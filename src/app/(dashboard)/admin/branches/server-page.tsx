import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import AdminBranchesClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Operational Network | Platform Governance",
    description: "Monitor and manage individual branch branches across the platform.",
};

export const dynamic = "force-dynamic";

export default async function AdminBranchesPage() {
    const session = await requireRole(["ADMIN", "OWNER"]);

    const branchWhere = session.user.role === "OWNER" ? { businessId: session.user.businessId } : {};

    // Fetch real branch data
    const branches = await prisma.branch.findMany({
        where: branchWhere,
        orderBy: { createdAt: "desc" },
        include: {
            business: {
                select: {
                    name: true
                }
            },
            _count: {
                select: {
                    employees: true,
                    services: true,
                    clients: true,
                },
            },
        },
    });

    const validBranchIds = branches.map((b) => b.id);
    const totalRevenue = await prisma.serviceRecord.aggregate({
        _sum: { amount: true },
        where: { 
            status: "COMPLETED",
            ...(session.user.role === "OWNER" ? { branchId: { in: validBranchIds } } : {})
        },
    });

    const branchData = branches.map((b) => ({
        id: b.id,
        name: b.name,
        email: b.email,
        phone: b.phone,
        address: b.address,
        status: b.status,
        employeeCount: b._count.employees,
        serviceCount: b._count.services,
        clientCount: b._count.clients,
        createdAt: b.createdAt.toISOString(),
        businessName: b.business?.name || "Independent",
        businessId: b.businessId,
    }));

    const stats = {
        totalRevenue: totalRevenue._sum.amount || 0,
        totalBranches: branches.length,
        activeBranches: branches.filter(b => b.status === "ACTIVE").length,
    };

    return <AdminBranchesClientPage branches={branchData} stats={stats} />;
}
