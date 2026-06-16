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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Branch Preview Card */}
                <section className="bg-[var(--bg-card)]/5 backdrop-blur-sm border border-white/5 rounded-xl p-5 space-y-4 flex flex-col">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-[var(--bg-card)] flex items-center justify-center overflow-hidden border border-white/10 shadow-sm">
                                {branch.logo ? (
                                    <img src={branch.logo} alt="Branch Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined text-[var(--color-primary)] !text-xl">storefront</span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-display font-black text-[var(--text-main)] truncate">{branch.name}</h3>
                                <div className="flex items-center gap-1 text-[var(--color-primary)] text-[8px] font-black uppercase tracking-widest mt-0.5">
                                    <span className="material-symbols-outlined !text-[10px]">verified</span>
                                    Ready to Launch
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        <div className="bg-[var(--bg-card)]/[0.02] border border-white/5 p-3 rounded-lg space-y-1.5">
                            <div className="flex items-center gap-2 text-[var(--text-main)] opacity-40">
                                <span className="material-symbols-outlined !text-[12px]">location_on</span>
                                <span className="text-[8px] font-black uppercase tracking-widest">Location Information</span>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold text-[var(--text-main)]">{branch.address || "Address not provided"}</p>
                                <p className="text-[10px] font-medium text-[var(--text-muted)] opacity-60">{branch.phone || "Phone not provided"}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-[var(--bg-card)]/[0.02] border border-white/5 p-3 rounded-lg space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="material-symbols-outlined text-[var(--color-primary)] !text-sm">spa</span>
                                    <span className="text-sm font-display font-black text-[var(--text-main)]">{branch.services?.length || 0}</span>
                                </div>
                                <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">Services</p>
                            </div>
                            <div className="bg-[var(--bg-card)]/[0.02] border border-white/5 p-3 rounded-lg space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="material-symbols-outlined text-[var(--color-primary)] !text-sm">badge</span>
                                    <span className="text-sm font-display font-black text-[var(--text-main)]">{branch.employees?.length || 0}</span>
                                </div>
                                <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">Team</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right: QR Preview */}
                <section className="bg-[var(--bg-card)]/5 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3">
                    <h2 className="text-sm font-bold text-[var(--text-main)]">Booking QR Code</h2>
                    <div className="size-32 bg-[var(--bg-card)] p-2 rounded-lg shadow-inner relative group">
                        <div className="size-full bg-neutral-100 rounded flex items-center justify-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://saunaspa.rw/spa/${branch.id}`)}`} 
                                alt="QR Code" 
                                className="w-full h-full" 
                            />
                        </div>
                    </div>
                    <p className="text-[9px] text-[var(--text-muted)] max-w-[200px] leading-relaxed opacity-60">
                        Customers can scan this code at your reception to view services and book.
                    </p>
                </section>
            </div>

            {/* Final Action */}
            <div className="flex flex-col items-center gap-3 pt-6">
                <button 
                    onClick={handleLaunch}
                    disabled={loading}
                    className="h-10 px-8 bg-[var(--color-primary)] text-[var(--bg-app)] rounded-lg font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:opacity-90 active:scale-[0.98] transition-all group"
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
