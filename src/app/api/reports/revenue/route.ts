import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        // Allow Managers, Business, and Admins to view revenue
        if (!session?.user || !["MANAGER", "OWNER", "ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const period = searchParams.get("period") || "weekly";
        
        // If manager, restrict to their branch
        let branchFilter = {};
        if (session.user.role === "MANAGER" && session.user.branchId) {
            branchFilter = { branchId: session.user.branchId };
        } else if (session.user.role === "OWNER" && session.user.businessId) {
            // Include all branches under business
            const branches = await prisma.branch.findMany({
                where: { businessId: session.user.businessId },
                select: { id: true }
            });
            branchFilter = { branchId: { in: branches.map(b => b.id) } };
        }

        const startDate = new Date();
        if (period === "weekly") {
            startDate.setDate(startDate.getDate() - 7);
        } else if (period === "monthly") {
            startDate.setMonth(startDate.getMonth() - 1);
        } else {
            // Default 30 days
            startDate.setDate(startDate.getDate() - 30);
        }
        startDate.setHours(0, 0, 0, 0);

        const records = await prisma.serviceRecord.findMany({
            where: {
                ...branchFilter,
                status: "COMPLETED",
                completedAt: { gte: startDate }
            },
            select: { amount: true, completedAt: true }
        });

        // Group by day
        const grouped = records.reduce((acc: Record<string, number>, curr) => {
            const dateStr = curr.completedAt?.toISOString().split('T')[0];
            if (dateStr) {
                acc[dateStr] = (acc[dateStr] || 0) + (curr.amount || 0);
            }
            return acc;
        }, {});

        const sortedData = Object.entries(grouped)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, amount]) => ({ date, amount }));

        return NextResponse.json(sortedData);

    } catch (error) {
        console.error("Failed to fetch revenue:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
