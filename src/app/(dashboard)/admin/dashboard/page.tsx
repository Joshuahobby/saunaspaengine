import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "./client-page";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Command Center | Admin Dashboard",
    description: "Global operational oversight and platform health nexus.",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    await requireRole(["ADMIN"]);

    // Fetch data
    const totalBranches = await prisma.branch.count();
    const activeUsers = await prisma.user.count();

    const totalRevenueResult = await prisma.serviceRecord.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" },
    });
    const totalRevenue = totalRevenueResult._sum.amount || 0;

    const branchesRaw = await prisma.branch.findMany({
        include: {
            users: {
                where: { role: 'MANAGER' },
                take: 1
            },
            _count: {
                select: { users: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const branches = branchesRaw.map(b => ({
        id: b.id,
        name: b.name,
        status: b.status,
        createdAt: b.createdAt.toISOString(),
        managerInitials: b.users[0]?.fullName ? b.users[0].fullName.substring(0, 2).toUpperCase() : '??',
        managerName: b.users[0]?.fullName || 'Unknown Manager',
        managerEmail: b.users[0]?.email || 'No Email',
        userCount: b._count.users
    }));

    const stats = {
        totalBranches,
        totalRevenue,
        activeUsers,
        systemHealth: 99.9
    };

    return <AdminDashboardClient stats={stats} branches={branches} />;
}
