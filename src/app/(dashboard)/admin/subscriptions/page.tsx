import { requireRole } from "@/lib/role-guard";
import SubscriptionsClientPage from "./client-page";
import { prisma } from "@/lib/prisma";

export const metadata = {
    title: "Global Subscriptions | Admin",
    description: "Manage branch subscriptions and revenue.",
};

export default async function AdminSubscriptionsPage() {
    await requireRole(["ADMIN"]);

    const businesses = await (prisma as any).business.findMany({
        include: {
            subscriptionPlan: true
        },
        orderBy: { createdAt: 'desc' },
    });

    const branches = businesses.map((c: any) => ({
        id: c.id,
        name: c.name,
        email: null,
        subscriptionPlan: c.subscriptionPlan?.name || "Unassigned",
        subscriptionCycle: c.subscriptionCycle,
        subscriptionStatus: c.subscriptionStatus,
        subscriptionRenewal: c.subscriptionRenewal,
    }));

    return <SubscriptionsClientPage branches={branches} />;
}
