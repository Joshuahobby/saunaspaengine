export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { resolveEffectiveBranchId } from "@/lib/branch-context";
import { ExtraService } from "@/types/operations";
import { randomUUID } from "crypto";
import { completeServiceRecord } from "@/lib/operations-logic";


// GET /api/operations — list service records for current branch
export async function GET(request: NextRequest) {
    const session = await auth();
    const branchId = await resolveEffectiveBranchId(session);
    if (!session?.user || !branchId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");

    const where: Record<string, unknown> = { branchId };
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
    const branchId = await resolveEffectiveBranchId(session);
    if (!session?.user || !branchId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clientId, serviceId, employeeId, lockerNumber, paymentMode, comment, recordId } = body;

    if (!clientId || !serviceId) {
        return NextResponse.json({ error: "Client and Service are required" }, { status: 400 });
    }

    try {
        // 1. If recordId is provided, we are adding an EXTRA SERVICE to an existing session
        if (recordId) {
            const existing = await prisma.serviceRecord.findUnique({
                where: { id: recordId, branchId }
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
                id: randomUUID(),
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
                    extraServices: [...currentExtras, newExtra] as unknown as Prisma.InputJsonValue,
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
        const [service, client, branch] = await Promise.all([
            prisma.service.findUnique({ where: { id: serviceId } }),
            prisma.client.findUnique({ 
                where: { id: clientId },
                include: { branch: { select: { businessId: true } } }
            }),
            prisma.branch.findUnique({
                where: { id: branchId },
                select: { businessId: true }
            })
        ]);

        if (!service) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }
        if (!client || !branch) {
            return NextResponse.json({ error: "Client or Branch not found" }, { status: 404 });
        }

        // Integrity Check: Client must belong to the same business
        if (client.branch.businessId !== branch.businessId) {
            return NextResponse.json({ error: "Client does not belong to this business network" }, { status: 403 });
        }

        // Locker Double Booking Prevention
        if (lockerNumber) {
            const occupiedLocker = await prisma.serviceRecord.findFirst({
                where: {
                    branchId,
                    lockerNumber,
                    status: { in: ["CREATED", "IN_PROGRESS"] }
                }
            });
            if (occupiedLocker) {
                return NextResponse.json({ error: `Locker ${lockerNumber} is currently occupied.` }, { status: 400 });
            }
        }

        // 3. Proactive Membership Validation
        if (paymentMode === "MEMBERSHIP") {
            const membership = await prisma.membership.findFirst({
                where: {
                    clientId,
                    status: "ACTIVE",
                    OR: [
                        { category: { branchId } },
                        { category: { isGlobal: true } },
                    ],
                    AND: [
                        { OR: [{ endDate: null }, { endDate: { gte: new Date() } }] },
                        { OR: [{ balance: null }, { balance: { gt: 0 } }] },
                    ],
                },
                include: { category: true },
            });

            if (!membership) {
                return NextResponse.json({ 
                    error: "No active membership found with remaining balance for this branch." 
                }, { status: 400 });
            }
        }

        const record = await prisma.serviceRecord.create({
            data: {
                clientId,
                serviceId,
                employeeId: employeeId || null,
                branchId,
                lockerNumber: lockerNumber || null,
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
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}

// PATCH /api/operations — update service record (e.g., mark as COMPLETED)
export async function PATCH(request: NextRequest) {
    const session = await auth();
    const branchId = await resolveEffectiveBranchId(session);
    if (!session?.user || !branchId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, paymentMode, comment } = body;

    if (!id) {
        return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    try {
        // If status is COMPLETED and it's NOT a MOMO payment (which is handled by webhook)
        // or if it's already PAID (we just mark as completed)
        if (status === "COMPLETED" && (paymentMode === "CASH" || paymentMode === "POS" || paymentMode === "MEMBERSHIP")) {
            // Update comments or other metadata first if provided
            if (comment || paymentMode) {
                await prisma.serviceRecord.update({
                    where: { id, branchId },
                    data: {
                        ...(comment && { comment }),
                        ...(paymentMode && { paymentMode }),
                    }
                });
            }

            const record = await completeServiceRecord(id, branchId);
            return NextResponse.json(record);
        }

        // Generic update for other statuses or data changes
        const record = await prisma.serviceRecord.update({
            where: { id, branchId },
            data: {
                ...(status && { status }),
                ...(paymentMode && { paymentMode }),
                ...(comment && { comment }),
            },
            include: {
                client: { select: { id: true } },
                service: { select: { price: true } },
            },
        });

        return NextResponse.json(record);
    } catch (error: unknown) {
        console.error("Service record update error:", error);
        return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
    }
}
