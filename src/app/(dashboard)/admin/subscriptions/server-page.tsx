import { requireRole } from "@/lib/role-guard";
import SubscriptionsClientPage from "./client-page";
import { prisma } from "@/lib/prisma";

export const metadata = {
    title: "Global Subscriptions | Admin",
    description: "Manage branch subscriptions and revenue.",
};

export default async function AdminSubscriptionsPage() {
    await requireRole(["ADMIN"]);

    const businesses = await prisma.business.findMany({
        include: {
            subscriptionPlan: true
        },
        orderBy: { createdAt: 'desc' },
    });

    const branches = businesses.map((c) => {
        // Calculate expected MRR for this business
        let mrrContribution = 0;
        if (c.subscriptionPlan && c.approvalStatus === "APPROVED") {
            if (c.subscriptionCycle === "Yearly") {
                mrrContribution = c.subscriptionPlan.priceYearly / 12;
            } else {
                mrrContribution = c.subscriptionPlan.priceMonthly;
            }
        }

        return {
            id: c.id,
            name: c.name,
            identifier: c.taxId ? `TIN: ${c.taxId}` : (c.headquarters || "Unknown HQ"),
            subscriptionPlan: c.subscriptionPlan?.name || "Unassigned",
            subscriptionCycle: c.subscriptionCycle,
            subscriptionStatus: c.approvalStatus === "APPROVED" ? (c.subscriptionStatus || "ACTIVE") : "PENDING",
            subscriptionRenewal: c.subscriptionRenewal,
            mrrContribution
        };
    });

    return <SubscriptionsClientPage branches={branches} />;
}
