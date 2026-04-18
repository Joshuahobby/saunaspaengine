import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UniversalMemberRegistryClient from "./client-page";

export default async function UniversalMemberRegistryPage() {
    const session = await auth();

    if (!session?.user || (session.user.role !== "OWNER" && session.user.role !== "ADMIN")) {
        redirect("/dashboard");
    }

    // 1. Get business context
    const businessId = session.user.businessId;

    // 2. Fetch all clients across all branches of the business
    const clientsData = await prisma.client.findMany({
        where: {
            branch: { businessId: businessId }
        },
        include: {
            branch: { select: { name: true } },
            memberships: {
                where: { status: "ACTIVE" }
            },
            serviceRecords: {
                where: { status: "COMPLETED" },
                select: { id: true, createdAt: true },
                orderBy: { createdAt: "desc" },
                take: 1
            }
        }
    });

    const formattedClients = clientsData.map((c) => ({
        id: c.id,
        fullName: c.fullName,
        phone: c.phone || "No phone",
        clientType: c.clientType,
        branchId: c.branchId,
        branchName: c.branch?.name || "Unknown",
        activeMemberships: c.memberships.length,
        totalVisits: c.serviceRecords?.length || 0,
        lastVisitDate: c.serviceRecords?.[0]?.createdAt?.toISOString() || null
    }));

    return <UniversalMemberRegistryClient initialClients={formattedClients} />;
}
