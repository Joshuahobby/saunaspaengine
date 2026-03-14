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

    // Fetch real business data
    const businesses = await prisma.business.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            corporate: {
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

    const businessData = businesses.map((b) => ({
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
        corporateName: b.corporate?.name || "Independent",
    }));

    const stats = {
        totalRevenue: totalRevenue._sum.amount || 0,
        totalBusinesses: businesses.length,
        activeBusinesses: businesses.filter(b => b.status === "ACTIVE").length,
    };

    return <AdminBranchesClientPage businesses={businessData} stats={stats} />;
}
