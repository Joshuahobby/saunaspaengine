"use client";

import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";

export interface BranchSubscription {
    id: string;
    name: string;
    identifier: string;
    subscriptionPlan: string | null;
    subscriptionCycle: string | null;
    subscriptionStatus: string;
    subscriptionRenewal: Date | null;
    mrrContribution: number;
}

export default function SubscriptionsClientPage({ branches }: { branches: BranchSubscription[] }) {
    const [filter, setFilter] = useState("all");

    // Computed Metrics
    const activeSubs = branches.filter(b => b.subscriptionStatus === 'ACTIVE').length;
    const expiringSoon = branches.filter(b => b.subscriptionStatus === 'EXPIRING').length;
    
    // Calculate real MRR from the server-provided contribution
    const platformMRR = branches.reduce((acc, b) => acc + (b.mrrContribution || 0), 0);

    const filteredBranches = branches.filter(b => {
        if (filter === 'all') return true;
        if (filter === 'active') return b.subscriptionStatus === 'ACTIVE';
        if (filter === 'expiring') return b.subscriptionStatus === 'EXPIRING';
        if (filter === 'inactive') return b.subscriptionStatus === 'CANCELLED' || b.subscriptionStatus === 'SUSPENDED' || b.subscriptionStatus === 'PENDING';
        return true;
    });

    return (
        <div className="max-w-[1440px] mx-auto w-full p-4 lg:p-6 space-y-5 animate-in fade-in duration-700">
            {/* Top Header */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-5">
                <div className="flex items-center gap-4 flex-1 md:max-w-xl w-full">
                    <div className="relative w-full text-[var(--text-muted)] focus-within:text-[var(--color-primary)] transition-all group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40 group-focus-within:opacity-100 transition-all">search</span>
                        <input
                            className="w-full bg-[var(--bg-app)]/30 border border-[var(--border-muted)] rounded-xl pl-10 pr-4 py-2 text-[10px] font-bold text-[var(--text-main)] focus:ring-1 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-[var(--text-muted)]/20 outline-none uppercase tracking-widest"
                            placeholder="Search Network..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button aria-label="Notifications" className="size-9 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/5 border border-[var(--border-muted)] transition-all flex items-center justify-center group relative">
                        <span className="material-symbols-outlined text-sm">notifications</span>
                    </button>
                    <Link href="/subscriptions/platform" className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-lg whitespace-nowrap">
                        <span className="material-symbols-outlined text-base">inventory_2</span>
                        Manage Packages
                    </Link>
                </div>
            </header>

            {/* Title Section */}
            <div className="flex flex-col gap-1 py-1">
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-[var(--text-main)] tracking-tight">System <span className="text-[var(--color-primary)]">Finance</span></h1>
                <p className="text-[10px] text-[var(--text-muted)] font-medium opacity-50 uppercase tracking-[0.2em]">Collective revenue and business subscription health.</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                    title="Active Businesses"
                    value={activeSubs.toLocaleString()}
                    trend="Total Approved"
                    subtitle="Platform Reach"
                    icon="domain"
                    color="primary"
                />
                <MetricCard
                    title="Expiring Plans"
                    value={expiringSoon.toLocaleString()}
                    trend="Needs Attention"
                    subtitle="Critical Pulse"
                    icon="warning"
                    color="amber"
                />
                <MetricCard
                    title="Platform Yield"
                    value={`$${platformMRR.toLocaleString()}`}
                    trend="Projected"
                    subtitle="Universal MRR"
                    icon="universal_currency_alt"
                    color="emerald"
                />
            </div>

            {/* Table Section */}
            <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-card)] overflow-hidden shadow-sm mt-4">
                <div className="px-6 py-4 border-b border-[var(--border-muted)] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
                    <div className="flex gap-6 overflow-x-auto no-scrollbar">
                        <TabButton active={filter === 'all'} onClick={() => setFilter('all')}>All Businesses</TabButton>
                        <TabButton active={filter === 'active'} onClick={() => setFilter('active')}>Active Only</TabButton>
                        <TabButton active={filter === 'expiring'} onClick={() => setFilter('expiring')}>Expiring Soon</TabButton>
                        <TabButton active={filter === 'inactive'} onClick={() => setFilter('inactive')}>Pending / Suspended</TabButton>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-white/[0.03] text-[var(--text-muted)] uppercase text-[8px] font-display font-black tracking-[0.2em] border-b border-[var(--border-muted)]">
                            <tr>
                                <th className="px-6 py-3">Business Entity</th>
                                <th className="px-4 py-3 text-center">Plan Tier</th>
                                <th className="px-4 py-3 text-center">Billing Cycle</th>
                                <th className="px-4 py-3 text-center">Renewal Date</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {filteredBranches.length > 0 ? filteredBranches.map((b) => (
                                <SubscriptionRow
                                    key={b.id}
                                    id={b.id}
                                    initial={b.name.charAt(0).toUpperCase()}
                                    name={b.name}
                                    identifier={b.identifier}
                                    plan={b.subscriptionPlan || "Unassigned"}
                                    cycle={b.subscriptionCycle || "N/A"}
                                    date={b.subscriptionRenewal ? format(new Date(b.subscriptionRenewal), "MMM dd, yyyy") : "N/A"}
                                    status={b.subscriptionStatus}
                                />
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-[var(--text-muted)] opacity-30 font-black text-[10px] uppercase tracking-widest">
                                        No matching businesses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Simplified) */}
                <div className="px-8 py-6 bg-[var(--bg-surface-muted)]/5 flex flex-col sm:flex-row items-center justify-between border-t border-[var(--border-muted)] gap-6">
                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] opacity-40">
                        Showing {filteredBranches.length} entries
                    </p>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, subtitle, icon, color }: { title: string, value: string, trend: string, subtitle: string, icon: string, color: 'primary' | 'amber' | 'emerald' }) {
    return (
        <div className="p-5 overflow-hidden rounded-xl bg-white/[0.02] border border-[var(--border-muted)] shadow-sm hover:border-[var(--color-primary)]/20 transition-all duration-500 group relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)] opacity-[0.01] rounded-full blur-2xl -mr-12 -mt-12 group-hover:opacity-[0.05] transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="space-y-0.5">
                    <h4 className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-30 group-hover:opacity-100 transition-opacity">{title}</h4>
                    <p className="text-[9px] font-bold text-white/40 tracking-tight italic">{subtitle}</p>
                </div>
                <div className={`size-8 rounded-lg transition-all duration-500 group-hover:scale-110 flex items-center justify-center border ${
                    color === 'primary' 
                    ? 'bg-[var(--color-primary)]/5 text-[var(--color-primary)] border-[var(--color-primary)]/10' 
                    : color === 'amber'
                    ? 'bg-amber-500/5 text-amber-500 border-amber-500/10'
                    : 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10'
                }`}>
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                </div>
            </div>
            
            <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-2xl font-display font-bold text-white tracking-tight">{value}</span>
                <span className={`text-[8px] font-black flex items-center gap-1 uppercase tracking-widest ${color === 'emerald' ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>
                    {trend}
                </span>
            </div>
        </div>
    );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`pb-3 border-b-2 font-display font-black text-[9px] uppercase tracking-[0.2em] transition-all relative ${active ? 'border-[var(--color-primary)] text-white shadow-[0_4px_12px_-4px_var(--color-primary)]' : 'border-transparent text-[var(--text-muted)] opacity-30 hover:opacity-100'}`}
        >
            {children}
        </button>
    );
}

interface SubscriptionRowProps {
    id: string;
    initial: string;
    name: string;
    identifier: string;
    plan: string;
    cycle: string;
    date: string;
    status: string;
}

function SubscriptionRow({ id, initial, name, identifier, plan, cycle, date, status }: SubscriptionRowProps) {
    const getStatusStyles = (s: string) => {
        if (s === 'ACTIVE') return 'text-emerald-500 border-emerald-500/10 bg-emerald-500/5';
        if (s === 'PENDING') return 'text-blue-500 border-blue-500/10 bg-blue-500/5';
        if (s === 'EXPIRING') return 'text-amber-500 border-amber-500/10 bg-amber-500/5';
        return 'text-rose-500 border-rose-500/10 bg-rose-500/5';
    };

    return (
        <tr className="hover:bg-white/[0.01] transition-all group border-l-2 border-transparent hover:border-[var(--color-primary)]/40">
            <td className="px-6 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[var(--color-primary)] font-display font-black text-xs group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                        {initial}
                    </div>
                    <div>
                        <p className="font-display font-bold text-white text-sm group-hover:text-[var(--color-primary)] transition-colors">{name}</p>
                        <p className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-[0.1em] opacity-30 italic">{identifier}</p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3.5 text-center">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white border border-white/5 font-display font-bold text-[10px] tracking-tight">
                    {plan}
                </span>
            </td>
            <td className="px-4 py-3.5 text-center">
                <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-30">{cycle}</span>
            </td>
            <td className="px-4 py-3.5 text-center">
                <span className="text-[10px] font-black text-white/80">{date}</span>
            </td>
            <td className="px-4 py-3.5 text-center">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-display font-black text-[8px] uppercase tracking-widest border ${getStatusStyles(status)}`}>
                    <span className={`size-1 rounded-full ${status === 'ACTIVE' ? 'bg-emerald-500' : status === 'EXPIRING' ? 'bg-amber-500' : status === 'PENDING' ? 'bg-blue-500' : 'bg-rose-500'} animate-pulse`}></span>
                    {status}
                </span>
            </td>
            <td className="px-6 py-3.5 text-right flex justify-end">
                <Link 
                    href={`/businesses/${id}`}
                    className="flex justify-center items-center px-4 py-1.5 bg-white/5 hover:bg-[var(--color-primary)] hover:text-white text-[var(--text-muted)] border border-white/5 rounded-lg transition-all active:scale-95 text-[9px] uppercase tracking-widest font-black gap-2"
                >
                    MANAGE
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                </Link>
            </td>
        </tr>
    );
}
