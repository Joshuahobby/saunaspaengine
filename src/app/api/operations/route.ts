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
    const { clientId, serviceId, employeeId, boxNumber, paymentMode, comment } = body;

    if (!clientId || !serviceId) {
        return NextResponse.json({ error: "Client and Service are required" }, { status: 400 });
    }

    // Fetch service price
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
        },
        include: {
            client: { select: { fullName: true } },
            service: { select: { name: true, category: true } },
            employee: { select: { fullName: true } },
        },
    });

    return NextResponse.json(record, { status: 201 });
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
        const record = await prisma.serviceRecord.update({
            where: {
                id,
                branchId: session.user.branchId,
            },
            data: {
                ...(status && { status }),
                ...(paymentMode && { paymentMode }),
                ...(comment && { comment }),
                ...(status === "COMPLETED" && { completedAt: new Date() }),
            },
            include: {
                client: { select: { id: true } },
                service: { select: { price: true } },
            },
        });

        // Loyalty Accrual & "Buy X, Get Y" Logic
        if (status === "COMPLETED") {
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
                    console.log(`Client ${record.clientId} has ${completedCount} completed sessions.`);
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
        }

        return NextResponse.json(record);
    } catch (error) {
        console.error("Service record update error:", error);
        return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
    }
}
