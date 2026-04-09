import { auth } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { subDays, format } from "date-fns";
import ExecutiveAnalyticsClient from "./client-page";

export const dynamic = "force-dynamic";

export default async function ExecutiveAnalyticsPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "OWNER") {
        redirect("/dashboard");
    }

    const businessId = session.user.businessId;
    if (!businessId) {
        return <div>No business context identified.</div>;
    }

    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);

    // 1. Fetch branch context
    const branches = await db.branch.findMany({
        where: { businessId },
        select: { id: true, name: true }
    });
    const branchIds = branches.map(b => b.id);

    // 2. High-Performance Aggregations (DB Level)
    const [
        revenueAggr,
        prevRevenueAggr,
        clientCount,
        employeeCount,
        branchMetrics,
        serviceAggr
    ] = await Promise.all([
        // Current 30 days revenue
        db.serviceRecord.aggregate({
            _sum: { amount: true },
            where: { branchId: { in: branchIds }, status: "COMPLETED", completedAt: { gte: thirtyDaysAgo } }
        }),
        // Previous 30 days revenue (for trend)
        db.serviceRecord.aggregate({
            _sum: { amount: true },
            where: { branchId: { in: branchIds }, status: "COMPLETED", completedAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }
        }),
        // Total Clients
        db.client.count({ where: { branchId: { in: branchIds } } }),
        // Total Employees
        db.employee.count({ where: { branchId: { in: branchIds } } }),
        // Branch Revenue & Efficiency (Last 30 days)
        db.serviceRecord.groupBy({
            by: ['branchId'],
            _sum: { amount: true },
            where: { branchId: { in: branchIds }, status: "COMPLETED", completedAt: { gte: thirtyDaysAgo } }
        }),
        // Service Category Popularity
        db.serviceRecord.groupBy({
            by: ['serviceId'],
            _sum: { amount: true },
            where: { branchId: { in: branchIds }, status: "COMPLETED", completedAt: { gte: thirtyDaysAgo } }
        })
    ]);

    // 3. Time-Series Data (Daily Revenue)
    // We still fetch minimal data for the trend chart to avoid complex Raw SQL logic for padding missing days
    const dailyRecords = await db.serviceRecord.findMany({
        where: { branchId: { in: branchIds }, status: "COMPLETED", completedAt: { gte: thirtyDaysAgo } },
        select: { amount: true, completedAt: true }
    });

    const currentRevenue = revenueAggr._sum.amount || 0;
    const previousRevenue = prevRevenueAggr._sum.amount || 0;
    const revenueTrend = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    // Daily revenue mapping
    const dailyRevenueMap = new Map();
    for (let i = 29; i >= 0; i--) {
        const d = format(subDays(now, i), "MMM dd");
        dailyRevenueMap.set(d, 0);
    }
    dailyRecords.forEach(r => {
        if (!r.completedAt) return;
        const d = format(r.completedAt, "MMM dd");
        if (dailyRevenueMap.has(d)) {
            dailyRevenueMap.set(d, dailyRevenueMap.get(d) + (r.amount || 0));
        }
    });
    const dailyRevenue = Array.from(dailyRevenueMap.entries()).map(([name, revenue]) => ({ name, revenue }));

    // 4. Branch Performance Matrix
    // Get employee counts per branch for efficiency calc
    const branchEmployees = await db.employee.groupBy({
        by: ['branchId'],
        _count: { id: true },
        where: { branchId: { in: branchIds } }
    });

    const branchPerformance = branches.map(b => {
        const rev = branchMetrics.find(m => m.branchId === b.id)?._sum.amount || 0;
        const empCount = branchEmployees.find(e => e.branchId === b.id)?._count.id || 0;
        
        return {
            id: b.id,
            name: b.name,
            revenue: rev,
            employees: empCount,
            clients: 0, // Simplified for now as it's less critical for HQ comparison
            efficiency: empCount > 0 ? rev / empCount : 0
        };
    }).sort((a, b) => b.revenue - a.revenue);

    // 5. Service Popularity
    const serviceIds = serviceAggr.map(s => s.serviceId);
    const serviceNames = await db.service.findMany({
        where: { id: { in: serviceIds } },
        select: { id: true, name: true }
    });

    const topServices = serviceAggr.map(s => ({
        name: serviceNames.find(n => n.id === s.serviceId)?.name || "Other",
        value: s._sum.amount || 0
    })).sort((a, b) => b.value - a.value).slice(0, 5);

    const stats = {
        totalRevenue: currentRevenue,
        revenueTrend: { value: Math.abs(revenueTrend), isPositive: revenueTrend >= 0 },
        totalClients: clientCount,
        totalEmployees: employeeCount,
        totalBranches: branches.length,
        projectedMRR: currentRevenue * 1.08, // Slightly more conservative strategy forecast
    };

    return (
        <ExecutiveAnalyticsClient 
            stats={stats}
            dailyRevenue={dailyRevenue}
            branchPerformance={branchPerformance}
            topServices={topServices}
        />
    );
}
