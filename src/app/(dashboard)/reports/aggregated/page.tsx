import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AggregatedReportsClient from "./client-page";

export const dynamic = "force-dynamic";

export default async function AggregatedReportsPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "OWNER") {
        redirect("/dashboard");
    }

    const businessId = session.user.businessId;
    if (!businessId) {
        return <div>No business association found.</div>;
    }

    // Fetch branches and recent global activity
    const branches = await prisma.branch.findMany({
        where: { businessId },
        select: { id: true, name: true, createdAt: true },
        orderBy: { name: "asc" }
    });

    const branchIds = branches.map(b => b.id);

    // Get the most recent 50 completed service records across all branches
    const recentRecords = await prisma.serviceRecord.findMany({
        where: {
            branchId: { in: branchIds },
            status: "COMPLETED"
        },
        include: {
            service: { select: { name: true } },
            employee: { select: { fullName: true } },
            branch: { select: { name: true } },
            client: { select: { fullName: true, clientType: true } },
        },
        orderBy: { completedAt: "desc" },
        take: 50
    });

    const aggregateData = recentRecords.map(r => ({
        id: r.id,
        branchName: r.branch.name,
        serviceName: r.service.name,
        employeeName: r.employee?.fullName || 'Unknown',
        clientName: r.client.fullName,
        clientType: r.client.clientType,
        amount: r.amount || 0,
        paymentMode: r.paymentMode,
        completedAt: r.completedAt ? r.completedAt.toISOString() : r.createdAt.toISOString()
    }));

    return <AggregatedReportsClient reports={aggregateData} branches={branches.map(b => b.name)} />;
}
