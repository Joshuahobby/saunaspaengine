import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import ApprovalsClientPage from "./client-page";

export const metadata = {
    title: "Compliance Queue | Business Approvals",
    description: "Verify and approve new business organizations for platform operations.",
};

export default async function BusinessApprovalsPage() {
    await requireRole(["ADMIN"]);

    const db = prisma as any;
    const pendingBusinesses = await db.business.findMany({
        where: {
            approvalStatus: "PENDING"
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const businesses = pendingBusinesses.map((b: any) => ({
        id: b.id,
        name: b.name,
        taxId: b.taxId,
        headquarters: b.headquarters,
        createdAt: b.createdAt,
    }));

    return <ApprovalsClientPage businesses={businesses} />;
}
