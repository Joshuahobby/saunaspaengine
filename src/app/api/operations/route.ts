import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/operations — list service records for current business
export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.businessId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");

    const where: Record<string, unknown> = { businessId: session.user.businessId };
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
    if (!session?.user?.businessId) {
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
            businessId: session.user.businessId,
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
