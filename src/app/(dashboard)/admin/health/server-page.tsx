import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import AdminHealthClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "System Pulse | Platform Health",
    description: "Real-time diagnostics and system health monitoring for the entire platform.",
};

export const dynamic = "force-dynamic";

export default async function AdminHealthPage() {
    await requireRole(["ADMIN"]);

    // Gather real system health metrics
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
        totalRecordsToday,
        totalBranches,
        activeBranches,
        totalUsers,
        totalEmployees,
        recentLogs,
    ] = await Promise.all([
        prisma.serviceRecord.count({
            where: { createdAt: { gte: startOfToday } },
        }),
        prisma.branch.count(),
        prisma.branch.count({ where: { status: "ACTIVE" } }),
        prisma.user.count(),
        prisma.employee.count(),
        prisma.auditLog.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { fullName: true } },
            },
        }),
    ]);

    const uptimePct = activeBranches > 0
        ? ((activeBranches / totalBranches) * 100).toFixed(1)
        : "100.0";

    const healthMetrics = {
        uptime: `${uptimePct}%`,
        requestsToday: totalRecordsToday,
        activeBranches,
        totalUsers,
        totalEmployees,
    };

    const logEntries = recentLogs.map((l) => ({
        id: l.id,
        time: new Date(l.createdAt).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        action: l.action,
        resource: l.entity,
        userName: l.user.fullName,
    }));

    return <AdminHealthClientPage metrics={healthMetrics} logEntries={logEntries} />;
}
