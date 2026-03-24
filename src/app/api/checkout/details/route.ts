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
        // Fetch parent and all related child records
        const records = await prisma.serviceRecord.findMany({
            where: {
                OR: [
                    { id: parentId },
                    { parentRecordId: parentId }
                ],
                branchId: session.user.branchId
            } as any,
            include: {
                service: true,
                employee: { select: { fullName: true } },
                client: { select: { fullName: true } }
            },
            orderBy: { createdAt: "asc" }
        });

        if (records.length === 0) {
            return NextResponse.json({ error: "No records found" }, { status: 404 });
        }

        // Parent is typically the first one or the one without a parentRecordId
        // but for simplicity we just pick the first record's client
        return NextResponse.json({
            clientName: (records[0] as any).client.fullName,
            services: records.map((r: any) => ({
                id: r.id,
                serviceName: r.service.name,
                isExtra: !!r.parentRecordId,
                employeeName: r.employee?.fullName || null,
                amount: r.amount
            }))
        });
    } catch (error) {
        console.error("Checkout details error:", error);
        return NextResponse.json({ error: "Failed to fetch checkout details" }, { status: 500 });
    }
}
