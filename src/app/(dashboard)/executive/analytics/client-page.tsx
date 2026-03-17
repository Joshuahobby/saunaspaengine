"use client";

import { useState, useEffect, useRef } from "react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";

function useContainerSize() {
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    setSize({ width: Math.floor(width), height: Math.floor(height) });
                }
            }
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return { ref, ...size };
}

const CUSTOM_TOOLTIP_STYLE = {
    contentStyle: {
        backgroundColor: "rgba(10, 10, 10, 0.9)",
        border: "1px solid var(--border-muted)",
        borderRadius: "16px",
        backdropFilter: "blur(20px)",
        padding: "16px",
        fontSize: "10px",
        fontWeight: "bold",
        textTransform: "uppercase" as const,
        letterSpacing: "0.15em",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
    },
    itemStyle: {
        color: "#fff",
    },
};

interface ExecutiveAnalyticsClientProps {
    stats: {
        totalRevenue: number;
        revenueTrend: { value: number; isPositive: boolean };
        totalClients: number;
        totalEmployees: number;
        totalBranches: number;
        projectedMRR: number;
    };
    dailyRevenue: { name: string; revenue: number }[];
    branchPerformance: {
        id: string;
        name: string;
        revenue: number;
        employees: number;
        clients: number;
        efficiency: number;
    }[];
    topServices: { name: string; value: number }[];
}

export default function ExecutiveAnalyticsClient({ stats, dailyRevenue, branchPerformance, topServices }: ExecutiveAnalyticsClientProps) {
    const { ref: areaChartRef, width: areaWidth, height: areaHeight } = useContainerSize();
    const { ref: pieChartRef, width: pieWidth, height: pieHeight } = useContainerSize();

    const COLORS = ["var(--color-primary)", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

    return (
        <div className="flex flex-col gap-10 px-4 lg:px-10 py-10 max-w-[1700px] mx-auto w-full min-h-screen bg-[var(--bg-app)] text-[var(--text-main)]">
            {/* Strategy Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/[0.05] pb-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--color-primary)] opacity-[0.03] blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="space-y-2 relative z-10">
                    <h1 className="text-4xl lg:text-6xl font-serif font-black italic tracking-tighter leading-none">
                        Intelligence <span className="text-[var(--color-primary)]">Manifest</span>
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] font-bold opacity-40 uppercase tracking-[0.3em] italic">Network-wide Financial Oversight & Strategy</p>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="hidden lg:flex flex-col items-end px-6 border-r border-white/[0.05]">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-30">Portfolio Status</span>
                        <span className="text-xl font-serif font-black italic text-emerald-500">Active Yielding</span>
                    </div>
                    <button className="px-8 py-3 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                        <span className="material-symbols-outlined text-sm">print</span>
                        Export Board Report
                    </button>
                </div>
            </div>

            {/* High-Level KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: "Portfolio Yield", value: formatCurrency(stats.totalRevenue), trend: `${stats.revenueTrend.isPositive ? '+' : '-'}${stats.revenueTrend.value.toFixed(1)}%`, icon: "payments", trendPos: stats.revenueTrend.isPositive },
                    { label: "Projected MRR", value: formatCurrency(stats.projectedMRR), trend: "Strategy Forecast", icon: "monitoring", trendPos: true },
                    { label: "Market Reach", value: stats.totalClients.toString(), trend: "Active Records", icon: "hub", trendPos: true },
                    { label: "Branch Density", value: stats.totalBranches.toString(), trend: "Managed Nodes", icon: "storefront", trendPos: true },
                ].map((kpi, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={kpi.label}
                        className="group relative rounded-[40px] border border-white/[0.05] bg-white/[0.02] p-10 backdrop-blur-3xl overflow-hidden hover:border-[var(--color-primary)]/20 transition-all duration-700 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-primary)] opacity-[0.02] blur-3xl rounded-full -mr-20 -mt-20 group-hover:opacity-[0.05] transition-opacity" />
                        <div className="mb-8 flex items-center justify-between">
                            <div className="size-14 rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] group-hover:rotate-12 transition-transform shadow-inner">
                                <span className="material-symbols-outlined text-2xl font-bold">{kpi.icon}</span>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${kpi.trendPos ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                                {kpi.trend}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-30 italic">{kpi.label}</p>
                            <h3 className="text-4xl font-serif font-black text-white italic tracking-tighter">{kpi.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Deep-Dive Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Revenue Momentum Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-8 rounded-[40px] border border-white/[0.05] bg-white/[0.02] p-12 backdrop-blur-3xl relative overflow-hidden group shadow-2xl"
                >
                    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-8 relative z-10">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-serif font-bold italic tracking-tight">Revenue Momentum</h3>
                            <p className="text-xs text-[var(--text-muted)] font-bold opacity-30 uppercase tracking-[0.2em] italic">Current Cycle Performance vs Strategy</p>
                        </div>
                    </div>

                    <div ref={areaChartRef} className="h-[400px] w-full relative">
                        {areaWidth > 0 && areaHeight > 0 && (
                            <AreaChart width={areaWidth} height={areaHeight} data={dailyRevenue}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 900, opacity: 0.4 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 900, opacity: 0.4 }}
                                />
                                <Tooltip {...CUSTOM_TOOLTIP_STYLE} />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="var(--color-primary)" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#colorRevenue)" 
                                    animationDuration={2500}
                                />
                            </AreaChart>
                        )}
                    </div>
                </motion.div>

                {/* Service Contribution */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-4 rounded-[40px] border border-white/[0.05] bg-white/[0.02] p-12 backdrop-blur-3xl shadow-2xl flex flex-col gap-10 relative overflow-hidden"
                >
                    <div className="space-y-2 border-b border-white/[0.05] pb-8 relative z-10">
                        <h3 className="text-2xl font-serif font-bold italic tracking-tight">Catalog Yield</h3>
                        <p className="text-xs text-[var(--text-muted)] font-bold opacity-30 uppercase tracking-[0.2em] italic">Service Contribution Mix</p>
                    </div>

                    <div ref={pieChartRef} className="flex-1 h-[250px] relative z-10 flex items-center justify-center">
                        {pieWidth > 0 && pieHeight > 0 && (
                            <PieChart width={pieWidth} height={pieHeight}>
                                <Pie
                                    data={topServices}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={10}
                                    dataKey="value"
                                    animationDuration={2000}
                                >
                                    {topServices.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.05)" />
                                    ))}
                                </Pie>
                                <Tooltip {...CUSTOM_TOOLTIP_STYLE} />
                            </PieChart>
                        )}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="text-3xl font-serif font-black italic text-white/90">Mix</span>
                        </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                        {topServices.map((s, idx) => (
                            <div key={s.name} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                                <div className="flex items-center gap-3">
                                    <motion.div className="size-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70 italic">{s.name}</span>
                                </div>
                                <span className="font-serif font-black italic text-[var(--color-primary)]">{formatCurrency(s.value)}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Branch Performance Comparison */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[40px] border border-white/[0.05] bg-white/[0.01] p-12 backdrop-blur-3xl shadow-2xl"
            >
                <div className="mb-12 flex items-center justify-between border-b border-white/[0.05] pb-10">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-serif font-black italic tracking-tighter">Branch Benchmarking</h3>
                        <p className="text-xs text-[var(--text-muted)] font-bold opacity-30 uppercase tracking-[0.3em] italic">Relative Performance Index Across Network</p>
                    </div>
                    <span className="px-6 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[8px] font-black uppercase tracking-[0.3em] rounded-full border border-[var(--color-primary)]/20 shadow-lg italic">Top Decile View</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left py-6">
                                <th className="pb-8 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-30 px-4">Entity</th>
                                <th className="pb-8 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-30 px-4">Efficiency</th>
                                <th className="pb-8 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-30 px-4 text-right">Revenue</th>
                                <th className="pb-8 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-30 px-4 text-right">Human Cap</th>
                                <th className="pb-8 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-30 px-4 text-right">Portfolio Share</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {branchPerformance.map((branch) => (
                                <tr key={branch.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-8 px-4">
                                        <div className="flex items-center gap-5">
                                            <div className="size-14 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-center font-serif font-black text-xl italic text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                                                {branch.name[0]}
                                            </div>
                                            <span className="text-lg font-serif font-bold italic text-white/90">{branch.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-8 px-4">
                                        <div className="flex flex-col gap-2 w-48">
                                            <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min((branch.efficiency / 5000) * 100, 100)}%` }}
                                                    transition={{ duration: 1.5 }}
                                                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[#3b82f6]"
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-emerald-500 italic">Optimal Range</span>
                                        </div>
                                    </td>
                                    <td className="py-8 px-4 text-right">
                                        <span className="text-2xl font-serif font-black italic text-white/80">{formatCurrency(branch.revenue)}</span>
                                    </td>
                                    <td className="py-8 px-4 text-right">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-50">{branch.employees} Specialists</span>
                                    </td>
                                    <td className="py-8 px-4 text-right">
                                        <span className="text-xl font-serif font-black italic text-[var(--color-primary)]">{((branch.revenue / stats.totalRevenue) * 100).toFixed(1)}%</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
