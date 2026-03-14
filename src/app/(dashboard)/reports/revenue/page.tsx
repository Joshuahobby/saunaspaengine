import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ReportsRevenueClientPage from "./client-page";

export const dynamic = "force-dynamic";

export default async function ReportsRevenuePage() {
    const session = await requireRole(["OWNER", "ADMIN", "CORPORATE"]);
    if (!session?.user?.businessId) redirect("/dashboard");

    const businessId = session.user.businessId;

    // Fetch total revenue components
    const completedRecords = await prisma.serviceRecord.findMany({
        where: {
            businessId,
            status: 'COMPLETED'
        },
        include: {
            service: {
                select: { name: true, category: true }
            }
        }
    });

    const totalRevenue = completedRecords.reduce((sum: number, r) => sum + r.amount, 0);
    const avgTransactionValue = completedRecords.length > 0 ? totalRevenue / completedRecords.length : 0;

    const activeMembersCount = await prisma.membership.count({
        where: {
            status: 'ACTIVE',
            category: { businessId }
        }
    });

    // Payment Mode Distribution
    const paymentDistribution = completedRecords.reduce((acc: Record<string, number>, r) => {
        acc[r.paymentMode] = (acc[r.paymentMode] || 0) + r.amount;
        return acc;
    }, {});

    // Top Services
    const serviceStats = completedRecords.reduce((acc: Record<string, any>, r) => {
        const key = r.serviceId;
        if (!acc[key]) {
            acc[key] = {
                name: r.service.name,
                category: r.service.category || 'Other',
                bookings: 0,
                revenue: 0
            };
        }
        acc[key].bookings += 1;
        acc[key].revenue += r.amount;
        return acc;
    }, {});

    const topServices = Object.values(serviceStats)
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 5);

    const metrics = {
        totalRevenue,
        avgTransactionValue,
        activeMembersCount,
        paymentDistribution,
        topServices,
        totalBookings: completedRecords.length
    };

    return <ReportsRevenueClientPage metrics={metrics} />;
}

