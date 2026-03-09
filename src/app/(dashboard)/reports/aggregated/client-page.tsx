"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
    LayoutDashboard,
    TrendingUp,
    Users,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Filter,
    Calendar,
    Building2,
    Search
} from "lucide-react";

interface AggregatedReportsClientPageProps {
    metrics: {
        totalRevenue: number;
        branchPerformance: any[];
        topServices: any[];
        totalBookings: number;
        branchCount: number;
    };
}

export default function AggregatedReportsClientPage({ metrics }: AggregatedReportsClientPageProps) {
    const [dateRange, setDateRange] = useState("Last 30 Days");

    const maxBranchRevenue = Math.max(...metrics.branchPerformance.map(b => b.revenue), 1);

    return (
        <main className="p-6 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Aggregated Group Reports</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Multi-branch performance insights and consolidated revenue analytics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:border-[var(--color-primary)] transition-all">
                            <Calendar className="size-4" />
                            {dateRange}
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-slate-900 rounded-xl text-sm font-bold shadow-md shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        <Download className="size-4" />
                        Export Data
                    </button>
                </div>
            </header>

            {/* High-Level KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Consolidated Revenue", value: `RWF ${metrics.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "var(--color-primary)", trend: "+12.5%" },
                    { label: "Total Group Bookings", value: metrics.totalBookings.toLocaleString(), icon: LayoutDashboard, color: "#a855f7", trend: "+8.2%" },
                    { label: "Active Branches", value: metrics.branchCount.toString(), icon: Building2, color: "#3b82f6", trend: "0%" },
                    { label: "Avg. Branch LTV", value: `RWF ${Math.floor(metrics.totalRevenue / (metrics.branchCount || 1)).toLocaleString()}`, icon: Users, color: "#22c55e", trend: "+5.1%" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                <stat.icon className="size-6" />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Branch Comparison Chart */}
                <section className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Revenue by Branch</h3>
                            <p className="text-sm text-slate-500 mt-1">Comparing financial output across the group.</p>
                        </div>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
                            <ArrowUpRight className="size-5" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {metrics.branchPerformance.map((branch, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-[var(--color-primary)] transition-colors">{branch.name}</span>
                                    <span className="text-sm font-black text-slate-900 dark:text-white">RWF {branch.revenue.toLocaleString()}</span>
                                </div>
                                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(19,236,164,0.3)]"
                                        style={{ width: `${(branch.revenue / maxBranchRevenue) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-sm bg-[var(--color-primary)]"></div>
                            Actual Revenue
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-sm bg-slate-200 dark:bg-slate-700"></div>
                            Target (Est.)
                        </div>
                    </div>
                </section>

                {/* Top Services Group-wide */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Top Group Services</h3>
                    <div className="space-y-4">
                        {metrics.topServices.map((service, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-50 dark:border-slate-800 hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/[0.02] transition-all">
                                <div className="size-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 font-bold shrink-0">
                                    #{i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{service.name}</p>
                                    <p className="text-xs text-slate-500">{service.bookings} bookings throughout group</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900 dark:text-white">RWF {service.revenue.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-[var(--color-primary)] border border-slate-200 dark:border-slate-800 rounded-xl hover:border-[var(--color-primary)] transition-all">
                        Full Inventory Report
                    </button>
                </section>
            </div>

            {/* Detailed Branch Table */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Branch Drilldown</h3>
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                        <Search className="size-4 text-slate-400" />
                        <input type="text" placeholder="Search branches..." className="bg-transparent border-none outline-none text-sm text-slate-600 dark:text-slate-300 w-48" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Branch Name</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-center">Bookings</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Revenue</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-center">Performance</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {metrics.branchPerformance.map((branch, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                <Building2 className="size-4 text-slate-500" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{branch.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 text-center">{branch.bookings}</td>
                                    <td className="px-6 py-4 text-sm font-black text-slate-900 dark:text-white text-right">RWF {branch.revenue.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                                                <TrendingUp className="size-3" />
                                                Above
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[var(--color-primary)] font-bold text-sm hover:underline">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
