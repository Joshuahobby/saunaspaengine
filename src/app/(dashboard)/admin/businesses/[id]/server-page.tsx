import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import BranchDetailsClientPage from "./client-page";
import { redirect } from "next/navigation";

export default async function BranchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await requireRole(["ADMIN", "OWNER"]);

    if (session.user.role === "OWNER" && session.user.businessId !== id) {
        redirect(session.user.businessId ? `/businesses/${session.user.businessId}` : "/dashboard");
    }

    const business = await prisma.business.findUnique({
        where: { id },
        include: {
            subscriptionPlan: true,
            branches: {
                orderBy: {
                    createdAt: 'desc'
                }
            },
        }
    });

    if (!business) {
        redirect("/businesses");
    }

    const platformPackages = await prisma.platformPackage.findMany({
        orderBy: { createdAt: 'asc' },
    });

    const mappedPackages = platformPackages.map((p) => ({
        ...p,
        priceMonthly: Number(p.priceMonthly),
        priceYearly: Number(p.priceYearly),
    }));

    // Map to a serializable object with proper type casting
    const serializableBusiness = {
        ...business,
        createdAt: business.createdAt.toISOString(),
        updatedAt: business.updatedAt.toISOString(),
        subscriptionRenewal: business.subscriptionRenewal?.toISOString() || null,
        branches: business.branches.map((b) => ({
            ...b,
            createdAt: b.createdAt.toISOString(),
            updatedAt: b.updatedAt.toISOString(),
        })),
    };

    return <BranchDetailsClientPage business={serializableBusiness as Parameters<typeof BranchDetailsClientPage>[0]["business"]} platformPackages={mappedPackages} />;
}
