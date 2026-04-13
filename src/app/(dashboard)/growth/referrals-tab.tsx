"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const REFERRALS = [
    { initials: "RM", name: "Riverside Marine & Spa", date: "Oct 24, 2023", status: "Trialing", note: "Reward pending" },
    { initials: "EW", name: "Elemental Wellness Center", date: "Oct 18, 2023", status: "Sent", note: "Invite opened" },
    { initials: "BS", name: "Boutique Steam Co.", date: "Oct 12, 2023", status: "Expired", note: null },
];

export default function ReferralsTab() {
    const [copied, setCopied] = useState(false);
    const link = "saunaspa.rw/ref/spabiz_928";

    const copyLink = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Hero Invitation */}
            <section className="relative overflow-hidden glass-card p-12 rounded-[3.5rem] border border-[var(--border-muted)] bg-[var(--color-primary)]/5">
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="size-16 rounded-[1.5rem] bg-[var(--color-primary)] flex items-center justify-center text-white shadow-2xl shadow-[var(--color-primary)]/20">
                            <span className="material-symbols-outlined text-4xl">diversity_3</span>
                        </div>
                        <h2 className="text-5xl font-serif font-black italic leading-tight tracking-tighter">
                            Grow Your <span className="text-[var(--color-primary)]">Circle.</span>
                        </h2>
                        <p className="text-xl text-[var(--text-muted)] font-bold italic opacity-80 leading-relaxed">
                            Refer a fellow spa owner and get <span className="text-[var(--text-main)] underline decoration-[var(--color-primary)] underline-offset-4">1 Month Free</span> for each successful signup.
                        </p>
                        <div className="flex gap-4">
                            <button className="h-16 px-8 rounded-2xl bg-[var(--text-main)] text-[var(--bg-app)] font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                                Send Invites
                            </button>
                            <button className="h-16 px-8 rounded-2xl border border-[var(--border-muted)] text-[var(--text-main)] font-black uppercase tracking-widest text-[10px] hover:bg-[var(--bg-card)] transition-all">
                                How it Works
                            </button>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-8 rounded-[2.5rem] bg-[var(--bg-app)]/50 border border-[var(--border-muted)]">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60 mb-2">Total Referrals</p>
                            <p className="text-4xl font-black">12</p>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-[var(--text-main)] text-[var(--bg-app)]">
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">Credits Earned</p>
                            <p className="text-4xl font-black">14 mo.</p>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-[var(--bg-app)]/50 border border-[var(--border-muted)] col-span-2">
                             <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60 mb-2">Link Performance</p>
                             <div className="flex items-center justify-between">
                                <p className="text-2xl font-black">1.2k Clicks</p>
                                <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">+12% Wow</span>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Pending History */}
                <section className="lg:col-span-2 space-y-8">
                     <h3 className="text-2xl font-serif font-black italic text-[var(--text-main)] underline decoration-[var(--color-primary)]/20 underline-offset-8">
                        Tracking <span className="text-[var(--color-primary)]">Progress.</span>
                    </h3>
                    <div className="space-y-4">
                        {REFERRALS.map((r) => (
                            <div key={r.name} className="flex items-center justify-between p-8 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] hover:-translate-y-1 transition-all duration-500 shadow-sm">
                                <div className="flex items-center gap-6">
                                    <div className="size-14 rounded-3xl bg-[var(--bg-surface-muted)] flex items-center justify-center font-black text-xs border border-[var(--border-muted)]">
                                        {r.initials}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg leading-tight">{r.name}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">Sent On {r.date}</p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                        r.status === 'Trialing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                        r.status === 'Sent' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20' :
                                        'bg-[var(--text-muted)]/10 text-[var(--text-muted)] border-[var(--text-muted)]/20'
                                    }`}>
                                        {r.status}
                                    </span>
                                    {r.note && <p className="text-[9px] font-black uppercase italic text-[var(--text-muted)] opacity-60">{r.note}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sharing Widget */}
                <section className="space-y-8">
                    <h3 className="text-2xl font-serif font-black italic text-[var(--text-main)] underline decoration-[var(--color-primary)]/20 underline-offset-8">
                        The <span className="text-[var(--color-primary)]">Link.</span>
                    </h3>
                    <div className="glass-card p-8 rounded-[2.5rem] border border-[var(--border-muted)] space-y-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Personal Connection URL</label>
                            <div className="flex h-16 bg-[var(--bg-app)]/50 rounded-2xl border border-[var(--border-muted)] overflow-hidden p-2 gap-2">
                                <div className="flex-1 flex items-center px-4 font-bold text-xs truncate opacity-40 italic">{link}</div>
                                <button 
                                    onClick={copyLink}
                                    className={`px-6 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all ${
                                        copied ? "bg-green-500 text-white" : "bg-[var(--text-main)] text-[var(--bg-app)]"
                                    }`}
                                >
                                    {copied ? "Copied" : "Copy"}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pb-6 border-b border-[var(--border-muted)]">
                            {["Email Link", "WhatsApp"].map(opt => (
                                <button key={opt} className="h-12 border border-[var(--border-muted)] rounded-xl font-black uppercase tracking-widest text-[8px] hover:bg-[var(--bg-card)] transition-all">
                                    {opt}
                                </button>
                            ))}
                        </div>

                        <div className="pt-4 text-center">
                            <p className="text-[10px] font-black uppercase italic tracking-widest text-[var(--text-muted)] opacity-40">
                                Rewards automatically applied to your next statement
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
