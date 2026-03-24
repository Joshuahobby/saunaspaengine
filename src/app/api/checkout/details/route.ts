import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/checkout/details?parentId=...
export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.branchId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId");

    if (!parentId) {
        return NextResponse.json({ error: "Parent ID is required" }, { status: 400 });
    }

    try {
        const record = await prisma.serviceRecord.findUnique({
            where: { id: parentId },
            include: {
                service: true,
                employee: { select: { fullName: true } },
                client: { select: { fullName: true } }
            }
        }) as any;

        if (!record) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        const consolidatedServices = [
            {
                id: record.id,
                serviceName: record.service.name,
                isExtra: false,
                employeeName: record.employee?.fullName || null,
                amount: record.service.price
            },
            ...(Array.isArray(record.extraServices) ? (record.extraServices as any[]).map(s => ({
                id: s.id,
                serviceName: s.serviceName,
                isExtra: true,
                employeeName: s.employeeName,
                amount: s.amount
            })) : [])
        ];

        return NextResponse.json({
            clientName: record.client.fullName,
            services: consolidatedServices
        });
    } catch (error) {
        console.error("Checkout details error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
