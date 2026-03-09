"use client";

import { useState } from "react";
import {
    Search,
    Bell,
    Plus,
    CheckCircle,
    TrendingUp,
    CalendarClock,
    DollarSign,
    ArrowUpCircle,
    History,
    MoreVertical,
    Tag,
    Filter
} from "lucide-react";

export default function SubscriptionsClientPage() {
    const [filter, setFilter] = useState("all");

    return (
        <div className="max-w-[1440px] mx-auto w-full p-6 lg:p-10 space-y-8">
            {/* Top Header */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-4 flex-1 md:max-w-xl w-full">
                    <div className="relative w-full text-slate-400 focus-within:text-[var(--color-primary)] transition-colors">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                        <input
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)]/50 transition-all placeholder:text-slate-400 outline-none"
                            placeholder="Search businesses, plans, or owners..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    <button aria-label="Notifications" className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    </button>
                    <button className="flex items-center gap-2 bg-[var(--color-primary)] text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[var(--color-primary)]/20 whitespace-nowrap active:scale-95">
                        <Plus className="w-5 h-5" />
                        New Business
                    </button>
                </div>
            </header>

            {/* Title Section */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Global Subscriptions</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Strategic overview of all multi-tenant accounts and platform revenue streams.</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Active Subscriptions"
                    value="1,284"
                    trend="+12%"
                    subtitle="v.s. last 30 days"
                    icon={<CheckCircle className="w-6 h-6" />}
                    color="primary"
                />
                <MetricCard
                    title="Expiring Soon"
                    value="42"
                    trend="+5%"
                    subtitle="Renewal due within 7 days"
                    icon={<CalendarClock className="w-6 h-6" />}
                    color="amber"
                />
                <MetricCard
                    title="Total Platform MRR"
                    value="$84,250"
                    trend="+8.4%"
                    subtitle="Monthly Recurring Revenue"
                    icon={<DollarSign className="w-6 h-6" />}
                    color="primary"
                />
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm shadow-slate-200/50 dark:shadow-none">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth">
                        <TabButton active={filter === 'all'} onClick={() => setFilter('all')}>All Businesses</TabButton>
                        <TabButton active={filter === 'active'} onClick={() => setFilter('active')}>Active</TabButton>
                        <TabButton active={filter === 'expiring'} onClick={() => setFilter('expiring')}>Expiring</TabButton>
                        <TabButton active={filter === 'cancelled'} onClick={() => setFilter('cancelled')}>Cancelled</TabButton>
                    </div>
                    <button title="Filter table" aria-label="Filter" className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 hidden md:block">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-black tracking-widest border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Business Name</th>
                                <th className="px-6 py-4 text-center">Current Plan</th>
                                <th className="px-6 py-4 text-center">Billing Cycle</th>
                                <th className="px-6 py-4 text-center">Renewal Date</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            <SubscriptionRow
                                initial="Z"
                                name="Zenith Spa Center"
                                url="zenith-spa.engine.io"
                                plan="Enterprise"
                                cycle="Yearly"
                                date="Oct 12, 2024"
                                status="active"
                            />
                            <SubscriptionRow
                                initial="B"
                                name="Blue Lagoon Wellness"
                                url="blue-lagoon.engine.io"
                                plan="Pro"
                                cycle="Monthly"
                                date="Aug 24, 2024"
                                status="expiring"
                            />
                            <SubscriptionRow
                                initial="N"
                                name="Nordic Steam Hub"
                                url="nordic-steam.engine.io"
                                plan="Basic"
                                cycle="Monthly"
                                date="Sep 01, 2024"
                                status="active"
                            />
                            <SubscriptionRow
                                initial="O"
                                name="Oasis Retreat"
                                url="oasis-retreat.engine.io"
                                plan="Enterprise"
                                cycle="Yearly"
                                date="Jan 15, 2025"
                                status="cancelled"
                            />
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-5 bg-slate-50 dark:bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 gap-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">Showing 1 to 4 of 1,284 entries</p>
                    <div className="flex items-center gap-2">
                        <PaginationButton disabled>Previous</PaginationButton>
                        <PaginationButton active>1</PaginationButton>
                        <PaginationButton>2</PaginationButton>
                        <PaginationButton>3</PaginationButton>
                        <span className="px-1 text-slate-300 dark:text-slate-800">...</span>
                        <PaginationButton>Next</PaginationButton>
                    </div>
                </div>
            </div>

            {/* Promotion Section */}
            <div className="bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 rounded-2xl border border-[var(--color-primary)]/20 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden group">
                <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Tag className="w-48 h-48 -rotate-12 translate-x-12 -translate-y-12" />
                </div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="bg-[var(--color-primary)] w-14 h-14 rounded-2xl flex items-center justify-center text-slate-900 shadow-xl shadow-[var(--color-primary)]/30">
                        <Tag className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Flash Promotion?</h3>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 max-w-md">Create global discounts, coupons or seasonal offers to drive plan upgrades across the entire network.</p>
                    </div>
                </div>
                <button className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-8 py-4 rounded-xl text-sm font-black shadow-xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto z-10 uppercase tracking-widest">
                    Create Discount
                </button>
            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, subtitle, icon, color }: { title: string, value: string, trend: string, subtitle: string, icon: React.ReactNode, color: 'primary' | 'amber' }) {
    const colorClasses = color === 'primary'
        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
        : 'bg-amber-500/10 text-amber-500';

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-[var(--color-primary)]/30 transition-all duration-300 group">
            <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] group-hover:text-slate-600 transition-colors">{title}</span>
                <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${colorClasses}`}>
                    {icon}
                </div>
            </div>
            <div className="flex items-baseline gap-2 mt-4">
                <span className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{value}</span>
                <span className={`text-xs font-black flex items-center gap-0.5 ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <TrendingUp className="w-3 h-3" /> {trend}
                </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-2 uppercase tracking-tighter">{subtitle}</p>
        </div>
    );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`pb-4 border-b-2 font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all ${active ? 'border-[var(--color-primary)] text-slate-900 dark:text-slate-100' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
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
        active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        expiring: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        cancelled: 'bg-slate-500/10 text-slate-500 dark:text-slate-400',
    };

    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-slate-900 dark:text-[var(--color-primary)] font-black shadow-inner shadow-[var(--color-primary)]/5 text-lg">
                        {initial}
                    </div>
                    <div>
                        <p className="font-black text-slate-900 dark:text-slate-100 text-sm group-hover:text-[var(--color-primary)] transition-colors">{name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{url}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-black text-[10px] uppercase tracking-widest">
                    {plan}
                </span>
            </td>
            <td className="px-6 py-4 text-center">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">{cycle}</span>
            </td>
            <td className="px-6 py-4 text-center">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{date}</span>
            </td>
            <td className="px-6 py-4 text-center">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest ${statusStyles[status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500' : status === 'expiring' ? 'bg-amber-500' : 'bg-slate-400'} animate-pulse`}></span>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ActionButton title="Upgrade Plan" icon={<ArrowUpCircle className="w-4 h-4" />} />
                    <ActionButton title="Billing History" icon={<History className="w-4 h-4" />} />
                    <ActionButton title="Settings" icon={<MoreVertical className="w-4 h-4" />} />
                </div>
            </td>
        </tr>
    );
}

function ActionButton({ title, icon }: { title: string, icon: React.ReactNode }) {
    return (
        <button title={title} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all hover:shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-600">
            {icon}
        </button>
    );
}

function PaginationButton({ children, active, disabled }: { children: React.ReactNode, active?: boolean, disabled?: boolean }) {
    return (
        <button
            disabled={disabled}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${active
                ? 'bg-[var(--color-primary)] text-slate-900 shadow-lg shadow-[var(--color-primary)]/20 shadow-inner'
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-sm'
                }`}
        >
            {children}
        </button>
    );
}
