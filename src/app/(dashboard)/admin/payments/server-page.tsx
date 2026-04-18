import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import AdminPaymentsClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Subscription Payments",
    description: "Monitor and manage all SaaS subscription payment transactions.",
};

interface PaymentRow {
    id: string;
    depositId: string;
    businessId: string;
    businessName: string;
    planName: string;
    cycle: string;
    amount: number;
    currency: string;
    phone: string;
    correspondent: string;
    status: string;
    failureReason: string | null;
    createdAt: string;
    businessApprovalStatus: string;
    businessSubStatus: string;
}

export default async function AdminPaymentsPage() {
    await requireRole(["ADMIN"]);

    const payments = await prisma.subscriptionPayment.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            business: {
                select: {
                    id: true,
                    name: true,
                    approvalStatus: true,
                    subscriptionStatus: true,
                    subscriptionCycle: true,
                    subscriptionPlan: { select: { name: true } },
                },
            },
        },
    });

    const stats = {
        total: payments.length,
        pending: payments.filter(p => p.status === "PENDING").length,
        completed: payments.filter(p => p.status === "COMPLETED").length,
        failed: payments.filter(p => p.status === "FAILED").length,
        totalRevenue: payments
            .filter(p => p.status === "COMPLETED")
            .reduce((sum, p) => sum + p.amount, 0),
    };

    const serialised: PaymentRow[] = payments.map(p => ({
        id: p.id,
        depositId: p.depositId,
        businessId: p.business.id,
        businessName: p.business.name,
        planName: p.business.subscriptionPlan?.name ?? "—",
        cycle: p.business.subscriptionCycle ?? "—",
        amount: p.amount,
        currency: p.currency,
        phone: p.phone,
        correspondent: p.correspondent,
        status: p.status,
        failureReason: p.failureReason ?? null,
        createdAt: p.createdAt.toISOString(),
        businessApprovalStatus: p.business.approvalStatus,
        businessSubStatus: p.business.subscriptionStatus ?? "—",
    }));

    return <AdminPaymentsClientPage payments={serialised} stats={stats} />;
}
