import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { subDays } from "date-fns";
import ExecutiveDashboardClient from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Command Center | Executive Dashboard",
    description: "Business owner oversight and strategy nexus.",
};

export const dynamic = "force-dynamic";

export default async function ExecutiveDashboard() {
    const session = await auth();

    if (!session || session.user.role !== "OWNER") {
        redirect("/dashboard");
    }

    const businessId = session.user.businessId;
    if (!businessId) {
        return <div>No business association found.</div>;
    }

    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);

    const branchesRaw = await prisma.branch.findMany({
        where: { businessId },
        include: {
            serviceRecords: {
                where: { status: "COMPLETED", createdAt: { gte: sixtyDaysAgo } },
                select: { amount: true, createdAt: true }
            },
            clients: {
                where: { createdAt: { gte: sixtyDaysAgo } },
                select: { createdAt: true }
            },
            employees: {
                where: { createdAt: { gte: sixtyDaysAgo } },
                select: { createdAt: true }
            },
            _count: {
                select: { employees: true, clients: true }
            }
        }
    });

    // --- KPI Calculation (Last 30 Days vs Previous 30 Days) ---
    let currentRevenue = 0;
    let previousRevenue = 0;
    let newClients = 0;
    let previousClients = 0;
    
    // Using overall count for total, but trends based on new additions
    const totalClients = branchesRaw.reduce((acc, b) => acc + b._count.clients, 0);
    const totalEmployees = branchesRaw.reduce((acc, b) => acc + b._count.employees, 0);

    const branches = branchesRaw.map(b => {
        let branchCurrentRev = 0;
        let branchPrevRev = 0;

        b.serviceRecords.forEach(r => {
            const amt = r.amount || 0;
            if (r.createdAt >= thirtyDaysAgo) {
                currentRevenue += amt;
                branchCurrentRev += amt;
            } else {
                previousRevenue += amt;
                branchPrevRev += amt;
            }
        });

        b.clients.forEach(c => {
            if (c.createdAt >= thirtyDaysAgo) newClients++;
            else previousClients++;
        });

        const performanceTarget = branchPrevRev > 0 ? (branchCurrentRev / branchPrevRev) * 100 : (branchCurrentRev > 0 ? 100 : 0);

        return {
            id: b.id,
            name: b.name,
            revenue: branchCurrentRev,
            performance: Math.min(Math.round(performanceTarget), 100), // Cap at 100% for progress bar
            status: b.status,
        };
    });

    const revenueTrend = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const clientTrend = previousClients > 0 ? ((newClients - previousClients) / previousClients) * 100 : 0;

    // --- Requires Attention (Alerts) ---
    // Each query has an individual .catch(() => []) so a transient DB connection failure
    // (e.g. Neon cold start) returns empty data instead of crashing the page.
    const [lowInventoryRaw, pendingAlertsRaw, recentActivityRaw] = await Promise.all([
        // Low Inventory — field-level comparison is not valid Prisma syntax, filter in JS
        prisma.inventory.findMany({
            where: { branch: { businessId } },
            include: { branch: { select: { name: true } } },
        }).then(all => all.filter(i => i.stockCount <= i.minThreshold).slice(0, 10))
          .catch(() => []),
        // Safety Alerts
        prisma.safetyAlert.findMany({
            where: { branch: { businessId }, status: "PENDING" },
            include: { branch: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
            take: 5
        }).catch(() => []),
        // Audit Logs (Recent Activity)
        prisma.auditLog.findMany({
            where: { branch: { businessId } },
            include: {
                user: { select: { fullName: true } },
                branch: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" },
            take: 10
        }).catch(() => []),
    ]);

    const stats = {
        totalRevenue: currentRevenue,
        revenueTrend: { value: Math.abs(revenueTrend), isPositive: revenueTrend >= 0 },
        totalClients,
        clientTrend: { value: Math.abs(clientTrend), isPositive: clientTrend >= 0 },
        totalEmployees,
        employeeTrend: { value: 0, isPositive: true }, // Not tracking employee churn actively enough
        totalLocations: branches.length,
    };

    const alerts = {
        inventory: lowInventoryRaw.map(i => ({ id: i.id, product: i.productName, stock: i.stockCount, branch: i.branch.name })),
        safety: pendingAlertsRaw.map(s => ({ id: s.id, type: s.type, message: s.message || "Alert Triggered", branch: s.branch.name })),
    };

    const activity = recentActivityRaw.map(a => ({
        id: a.id,
        user: a.user.fullName,
        action: a.action,
        entity: a.entity,
        branch: a.branch?.name || "System",
        time: a.createdAt.toISOString()
    }));

    return (
        <ExecutiveDashboardClient 
            stats={stats} 
            branches={branches} 
            alerts={alerts}
            activity={activity}
        />
    );
}
