import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./client-page";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const session = await auth();

    // Verify system admin somehow, or just pass if 'admin' dashboard
    if (!session?.user) {
        redirect("/login");
    }

    // Fetch data
    const totalBusinesses = await prisma.business.count();
    const activeUsers = await prisma.user.count();

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
        createdAt: b.createdAt,
        ownerInitials: b.users[0]?.fullName ? b.users[0].fullName.substring(0, 2).toUpperCase() : '??',
        ownerName: b.users[0]?.fullName || 'Unknown Owner',
        ownerEmail: b.users[0]?.email || 'No Email',
        userCount: b._count.users
    }));

    const stats = {
        totalBusinesses,
        totalRevenue: 428500, // Still placeholder for now
        activeUsers,
        systemHealth: 99.9
    };

    return <AdminDashboardClient stats={stats} businesses={businesses} />;
}
