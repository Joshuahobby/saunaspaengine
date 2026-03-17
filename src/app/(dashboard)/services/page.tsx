import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServicesClientPage from "./client-page";

type SessionUser = { branchId?: string; role?: string };

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
    const session = await auth();

    if (!session?.user?.branchId) {
        redirect("/login");
    }

    const branchId = session.user.branchId;

    // Fetch all services for this branch
    const services = await prisma.service.findMany({
        where: { branchId },
        orderBy: { name: 'asc' }
    });

    // Calculate Stats
    const totalServices = services.length;
    const activeServices = services.filter(s => s.status === 'ACTIVE').length;

    // Avg Duration
    const avgDuration = services.length > 0
        ? Math.round(services.reduce((acc, s) => acc + s.duration, 0) / services.length)
        : 0;

    // Most Popular Service (via ServiceRecords)
    const mostPopularAgg = await prisma.serviceRecord.groupBy({
        by: ['serviceId'],
        where: { branchId },
        _count: {
            serviceId: true
        },
        orderBy: {
            _count: {
                serviceId: 'desc'
            }
        },
        take: 1
    });

    let mostPopularName = "None";
    if (mostPopularAgg.length > 0) {
        const popularService = await prisma.service.findUnique({
            where: { id: mostPopularAgg[0].serviceId },
            select: { name: true }
        });
        mostPopularName = popularService?.name || "Unknown";
    }

    const stats = {
        total: totalServices,
        active: activeServices,
        avgDuration,
        mostPopular: mostPopularName
    };

    const userRole = (session.user as SessionUser).role || "EMPLOYEE";

    return <ServicesClientPage services={services} stats={stats} userRole={userRole} />;
}
