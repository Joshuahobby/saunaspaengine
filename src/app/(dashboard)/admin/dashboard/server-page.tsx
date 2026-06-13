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
    const totalBusinesses = await prisma.business.count();
    const totalBranches = await prisma.branch.count();
    const activeUsers = await prisma.user.count();

    const totalRevenueResult = await prisma.serviceRecord.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" },
    });
    const totalRevenue = totalRevenueResult._sum.amount || 0;

    // Fetch Businesses instead of Branches for the main directory
    const businessesRaw = await prisma.business.findMany({
        include: {
            branches: true,
            subscriptionPlan: true,
            users: {
                where: { role: 'OWNER' },
                take: 1
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 10 // Limit to recent businesses for the dashboard feed
    });

    const businesses = businessesRaw.map(b => ({
        id: b.id,
        name: b.name,
        status: b.status,
        createdAt: b.createdAt.toISOString(),
        ownerName: b.users[0]?.fullName || 'Unknown Owner',
        ownerEmail: b.users[0]?.email || 'No Email',
        branchCount: b.branches.length,
        packageName: b.subscriptionPlan?.name || 'Custom Plan',
        subscriptionRenewal: b.subscriptionRenewal?.toISOString() || null
    }));

    const stats = {
        totalBusinesses,
        totalBranches,
        totalRevenue,
        activeUsers,
        systemHealth: 99.9
    };

    return <AdminDashboardClient stats={stats} businesses={businesses} />;
}
