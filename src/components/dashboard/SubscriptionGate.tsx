"use client";

import React from "react";
import { SubscriptionState } from "@/lib/subscription";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SubscriptionGateProps {
    children: React.ReactNode;
    state: SubscriptionState | null;
}

export function SubscriptionGate({ children, state }: SubscriptionGateProps) {
    const pathname = usePathname();

    // Allow access to billing, help, and initial onboarding routes even when blocked
    const isAllowedPath = 
        pathname.includes("/settings/billing") || 
        pathname.includes("/help") || 
        pathname.includes("/onboarding");

    // If fully active, just render the dashboard
    if (!state || state.isActive || isAllowedPath) {
        return <>{children}</>;
    }

    // Determine the specific reason for the block
    const isExpired = state.status === "EXPIRED" || state.status === "PAST_DUE";
    const isRejected = state.status === "REJECTED";

    return (
        <div className="relative min-h-[calc(100vh-100px)] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
            {/* Background Blur Effect */}
            <div className="absolute inset-0 bg-[var(--bg-app)]/40 backdrop-blur-[2px] z-0" />
            
            {/* The actual underlying content (blurred) */}
            <div className="absolute inset-0 select-none pointer-events-none opacity-20 filter blur-xl z-[-1]">
                {children}
            </div>

            {/* Block Modal */}
            <div className="relative z-10 w-full max-w-2xl bg-[var(--bg-card)] border-2 border-[var(--border-muted)] rounded-[3rem] p-8 md:p-16 shadow-2xl space-y-10 text-center animate-in fade-in zoom-in duration-500">
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 size-48 bg-[var(--color-primary)]/10 blur-[80px] rounded-full" />
                
                <div className="flex flex-col items-center gap-6">
                    <div className="size-24 rounded-[2.5rem] bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shadow-inner transform -rotate-12">
                        <span className="material-symbols-outlined text-5xl font-black">lock_person</span>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-3xl md:text-5xl font-serif font-black text-[var(--text-main)] tracking-tight italic">
                            Workspace <span className="text-[var(--color-primary)]">Locked.</span>
                        </h2>
                        <p className="text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] text-[10px] opacity-60">
                            Immediate Action Required to Resume Operations
                        </p>
                    </div>
                </div>

                <div className="bg-[var(--bg-surface-muted)]/50 border border-[var(--border-muted)] rounded-3xl p-8 space-y-4">
                    <p className="text-sm md:text-base text-[var(--text-main)] font-bold leading-relaxed">
                        {isExpired ? (
                            "Your subscription has expired. To maintain service continuity and preserve your business data access, please reactivate your plan."
                        ) : isRejected ? (
                            "Your latest payment was rejected or canceled. Please re-verify your payment details to restore workspace functionality."
                        ) : (
                            "Access to your operational dashboard is currently restricted. Activate a plan to continue managing your spa business."
                        )}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <span className="h-1.5 w-12 rounded-full bg-[var(--color-primary)] opacity-30" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--color-primary)]">Sacred Sanctuary Policy</span>
                        <span className="h-1.5 w-12 rounded-full bg-[var(--color-primary)] opacity-30" />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                        href="/settings/billing#plans" 
                        className="flex-1 h-16 bg-[var(--text-main)] text-[var(--bg-app)] hover:bg-[var(--color-primary)] transition-all rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.3em] text-xs shadow-xl group"
                    >
                        <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">payments</span>
                        Reactivate Now
                    </Link>
                    <Link 
                        href="/help"
                        className="h-16 px-8 border border-[var(--border-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)] transition-all rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-[0.2em] text-[10px]"
                    >
                        Contact Support
                    </Link>
                </div>

                <p className="text-[10px] text-[var(--text-muted)] opacity-40 font-bold uppercase tracking-widest leading-loose italic">
                    All client data and history are safely preserved.
                    <br />
                    Workspace unlocks instantly upon successful plan activation.
                </p>
            </div>
        </div>
    );
}
