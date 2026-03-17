import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import PlatformPackagesClientPage from "./client-page";

export const metadata = {
    title: "Platform Packages | Admin",
    description: "Manage subscription plans for Branch Hubs.",
};

export default async function PlatformPackagesPage() {
    await requireRole(["ADMIN"]);

    const packages = await (prisma as any).platformPackage.findMany({
        orderBy: { createdAt: 'asc' },
    });

    const mappedPackages = packages.map((p: any) => ({
        ...p,
        priceMonthly: Number(p.priceMonthly),
        priceYearly: Number(p.priceYearly),
    }));

    return <PlatformPackagesClientPage initialPackages={mappedPackages} />;
}
