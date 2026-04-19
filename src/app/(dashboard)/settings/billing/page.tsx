import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSubscriptionState } from "@/lib/subscription";
import UsageMeters from "@/components/dashboard/UsageMeters";
import PlanSelector from "@/components/dashboard/PlanSelector";
import BillingHistory from "@/components/dashboard/BillingHistory";

export const metadata = {
    title: "Billing & Subscription | Sauna SPA Engine",
};

export default async function BillingPage() {
    const session = await auth();
    if (!session?.user?.businessId) redirect("/login");

    const businessId = session.user.businessId;
    const subState = await getSubscriptionState(businessId);
    
    if (!subState) redirect("/onboarding");

    const packages = await prisma.platformPackage.findMany({
        where: { isCustom: false } // Only show standard plans
    });

    const payments = await prisma.subscriptionPayment.findMany({
        where: { businessId },
        orderBy: { createdAt: "desc" },
        take: 10
    });

    return (
        <main className="flex-1 w-full max-w-7xl mx-auto space-y-16 pb-20 no-scrollbar animate-fade-in py-8 px-4 md:px-10">
            {/* Header */}
            <header className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="size-14 rounded-3xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shadow-inner">
                        <span className="material-symbols-outlined text-3xl font-black">payments</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-black text-[var(--text-main)] tracking-tight">
                            Billing & <span className="text-[var(--color-primary)]">Subscription.</span>
                        </h1>
                        <p className="text-[var(--text-muted)] font-bold text-xs opacity-60">
                            Manage your workspace capacity, billing cycles, and growth.
                        </p>
                    </div>
                </div>
            </header>

            {/* Current Status & Usage Stats */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                        <span className="size-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                        Usage Analytics
                    </h2>
                    {subState.isTrial && (
                        <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-3">
                            <span className="material-symbols-outlined text-orange-500 text-sm">timer</span>
                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                                {subState.daysRemaining} Days left in trial
                            </span>
                        </div>
                    )}
                </div>
                
                <UsageMeters usage={subState.usage} limits={subState.plan || { employeeLimit: 0, serviceLimit: 0, checkInLimit: 0 }} />
            </section>

            {/* Plan Selection */}
            <section id="plans" className="space-y-10 pt-8 border-t border-[var(--border-muted)]">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-display font-black tracking-tight">Choose Your <span className="text-[var(--color-primary)]">Growth Stage.</span></h2>
                    <p className="text-[var(--text-muted)] text-sm font-medium max-w-xl mx-auto opacity-70">
                        Select a plan that fits your current team size and operation volume. Upgrade anytime to unlock more capacity.
                    </p>
                </div>

                <PlanSelector 
                    packages={packages} 
                    currentPlanId={subState.plan?.name ? packages.find(p => p.name === subState.plan?.name)?.id : undefined}
                    businessEmail={session.user.email!}
                />
            </section>

            {/* Billing History */}
            <section className="space-y-8 pt-8 border-t border-[var(--border-muted)]">
                <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">history</span>
                    Payment History
                </h2>
                <BillingHistory payments={payments} />
            </section>

            {/* Safety/Cancellation CTA */}
            <section className="bg-[var(--bg-surface-muted)]/30 border border-[var(--border-muted)] p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                    <h4 className="text-xl font-display font-black">Pause or Cancel?</h4>
                    <p className="text-[var(--text-muted)] text-xs font-bold opacity-60 max-w-lg">
                        You can cancel your subscription at any time. Your workspace features will remain active until the end of your current billing cycle.
                    </p>
                </div>
                <button className="px-8 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    Cancel Subscription
                </button>
            </section>
        </main>
    );
}
