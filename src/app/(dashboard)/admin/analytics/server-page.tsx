import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import AnalyticsClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Yield Intelligence | Platform Analytics",
    description: "Deep-dive into platform revenue, growth, and business performance metrics.",
};

export const dynamic = "force-dynamic";

const CATEGORY_COLORS = [
    "var(--color-primary)",
    "#10b981",
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default async function AdminAnalyticsPage() {
    await requireRole(["ADMIN"]);

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const twentyEightDaysAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

    // Using any cast for business queries since Prisma types might need refresh
    const db = prisma as any;

    const [
        totalRevenueAgg,
        totalBusinesses,
        totalBranches,
        totalUsers,
        recentActivity,
        // Monthly Growth
        monthlyBusinesses,
        monthlyUsers,
        // Subscription & Treasury
        businessesWithPlans,
        // Top Corporates by Revenue (last 28 days)
        topCorporateRecords,
        // Role Distribution
        roleDistributionRaw,
        // Compliance Status
        approvalDistributionRaw,
        // Growth calc
        newBusinessesThisMonth,
        newBusinessesLastMonth,
    ] = await Promise.all([
        prisma.serviceRecord.aggregate({
            _sum: { amount: true },
            where: { status: "COMPLETED" }
        }),
        db.business.count(),
        prisma.branch.count({ where: { status: "ACTIVE" } }),
        prisma.user.count(),
        prisma.auditLog.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { fullName: true, role: true } } }
        }),
        db.business.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true }
        }),
        prisma.user.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true }
        }),
        db.business.findMany({
            where: { approvalStatus: "APPROVED" },
            select: {
                subscriptionPlan: {
                    select: { name: true, priceMonthly: true }
                }
            }
        }),
        prisma.serviceRecord.findMany({
            where: {
                status: "COMPLETED",
                createdAt: { gte: twentyEightDaysAgo }
            },
            select: {
                amount: true,
                branch: {
                    select: {
                        business: {
                            select: { id: true, name: true, headquarters: true }
                        }
                    }
                }
            }
        }),
        prisma.user.groupBy({
            by: ['role'],
            _count: { _all: true }
        }),
        db.business.groupBy({
            by: ['approvalStatus'],
            _count: { _all: true }
        }),
        db.business.count({
            where: { createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } }
        }),
        db.business.count({
            where: {
                createdAt: {
                    gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
                    lt: new Date(now.getFullYear(), now.getMonth(), 1)
                }
            }
        }),
    ]);

    // --- Process Growth Trends ---
    const growthData = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        
        const bCount = monthlyBusinesses.filter((b: any) => {
            const bd = new Date(b.createdAt);
            return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth();
        }).length;

        const uCount = monthlyUsers.filter(u => {
            const ud = new Date(u.createdAt);
            return ud.getFullYear() === d.getFullYear() && ud.getMonth() === d.getMonth();
        }).length;

        growthData.push({
            name: MONTH_NAMES[d.getMonth()],
            businesses: bCount,
            users: uCount,
        });
    }

    // --- Process Treasury (MRR) ---
    const planCounts = new Map<string, number>();
    let projectedMRR = 0;
    
    businessesWithPlans.forEach((b: any) => {
        const plan = b.subscriptionPlan;
        const planName = plan?.name || "No Plan";
        planCounts.set(planName, (planCounts.get(planName) || 0) + 1);
        if (plan?.priceMonthly) {
            projectedMRR += plan.priceMonthly;
        }
    });
    
    const totalApproved = Math.max(businessesWithPlans.length, 1);
    const subscriptionData = Array.from(planCounts.entries())
        .map(([name, count], idx) => ({
            name,
            value: Math.round((count / totalApproved) * 100),
            color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
        }))
        .sort((a, b) => b.value - a.value);

    // --- Process Compliance Status ---
    const approvalMap: Record<string, number> = {
        PENDING: 0,
        APPROVED: 0,
        REJECTED: 0,
        SUSPENDED: 0
    };
    approvalDistributionRaw.forEach((item: any) => {
        approvalMap[item.approvalStatus] = item._count._all;
    });

    const complianceData = [
        { name: "Verified", value: approvalMap.APPROVED, color: "var(--color-primary)" },
        { name: "Pending", value: approvalMap.PENDING, color: "#f59e0b" },
        { name: "Suspended", value: approvalMap.SUSPENDED + approvalMap.REJECTED, color: "#ef4444" },
    ];

    // --- Process Top Revenue Corporates ---
    const corporateRevenueMap = new Map<string, { name: string; location: string; revenue: number }>();
    topCorporateRecords.forEach(record => {
        const business = record.branch?.business;
        if (!business) return;
        
        const existing = corporateRevenueMap.get(business.id);
        if (existing) {
            existing.revenue += record.amount || 0;
        } else {
            corporateRevenueMap.set(business.id, {
                name: business.name,
                location: business.headquarters || "Unknown",
                revenue: record.amount || 0,
            });
        }
    });

    const topCorporates = Array.from(corporateRevenueMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(c => ({
            ...c,
            initial: c.name.charAt(0).toUpperCase()
        }));

    // --- Process Role Distribution ---
    const roleStats: Record<string, number> = { ADMIN: 0, OWNER: 0, MANAGER: 0, EMPLOYEE: 0 };
    roleDistributionRaw.forEach(item => { roleStats[item.role] = item._count._all; });

    const roleData = [
        { name: "Admins", count: roleStats.ADMIN },
        { name: "Owners", count: roleStats.OWNER },
        { name: "Managers", count: roleStats.MANAGER },
        { name: "Employee", count: roleStats.EMPLOYEE },
    ];

    // --- Overall Growth Stats ---
    const bizGrowth = newBusinessesLastMonth > 0 
        ? Math.round(((newBusinessesThisMonth - newBusinessesLastMonth) / newBusinessesLastMonth) * 100)
        : newBusinessesThisMonth > 0 ? 100 : 0;

    return <AnalyticsClientPage 
        stats={{
            totalBusinesses,
            totalBranches,
            totalRevenue: totalRevenueAgg._sum.amount || 0,
            totalUsers,
            bizGrowth,
            projectedMRR
        }}
        growthData={growthData}
        subscriptionData={subscriptionData}
        complianceData={complianceData}
        topCorporates={topCorporates}
        roleData={roleData}
        recentActivity={recentActivity.map(a => ({
            ...a,
            details: a.details ?? undefined,
            user: { fullName: a.user.fullName }
        }))}
    />;
}
