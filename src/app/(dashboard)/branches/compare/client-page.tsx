"use client";

import React from "react";

interface BranchData {
    id: string;
    name: string;
    status: string;
    revenue: number;
    employees: number;
    services: number;
    clients: number;
    createdAt: string;
}

interface Props {
    branches: BranchData[];
}

export default function BranchComparisonClient({ branches }: Props) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(amount);

    return (
        <main className="flex flex-col flex-1 gap-12 max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-12 overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-[var(--border-muted)] pb-8">
                <h1 className="text-4xl font-serif font-bold text-[var(--text-main)] italic">Entity Constellation</h1>
                <p className="text-lg text-[var(--text-muted)] italic font-medium opacity-80">
                    Comparative resonance across all {branches.length} sanctuary nodes.
                </p>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {branches.map((biz) => (
                    <div key={biz.id} className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] p-10 shadow-sm transition-all hover:shadow-lg hover:border-[var(--color-primary)]/30 group">
                        <div className="flex items-center justify-between mb-8 pb-8 border-b border-[var(--border-muted)]">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-[var(--text-main)] italic group-hover:text-[var(--color-primary)] transition-colors">{biz.name}</h2>
                                <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] italic mt-2 opacity-60">Status: <span className={biz.status === 'ACTIVE' ? "text-emerald-500 opacity-100" : ""}>{biz.status}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-[0.1em] italic opacity-60 mb-1">Total Yield</p>
                                <p className="text-3xl font-serif font-black text-[var(--text-main)] italic tracking-tighter">{formatCurrency(biz.revenue)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <div className="size-12 rounded-2xl bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[var(--text-muted)]">group</span>
                                </div>
                                <p className="text-2xl font-bold text-[var(--text-main)]">{biz.clients.toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">Members</p>
                            </div>
                            <div className="space-y-2">
                                <div className="size-12 rounded-2xl bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[var(--text-muted)]">badge</span>
                                </div>
                                <p className="text-2xl font-bold text-[var(--text-main)]">{biz.employees.toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">Healers</p>
                            </div>
                            <div className="space-y-2">
                                <div className="size-12 rounded-2xl bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[var(--text-muted)]">spa</span>
                                </div>
                                <p className="text-2xl font-bold text-[var(--text-main)]">{biz.services.toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">Services</p>
                            </div>
                        </div>
                    </div>
                ))}

                {branches.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <span className="material-symbols-outlined text-6xl text-[var(--text-muted)] opacity-20 mb-4">business_fare</span>
                        <h3 className="text-2xl font-serif font-bold text-[var(--text-main)] italic">No Entities Found</h3>
                        <p className="text-[var(--text-muted)] italic">There are no branches tethered to this business jurisdiction.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
