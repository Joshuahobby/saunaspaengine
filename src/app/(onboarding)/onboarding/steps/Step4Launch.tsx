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
        <div className="max-w-4xl mx-auto space-y-12 py-8">
            {/* Stage Header */}
            <div className="space-y-3">
                <h1 className="text-4xl font-display font-black text-[var(--text-main)] tracking-tight">Final Review & Launch</h1>
                <p className="text-lg text-[var(--text-muted)] leading-relaxed">
                    Your branch profile and settings are ready. Review your setup and launch your dashboard to start taking bookings.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Branch Preview Card */}
                <section className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-8 space-y-8 flex flex-col">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="size-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden border-4 border-white/10 shadow-2xl">
                                {branch.logo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={branch.logo} alt="Branch Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">storefront</span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-2xl font-display font-black text-[var(--text-main)] truncate">{branch.name}</h3>
                                <div className="flex items-center gap-2 text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest mt-0.5">
                                    <span className="material-symbols-outlined !text-sm">verified</span>
                                    Ready to Launch
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl space-y-3">
                            <div className="flex items-center gap-3 text-[var(--text-main)] opacity-40">
                                <span className="material-symbols-outlined !text-lg">location_on</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Location Information</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-[var(--text-main)]">{branch.address || "Address not provided"}</p>
                                <p className="text-xs font-medium text-[var(--text-muted)] opacity-60">{branch.phone || "Phone not provided"}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl space-y-2 group hover:border-[var(--color-primary)]/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="material-symbols-outlined text-[var(--color-primary)]">spa</span>
                                    <span className="text-xl font-display font-black text-[var(--text-main)]">{branch.services?.length || 0}</span>
                                </div>
                                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">Services Added</p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl space-y-2 group hover:border-[var(--color-primary)]/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="material-symbols-outlined text-[var(--color-primary)]">badge</span>
                                    <span className="text-xl font-display font-black text-[var(--text-main)]">{branch.employees?.length || 0}</span>
                                </div>
                                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">Team Registered</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 p-6 rounded-2xl space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[var(--color-primary)]">mail</span>
                            <h4 className="font-bold text-sm text-[var(--text-main)]">Staff Notifications</h4>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed font-bold opacity-60 italic">
                            Automatic onboarding invites will be sent to your {branch.employees?.length || 0} registered staff members once you launch.
                        </p>
                    </div>
                </section>

                {/* Right: QR Preview */}
                <section className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center">
                    <div className="w-full flex justify-between items-center border-b border-white/5 pb-4 mb-8">
                        <h2 className="text-xl font-bold text-[var(--text-main)]">Booking QR Code</h2>
                        <span className="px-3 py-1 bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-[10px] font-black uppercase rounded-lg tracking-widest border border-[var(--color-primary)]/30">READY</span>
                    </div>

                    <div className="relative group">
                        <div className="size-48 bg-white p-4 rounded-3xl shadow-inner relative group">
                            <div className="size-full bg-neutral-100 rounded-2xl flex items-center justify-center overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://saunaspa.rw/spa/${branch.id}`)}`} 
                                    alt="QR Code" 
                                    className="w-full h-full" 
                                />
                            </div>
                        </div>
                        {/* Interactive Hint */}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-3xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                            <button title="Download QR Code" aria-label="Download QR Code" className="size-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                                <span className="material-symbols-outlined">download</span>
                            </button>
                            <button title="Print QR Code" aria-label="Print QR Code" className="size-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                                <span className="material-symbols-outlined">print</span>
                            </button>
                        </div>
                    </div>

                    <div className="text-center mt-8 space-y-2">
                        <h4 className="font-black text-[var(--text-main)] uppercase tracking-[0.2em] text-xs">Reception Flow</h4>
                        <p className="text-sm text-[var(--text-muted)] max-w-[240px] leading-relaxed font-bold opacity-60">
                            Customers can scan this code at your reception to view services and book.
                        </p>
                    </div>
                </section>
            </div>

            {/* Final Action */}
            <div className="flex flex-col items-center gap-6 pt-12">
                <button 
                    onClick={handleLaunch}
                    disabled={loading}
                    className="h-16 px-16 bg-[var(--color-primary)] text-[var(--bg-app)] rounded-2xl font-black text-lg uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(19,236,164,0.3)] hover:shadow-[0_0_60px_rgba(19,236,164,0.5)] hover:scale-[1.05] active:scale-[0.98] transition-all group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full duration-[1500ms] transition-transform" />
                    {loading ? (
                        <div className="flex items-center gap-4">
                            <span className="size-6 border-4 border-[var(--bg-app)] border-t-transparent rounded-full animate-spin"></span>
                            Launching...
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            Finish Setup
                            <span className="material-symbols-outlined !text-3xl animate-bounce">celebration</span>
                        </div>
                    )}
                </button>
                <div className="flex items-center gap-4 text-[var(--text-muted)]">
                    <button onClick={onPrev} className="text-[10px] font-black uppercase tracking-widest hover:text-[var(--text-main)] transition-colors border-b border-transparent hover:border-white/20">Go Back</button>
                    <span className="size-1 rounded-full bg-white/20"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Ready to launch</span>
                </div>
            </div>

            {/* Optional visual flair element */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl pointer-events-none opacity-50">
                <div className="relative">
                    <span className="size-2 rounded-full bg-[var(--color-primary)] block"></span>
                    <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] animate-ping"></span>
                </div>
                <p className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-[0.3em]">System Health: Optimal</p>
            </div>
        </div>
    );
}
