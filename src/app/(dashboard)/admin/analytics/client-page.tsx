"use client";

import { useMemo, useState } from "react";
import { formatCurrency, getTimeAgo } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
} from "recharts";

interface Activity {
    id: string;
    action: "CREATE" | "UPDATE" | "DELETE" | string;
    createdAt: string | Date;
    user: {
        fullName: string;
    };
    details?: string;
}

interface AnalyticsClientPageProps {
    stats: {
        totalBusinesses: number;
        totalRevenue: number;
        activeSubscriptions: number;
        revenueGrowth: number;
    };
    recentActivity: Activity[];
}

const REVENUE_DATA = [
    { name: "Jan", revenue: 42000, users: 120 },
    { name: "Feb", revenue: 48000, users: 135 },
    { name: "Mar", revenue: 45000, users: 130 },
    { name: "Apr", revenue: 52000, users: 155 },
    { name: "May", revenue: 58000, users: 170 },
    { name: "Jun", revenue: 65000, users: 195 },
];

const CATEGORY_DATA = [
    { name: "Hotel & Resort", value: 42, color: "var(--color-primary)" },
    { name: "Day Spas", value: 28, color: "#10b981" },
    { name: "Healing Centers", value: 18, color: "#3b82f6" },
    { name: "Wellness Centers", value: 12, color: "#8b5cf6" },
];

const CUSTOM_TOOLTIP_STYLE = {
    contentStyle: {
        backgroundColor: "rgba(10, 10, 10, 0.8)",
        border: "1px solid var(--border-muted)",
        borderRadius: "12px",
        backdropFilter: "blur(12px)",
        padding: "12px",
        fontSize: "10px",
        fontWeight: "bold",
        textTransform: "uppercase" as const,
        letterSpacing: "0.1em",
    },
    itemStyle: {
        color: "#fff",
    },
};

type Timeframe = "Monthly" | "Quarterly" | "Yearly";

export default function AnalyticsClientPage({ stats, recentActivity }: AnalyticsClientPageProps) {
    const [chartTimeframe, setChartTimeframe] = useState<Timeframe>("Monthly");

    const kpiCards = useMemo(() => [
        {
            label: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            change: `${stats.revenueGrowth > 0 ? "+" : ""}${stats.revenueGrowth}%`,
            icon: "payments",
            trend: stats.revenueGrowth > 0 ? "up" : "down"
        },
        {
            label: "Active Businesses",
            value: stats.totalBusinesses.toString(),
            change: "+12",
            icon: "corporate_fare",
            trend: "up"
        },
        {
            label: "Platform Users",
            value: stats.activeSubscriptions.toString(),
            change: "+5.4%",
            icon: "groups",
            trend: "up"
        }
    ], [stats]);

    return (
        <div className="flex flex-col gap-8 px-4 lg:px-6 py-6 max-w-[1600px] mx-auto w-full">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[var(--border-muted)] pb-8 relative">
                <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--color-primary)] opacity-[0.05] blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="space-y-1 relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[var(--text-main)] italic tracking-tight leading-tight">
                        Platform <span className="text-[var(--color-primary)]/80">Yield & Intelligence</span>
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] font-medium opacity-60 italic">Algorithmic oversight of the global sanctuary network.</p>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                    <button className="px-5 py-2.5 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-card)]/30 text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:bg-[var(--bg-card)] hover:border-[var(--color-primary)]/30 shadow-sm group">
                        <span className="opacity-60 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                             <span className="material-symbols-outlined text-sm">cloud_download</span>
                             Export Node Data
                        </span>
                    </button>
                    <button className="px-6 py-2.5 rounded-xl bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center gap-2 group/btn">
                        <span className="material-symbols-outlined text-sm">insights</span>
                        Generate Ledger
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpiCards.map((card, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={card.label} 
                        className="group relative rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-card)]/40 p-8 shadow-sm backdrop-blur-sm transition-all duration-700 hover:border-[var(--color-primary)]/40 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-[0.02] rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-[0.05] transition-opacity" />
                        <div className="mb-6 flex items-center justify-between">
                            <div className="size-12 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
                                <span className="material-symbols-outlined text-xl font-bold">{card.icon}</span>
                            </div>
                            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest leading-none border ${card.trend === "up" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]"}`}>
                                <span className="material-symbols-outlined text-[10px] font-bold">{card.trend === "up" ? "trending_up" : "trending_down"}</span>
                                {card.change}
                            </span>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-30 italic">{card.label}</p>
                            <h3 className="text-3xl font-serif font-black text-white tracking-tighter italic">{card.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Interactive Chart Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-8 rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-card)]/40 p-1 backdrop-blur-sm overflow-hidden group shadow-sm"
                >
                    <div className="p-8 pb-0">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border-muted)] pb-6 relative z-10">
                            <div className="space-y-1">
                                <h3 className="text-xl font-serif font-bold text-[var(--text-main)] italic">Revenue Resonance</h3>
                                <p className="text-xs text-[var(--text-muted)] font-medium opacity-40">Frequency of financial intake across all active nodes.</p>
                            </div>
                            <div className="flex gap-1.5 p-1 bg-black/20 rounded-xl border border-[var(--border-muted)]">
                                {["Monthly", "Quarterly", "Yearly"].map((p) => (
                                    <button 
                                        key={p} 
                                        onClick={() => setChartTimeframe(p as Timeframe)}
                                        className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.15em] transition-all ${chartTimeframe === p ? "bg-[var(--color-primary)]/80 text-white shadow-lg" : "text-[var(--text-muted)] hover:text-white"}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-[350px] w-full p-4 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REVENUE_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'var(--text-muted)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em' }} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'var(--text-muted)', fontSize: 9, fontWeight: 700 }} 
                                    tickFormatter={(val) => `$${val/1000}k`}
                                />
                                <Tooltip {...CUSTOM_TOOLTIP_STYLE} />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="var(--color-primary)" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorRev)" 
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-4 rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-card)]/40 p-8 backdrop-blur-sm shadow-sm flex flex-col gap-6 relative overflow-hidden"
                >
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--color-primary)] opacity-[0.03] blur-[60px] rounded-full"></div>
                    <div className="space-y-1 border-b border-[var(--border-muted)] pb-6 relative z-10">
                        <h3 className="text-xl font-serif font-bold text-[var(--text-main)] italic">Node Distribution</h3>
                        <p className="text-xs text-[var(--text-muted)] font-medium opacity-40">Market saturation by category.</p>
                    </div>
                    
                    <div className="flex-1 min-h-[220px] relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={CATEGORY_DATA}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={8}
                                    dataKey="value"
                                    animationDuration={1500}
                                >
                                    {CATEGORY_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                                    ))}
                                </Pie>
                                <Tooltip {...CUSTOM_TOOLTIP_STYLE} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="text-2xl font-black text-white/80 leading-none">100%</span>
                            <p className="text-[7px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">Network Coverage</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 relative z-10">
                        {CATEGORY_DATA.map((cat) => (
                            <div key={cat.name} className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                <div 
                                    className={`size-1.5 rounded-full ${
                                        cat.name === "Services" ? "bg-[#6366f1]" : 
                                        cat.name === "Retail" ? "bg-[#a855f7]" : 
                                        cat.name === "Membership" ? "bg-[#ec4899]" : "bg-[#f43f5e]"
                                    }`} 
                                ></div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-white/60 uppercase tracking-tighter leading-none">{cat.name}</span>
                                    <span className="text-[10px] font-black text-[var(--color-primary)]">{cat.value}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Peer Rankings */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-7 rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-card)]/40 overflow-hidden shadow-sm flex flex-col backdrop-blur-sm"
                >
                    <div className="p-8 border-b border-[var(--border-muted)] flex justify-between items-center bg-black/10">
                        <div className="space-y-1">
                            <h3 className="text-xl font-serif font-bold text-[var(--text-main)] italic">High-Resonance Nodes</h3>
                            <p className="text-xs text-[var(--text-muted)] font-medium opacity-40">Top performing vessels in the 28-day window.</p>
                        </div>
                        <span className="px-5 py-2 bg-white text-black text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">Yield Ranking</span>
                    </div>
                    <div className="flex-1">
                            { [
                                { name: "Nordic Sky Wellness", location: "Stockholm, SE", revenue: 42300, initial: "N" },
                                { name: "Alpine Retreat & Spa", location: "Zermatt, CH", revenue: 38900, initial: "A" },
                                { name: "Blue Lagoon Premium", location: "Reykjavík, IS", revenue: 35150, initial: "B" },
                                { name: "Thermal Sands Resort", location: "Dubai, UAE", revenue: 31800, initial: "T" },
                                { name: "Zen Garden Spa", location: "Kyoto, JP", revenue: 29400, initial: "Z" }
                            ].map((business, idx) => (
                                <div key={idx} className="flex items-center justify-between px-8 py-4 hover:bg-[var(--color-primary)]/[0.03] transition-all group/row cursor-pointer border-b border-[var(--border-muted)]/30 last:border-0 border-l-2 border-transparent hover:border-[var(--color-primary)]">
                                    <div className="flex items-center gap-5">
                                        <div className="size-11 rounded-xl bg-[var(--bg-surface-muted)]/20 border border-[var(--border-muted)] flex items-center justify-center text-[var(--color-primary)] font-serif font-black shadow-inner shadow-black/20 group-hover/row:scale-105 transition-transform">{business.initial}</div>
                                        <div className="space-y-0.5">
                                            <p className="font-serif font-bold text-base text-white/90 leading-tight group-hover/row:text-[var(--color-primary)] transition-colors italic">{business.name}</p>
                                            <p className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-[0.15em] opacity-40 italic">{business.location}</p>
                                        </div>
                                    </div>
                                    <p className="font-serif font-black text-xl text-[var(--color-primary)] tracking-tighter opacity-80 italic">{formatCurrency(business.revenue)}</p>
                                </div>
                            ))}
                    </div>
                </motion.div>

                {/* Growth Visualization */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-5 rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-card)]/40 p-1 backdrop-blur-sm overflow-hidden group shadow-sm flex flex-col"
                >
                    <div className="p-8">
                        <div className="space-y-1 mb-6">
                            <h3 className="text-xl font-serif font-bold text-[var(--text-main)] italic">User Acquisition</h3>
                            <p className="text-xs text-[var(--text-muted)] font-medium opacity-40">Steady enrollment frequency across the network.</p>
                        </div>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={REVENUE_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: 'var(--text-muted)', fontSize: 8, fontWeight: 700 }} 
                                    />
                                    <Tooltip {...CUSTOM_TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                                    <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                                        {REVENUE_DATA.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={index === REVENUE_DATA.length - 1 ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'} 
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                                <span className="text-[7px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">Avg Monthly Growth</span>
                                <p className="text-2xl font-serif font-black text-emerald-500 italic">+14.2%</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                                <span className="text-[7px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">Guest Retention</span>
                                <p className="text-2xl font-serif font-black text-white/80 italic">88.4%</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Audit Trace (Recent Activity) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-card)]/40 overflow-hidden shadow-sm flex flex-col mb-12 backdrop-blur-sm"
            >
                <div className="p-8 border-b border-[var(--border-muted)] flex justify-between items-center bg-black/10">
                    <div className="space-y-1">
                        <h3 className="text-xl font-serif font-bold text-[var(--text-main)] italic">Structural Audit Feed</h3>
                        <p className="text-xs text-[var(--text-muted)] font-medium opacity-40">Real-time chronicle of architectural shifts within the platform.</p>
                    </div>
                    <button className="text-[8px] font-black text-[var(--color-primary)] uppercase tracking-[0.2em] hover:scale-110 transition-transform italic bg-[var(--color-primary)]/5 px-5 py-2 rounded-full border border-[var(--color-primary)]/20">Expand History</button>
                </div>
                <div className="p-8 space-y-6">
                    {recentActivity.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex gap-5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] group hover:border-[var(--color-primary)]/30 transition-all">
                                    <div className="flex-none">
                                        <div className="size-12 rounded-xl bg-black/20 text-[var(--color-primary)] border border-white/5 flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all shadow-sm">
                                            <span className="material-symbols-outlined text-xl font-black italic">
                                                {activity.action === "CREATE" ? "add_circle" :
                                                    activity.action === "UPDATE" ? "published_with_changes" :
                                                        activity.action === "DELETE" ? "delete_sweep" : "history_edu"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center min-w-0">
                                        <div className="flex items-center justify-between w-full gap-4">
                                            <p className="text-sm font-serif font-bold text-white/80 truncate italic">{activity.user.fullName}</p>
                                            <span className="text-[7px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-30 whitespace-nowrap">{getTimeAgo(activity.createdAt)}</span>
                                        </div>
                                        <p className="text-[10px] font-medium text-[var(--text-muted)] opacity-50 truncate mt-0.5 italic">{activity.details || `Logged ${activity.action} on ${activity.id.slice(0, 8)}`}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                            <span className="material-symbols-outlined text-5xl text-[var(--text-muted)] opacity-20 italic">fingerprint</span>
                            <p className="text-sm font-black text-[var(--text-muted)] opacity-30 uppercase tracking-[0.3em] italic">No resonance detected in logs.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
