import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import ExecutiveBranchesClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Branch Network | Executive Dashboard",
    description: "Monitor and manage your spa branch locations.",
};

export const dynamic = "force-dynamic";

export default async function ExecutiveBranchesPage() {
    const session = await requireRole(["OWNER"]);

    const branches = await prisma.branch.findMany({
        where: { businessId: session.user.businessId as string },
        orderBy: { createdAt: "desc" },
        include: {
            business: {
                select: { name: true }
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
            branchId: { in: validBranchIds }
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
        businessName: b.business?.name || "My Business",
        businessId: b.businessId,
    }));

    const stats = {
        totalRevenue: totalRevenue._sum.amount || 0,
        totalBranches: branches.length,
        activeBranches: branches.filter(b => b.status === "ACTIVE").length,
    };

    return <ExecutiveBranchesClientPage branches={branchData} stats={stats} />;
}
