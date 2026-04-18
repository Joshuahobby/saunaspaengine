import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import AdminBranchesClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Business Ecosystem",
    description: "Manage and oversee all corporate entities and their global branch networks.",
};

interface BusinessRecord {
    id: string;
    name: string;
    taxId: string | null;
    headquarters: string | null;
    status: string;
    approvalStatus?: string;
    branches: Array<{ status: string }>;
}

export default async function AdminBranchesPage() {
    await requireRole(["ADMIN"]);

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
            activeBranches,
            totalBranches,
            approvalStatus: (corp.approvalStatus as "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED") || "PENDING",
        };
    });

    const stats = {
        totalBranches: mappedBranches.length,
        activeBranches: mappedBranches.filter(b => b.status === "ACTIVE").length,
    };

    return <AdminBranchesClientPage branches={mappedBranches} stats={stats} />;
}
