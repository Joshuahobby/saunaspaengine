import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AnalyticsClientPage from "./client-page";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    // Fetch Global Stats
    const [
        totalRevenueAgg,
        activeBusinesses,
        totalUsers,
        totalServices,
        recentActivity
    ] = await Promise.all([
        prisma.serviceRecord.aggregate({
            _sum: { amount: true },
            where: { status: "COMPLETED" }
        }),
        prisma.business.count({ where: { status: "ACTIVE" } }),
        prisma.user.count(),
        prisma.service.count(),
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
        activeBusinesses,
        totalUsers,
        totalServices,
        revenueGrowth: 12.5 // Placeholder for trend analysis
    };

    return <AnalyticsClientPage stats={stats} recentActivity={recentActivity} />;
}
