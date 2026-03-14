import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BranchComparisonClient from "./client-page";

export const dynamic = "force-dynamic";

export default async function BranchComparisonPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "CORPORATE") {
        redirect("/dashboard");
    }

    const corporateId = session.user.corporateId;
    if (!corporateId) {
        return <div>No corporate association found.</div>;
    }

    // Fetch businesses under this corporate entity
    const businesses = await prisma.business.findMany({
        where: { corporateId },
        include: {
            _count: {
                select: {
                    employees: true,
                    services: true,
                    clients: true,
                },
            },
            serviceRecords: {
                where: { status: "COMPLETED" },
                select: { amount: true }
            }
        },
        orderBy: { name: "asc" }
    });

    const businessData = businesses.map(b => ({
        id: b.id,
        name: b.name,
        status: b.status,
        revenue: b.serviceRecords.reduce((sum, r) => sum + (r.amount || 0), 0),
        employees: b._count.employees,
        services: b._count.services,
        clients: b._count.clients,
        createdAt: b.createdAt.toISOString(),
    }));

    return <BranchComparisonClient businesses={businessData} />;
}
