import { auth } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { subDays, startOfMonth, endOfMonth, format, startOfDay } from "date-fns";
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

    // 1. Fetch all branches for this business
    const branches = await db.branch.findMany({
        where: { businessId },
        include: {
            _count: {
                select: { employees: true, clients: true }
            }
        }
    });

    const branchIds = branches.map(b => b.id);

    // 2. Aggregated Totals & Trends
    const [serviceRecords, allClients, allEmployees] = await Promise.all([
        db.serviceRecord.findMany({
            where: { branchId: { in: branchIds }, status: "COMPLETED", createdAt: { gte: sixtyDaysAgo } },
            select: { amount: true, createdAt: true, serviceId: true, branchId: true }
        }),
        db.client.findMany({
            where: { branchId: { in: branchIds } },
            select: { id: true, createdAt: true }
        }),
        db.employee.findMany({
            where: { branchId: { in: branchIds } },
            select: { id: true, createdAt: true }
        })
    ]);

    // Calculate revenue metrics
    let currentRevenue = 0;
    let previousRevenue = 0;
    serviceRecords.forEach(r => {
        if (r.createdAt >= thirtyDaysAgo) currentRevenue += (r.amount || 0);
        else previousRevenue += (r.amount || 0);
    });

    const revenueTrend = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    // 3. Daily Revenue Data (Charts)
    const dailyRevenueMap = new Map();
    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
        const d = format(subDays(now, i), "MMM dd");
        dailyRevenueMap.set(d, 0);
    }
    serviceRecords.filter(r => r.createdAt >= thirtyDaysAgo).forEach(r => {
        const d = format(r.createdAt, "MMM dd");
        if (dailyRevenueMap.has(d)) {
            dailyRevenueMap.set(d, dailyRevenueMap.get(d) + (r.amount || 0));
        }
    });
    const dailyRevenue = Array.from(dailyRevenueMap.entries()).map(([name, revenue]) => ({ name, revenue }));

    // 4. Branch Performance Matrix
    const branchPerformance = branches.map(b => {
        const bRevenue = serviceRecords
            .filter(r => r.branchId === b.id && r.createdAt >= thirtyDaysAgo)
            .reduce((acc, r) => acc + (r.amount || 0), 0);
        
        return {
            id: b.id,
            name: b.name,
            revenue: bRevenue,
            employees: b._count.employees,
            clients: b._count.clients,
            efficiency: b._count.employees > 0 ? bRevenue / b._count.employees : 0
        };
    }).sort((a, b) => b.revenue - a.revenue);

    // 5. Service Popularity Aggregation
    const services = await db.service.findMany({
        where: { branch: { businessId } },
        select: { id: true, name: true }
    });
    const serviceMap = new Map();
    serviceRecords.filter(r => r.createdAt >= thirtyDaysAgo).forEach(r => {
        const sName = services.find(s => s.id === r.serviceId)?.name || "Other";
        serviceMap.set(sName, (serviceMap.get(sName) || 0) + (r.amount || 0));
    });
    const topServices = Array.from(serviceMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    const stats = {
        totalRevenue: currentRevenue,
        revenueTrend: { value: Math.abs(revenueTrend), isPositive: revenueTrend >= 0 },
        totalClients: allClients.length,
        totalEmployees: allEmployees.length,
        totalBranches: branches.length,
        projectedMRR: currentRevenue * 1.1, // Hypothetical platform metric
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
