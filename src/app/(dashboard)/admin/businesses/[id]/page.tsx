import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import BusinessDetailsClientPage from "./client-page";
import { redirect } from "next/navigation";

export default async function BusinessDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await requireRole(["ADMIN", "CORPORATE"]);

    const corporate = await prisma.corporate.findUnique({
        where: { id },
        include: {
            businesses: {
                orderBy: {
                    createdAt: 'desc'
                }
            },
        }
    });

    if (!corporate) {
        redirect("/admin/businesses");
    }

    const platformPackages = await prisma.platformPackage.findMany({
        orderBy: { createdAt: 'asc' },
    });

    const mappedPackages = platformPackages.map((p: any) => ({
        ...p,
        priceMonthly: Number(p.priceMonthly),
        priceYearly: Number(p.priceYearly),
    }));

    // Map to a serializable object with proper type casting
    const serializableCorporate = {
        ...corporate,
        createdAt: corporate.createdAt.toISOString(),
        updatedAt: corporate.updatedAt.toISOString(),
        subscriptionRenewal: corporate.subscriptionRenewal?.toISOString() || null,
        businesses: corporate.businesses.map((b: any) => ({
            ...b,
            createdAt: b.createdAt.toISOString(),
            updatedAt: b.updatedAt.toISOString(),
        })),
    };

    return <BusinessDetailsClientPage corporate={serializableCorporate as any} platformPackages={mappedPackages} />;
}
