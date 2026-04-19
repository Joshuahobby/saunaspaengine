export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { OnboardingClient } from "./onboarding-client";

export default async function OnboardingPage() {
    const session = await auth();

    if (!session || (session.user.role !== "MANAGER" && session.user.role !== "OWNER")) {
        redirect("/dashboard");
    }

    const branchId = session.user.branchId;
    if (!branchId) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl max-w-sm text-center">
                    <h2 className="text-red-500 font-bold mb-2">Access Denied</h2>
                    <p className="text-sm opacity-60">No branch location associated with this account.</p>
                </div>
            </div>
        );
    }

    const branch = await prisma.branch.findUnique({
        where: { id: branchId },
        include: {
            services: true,
            employees: true,
            business: {
                select: {
                    subscriptionStatus: true,
                    subscriptionPlan: { select: { name: true, priceMonthly: true, priceYearly: true } },
                    subscriptionCycle: true,
                }
            },
        }
    });

    if (!branch) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl max-w-sm text-center">
                    <h2 className="text-amber-600 font-bold mb-2">Branch Not Found</h2>
                    <p className="text-sm opacity-60">The branch location could not be retrieved from the central registry.</p>
                </div>
            </div>
        );
    }

    // If onboarding is already completed, redirect to the actual dashboard
    if (branch.onboardingCompleted) {
        redirect("/dashboard");
    }

    const planPrice = branch.business?.subscriptionCycle === "Yearly"
        ? branch.business?.subscriptionPlan?.priceYearly ?? 0
        : branch.business?.subscriptionPlan?.priceMonthly ?? 0;

    const paymentPending = branch.business?.subscriptionStatus === "PENDING_PAYMENT" && planPrice > 0;

    return (
        <OnboardingClient 
            branch={branch} 
            initialStep={branch.onboardingStep} 
            paymentPending={paymentPending}
            userEmail={session.user.email || ""} 
        />
    );
}
