import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import ClientListClient from "./client-page";

export default async function ClientsPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");
    if (!session.user.branchId && session.user.role !== 'OWNER') redirect("/login");

    const branchIds = session.user.role === 'OWNER'
        ? (await prisma.branch.findMany({ where: { businessId: session.user.businessId as string }, select: { id: true } })).map(b => b.id)
        : [session.user.branchId as string];

    const clients = await prisma.client.findMany({
        where: { branchId: { in: branchIds } },
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
        orderBy: { createdAt: "desc" }
    });

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
            lastVisit,
            totalSpent,
            membershipName: activeMembership?.category?.name,
            membershipExpiry: activeMembership?.endDate
                ? new Date(activeMembership.endDate).toLocaleDateString()
                : undefined
        };
    });

    return <ClientListClient clients={clientData} />;
}
