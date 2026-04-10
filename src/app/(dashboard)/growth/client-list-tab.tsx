import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";
import ClientListClient from "../clients/client-page";

export default async function ClientListTab({ 
    searchParams 
}: { 
    searchParams: Promise<{ 
        branchId?: string, 
        page?: string, 
        search?: string, 
        filter?: "all" | "MEMBER" | "WALK_IN" | "ARCHIVED" 
    }> 
}) {
    const params = await searchParams;
    const session = await auth();
    if (!session?.user) return null;

    const page = parseInt(params.page || "1");
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = params.search || "";
    const filter = params.filter || "all";

    const branchIds = params.branchId 
        ? [params.branchId]
        : (session.user.role === 'OWNER'
            ? (await prisma.branch.findMany({ where: { businessId: session.user.businessId as string }, select: { id: true } })).map(b => b.id)
            : [session.user.branchId as string]);

    const searchWhere: any = {
        branchId: { in: branchIds }
    };

    if (filter === "MEMBER" || filter === "WALK_IN") {
        searchWhere.clientType = filter;
        searchWhere.status = "ACTIVE";
    } else if (filter === "ARCHIVED") {
        searchWhere.status = "ARCHIVED";
    } else {
        searchWhere.status = "ACTIVE";
    }

    if (search) {
        searchWhere.OR = [
            { fullName: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } }
        ];
    }

    const [clients, totalCount, allCount, membersCount, walkInsCount, archivedCount] = await Promise.all([
        prisma.client.findMany({
            where: searchWhere,
            include: {
                memberships: {
                    where: { status: "ACTIVE" },
                    include: { category: true }
                },
                serviceRecords: {
                    where: { status: "COMPLETED" },
                    orderBy: { createdAt: "desc" }
                }
            },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" }
        }),
        prisma.client.count({ where: searchWhere }),
        prisma.client.count({ where: { branchId: { in: branchIds }, status: "ACTIVE" } }),
        prisma.client.count({ where: { branchId: { in: branchIds }, clientType: "MEMBER", status: "ACTIVE" } }),
        prisma.client.count({ where: { branchId: { in: branchIds }, clientType: "WALK_IN", status: "ACTIVE" } }),
        prisma.client.count({ where: { branchId: { in: branchIds }, status: "ARCHIVED" } })
    ]);

    const clientData = clients.map(client => {
        const lastVisit = client.serviceRecords.length > 0
            ? formatDistanceToNow(new Date(client.serviceRecords[0].createdAt), { addSuffix: true })
            : "Never";
        const totalSpent = client.serviceRecords.reduce((sum, r) => sum + r.amount, 0);
        const activeMembership = client.memberships[0];

        return {
            id: client.id,
            fullName: client.fullName,
            phone: client.phone,
            clientType: client.clientType,
            qrCode: client.qrCode,
            status: client.status,
            lastVisit,
            totalSpent,
            membershipName: activeMembership?.category?.name,
            membershipExpiry: activeMembership?.endDate
                ? new Date(activeMembership.endDate).toLocaleDateString()
                : undefined
        };
    });

    return (
        <ClientListClient 
            initialClients={clientData} 
            totalCount={totalCount}
            currentPage={page}
            totalPages={Math.ceil(totalCount / limit)}
            metrics={{
                all: allCount,
                members: membersCount,
                walkIns: walkInsCount,
                archived: archivedCount
            }}
            initialSearch={search}
            initialFilter={filter}
        />
    );
}
