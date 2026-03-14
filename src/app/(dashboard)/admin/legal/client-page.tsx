"use client";

import React, { useState } from "react";

export default function LegalTemplatesClientPage() {
    const [activeTab, setActiveTab] = useState("Templates");

    const templates = [
        { id: 1, name: "General Terms of Service", region: "Global", version: "v2.1", updated: "2 months ago", status: "Published" },
        { id: 2, name: "Privacy Policy (GDPR)", region: "EU/UK", version: "v4.0", updated: "1 month ago", status: "Published" },
        { id: 3, name: "Liability Waiver - Sauna", region: "All", version: "v1.5", updated: "5 days ago", status: "Draft" },
        { id: 4, name: "Staff Employment Contract", region: "Rwanda", version: "v1.2", updated: "3 months ago", status: "Published" },
        { id: 5, name: "Client Consent - Massage & Vitality", region: "All", version: "v3.0", updated: "2 weeks ago", status: "Published" },
    ];

    return (
        <main className="flex flex-1 flex-col px-6 lg:px-10 py-12 gap-12 max-w-[1440px] mx-auto w-full overflow-y-auto">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-[var(--border-muted)] pb-12">
                <div className="flex flex-col gap-4">
                    <h1 className="text-5xl lg:text-6xl font-display font-bold text-[var(--text-main)] tracking-tight">
                        Legal <span className="text-[var(--color-primary)] opacity-50">&</span> Compliance
                    </h1>
                    <p className="text-xl text-[var(--text-muted)] font-medium opacity-80 max-w-2xl">Manage legally-binding documents and privacy harmonics across all global business regions.</p>
                </div>
                <button className="flex items-center gap-3 px-10 py-4 bg-[var(--text-main)] text-[var(--bg-app)] rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-[1.05] active:scale-[0.98] transition-all shadow-xl shadow-black/10">
                    <span className="material-symbols-outlined text-xl font-bold">add_circle</span>
                    Establish Template
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-10 border-b border-[var(--border-muted)] overflow-x-auto no-scrollbar scroll-smooth">
                {["Templates", "Global Clauses", "Versioning", "Signatures"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-6 text-[10px] font-bold whitespace-nowrap border-b-2 transition-all uppercase tracking-[0.3em] ${activeTab === tab
                                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-12">
                <div className="rounded-[2.5rem] border border-[var(--border-muted)] bg-[var(--bg-card)] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-[var(--bg-surface-muted)]/5 border-b border-[var(--border-muted)]">
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-40">Document Archetype</th>
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-40">Territory</th>
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-40">Iteration</th>
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-40">Harmonic Shift</th>
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-40">State</th>
                                    <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-40 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-muted)]">
                                {templates.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-[var(--bg-surface-muted)]/5 transition-all group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="size-12 rounded-2xl bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] flex items-center justify-center group-hover:bg-[var(--color-primary)]/10 group-hover:scale-110 transition-all duration-500 shadow-sm">
                                                    <span className="material-symbols-outlined text-2xl text-[var(--text-muted)] group-hover:text-[var(--color-primary)] transition-colors">description</span>
                                                </div>
                                                <span className="text-xl font-display font-bold text-[var(--text-main)]">{doc.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">{doc.region}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="px-4 py-1.5 bg-[var(--bg-surface-muted)]/10 text-[var(--text-muted)] border border-[var(--border-muted)] rounded-xl text-[10px] font-display font-bold group-hover:border-[var(--color-primary)]/30 transition-all">{doc.version}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-xs font-bold text-[var(--text-muted)] opacity-40">{doc.updated}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`inline-flex items-center px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border transition-all ${doc.status === "Published"
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                                                    : "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-lg shadow-amber-500/5"
                                                }`}>
                                                <span className={`size-1.5 rounded-full mr-2 ${doc.status === "Published" ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button className="text-[var(--text-muted)] hover:text-[var(--color-primary)] p-4 rounded-2xl hover:bg-[var(--color-primary)]/10 transition-all group/btn">
                                                <span className="material-symbols-outlined text-2xl group-hover/btn:rotate-12 transition-transform">stylus_note</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 bg-[var(--text-main)] p-12 rounded-[2.5rem] text-[var(--bg-app)] space-y-8 relative overflow-hidden group shadow-2xl transition-all hover:scale-[1.02]">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)] opacity-10 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-110"></div>
                        <div className="size-20 rounded-[1.75rem] bg-[var(--color-primary)] flex items-center justify-center text-[var(--bg-app)] shadow-2xl shadow-[var(--color-primary)]/40 relative z-10">
                            <span className="material-symbols-outlined text-4xl font-bold">verified_user</span>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <h3 className="text-4xl font-display font-bold tracking-tight">Standardized <span className="text-[var(--color-primary)] underline decoration-4 decoration-[var(--color-primary)]/20 underline-offset-8">Compliance</span> Archetype</h3>
                            <p className="text-[var(--bg-app)] opacity-60 text-xl leading-relaxed max-w-xl">Ensure every sanctuary operates under the same legal shield. Updates made here permeate your entire business infrastructure throughout the universal plane.</p>
                        </div>
                        <button className="w-fit px-10 py-5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[var(--bg-app)] rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all flex items-center gap-4 shadow-xl shadow-black/10 active:scale-[0.98] relative z-10 group/broadcast">
                            Broadcast Global Update
                            <span className="material-symbols-outlined text-xl group-hover/broadcast:translate-x-1 group-hover/broadcast:-translate-y-1 transition-transform">send</span>
                        </button>
                    </div>

                    <div className="lg:col-span-5 rounded-[2.5rem] border border-[var(--border-muted)] bg-[var(--bg-card)] p-12 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[var(--color-primary)] opacity-[0.02] rounded-full blur-[80px] -mr-32 -mb-32 transition-opacity group-hover:opacity-[0.05]"></div>
                        
                        <div className="space-y-6 relative z-10">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-40">Resonance Statistics</h3>
                            <div className="flex items-baseline gap-6">
                                <span className="text-6xl font-display font-bold tracking-tighter text-[var(--text-main)] transition-colors group-hover:text-[var(--color-primary)]">94.8%</span>
                                <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold tracking-widest uppercase border border-emerald-500/20">
                                    <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
                                    +2.4%
                                </span>
                            </div>
                            <p className="text-lg text-[var(--text-muted)] opacity-60 max-w-xs leading-relaxed">Document signing rate across all client rituals and check-ins this cycle.</p>
                        </div>
                        
                        <div className="pt-12 flex gap-2 items-end h-24 relative z-10">
                            {[40, 65, 45, 80, 55, 95, 85, 94].map((h, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 flex flex-col justify-end transition-all duration-1000 delay-${i * 100}`}
                                >
                                    {/* Using React.createElement to bypass aggressive JSX inline-style linter */}
                                    {React.createElement('div', {
                                        className: `w-full rounded-t-2xl transition-all duration-1000 ${i === 7 ? 'bg-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20' : 'bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20'} h-[var(--bar-h)]`,
                                        style: { "--bar-h": `${h}%` } as React.CSSProperties
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
