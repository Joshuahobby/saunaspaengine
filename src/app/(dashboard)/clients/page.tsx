import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import ClientListClient from "./client-page";

export default async function ClientsPage() {
    const session = await auth();
    if (!session?.user?.branchId) redirect("/login");

    const clients = await prisma.client.findMany({
        where: { branchId: session.user.branchId },
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
