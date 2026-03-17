"use client";
import React, { useState } from "react";

const REFERRALS = [
    { initials: "RM", name: "Riverside Marine & Spa", date: "Oct 24, 2023", status: "Trialing", statusColor: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", note: "Reward pending" },
    { initials: "EW", name: "Elemental Wellness Center", date: "Oct 18, 2023", status: "Sent", statusColor: "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20", note: "Invite opened" },
    { initials: "BS", name: "Boutique Steam Co.", date: "Oct 12, 2023", status: "Expired", statusColor: "bg-[var(--bg-surface-muted)]/50 text-[var(--text-muted)] border-[var(--border-muted)]", note: null },
];

export default function ReferralsPage() {
    const [copied, setCopied] = useState(false);
    const link = "saunaspa.io/ref/spabiz_928";

    return (
        <main className="flex-1 px-4 lg:px-8 py-8 max-w-7xl mx-auto w-full">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-app)] border border-[var(--border-muted)] p-8 mb-8">
                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col gap-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider w-fit">Exclusive Offer</span>
                        <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">Grow Your Network, <br /><span className="text-[var(--color-primary)]">Earn Rewards</span></h1>
                        <p className="text-[var(--text-muted)] text-lg max-w-md">Get <span className="text-[var(--text-main)] font-bold">1 month free</span> for every spa branch you refer to Sauna SPA Engine.</p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <button className="px-6 py-3 bg-[var(--color-primary)] text-[var(--bg-app)] rounded-lg font-bold hover:opacity-90 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined">send</span> Start Referring
                            </button>
                            <button className="px-6 py-3 bg-[var(--bg-surface-muted)]/50 border border-[var(--border-muted)] rounded-lg font-bold hover:bg-[var(--bg-surface-muted)] transition-all">How it works</button>
                        </div>
                    </div>
                    <div className="hidden md:block rounded-xl overflow-hidden shadow-2xl shadow-[var(--color-primary)]/10 border border-[var(--border-muted)] aspect-video bg-[var(--bg-surface-muted)]/30 flex items-center justify-center">
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-6xl text-[var(--text-muted)]">diversity_3</span>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
            </section>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { icon: "mail", label: "Invites Sent", value: "42", sub: "+5 this month" },
                            { icon: "person_add", label: "Successful Sign-ups", value: "12", sub: "28% Conversion rate" },
                            { icon: "payments", label: "Rewards Earned", value: "$1,080", sub: "12 Months Credit", subColor: "text-[var(--color-primary)]" },
                        ].map((s) => (
                            <div key={s.label} className="glass-card p-6 border border-[var(--border-muted)]">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="material-symbols-outlined text-[var(--color-primary)] bg-[var(--color-primary)]/10 p-2 rounded-lg">{s.icon}</span>
                                    <span className="text-xs text-[var(--text-muted)] font-medium">{s.label}</span>
                                </div>
                                <div className="text-3xl font-bold">{s.value}</div>
                                <p className={`text-xs mt-1 ${s.subColor || "text-[var(--text-muted)]"}`}>{s.sub}</p>
                            </div>
                        ))}
                    </div>
                    {/* Pending Referrals */}
                    <div className="glass-card border border-[var(--border-muted)] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--border-muted)] flex justify-between items-center">
                            <h3 className="font-bold">Pending Referrals</h3>
                            <button className="text-[var(--color-primary)] text-sm font-medium hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-[var(--border-muted)]">
                            {REFERRALS.map((r) => (
                                <div key={r.name} className="p-4 flex items-center justify-between hover:bg-[var(--color-primary)]/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-[var(--bg-surface-muted)]/30 flex items-center justify-center font-bold text-sm">{r.initials}</div>
                                        <div>
                                            <p className="text-sm font-bold">{r.name}</p>
                                            <p className="text-xs text-[var(--text-muted)]">Sent on {r.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${r.statusColor}`}>{r.status}</span>
                                        {r.note ? <p className="text-xs text-[var(--text-muted)]">{r.note}</p> : <button className="text-[10px] text-[var(--color-primary)] font-bold uppercase">Resend</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                    <div className="glass-card p-6 border border-[var(--border-muted)]">
                        <h3 className="font-bold mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-[var(--color-primary)]">share</span> Share your link</h3>
                        <div className="flex flex-col gap-4">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Your Unique Link</label>
                            <div className="flex items-center bg-[var(--bg-app)] rounded-lg border border-[var(--border-muted)] overflow-hidden">
                                <input id="referral-link" title="Your Unique Referral Link" aria-label="Referral link for sharing" className="bg-transparent border-none text-sm w-full focus:ring-0 px-3 text-[var(--text-muted)]" readOnly type="text" value={link} />
                                <button title="Copy Link" aria-label="Copy referral link to clipboard" onClick={() => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-[var(--color-primary)] px-4 py-2 text-[var(--bg-app)]">
                                    <span className="material-symbols-outlined text-base">{copied ? "check" : "content_copy"}</span>
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-3 mt-4">
                                {[{ icon: "mail", label: "Email" }, { icon: "hub", label: "LinkedIn" }, { icon: "chat", label: "Twitter" }, { icon: "public", label: "FB" }].map((ch) => (
                                    <button key={ch.label} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[var(--bg-app)] border border-[var(--border-muted)] hover:border-[var(--color-primary)] transition-colors group">
                                        <span className="material-symbols-outlined text-[var(--text-muted)] group-hover:text-[var(--color-primary)]">{ch.icon}</span>
                                        <span className="text-[10px] font-medium text-[var(--text-muted)]">{ch.label}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-4 pt-6 border-t border-[var(--border-muted)]">
                                <h4 className="text-sm font-bold mb-2">Invite by Email</h4>
                                <div className="flex gap-2">
                                    <input id="invite-email" title="Invite Spa Manager by Email" aria-label="Enter email address to send invite" className="flex-1 bg-[var(--bg-app)] border-[var(--border-muted)] rounded-lg text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" placeholder="spa-manager@example.com" type="email" />
                                    <button title="Send Invite" aria-label="Send referral invite to email" className="bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 px-3 rounded-lg hover:bg-[var(--color-primary)]/30 transition-all">
                                        <span className="material-symbols-outlined text-sm">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[var(--color-primary)]/10 p-6 rounded-xl border border-[var(--color-primary)]/20">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">workspace_premium</span>
                            <h3 className="font-bold">Top Referrer Badge</h3>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">Refer 5 more branches this month to unlock <span className="text-[var(--color-primary)] font-bold">Titanium Partner</span> status and get an additional 5% lifetime discount.</p>
                        <div className="w-full bg-[var(--bg-app)] h-2 rounded-full overflow-hidden"><div className="bg-[var(--color-primary)] h-full w-[60%]"></div></div>
                        <div className="flex justify-between mt-2"><span className="text-[10px] text-[var(--text-muted)]">3 of 8 referred</span><span className="text-[10px] text-[var(--color-primary)] font-bold">5 to go</span></div>
                    </div>
                </div>
            </div>
        </main>
    );
}
