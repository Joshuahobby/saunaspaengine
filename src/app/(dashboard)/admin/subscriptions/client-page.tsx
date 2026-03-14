"use client";

import { useState } from "react";
import { format } from "date-fns";

export interface BusinessSubscription {
    id: string;
    name: string;
    email: string | null;
    subscriptionPlan: string | null;
    subscriptionCycle: string | null;
    subscriptionStatus: string | null;
    subscriptionRenewal: Date | null;
}

export default function SubscriptionsClientPage({ businesses }: { businesses: BusinessSubscription[] }) {
    const [filter, setFilter] = useState("all");

    // Computed Metrics
    const activeSubs = businesses.filter(b => b.subscriptionStatus === 'ACTIVE' || !b.subscriptionStatus).length;
    const expiringSoon = businesses.filter(b => b.subscriptionStatus === 'EXPIRING').length;
    // Basic mapping for visual MRR
    const platformMRR = activeSubs * 299; // Using a dummy average MRR per active sub

    const filteredBusinesses = businesses.filter(b => {
        if (filter === 'all') return true;
        if (filter === 'active') return b.subscriptionStatus === 'ACTIVE' || !b.subscriptionStatus;
        if (filter === 'expiring') return b.subscriptionStatus === 'EXPIRING';
        if (filter === 'cancelled') return b.subscriptionStatus === 'CANCELLED' || b.subscriptionStatus === 'SUSPENDED';
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
                            placeholder="Network Query..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button aria-label="Notifications" className="size-9 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/5 border border-[var(--border-muted)] transition-all flex items-center justify-center group relative">
                        <span className="material-symbols-outlined text-sm">notifications</span>
                        <span className="absolute top-2 right-2 size-1.5 bg-[var(--color-primary)] rounded-full animate-pulse border border-[var(--bg-app)]"></span>
                    </button>
                    <a href="/admin/subscriptions/platform" className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-lg whitespace-nowrap">
                        <span className="material-symbols-outlined text-base">settings_input_component</span>
                        PLATFORM LOGIC
                    </a>
                </div>
            </header>

            {/* Title Section */}
            <div className="flex flex-col gap-1 py-1">
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-[var(--text-main)] tracking-tight">System <span className="text-[var(--color-primary)]">Finance</span></h1>
                <p className="text-[10px] text-[var(--text-muted)] font-medium opacity-50 uppercase tracking-[0.2em]">Collective revenue and node subscription health.</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                    title="Active Nodes"
                    value={activeSubs.toLocaleString()}
                    trend="+12%"
                    subtitle="Platform Reach"
                    icon="hub"
                    color="primary"
                />
                <MetricCard
                    title="Grace Periods"
                    value={expiringSoon.toLocaleString()}
                    trend="+5%"
                    subtitle="Critical Pulse"
                    icon="potted_plant"
                    color="amber"
                />
                <MetricCard
                    title="Monthly Yield"
                    value={`$${platformMRR.toLocaleString()}`}
                    trend="+8.4%"
                    subtitle="Universal MRR"
                    icon="universal_currency_alt"
                    color="primary"
                />
            </div>

            {/* Table Section */}
            <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-card)] overflow-hidden shadow-sm mt-4">
                <div className="px-6 py-4 border-b border-[var(--border-muted)] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
                    <div className="flex gap-6 overflow-x-auto no-scrollbar">
                        <TabButton active={filter === 'all'} onClick={() => setFilter('all')}>Universal</TabButton>
                        <TabButton active={filter === 'active'} onClick={() => setFilter('active')}>Vital</TabButton>
                        <TabButton active={filter === 'expiring'} onClick={() => setFilter('expiring')}>Expiring</TabButton>
                        <TabButton active={filter === 'cancelled'} onClick={() => setFilter('cancelled')}>Hibernated</TabButton>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-white/[0.03] text-[var(--text-muted)] uppercase text-[8px] font-display font-black tracking-[0.2em] border-b border-[var(--border-muted)]">
                            <tr>
                                <th className="px-6 py-3">Deployment Unit</th>
                                <th className="px-4 py-3 text-center">Tier</th>
                                <th className="px-4 py-3 text-center">Frequency</th>
                                <th className="px-4 py-3 text-center">Next Pulse</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {filteredBusinesses.length > 0 ? filteredBusinesses.map((b) => (
                                <SubscriptionRow
                                    key={b.id}
                                    initial={b.name.charAt(0).toUpperCase()}
                                    name={b.name}
                                    url={b.email || "No Identifier"}
                                    plan={b.subscriptionPlan || "Tier 1"}
                                    cycle={b.subscriptionCycle || "Monthly"}
                                    date={b.subscriptionRenewal ? format(new Date(b.subscriptionRenewal), "MMM dd, yy") : "N/A"}
                                    status={(b.subscriptionStatus?.toLowerCase() as SubscriptionRowProps['status']) || 'active'}
                                />
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-[var(--text-muted)] opacity-30 font-black text-[10px] uppercase tracking-widest">
                                        No matching nodes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 bg-[var(--bg-surface-muted)]/5 flex flex-col sm:flex-row items-center justify-between border-t border-[var(--border-muted)] gap-6">
                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] opacity-40">Showing 1 to 4 of 1,284 entries</p>
                    <div className="flex items-center gap-3">
                        <PaginationButton disabled>Previous</PaginationButton>
                        <PaginationButton active>1</PaginationButton>
                        <PaginationButton>2</PaginationButton>
                        <PaginationButton>3</PaginationButton>
                        <span className="px-2 text-[var(--border-muted)] font-sans text-base opacity-40">...</span>
                        <PaginationButton>Next</PaginationButton>
                    </div>
                </div>
            </div>

            {/* Promotion Section */}
            <div className="rounded-2xl border border-[var(--border-muted)] bg-white/[0.01] p-6 flex flex-col xl:flex-row items-center justify-between gap-6 relative overflow-hidden group/promo mt-4 shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)] opacity-[0.02] rounded-full blur-[80px] -mr-32 -mt-32 transition-transform duration-1000 group-hover/promo:scale-125"></div>
                
                <div className="flex items-center gap-5 relative z-10 w-full xl:w-auto">
                    <div className="bg-white/5 text-[var(--color-primary)] size-12 rounded-xl flex items-center justify-center border border-white/5 group-hover/promo:bg-[var(--color-primary)] group-hover/promo:text-white transition-all duration-300">
                        <span className="material-symbols-outlined text-xl">auto_awesome</span>
                    </div>
                    <div className="space-y-0.5">
                        <h3 className="text-lg font-display font-bold text-white tracking-tight">Yield Optimizers</h3>
                        <p className="text-[10px] text-[var(--text-muted)] font-medium opacity-50 max-w-lg italic">Strategic vouchers and promotional logic for the collective network.</p>
                    </div>
                </div>
                
                <button className="bg-white text-black px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-[var(--color-primary)] hover:text-white transition-all w-full xl:w-auto z-10 relative">
                    Deploy Optimizer
                </button>
            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, subtitle, icon, color }: { title: string, value: string, trend: string, subtitle: string, icon: string, color: 'primary' | 'amber' }) {
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
                    : 'bg-amber-500/5 text-amber-500 border-amber-500/10'
                }`}>
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                </div>
            </div>
            
            <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-2xl font-display font-bold text-white tracking-tight">{value}</span>
                <span className={`text-[8px] font-black flex items-center gap-1 uppercase tracking-widest ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <span className="material-symbols-outlined text-[10px]">{trend.startsWith('+') ? 'trending_up' : 'trending_down'}</span>
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
    initial: string;
    name: string;
    url: string;
    plan: string;
    cycle: string;
    date: string;
    status: 'active' | 'expiring' | 'cancelled';
}

function SubscriptionRow({ initial, name, url, plan, cycle, date, status }: SubscriptionRowProps) {
    const statusStyles: Record<SubscriptionRowProps['status'], string> = {
        active: 'text-emerald-500 border-emerald-500/10 bg-emerald-500/5',
        expiring: 'text-amber-500 border-amber-500/10 bg-amber-500/5',
        cancelled: 'text-rose-500 border-rose-500/10 bg-rose-500/5',
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
                        <p className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-[0.1em] opacity-30 italic">{url}</p>
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
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-display font-black text-[8px] uppercase tracking-widest border ${statusStyles[status]}`}>
                    <span className={`size-1 rounded-full ${status === 'active' ? 'bg-emerald-500' : status === 'expiring' ? 'bg-amber-500' : 'bg-rose-500'} animate-pulse`}></span>
                    {status}
                </span>
            </td>
            <td className="px-6 py-3.5 text-right">
                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                    <ActionButton title="Incr." icon="north" />
                    <ActionButton title="Arch." icon="history" />
                    <ActionButton title="Edit" icon="tune" />
                </div>
            </td>
        </tr>
    );
}

function ActionButton({ title, icon }: { title: string, icon: string }) {
    return (
        <button title={title} className="size-7 bg-white/5 hover:bg-[var(--color-primary)] hover:text-white text-[var(--text-muted)] border border-white/5 rounded-lg transition-all active:scale-95 flex items-center justify-center">
            <span className="material-symbols-outlined text-base">{icon}</span>
        </button>
    );
}

function PaginationButton({ children, active, disabled }: { children: React.ReactNode, active?: boolean, disabled?: boolean }) {
    return (
        <button
            disabled={disabled}
            className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] rounded-lg transition-all border ${active
                ? 'bg-[var(--color-primary)] text-black border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20'
                : 'bg-white/5 text-[var(--text-muted)] border-white/5 hover:border-[var(--color-primary)]/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed'
                }`}
        >
            {children}
        </button>
    );
}
