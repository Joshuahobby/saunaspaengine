import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import AdminBusinessesClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Vessel Directory | Business Hubs",
    description: "Manage and oversee all corporate business hubs and their branch networks.",
};

export default async function AdminBusinessesPage() {
    await requireRole(["ADMIN", "CORPORATE"]);

    const businesses = await prisma.corporate.findMany({
        include: {
            businesses: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const mappedBusinesses = businesses.map(corp => {
        const activeBranches = corp.businesses.filter(b => b.status === "ACTIVE").length;
        const totalBranches = corp.businesses.length;
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
        totalBusinesses: mappedBusinesses.length,
        activeBusinesses: mappedBusinesses.filter(b => b.status === "ACTIVE").length,
    };

    return <AdminBusinessesClientPage businesses={mappedBusinesses} stats={stats} />;
}
