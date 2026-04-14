"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import StatsCard from "@/components/dashboard/StatsCard";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

interface ExecutiveDashboardProps {
    stats: {
        totalRevenue: number;
        revenueTrend: { value: number; isPositive: boolean };
        totalClients: number;
        clientTrend: { value: number; isPositive: boolean };
        totalEmployees: number;
        employeeTrend: { value: number; isPositive: boolean };
        totalLocations: number;
    };
    branches: Array<{
        id: string;
        name: string;
        revenue: number;
        performance: number;
        status: string;
    }>;
    alerts: {
        inventory: Array<{ id: string; product: string; stock: number; branch: string }>;
        safety: Array<{ id: string; type: string; message: string; branch: string }>;
    };
    activity: Array<{
        id: string;
        user: string;
        action: string;
        entity: string;
        branch: string;
        time: string;
    }>;
}

export default function ExecutiveDashboardClient({ stats, branches, alerts, activity }: ExecutiveDashboardProps) {
    const [activeTab, setActiveTab] = useState<"alerts" | "activity">("alerts");
    const [chartSize, setChartSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    const chartContainerRef = useRef<HTMLDivElement>(null);

    const updateChartSize = useCallback(() => {
        if (chartContainerRef.current) {
            const { width, height } = chartContainerRef.current.getBoundingClientRect();
            if (width > 0 && height > 0) {
                setChartSize({ width: Math.floor(width), height: Math.floor(height) });
            }
        }
    }, []);

    useEffect(() => {
        const el = chartContainerRef.current;
        if (!el) return;
        // Initial measure after paint
        const raf = requestAnimationFrame(updateChartSize);
        // Observe resize
        const ro = new ResizeObserver(updateChartSize);
        ro.observe(el);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [updateChartSize]);

    // Prepare data for the Leaderboard Chart (Top 5 Branches)
    const topBranches = [...branches]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(b => ({
            name: b.name.split('-')[0].trim(), // Shorten name for chart
            revenue: b.revenue,
            performance: b.performance
        }));

    const totalAlerts = alerts.inventory.length + alerts.safety.length;

    return (
        <div className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-6 space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2 border-b border-[var(--border-muted)] pb-8">
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-[var(--text-main)] tracking-tight">
                    Business <span className="text-[var(--color-primary)] opacity-50">&</span> Branch Overview
                </h1>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-base text-[var(--text-muted)] font-bold opacity-80">Monitoring the performance of {stats.totalLocations} spa locations.</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <Link 
                            href="/settings/roles"
                            className="h-10 px-4 sm:px-6 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-card)] text-[var(--text-main)] text-[10px] font-black tracking-widest uppercase flex items-center gap-1 sm:gap-2 hover:bg-[var(--bg-surface-muted)] transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined text-sm">security</span>
                            <span className="hidden sm:inline">Permissions</span>
                        </Link>
                        <Link 
                            href="/employees/gamification"
                            className="h-10 px-4 sm:px-6 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-card)] text-[var(--text-main)] text-[10px] font-black tracking-widest uppercase flex items-center gap-1 sm:gap-2 hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined text-sm">emoji_events</span>
                            <span>Leaderboard</span>
                        </Link>
                        <Link 
                            href="/employees/new"
                            className="h-10 px-4 sm:px-6 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-card)] text-[var(--text-main)] text-[10px] font-black tracking-widest uppercase flex items-center gap-1 sm:gap-2 hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined text-sm">person_add</span>
                            <span className="hidden sm:inline">Add Staff</span>
                        </Link>
                        <Link 
                            href="/branches/new"
                            className="h-10 px-4 sm:px-6 rounded-xl bg-[var(--color-primary)] text-white text-[10px] font-black tracking-widest uppercase flex items-center gap-1 sm:gap-2 hover:scale-[1.05] transition-all shadow-xl shadow-[var(--color-primary)]/20"
                        >
                            <span className="material-symbols-outlined text-sm">add_location_alt</span>
                            <span>Add Branch</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Revenue (30d)"
                    value={formatCurrency(stats.totalRevenue)}
                    icon="payments"
                    description="Combined revenue across all locations"
                    trend={{ value: Math.round(stats.revenueTrend.value), isPositive: stats.revenueTrend.isPositive }}
                />
                <StatsCard
                    title="Total Customers"
                    value={stats.totalClients.toString()}
                    icon="groups"
                    description="Total registered clients in your network"
                    trend={{ value: Math.round(stats.clientTrend.value), isPositive: stats.clientTrend.isPositive }}
                />
                <StatsCard
                    title="Total Staff"
                    value={stats.totalEmployees.toString()}
                    icon="badge"
                    description="Total number of active employees"
                />
                <StatsCard
                    title="Total Locations"
                    value={stats.totalLocations.toString()}
                    icon="corporate_fare"
                    description="Active spa centers currently operating"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="bg-[var(--bg-card)] rounded-[1.5rem] border border-[var(--border-muted)] overflow-hidden shadow-sm flex flex-col h-[500px]">
                    <div className="px-6 py-5 border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-display font-bold text-[var(--text-main)] flex items-center gap-2">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">emoji_events</span>
                                Staff Leaderboard
                            </h2>
                            <p className="text-xs text-[var(--text-muted)] font-bold mt-1">Real-time performance rankings across all branches.</p>
                        </div>
                        <Link href="/employees/gamification" className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:underline px-4 py-2 bg-[var(--color-primary)]/5 rounded-lg transition-all">
                            View Module
                        </Link>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                         <div className="size-24 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-primary)]/40 flex items-center justify-center text-white shadow-xl shadow-[var(--color-primary)]/20 animate-pulse">
                            <span className="material-symbols-outlined text-5xl">emoji_events</span>
                         </div>
                         <div className="space-y-2">
                             <h3 className="text-lg font-bold text-[var(--text-main)]">Performance Gamification</h3>
                             <p className="text-sm text-[var(--text-muted)] max-w-xs mx-auto">Track top earners, service volume, and team consistency in real-time.</p>
                         </div>
                         <Link 
                            href="/employees/gamification"
                            className="w-full max-w-[200px] py-3 bg-[var(--bg-surface-muted)] hover:bg-[var(--color-primary)]/10 text-[var(--text-main)] rounded-xl text-[10px] font-black uppercase tracking-widest border border-[var(--border-muted)] transition-all"
                         >
                            Access Dashboard
                         </Link>
                    </div>
                </div>

                {/* Visual Branch Leaderboard */}
                <div className="bg-[var(--bg-card)] rounded-[1.5rem] border border-[var(--border-muted)] overflow-hidden shadow-sm flex flex-col h-[500px]">
                    <div className="px-6 py-5 border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-display font-bold text-[var(--text-main)]">Branch Leaderboard</h2>
                            <p className="text-xs text-[var(--text-muted)] font-bold mt-1">Top performing locations by revenue.</p>
                        </div>
                    </div>
                    <div ref={chartContainerRef} className="p-6 h-[350px] w-full">
                        {topBranches.length > 0 ? (
                            chartSize.width > 0 && chartSize.height > 0 && (
                                <BarChart data={topBranches} width={chartSize.width - 48} height={chartSize.height - 48} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-muted)" />
                                    <XAxis type="number" tickFormatter={(value) => `${value / 1000}k`} stroke="var(--text-muted)" fontSize={12} />
                                    <YAxis dataKey="name" type="category" width={120} stroke="var(--text-muted)" fontSize={12} fontWeight="bold" />
                                    <Tooltip 
                                        cursor={{ fill: 'var(--bg-surface-muted)' }}
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-muted)', borderRadius: '1rem', color: 'var(--text-main)' }}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        formatter={(value: any) => [formatCurrency(Number(value)), "Revenue"]}
                                    />
                                    <Bar dataKey="revenue" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={24} />
                                </BarChart>
                            )
                        ) : (
                            <div className="h-full flex items-center justify-center text-[var(--text-muted)] font-bold text-sm">
                                No revenue data available for the last 60 days.
                            </div>
                        )}
                    </div>
                </div>

                {/* The "Requires Attention" Action Center */}
                <div className="bg-[var(--bg-card)] rounded-[1.5rem] border border-[var(--border-muted)] overflow-hidden shadow-sm flex flex-col h-[500px]">
                    <div className="px-6 py-5 border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h2 className="text-xl font-display font-bold text-[var(--text-main)] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[var(--color-primary)]">policy</span>
                                    Command Center
                                </h2>
                                <p className="text-xs text-[var(--text-muted)] font-bold mt-1">Real-time alerts and network activity.</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-[var(--bg-surface-muted)]/20 rounded-lg p-1">
                            <button 
                                onClick={() => setActiveTab("alerts")}
                                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'alerts' ? 'bg-[var(--bg-card)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                            >
                                Alerts
                                {totalAlerts > 0 && (
                                    <span className="ml-2 inline-flex items-center justify-center bg-red-500/10 text-red-500 text-[10px] px-1.5 py-0.5 rounded-full border border-red-500/20">{totalAlerts}</span>
                                )}
                            </button>
                            <button 
                                onClick={() => setActiveTab("activity")}
                                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'activity' ? 'bg-[var(--bg-card)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                            >
                                Pulse
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        <AnimatePresence mode="wait">
                            {activeTab === "alerts" ? (
                                <motion.div 
                                    key="alerts"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-4 space-y-4"
                                >
                                    {totalAlerts === 0 ? (
                                        <div className="text-center py-12">
                                            <span className="material-symbols-outlined text-4xl text-emerald-500/50 mb-3">check_circle</span>
                                            <p className="text-[var(--text-muted)] font-bold text-sm">All clear. No urgent items require your attention.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Safety Alerts */}
                                            {alerts.safety.length > 0 && alerts.safety.map(alert => (
                                                <div key={alert.id} className="flex items-start gap-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors">
                                                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                                                        <span className="material-symbols-outlined">warning</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="text-sm font-bold text-red-500">{alert.type} Alert</h4>
                                                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{alert.branch}</span>
                                                        </div>
                                                        <p className="text-sm text-[var(--text-main)] opacity-80">{alert.message}</p>
                                                    </div>
                                                    <button className="text-[10px] text-red-500 font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10">Review</button>
                                                </div>
                                            ))}
                                            
                                            {/* Inventory Alerts */}
                                            {alerts.inventory.length > 0 && alerts.inventory.map(inv => (
                                                <div key={inv.id} className="flex items-start gap-4 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                                                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                                                        <span className="material-symbols-outlined">inventory_2</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="text-sm font-bold text-amber-500">Low Stock: {inv.product}</h4>
                                                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{inv.branch}</span>
                                                        </div>
                                                        <p className="text-sm text-[var(--text-main)] opacity-80">Only {inv.stock} units remaining.</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="activity"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-4 space-y-3"
                                >
                                    {activity.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-[var(--text-muted)] font-bold text-sm">No recent network activity found.</p>
                                        </div>
                                    ) : (
                                        activity.map(act => (
                                            <div key={act.id} className="flex items-center gap-4 p-3 rounded-xl border border-[var(--border-muted)] hover:bg-[var(--bg-surface-muted)]/5 transition-colors">
                                                 <div className="p-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                                    <span className="material-symbols-outlined text-sm">
                                                        {act.action === 'CREATE' ? 'add_circle' : act.action === 'UPDATE' ? 'edit' : 'history'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-[var(--text-main)] truncate">
                                                        <span className="font-bold">{act.user}</span> {act.action.toLowerCase()}d <span className="font-bold">{act.entity}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{act.branch}</p>
                                                    <p className="text-[9px] text-[var(--text-muted)] opacity-70 mt-0.5">{new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
