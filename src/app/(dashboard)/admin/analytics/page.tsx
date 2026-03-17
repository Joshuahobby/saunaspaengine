import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import AnalyticsClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Yield Intelligence | Platform Analytics",
    description: "Deep-dive into platform revenue, growth, and node performance metrics.",
};

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
    await requireRole(["ADMIN"]);

    // Fetch Global Stats
    const [
        totalRevenueAgg,
        activeBranches,
        totalUsers,
        recentActivity
    ] = await Promise.all([
        prisma.serviceRecord.aggregate({
            _sum: { amount: true },
            where: { status: "COMPLETED" }
        }),
        prisma.branch.count({ where: { status: "ACTIVE" } }),
        prisma.user.count(),
        prisma.auditLog.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        fullName: true,
                        role: true
                    }
                }
            }
        })
    ]);

    const stats = {
        totalRevenue: totalRevenueAgg._sum.amount || 0,
        totalBranches: activeBranches,
        activeSubscriptions: totalUsers, // Using total users as a proxy for active subscriptions for now
        revenueGrowth: 12.5
    };

    return <AnalyticsClientPage stats={stats} recentActivity={recentActivity.map(a => ({
        ...a,
        details: a.details ?? undefined,
        user: { fullName: a.user.fullName }
    }))} />;
}
