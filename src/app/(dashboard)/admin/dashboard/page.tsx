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
    const activeUsers = await prisma.user.count();

    const totalRevenueResult = await prisma.serviceRecord.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" },
    });
    const totalRevenue = totalRevenueResult._sum.amount || 0;

    const businessesRaw = await prisma.business.findMany({
        include: {
            users: {
                where: { role: 'OWNER' },
                take: 1
            },
            _count: {
                select: { users: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const businesses = businessesRaw.map(b => ({
        id: b.id,
        name: b.name,
        status: b.status,
        createdAt: b.createdAt.toISOString(),
        ownerInitials: b.users[0]?.fullName ? b.users[0].fullName.substring(0, 2).toUpperCase() : '??',
        ownerName: b.users[0]?.fullName || 'Unknown Owner',
        ownerEmail: b.users[0]?.email || 'No Email',
        userCount: b._count.users
    }));

    const stats = {
        totalBusinesses,
        totalRevenue,
        activeUsers,
        systemHealth: 99.9
    };

    return <AdminDashboardClient stats={stats} businesses={businesses} />;
}
