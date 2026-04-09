import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || !["OWNER", "ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const businessId = session.user.businessId;
        if (!businessId) {
            return NextResponse.json({ error: "Business context required" }, { status: 400 });
        }

        // Group by clientId to find repeat customers
        // This is done at the database level for performance
        const clientStats = await prisma.serviceRecord.groupBy({
            by: ['clientId'],
            where: {
                branch: { businessId },
                status: "COMPLETED"
            },
            _count: {
                id: true
            }
        });

        const totalUniqueClients = clientStats.length;
        const repeatClients = clientStats.filter(c => c._count.id > 1).length;
        
        const retentionRate = totalUniqueClients > 0 
            ? ((repeatClients / totalUniqueClients) * 100).toFixed(1) 
            : 0;

        return NextResponse.json({
            totalUniqueClients,
            repeatClients,
            retentionRate: Number(retentionRate),
            period: "All Time"
        });

    } catch (error) {
        console.error("Failed to fetch retention report:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
