"use client";

import { SubscriptionState } from "@/lib/subscription";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface SubscriptionBannerProps {
    state: SubscriptionState;
}

export function SubscriptionBanner({ state }: SubscriptionBannerProps) {
    if (state.status === "ACTIVE") return null;

    let bgClass = "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30";
    let textClass = "text-[var(--color-primary)]";
    let btnClass = "bg-[var(--color-primary)] text-[var(--bg-app)] hover:scale-105";
    let message = "";
    let subMessage = "";
    let icon = "info";

    switch (state.status) {
        case "TRIAL":
            message = `Your ${state.plan?.name || "Premium"} trial ends in ${state.daysRemaining} days.`;
            subMessage = "Upgrade now to keep your data and advanced features.";
            icon = "timer";
            break;
        case "EXPIRED":
        case "PAST_DUE":
            bgClass = "bg-red-500/10 border-red-500/30";
            textClass = "text-red-500";
            btnClass = "bg-red-500 text-white hover:scale-105 shadow-lg shadow-red-500/20";
            message = "Subscription Expired - Operations Restricted.";
            subMessage = "Reactivate your account to resume check-ins and staff management.";
            icon = "error";
            break;
        case "REJECTED":
            bgClass = "bg-amber-500/10 border-amber-500/30";
            textClass = "text-amber-500";
            btnClass = "bg-amber-500 text-white hover:scale-105 shadow-lg shadow-amber-500/20";
            message = "Verification Required.";
            subMessage = "Your business profile was not approved. Please update your details.";
            icon = "warning";
            break;
        case "FREE":
            bgClass = "bg-emerald-500/10 border-emerald-500/30";
            textClass = "text-emerald-500";
            btnClass = "bg-emerald-500 text-white hover:scale-105 shadow-lg shadow-emerald-500/20";
            message = "Free Forever Tier.";
            subMessage = `Manage your spa with limits (1 Staff, 5 Services). Upgrade for more.`;
            icon = "volunteer_activism";
            break;
    }

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className={`w-full border-b backdrop-blur-md sticky top-0 z-[60] overflow-hidden ${bgClass}`}
            >
                <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${bgClass} border`}>
                            <span className="material-symbols-outlined !text-lg">{icon}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                            <span className={`text-xs font-black uppercase tracking-widest ${textClass}`}>{message}</span>
                            <span className="text-[10px] opacity-70 font-bold hidden md:block">{subMessage}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/settings/billing" 
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${btnClass}`}
                        >
                            {state.status === "FREE" || state.status === "TRIAL" ? "Upgrade Now" : "Reactivate"}
                        </Link>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
