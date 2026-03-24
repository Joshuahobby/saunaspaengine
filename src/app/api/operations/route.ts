export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/operations — list service records for current branch
export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.branchId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");

    const where: Record<string, unknown> = { branchId: session.user.branchId };
    if (status && status !== "ALL") {
        where.status = status;
    }

    const [records, total] = await Promise.all([
        prisma.serviceRecord.findMany({
            where,
            include: {
                client: { select: { fullName: true } },
                service: { select: { name: true, category: true, price: true } },
                employee: { select: { fullName: true } },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.serviceRecord.count({ where }),
    ]);

    return NextResponse.json({ records, total, pages: Math.ceil(total / limit) });
}

// POST /api/operations — create a new service record
export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.branchId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clientId, serviceId, employeeId, boxNumber, paymentMode, comment, parentRecordId } = body;

    if (!clientId || !serviceId) {
        return NextResponse.json({ error: "Client and Service are required" }, { status: 400 });
    }

    try {
        // 1. Fetch branch/business context
        const currentBranch = await prisma.branch.findUnique({
            where: { id: session.user.branchId },
            select: { businessId: true }
        });

        // 2. Verify Client exists and belongs to the same Business network
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const clientsInBusiness = await (prisma.client as any).findMany({
            where: {
                id: clientId,
                branch: { businessId: currentBranch?.businessId }
            }
        });

        if (!clientsInBusiness || clientsInBusiness.length === 0) {
            return NextResponse.json({ error: "Client not found in this business network" }, { status: 404 });
        }

        // 3. Fetch service price
        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }

        const record = await prisma.serviceRecord.create({
            data: {
                clientId,
                serviceId,
                employeeId: employeeId || null,
                branchId: session.user.branchId,
                boxNumber: boxNumber || null,
                paymentMode: paymentMode || "CASH",
                amount: service.price,
                comment: comment || null,
                status: "CREATED",
                parentRecordId: parentRecordId || null,
                isExtra: !!parentRecordId,
            },
            include: {
                client: { select: { fullName: true } },
                service: { select: { name: true, category: true } },
                employee: { select: { fullName: true } },
            },
        });

        return NextResponse.json(record, { status: 201 });
    } catch (error) {
        console.error("Operations check-in error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PATCH /api/operations — update service record (e.g., mark as COMPLETED)
export async function PATCH(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.branchId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, paymentMode, comment } = body;

    if (!id) {
        return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    try {
        // Fetch existing record to get financial context
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existingRecord = await prisma.serviceRecord.findUnique({
            where: { id, branchId: session.user.branchId },
            include: {
                branch: {
                    include: {
                        business: {
                            select: { platformCommissionRate: true } as any // eslint-disable-line @typescript-eslint/no-explicit-any
                        }
                    }
                },
                employee: {
                    select: { id: true, commissionRate: true } as any // eslint-disable-line @typescript-eslint/no-explicit-any
                }
            }
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

        if (!existingRecord) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        // If completing a parent, also complete all extras
        if (status === "COMPLETED") {
            await prisma.serviceRecord.updateMany({
                where: { parentRecordId: id, branchId: session.user.branchId },
                data: { status: "COMPLETED", completedAt: new Date() }
            });
        }

        let financialData = {};
        if (status === "COMPLETED") {
            // Fetch Regional Tax (Default to 18% if not found)
            const compliance = await prisma.compliance.findFirst({
                where: { region: "RWANDA" }
            });
            const taxRate = compliance?.taxRate ?? 18.0;
            const commissionRate = (existingRecord as any).branch?.business?.platformCommissionRate ?? 5.0; // eslint-disable-line @typescript-eslint/no-explicit-any
            
            const totalAmount = existingRecord.amount;
            const taxAmount = totalAmount * (taxRate / 100);
            const netBeforeCommission = totalAmount - taxAmount;
            const platformFee = netBeforeCommission * (commissionRate / 100);
            const netAmount = totalAmount - taxAmount - platformFee;

            financialData = {
                taxAmount,
                platformFee,
                netAmount,
                completedAt: new Date()
            };

            // Calculate Employee Commission (on Gross Amount)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const employee = (existingRecord as any).employee;
            if (employee && employee.commissionRate) {
                const commissionAmount = totalAmount * (employee.commissionRate / 100);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (financialData as any).employeeCommission = commissionAmount;
            }
        }

        const record = await prisma.serviceRecord.update({
            where: {
                id,
                branchId: session.user.branchId,
            },
            data: {
                ...(status && { status }),
                ...(paymentMode && { paymentMode }),
                ...(comment && { comment }),
                ...financialData
            },
            include: {
                client: { select: { id: true } },
                service: { select: { price: true } },
            },
        });

        // Loyalty Accrual & Membership Deduction
        if (status === "COMPLETED") {
            // 1. Membership Deduction
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((record.paymentMode as any) === "MEMBERSHIP") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const membership = await (prisma.membership as any).findFirst({
                    where: {
                        clientId: record.clientId,
                        status: "ACTIVE",
                        OR: [
                            { branchId: session.user.branchId },
                            { category: { isGlobal: true } }
                        ],
                        balance: { gt: 0 }
                    }
                });

                if (membership && membership.balance !== null) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await (prisma.membership as any).update({
                        where: { id: membership.id },
                        data: { balance: { decrement: 1 } }
                    });
                }
            }

            // 2. Loyalty Logic (Accrual & "Buy X, Get Y")
            const loyaltyProgram = await prisma.loyaltyProgram.findUnique({
                where: { branchId: session.user.branchId },
            });

            if (loyaltyProgram && loyaltyProgram.status === "ACTIVE") {
                // 1. Traditional Points Accrual
                const pointsToEarn = Math.floor(record.amount * loyaltyProgram.pointsPerRwf);

                // 2. "Buy X, Get Y" Logic
                if (loyaltyProgram.buyCount && loyaltyProgram.getCount) {
                    const completedCount = await prisma.serviceRecord.count({
                        where: {
                            clientId: record.clientId,
                            branchId: record.branchId,
                            serviceId: record.serviceId,
                            status: "COMPLETED",
                            amount: { gt: 0 }
                        }
                    });

                    // Logic: After X paid sessions, the next Y sessions could be rewarded.
                    // For now, we just log the progress in the console or audit log.

                }

                if (pointsToEarn > 0) {
                    const existingLoyalty = await prisma.loyaltyPoint.findFirst({
                        where: { clientId: record.clientId, branchId: record.branchId }
                    });

                    await prisma.loyaltyPoint.upsert({
                        where: { id: existingLoyalty?.id || "temp-id-for-upsert" },
                        update: { points: { increment: pointsToEarn } },
                        create: {
                            clientId: record.clientId,
                            branchId: record.branchId,
                            points: pointsToEarn,
                            tier: "BRONZE",
                        },
                    });
                }
            }

            // 3. Commission Logging
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((record as any).employeeCommission > 0 && record.employeeId) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (prisma as any).commissionLog.upsert({
                    where: { serviceRecordId: record.id },
                    update: { 
                        amount: (record as any).employeeCommission,
                        employeeId: record.employeeId
                    },
                    create: {
                        serviceRecordId: record.id,
                        employeeId: record.employeeId,
                        amount: (record as any).employeeCommission,
                        status: "UNPAID"
                    }
                });
            }
        }

        return NextResponse.json(record);
    } catch (error) {
        console.error("Service record update error:", error);
        return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
    }
}
