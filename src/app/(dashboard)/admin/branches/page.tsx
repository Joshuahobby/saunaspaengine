import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import AdminBranchesClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Node Network | Branch Management",
    description: "Monitor and manage individual branch nodes across the platform.",
};

export const dynamic = "force-dynamic";

export default async function AdminBranchesPage() {
    await requireRole(["ADMIN"]);

    // Fetch real branch data
    const branches = await prisma.branch.findMany({
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

    const totalRevenue = await prisma.serviceRecord.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" },
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
    }));

    const stats = {
        totalRevenue: totalRevenue._sum.amount || 0,
        totalBranches: branches.length,
        activeBranches: branches.filter(b => b.status === "ACTIVE").length,
    };

    return <AdminBranchesClientPage branches={branchData} stats={stats} />;
}
