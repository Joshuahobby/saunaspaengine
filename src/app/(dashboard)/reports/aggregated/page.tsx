import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AggregatedReportsClient from "./client-page";

export const dynamic = "force-dynamic";

export default async function AggregatedReportsPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "CORPORATE") {
        redirect("/dashboard");
    }

    const corporateId = session.user.corporateId;
    if (!corporateId) {
        return <div>No corporate association found.</div>;
    }

    // Fetch branches and recent global activity
    const businesses = await prisma.business.findMany({
        where: { corporateId },
        select: { id: true, name: true, createdAt: true },
        orderBy: { name: "asc" }
    });

    const businessIds = businesses.map(b => b.id);

    // Get the most recent 50 completed service records across all branches
    const recentRecords = await prisma.serviceRecord.findMany({
        where: {
            businessId: { in: businessIds },
            status: "COMPLETED"
        },
        include: {
            service: { select: { name: true } },
            employee: { select: { fullName: true } },
            business: { select: { name: true } },
            client: { select: { fullName: true, clientType: true } },
        },
        orderBy: { completedAt: "desc" },
        take: 50
    });

    const aggregateData = recentRecords.map(r => ({
        id: r.id,
        businessName: r.business.name,
        serviceName: r.service.name,
        employeeName: r.employee?.fullName || 'Unknown',
        clientName: r.client.fullName,
        clientType: r.client.clientType,
        amount: r.amount || 0,
        paymentMode: r.paymentMode,
        completedAt: r.completedAt ? r.completedAt.toISOString() : r.createdAt.toISOString()
    }));

    return <AggregatedReportsClient reports={aggregateData} businesses={businesses.map(b => b.name)} />;
}
