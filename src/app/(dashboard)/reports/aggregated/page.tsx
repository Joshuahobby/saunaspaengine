import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AggregatedReportsClientPage from "./client-page";

export const dynamic = "force-dynamic";

export default async function AggregatedReportsPage() {
    const session = await auth();
    if (!session?.user || (session.user.role !== "CORPORATE" && session.user.role !== "ADMIN")) {
        redirect("/login");
    }

    const businessId = session.user.businessId;

    // Find all businesses in the same corporate group
    let businesses: any[] = [];
    if (session.user.role === "CORPORATE" && session.user.corporateId) {
        businesses = await prisma.business.findMany({
            where: { corporateId: session.user.corporateId }
        });
    } else if (session.user.role === "ADMIN") {
        businesses = await prisma.business.findMany();
    } else {
        // Fallback for OWNER if they somehow get here, but they should only see their own
        businesses = await prisma.business.findMany({
            where: { id: businessId }
        });
    }

    const businessIds = businesses.map(b => b.id);

    // Aggregate data across all branches
    const completedRecords = await prisma.serviceRecord.findMany({
        where: {
            businessId: { in: businessIds },
            status: 'COMPLETED'
        },
        include: {
            service: {
                select: { name: true, category: true }
            },
            business: {
                select: { name: true }
            }
        }
    });

    const totalRevenue = completedRecords.reduce((sum, r) => sum + r.amount, 0);

    // Branch Performance
    const branchStats = completedRecords.reduce((acc: Record<string, any>, r) => {
        const key = r.businessId;
        if (!acc[key]) {
            acc[key] = {
                name: r.business.name,
                revenue: 0,
                bookings: 0
            };
        }
        acc[key].revenue += r.amount;
        acc[key].bookings += 1;
        return acc;
    }, {});

    const branchPerformance = Object.values(branchStats).sort((a: any, b: any) => b.revenue - a.revenue);

    // Service Performance Group-wide
    const serviceStats = completedRecords.reduce((acc: Record<string, any>, r) => {
        const key = r.service.name;
        if (!acc[key]) {
            acc[key] = {
                name: r.service.name,
                revenue: 0,
                bookings: 0
            };
        }
        acc[key].revenue += r.amount;
        acc[key].bookings += 1;
        return acc;
    }, {});

    const topServices = Object.values(serviceStats)
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 5);

    const metrics = {
        totalRevenue,
        branchPerformance,
        topServices,
        totalBookings: completedRecords.length,
        branchCount: businesses.length
    };

    return <AggregatedReportsClientPage metrics={metrics} />;
}
