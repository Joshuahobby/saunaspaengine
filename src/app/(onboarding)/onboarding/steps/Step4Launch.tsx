"use client";

import { useState } from "react";
import { completeOnboardingAction } from "../actions";

interface StepProps {
    branch: {
        id: string;
        name: string | null;
        logo: string | null;
        address: string | null;
        phone: string | null;
        services?: any[];
        employees?: any[];
    };
    onNext: () => void;
    onPrev: () => void;
}

export function Step4Launch({ branch, onNext, onPrev }: StepProps) {
    const [loading, setLoading] = useState(false);

    async function handleLaunch() {
        setLoading(true);
        try {
            await completeOnboardingAction(branch.id);
            onNext();
        } catch (error) {
            console.error("Failed to launch branch:", error);
            // Optionally handle error, e.g., show a toast
        } finally {
            setLoading(false);
        }
    }



    return (
        <div className="max-w-2xl mx-auto space-y-6 py-2">
            {/* Stage Header */}
            <div className="space-y-1">
                <h1 className="text-xl font-display font-black text-[var(--text-main)] tracking-tight">Final Review & Launch</h1>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed opacity-80">
                    Your profile is ready. Launch your dashboard to start taking bookings.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Branch Preview Card */}
                <section className="bg-[var(--bg-card)]/40 backdrop-blur-md border border-[var(--border-main)] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[var(--color-primary-border)] transition-colors">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-[var(--bg-surface-muted)] flex items-center justify-center overflow-hidden border border-[var(--border-main)] shadow-sm shrink-0">
                                    {branch.logo ? (
                                        <img src={branch.logo} alt="Branch Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-[var(--color-primary)] !text-2xl">storefront</span>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base font-display font-black text-[var(--text-main)] truncate">{branch.name}</h3>
                                    <div className="flex items-center gap-1.5 text-[var(--color-primary)] text-[9px] font-black uppercase tracking-[0.2em] mt-1">
                                        <span className="material-symbols-outlined !text-[12px]">verified</span>
                                        Ready to Launch
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] p-4 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                    <span className="material-symbols-outlined !text-[14px]">location_on</span>
                                    <span className="text-[9px] font-black uppercase tracking-[0.15em]">Location & Contact</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-[var(--text-main)]">{branch.address || "Address not provided"}</p>
                                    <p className="text-xs font-medium text-[var(--text-muted)]">{branch.phone || "Phone not provided"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] p-4 rounded-xl flex flex-col justify-center items-center text-center gap-1">
                                    <span className="material-symbols-outlined text-[var(--color-primary)] !text-xl mb-1">spa</span>
                                    <span className="text-2xl font-display font-black text-[var(--text-main)]">{branch.services?.length || 0}</span>
                                    <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.15em]">Services</p>
                                </div>
                                <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] p-4 rounded-xl flex flex-col justify-center items-center text-center gap-1">
                                    <span className="material-symbols-outlined text-[var(--color-primary)] !text-xl mb-1">badge</span>
                                    <span className="text-2xl font-display font-black text-[var(--text-main)]">{branch.employees?.length || 0}</span>
                                    <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.15em]">Team</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right: QR Preview */}
                <section className="bg-[var(--bg-card)]/40 backdrop-blur-md border border-[var(--border-main)] rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-6 hover:border-[var(--color-primary-border)] transition-colors">
                    <div className="space-y-2">
                        <h2 className="text-base font-display font-black text-[var(--text-main)]">Your Booking QR Code</h2>
                        <p className="text-[11px] font-medium text-[var(--text-muted)] max-w-[220px] leading-relaxed mx-auto">
                            Customers can scan this code at your reception to view services and book.
                        </p>
                    </div>
                    
                    <div className="size-40 bg-white p-3 rounded-2xl shadow-md border border-neutral-200 relative group transition-transform hover:scale-105 duration-300">
                        <div className="size-full bg-neutral-50 rounded-xl flex items-center justify-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.saunaspaengine.com"}/spa/${branch.id}`)}`} 
                                alt="QR Code" 
                                className="w-full h-full mix-blend-multiply" 
                            />
                        </div>
                    </div>
                    
                    <div className="bg-[var(--color-primary-muted)] text-[var(--color-primary)] px-4 py-2 rounded-lg border border-[var(--color-primary-border)]">
                        <p className="text-[10px] font-black uppercase tracking-[0.1em]">Test Scan to Verify</p>
                    </div>
                </section>
            </div>

            {/* Final Action */}
            <div className="flex flex-col items-center gap-4 pt-8">
                <button 
                    onClick={handleLaunch}
                    disabled={loading}
                    className="h-12 px-10 bg-[var(--color-primary)] text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-xl hover:bg-[var(--color-primary-hover)] hover:-translate-y-0.5 active:scale-[0.98] transition-all group disabled:opacity-70 disabled:hover:translate-y-0"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <span className="size-3 border-2 border-[var(--bg-app)] border-t-transparent rounded-full animate-spin"></span>
                            Launching...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            Finish Setup
                            <span className="material-symbols-outlined !text-sm animate-bounce">celebration</span>
                        </div>
                    )}
                </button>
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <button onClick={onPrev} className="text-[8px] font-black uppercase tracking-widest hover:text-[var(--text-main)] transition-colors border-b border-transparent hover:border-white/20">Go Back</button>
                </div>
            </div>

            {/* Optional visual flair element */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[var(--bg-card)]/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl pointer-events-none opacity-50">
                <div className="relative">
                    <span className="size-2 rounded-full bg-[var(--color-primary)] block"></span>
                    <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] animate-ping"></span>
                </div>
                <p className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-[0.3em]">System Health: Optimal</p>
            </div>
        </div>
    );
}
