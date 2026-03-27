export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ExtraService } from "@/types/operations";
import { calculatePointsEarned, determineTier } from "@/lib/loyalty";


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
    const { clientId, serviceId, employeeId, boxNumber, paymentMode, comment, recordId } = body;

    if (!clientId || !serviceId) {
        return NextResponse.json({ error: "Client and Service are required" }, { status: 400 });
    }

    try {
        // 1. If recordId is provided, we are adding an EXTRA SERVICE to an existing session
        if (recordId) {
            const existing = await prisma.serviceRecord.findUnique({
                where: { id: recordId, branchId: session.user.branchId }
            });


            if (!existing) {
                return NextResponse.json({ error: "Original record not found" }, { status: 404 });
            }

            const extraSvc = await prisma.service.findUnique({
                where: { id: serviceId }
            });

            if (!extraSvc) {
                return NextResponse.json({ error: "Service not found" }, { status: 404 });
            }

            let employeeName = null;
            if (employeeId) {
                const emp = await prisma.employee.findUnique({
                    where: { id: employeeId },
                    select: { fullName: true }
                });
                employeeName = emp?.fullName;
            }

            let currentExtras: ExtraService[] = [];
            if (existing.extraServices) {
                if (typeof existing.extraServices === 'string') {
                    try {
                        const parsed = JSON.parse(existing.extraServices);
                        currentExtras = Array.isArray(parsed) ? parsed as ExtraService[] : [];
                    } catch {
                        currentExtras = [];
                    }
                } else if (Array.isArray(existing.extraServices)) {
                    currentExtras = existing.extraServices as unknown as ExtraService[];
                }
            }

            
            const newExtra = {
                id: Math.random().toString(36).substring(7),
                serviceId,
                serviceName: extraSvc.name,
                amount: extraSvc.price,
                employeeId: employeeId || null,
                employeeName: employeeName || null,
                createdAt: new Date().toISOString()
            };

            const updatedRecord = await prisma.serviceRecord.update({
                where: { id: recordId },
                data: {
                    extraServices: [...currentExtras, newExtra] as any,
                    amount: { increment: extraSvc.price },
                    netAmount: { increment: extraSvc.price }
                },
                include: {
                    client: { select: { fullName: true } },
                    service: { select: { name: true, category: true } },
                    employee: { select: { fullName: true } },
                }
            });


            return NextResponse.json(updatedRecord);
        }

        // 2. Normal Check-in: Create a new service record
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
                netAmount: service.price,
                comment: comment || null,
                status: "CREATED",
            },
            include: {
                client: { select: { fullName: true } },
                service: { select: { name: true, category: true } },
                employee: { select: { fullName: true } },
            },
        });

        return NextResponse.json(record, { status: 201 });
    } catch (error: unknown) {
        console.error("Operations check-in error:", error);
        return NextResponse.json({ 
            error: "Internal server error", 
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
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

        // Hierarchical service tracking is now handled via JSON field, 
        // no independent status updates needed for extra services.

        let financialData = {};
        if (status === "COMPLETED") {
            // Fetch Regional Tax (Default to 18% if not found)
            const compliance = await prisma.compliance.findFirst({
                where: { region: "RWANDA" }
            });
            const taxRate = compliance?.taxRate ?? 18.0;
            const commissionRate = (existingRecord as any).branch?.business?.platformCommissionRate ?? 5.0;
            
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
                const membership = await (prisma.membership as any).findFirst({
                    where: {
                        clientId: record.clientId,
                        status: "ACTIVE",
                        OR: [
                            { branchId: session.user.branchId },
                            { category: { isGlobal: true } }
                        ],
                        AND: [
                            {
                                OR: [
                                    { endDate: null },
                                    { endDate: { gte: new Date() } }
                                ]
                            },
                            {
                                OR: [
                                    { balance: null },
                                    { balance: { gt: 0 } }
                                ]
                            }
                        ]
                    }
                });

                if (membership) {
                    if (membership.balance !== null) {
                        await (prisma.membership as any).update({
                            where: { id: membership.id },
                            data: { balance: { decrement: 1 } }
                        });
                    }
                } else {
                    // Log warning: Record was processed with MEMBERSHIP payment mode but no active membership was found.
                    // In a production app, we might want to revert or flag this record.
                }
            }

            // Fetch Loyalty Program for the branch
            const loyaltyProgram = await prisma.loyaltyProgram.findFirst({
                where: { branchId: record.branchId, status: "ACTIVE" }
            });

            if (loyaltyProgram) {
                // 1. Fetch current loyalty data
                const existingLoyalty = await prisma.loyaltyPoint.findFirst({
                    where: { clientId: record.clientId, branchId: record.branchId }
                });

                const currentPoints = existingLoyalty?.points || 0;
                const currentTier = existingLoyalty?.tier || "BRONZE";

                // 2. Traditional Points Accrual (based on tier multiplier)
                const pointsToEarn = calculatePointsEarned(
                    record.amount,
                    currentTier,
                    loyaltyProgram.pointsPerRwf
                );

                if (pointsToEarn > 0) {
                    const newTotalPoints = currentPoints + pointsToEarn;
                    const nextTier = determineTier(newTotalPoints);

                    if (existingLoyalty) {
                        await prisma.loyaltyPoint.update({
                            where: { id: existingLoyalty.id },
                            data: { 
                                points: { increment: pointsToEarn },
                                tier: nextTier
                            }
                        });
                    } else {
                        await prisma.loyaltyPoint.create({
                            data: {
                                clientId: record.clientId,
                                branchId: record.branchId,
                                points: pointsToEarn,
                                tier: nextTier,
                            }
                        });
                    }
                }

                // 3. "Buy X, Get Y" Session Tracking
                if (loyaltyProgram.buyCount && loyaltyProgram.getCount) {
                    const sessionCount = await prisma.serviceRecord.count({
                        where: {
                            clientId: record.clientId,
                            branchId: record.branchId,
                            serviceId: record.serviceId,
                            status: "COMPLETED",
                            amount: { gt: 0 } // Only count paid sessions
                        }
                    });

                    // Logic: If sessionCount is a multiple of (buyCount + getCount), 
                    // or meets other criteria, we could notify for a reward.
                    // For now, we log it for potential front-end badges.
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
    } catch (error: unknown) {
        console.error("Service record update error:", error);
        return NextResponse.json({ 
            error: "Failed to update record", 
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }

}
