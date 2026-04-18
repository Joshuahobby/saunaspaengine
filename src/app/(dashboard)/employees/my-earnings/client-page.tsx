"use client";

import React, { useState } from "react";
import { format, startOfDay, startOfWeek, startOfMonth } from "date-fns";

interface EarningLogItem {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    serviceRecord: {
        service: { name: string }
    }
}

interface MyEarningsClientProps {
    employee: { fullName: string; commissionRate: number; category: { name: string }; branch: { name: string } };
    initialEarnings: EarningLogItem[];
}

export default function MyEarningsClient({ employee, initialEarnings }: MyEarningsClientProps) {
    const [filter, setFilter] = useState<"ALL" | "TODAY" | "WEEK" | "MONTH">("ALL");

    const today = startOfDay(new Date());
    const week = startOfWeek(new Date());
    const month = startOfMonth(new Date());

    const filteredEarnings = initialEarnings.filter(log => {
        const logDate = new Date(log.createdAt);
        if (filter === "TODAY") return logDate >= today;
        if (filter === "WEEK") return logDate >= week;
        if (filter === "MONTH") return logDate >= month;
        return true;
    });

    const totalEarned = filteredEarnings.reduce((acc, curr) => acc + curr.amount, 0);
    const pendingEarned = filteredEarnings
        .filter(l => l.status === "UNPAID")
        .reduce((acc, curr) => acc + curr.amount, 0);

    // Real settlement rate: proportion of all-time commissions that have been paid out
    const allTimePaid = initialEarnings
        .filter(l => l.status === "PAID")
        .reduce((acc, curr) => acc + curr.amount, 0);
    const allTimeTotal = initialEarnings.reduce((acc, curr) => acc + curr.amount, 0);
    const settlementRate = allTimeTotal > 0 ? Math.round((allTimePaid / allTimeTotal) * 100) : 0;

    // Real period breakdowns
    const thisMonthTotal = initialEarnings
        .filter(l => new Date(l.createdAt) >= month)
        .reduce((acc, curr) => acc + curr.amount, 0);
    const thisWeekTotal = initialEarnings
        .filter(l => new Date(l.createdAt) >= week)
        .reduce((acc, curr) => acc + curr.amount, 0);
    const avgPerSession = initialEarnings.length > 0
        ? Math.round(allTimeTotal / initialEarnings.length)
        : 0;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-surface-muted)] border border-[var(--border-main)] p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)] opacity-[0.03] blur-[100px] -mr-48 -mt-48" />

                <div className="relative z-10 flex flex-col gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-[0.2em] border border-[var(--color-primary)]/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]" />
                            </span>
                            Live Earnings Tracking
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold tracking-tight text-[var(--text-main)]">
                                Hello, <span className="text-[var(--color-primary)]">{employee.fullName.split(" ")[0]}</span>
                            </h1>
                            <p className="text-[var(--text-muted)] font-medium text-sm leading-relaxed opacity-60">
                                Transparency is power. Track every RWF you earn across the {employee.branch?.name} network in real-time.
                            </p>
                        </div>
                    </div>

                    {/* Settlement Rate — real metric */}
                    <div className="flex flex-col items-center justify-center p-8 bg-[var(--bg-card)]/50 backdrop-blur-xl rounded-3xl border border-[var(--border-main)] shadow-inner">
                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-4 opacity-50">Settlement Rate</p>
                        <div className="relative size-32 flex items-center justify-center">
                            <svg className="size-full -rotate-90">
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[var(--border-muted)] opacity-20" />
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * settlementRate / 100)} className="text-[var(--color-primary)] transition-all duration-1000 ease-out" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-display font-black text-[var(--text-main)] tracking-tighter">{settlementRate}%</span>
                                <span className="text-[8px] font-black text-[var(--color-primary)] uppercase tracking-widest">Paid Out</span>
                            </div>
                        </div>
                        {allTimeTotal === 0 && (
                            <p className="text-[10px] text-[var(--text-muted)] opacity-40 font-bold uppercase tracking-widest mt-4">No commissions logged yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-8 group hover:border-[var(--color-primary)]/30 transition-all duration-500">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-[var(--color-primary)]/10 rounded-2xl text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-500">
                            <span className="material-symbols-outlined text-2xl">payments</span>
                        </div>
                        <span className="text-[10px] font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 rounded-lg">Net Commissions</span>
                    </div>
                    <p className="text-4xl font-display font-black text-[var(--text-main)] tracking-tight mb-2">
                        {totalEarned.toLocaleString()} <span className="text-lg opacity-40">RWF</span>
                    </p>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">
                        {filter === "ALL" ? "Total earnings to date" : `Earnings — ${filter.toLowerCase()}`}
                    </p>
                </div>

                <div className="glass-card p-8 group hover:border-yellow-500/30 transition-all duration-500">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 group-hover:scale-110 transition-transform duration-500">
                            <span className="material-symbols-outlined text-2xl">pending_actions</span>
                        </div>
                        <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-lg">Pending Settlement</span>
                    </div>
                    <p className="text-4xl font-display font-black text-[var(--text-main)] tracking-tight mb-2">
                        {pendingEarned.toLocaleString()} <span className="text-lg opacity-40">RWF</span>
                    </p>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">Unpaid commission balance</p>
                </div>

                <div className="glass-card p-8 border-dashed border-[var(--border-main)] flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-4">Earning Rate</p>
                    <p className="text-2xl font-display font-bold text-[var(--text-main)]">{employee.commissionRate}%</p>
                    <p className="text-[10px] font-medium text-[var(--text-muted)] mt-2 italic">Standard flat-rate commission per service handled.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transaction History */}
                <div className="lg:col-span-2 bg-[var(--bg-card)] rounded-[2rem] border border-[var(--border-main)] overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-[var(--border-muted)] flex flex-col gap-6">
                        <div>
                            <h3 className="text-xl font-display font-bold text-[var(--text-main)]">Earning Logs</h3>
                            <p className="text-xs text-[var(--text-muted)] mt-1 opacity-60">Detailed history of every commission event.</p>
                        </div>
                        <div className="flex w-full overflow-x-auto no-scrollbar pb-1">
                            <div className="flex p-1 bg-[var(--bg-surface-muted)] rounded-xl border border-[var(--border-muted)] w-fit whitespace-nowrap">
                                {(["ALL", "TODAY", "WEEK", "MONTH"] as const).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setFilter(t)}
                                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                            filter === t
                                                ? "bg-[var(--bg-card)] text-[var(--color-primary)] shadow-sm"
                                                : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--bg-surface-muted)]/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em]">Service</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em]">Date</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em]">Commission</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em] text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-muted)]">
                                {filteredEarnings.map((log) => (
                                    <tr key={log.id} className="hover:bg-[var(--bg-surface-muted)]/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                                                    <span className="material-symbols-outlined text-sm">spa</span>
                                                </div>
                                                <span className="text-sm font-bold text-[var(--text-main)]">{log.serviceRecord.service.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-xs font-semibold text-[var(--text-muted)]">
                                            {format(new Date(log.createdAt), "MMM d, yyyy · HH:mm")}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-display font-black text-[var(--text-main)]">
                                                {log.amount.toLocaleString()} <span className="text-[10px] opacity-40 font-sans">RWF</span>
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                log.status === "PAID"
                                                    ? "bg-green-500/10 text-green-500"
                                                    : "bg-yellow-500/10 text-yellow-500 animate-pulse"
                                            }`}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredEarnings.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <p className="text-sm text-[var(--text-muted)] font-bold opacity-40">No earning records found for this period.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Real Breakdown Sidebar */}
                <div className="space-y-6">
                    <div className="glass-card p-8 space-y-6">
                        <h3 className="text-xl font-display font-black text-[var(--text-main)]">
                            Earnings <span className="text-[var(--color-primary)]">Breakdown</span>
                        </h3>

                        <div className="space-y-5 pt-2">
                            <div className="flex justify-between items-center py-3 border-b border-[var(--border-muted)]">
                                <div>
                                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">This Month</p>
                                    <p className="text-lg font-display font-black text-[var(--text-main)] mt-1">
                                        {thisMonthTotal.toLocaleString()} <span className="text-xs opacity-40">RWF</span>
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-[var(--color-primary)] opacity-40">calendar_month</span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-[var(--border-muted)]">
                                <div>
                                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">This Week</p>
                                    <p className="text-lg font-display font-black text-[var(--text-main)] mt-1">
                                        {thisWeekTotal.toLocaleString()} <span className="text-xs opacity-40">RWF</span>
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-[var(--color-primary)] opacity-40">date_range</span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-[var(--border-muted)]">
                                <div>
                                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">Avg per Session</p>
                                    <p className="text-lg font-display font-black text-[var(--text-main)] mt-1">
                                        {avgPerSession.toLocaleString()} <span className="text-xs opacity-40">RWF</span>
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-[var(--color-primary)] opacity-40">spa</span>
                            </div>

                            <div className="flex justify-between items-center py-3">
                                <div>
                                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">Total Sessions</p>
                                    <p className="text-lg font-display font-black text-[var(--text-main)] mt-1">{initialEarnings.length}</p>
                                </div>
                                <span className="material-symbols-outlined text-[var(--color-primary)] opacity-40">receipt_long</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 space-y-4">
                        <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">Commission Rate</h3>
                        <p className="text-4xl font-display font-black text-[var(--text-main)]">{employee.commissionRate}<span className="text-xl opacity-40">%</span></p>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] leading-relaxed">
                            You earn {employee.commissionRate}% commission on every completed service. Contact your manager to discuss rate adjustments.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
