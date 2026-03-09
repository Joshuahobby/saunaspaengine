"use client";

import { useState } from "react";
import {
    TrendingUp,
    Store,
    DollarSign,
    Users,
    ShieldCheck,
    Filter,
    MoreVertical,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { BusinessStatusToggle } from "@/components/admin/business-status-toggle";

interface BusinessData {
    id: string;
    name: string;
    status: string;
    createdAt: Date;
    ownerInitials: string;
    ownerName: string;
    ownerEmail: string;
    userCount: number;
}

interface AdminDashboardClientProps {
    stats: {
        totalBusinesses: number;
        totalRevenue: number;
        activeUsers: number;
        systemHealth: number;
    };
    businesses: BusinessData[];
}

export default function AdminDashboardClient({ stats, businesses }: AdminDashboardClientProps) {
    const [filter, setFilter] = useState("all");

    // Filter businesses
    const filteredBusinesses = businesses.filter(b => {
        if (filter === "active") return b.status === "ACTIVE";
        if (filter === "suspended") return b.status !== "ACTIVE";
        return true;
    });

    const getInitials = (bName: string) => {
        const parts = bName.split(' ');
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return bName.substring(0, 2).toUpperCase();
    };

    const getColors = (idx: number) => {
        const colors = [
            'bg-[var(--color-primary)]/20 text-slate-900',
            'bg-orange-500/20 text-slate-900',
            'bg-blue-500/20 text-slate-900',
            'bg-emerald-500/20 text-slate-900',
            'bg-purple-500/20 text-slate-900',
        ];
        return colors[idx % colors.length];
    };

    return (
        <div className="max-w-[1440px] mx-auto w-full p-6 space-y-8">
            {/* Hero Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--color-border-light)] pb-8">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Business Overview</h1>
                    <p className="text-slate-500 mt-2 font-medium">Monitor and manage multi-tenant performance across the platform.</p>
                </div>
                <button className="flex items-center gap-2 bg-[var(--color-primary)] hover:opacity-90 text-[var(--color-bg-dark)] font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-[var(--color-primary)]/20 active:scale-95">
                    <Store className="w-5 h-5" />
                    <span>Create New Business</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[var(--color-border-light)] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                            <Store className="w-6 h-6 text-[var(--color-primary)]" />
                        </div>
                        <span className="text-emerald-500 text-xs font-bold px-2 py-1 bg-emerald-500/10 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> {/* Add dynamic trend if needed */}
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Businesses</p>
                    <h3 className="text-3xl font-black mt-1 text-slate-900">{stats.totalBusinesses.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[var(--color-border-light)] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                            <DollarSign className="w-6 h-6 text-[var(--color-primary)]" />
                        </div>
                        <span className="text-emerald-500 text-xs font-bold px-2 py-1 bg-emerald-500/10 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Revenue</p>
                    <h3 className="text-3xl font-black mt-1 text-slate-900">${stats.totalRevenue.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[var(--color-border-light)] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                            <Users className="w-6 h-6 text-[var(--color-primary)]" />
                        </div>
                        <span className="text-emerald-500 text-xs font-bold px-2 py-1 bg-emerald-500/10 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Active Users</p>
                    <h3 className="text-3xl font-black mt-1 text-slate-900">{stats.activeUsers.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[var(--color-border-light)] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                            <ShieldCheck className="w-6 h-6 text-[var(--color-primary)]" />
                        </div>
                        <span className="text-slate-400 text-xs font-bold px-2 py-1 bg-slate-100 rounded-full">Optimal</span>
                    </div>
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">System Health</p>
                    <h3 className="text-3xl font-black mt-1 text-slate-900">{stats.systemHealth}%</h3>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-[var(--color-border-light)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        Registered Businesses
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-xs font-medium text-slate-500">{filteredBusinesses.length} total</span>
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="flex rounded-lg border border-[var(--color-border-light)] p-1">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-3 py-1.5 text-xs font-bold rounded ${filter === "all" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 transition-colors"}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter("active")}
                                className={`px-3 py-1.5 text-xs font-bold rounded ${filter === "active" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 transition-colors"}`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setFilter("suspended")}
                                className={`px-3 py-1.5 text-xs font-bold rounded ${filter === "suspended" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 transition-colors"}`}
                            >
                                Suspended
                            </button>
                        </div>
                        <button title="Filter businesses" aria-label="Filter businesses" className="p-2 rounded-lg border border-[var(--color-border-light)] text-slate-600 hover:bg-slate-50">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-[var(--color-border-light)]">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Business Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Users</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Joined</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border-light)]">
                            {filteredBusinesses.map((b, idx) => (
                                <tr key={b.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${getColors(idx)}`}>
                                                {getInitials(b.name)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{b.name}</p>
                                                <p className="text-xs text-slate-500">ID: BIZ-{b.id.substring(b.id.length - 4).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium">{b.ownerName}</p>
                                        <p className="text-xs text-slate-500">{b.ownerEmail}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {b.userCount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600">{format(new Date(b.createdAt), 'MMM dd, yyyy')}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {b.status === "ACTIVE" ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Suspended
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <BusinessStatusToggle businessId={b.id} initialStatus={b.status} />
                                            <button title="Options" aria-label="Options" className="text-slate-400 hover:text-slate-900 transition-colors">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                            {filteredBusinesses.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        No businesses found matching the current filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-[var(--color-border-light)]">
                    <p className="text-xs text-slate-500 font-medium tracking-wide">Showing 1 to {filteredBusinesses.length} of {stats.totalBusinesses} entries</p>
                    <div className="flex items-center gap-2">
                        <button title="Previous page" aria-label="Previous page" className="p-1 rounded hover:bg-slate-200 disabled:opacity-30" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button title="Page 1" aria-label="Page 1" className="px-2.5 py-1 text-xs font-bold rounded bg-[var(--color-primary)] text-slate-900">1</button>
                        <button title="Next page" aria-label="Next page" className="p-1 rounded hover:bg-slate-200 disabled:opacity-30" disabled>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
