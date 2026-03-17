"use client";

import React from "react";

interface SettlementRecord {
    id: string;
    branchName: string;
    period: string;
    totalGross: number;
    totalCommission: number;
    totalNet: number;
    status: "PENDING" | "PAID" | "FAILED";
    payoutRef: string | null;
    createdAt: Date;
}

export default function SettlementClientPage({ settlements }: { settlements: SettlementRecord[] }) {
    const totalPending = settlements
        .filter(s => s.status === "PENDING")
        .reduce((sum, s) => sum + s.totalNet, 0);

    const totalPaid = settlements
        .filter(s => s.status === "PAID")
        .reduce((sum, s) => sum + s.totalNet, 0);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "PAID": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "FAILED": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
        }
    };

    return (
        <div className="max-w-[1440px] mx-auto w-full p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--border-main)] pb-8">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-display font-bold text-[var(--text-main)] tracking-tight">Payout <span className="text-[var(--color-primary)]">Pipeline</span></h1>
                    <p className="text-[var(--text-muted)] mt-2 font-medium">Monitoring settlements and automated revenue distribution.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-8 py-3 bg-[var(--color-primary)] rounded-xl text-[10px] uppercase tracking-widest font-bold text-white hover:bg-[var(--color-primary-hover)] transition-all shadow-lg shadow-[var(--color-primary)]/15">
                        <span className="material-symbols-outlined text-lg font-bold">request_quote</span>
                        Manual Reconciliation
                    </button>
                </div>
            </div>

            {/* Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-main)] shadow-sm">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">Pending Settlements</p>
                    <h2 className="text-3xl font-black text-[var(--text-main)] mt-2 tracking-tight">RWF {totalPending.toLocaleString()}</h2>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Awaiting Payout</span>
                    </div>
                </div>
                <div className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-main)] shadow-sm">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">Total Disbursed</p>
                    <h2 className="text-3xl font-black text-[var(--text-main)] mt-2 tracking-tight">RWF {totalPaid.toLocaleString()}</h2>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Successfully Settled</span>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-[#102220] to-[#0a1514] p-8 rounded-3xl border border-[var(--color-primary)]/20 shadow-lg relative overflow-hidden">
                    <p className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest opacity-80">Platform Efficiency</p>
                    <h2 className="text-3xl font-black text-white mt-2 tracking-tight">99.8%</h2>
                    <p className="text-xs text-slate-400 mt-2 font-medium">Automated reconciliation rate</p>
                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl text-white opacity-5">precision_manufacturing</span>
                </div>
            </div>

            {/* Settlements Table */}
            <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-[var(--border-main)] flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-display font-bold text-[var(--text-main)] tracking-tight">Settlement Audit Trail</h3>
                        <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">Historical breakdown of funds across your network.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[var(--bg-surface-muted)] border-b border-[var(--border-main)]">
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Branch</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Period</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-right">Gross</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-right">Commission</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-right">Net Payout</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-main)]">
                            {settlements.map((s) => (
                                <tr key={s.id} className="hover:bg-[var(--bg-surface-muted)]/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-[var(--text-main)]">{s.branchName}</p>
                                        <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest mt-1">Ref: {s.id.slice(-6).toUpperCase()}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-[var(--text-main)]">{s.period}</p>
                                    </td>
                                    <td className="px-8 py-6 text-right font-medium text-[var(--text-muted)] text-sm">
                                        RWF {s.totalGross.toLocaleString()}
                                    </td>
                                    <td className="px-8 py-6 text-right font-medium text-red-400 text-sm">
                                        -RWF {s.totalCommission.toLocaleString()}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <p className="font-black text-[var(--text-main)] text-base">RWF {s.totalNet.toLocaleString()}</p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(s.status)}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {settlements.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-16 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <span className="material-symbols-outlined text-4xl text-[var(--text-muted)] opacity-20">history_toggle_off</span>
                                            <p className="text-[var(--text-muted)] font-bold">No active settlements in current pipeline.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
