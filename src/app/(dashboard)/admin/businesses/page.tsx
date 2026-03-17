import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import AdminBranchesClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Vessel Directory | Branch Hubs",
    description: "Manage and oversee all business branch hubs and their branch networks.",
};

export default async function AdminBranchesPage() {
    await requireRole(["ADMIN", "OWNER"]);

    const branches = await prisma.business.findMany({
        include: {
            branches: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const mappedBranches = branches.map(corp => {
        const activeBranches = corp.branches.filter(b => b.status === "ACTIVE").length;
        const totalBranches = corp.branches.length;
        return {
            id: corp.id,
            name: corp.name,
            taxId: corp.taxId,
            headquarters: corp.headquarters,
            status: corp.status,
            createdAt: corp.createdAt.toISOString(),
            activeBranches,
            totalBranches
        };
    });

    const stats = {
        totalBranches: mappedBranches.length,
        activeBranches: mappedBranches.filter(b => b.status === "ACTIVE").length,
    };

    return <AdminBranchesClientPage branches={mappedBranches} stats={stats} />;
}
