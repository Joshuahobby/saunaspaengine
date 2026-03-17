"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { formatCurrency, getTimeAgo } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
} from "recharts";

// Custom hook: measures a container via ResizeObserver and only returns
// positive dimensions, completely bypassing Recharts' ResponsiveContainer.
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
        totalBranches: number;
        totalRevenue: number;
        totalUsers: number;
        bizGrowth: number;
        projectedMRR: number;
    };
    growthData: { name: string; businesses: number; users: number }[];
    subscriptionData: { name: string; value: number; color: string }[];
    complianceData: { name: string; value: number; color: string }[];
    topCorporates: { name: string; location: string; revenue: number; initial: string }[];
    roleData: { name: string; count: number }[];
    recentActivity: Activity[];
}

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

const getBgColorClass = (color: string) => {
    if (color === "var(--color-primary)") return "bg-[var(--color-primary)]";
    if (color === "#10b981") return "bg-emerald-500";
    if (color === "#3b82f6") return "bg-blue-500";
    if (color === "#8b5cf6") return "bg-violet-500";
    if (color === "#f59e0b") return "bg-amber-500";
    if (color === "#ef4444") return "bg-red-500";
    return "";
};

export default function AnalyticsClientPage({ stats, growthData, subscriptionData, complianceData, topCorporates, roleData, recentActivity }: AnalyticsClientPageProps) {
    const [chartTimeframe, setChartTimeframe] = useState<Timeframe>("Monthly");
    const { ref: growthChartRef, width: growthWidth, height: growthHeight } = useContainerSize();
    const { ref: pieChartRef, width: pieWidth, height: pieHeight } = useContainerSize();
    const { ref: roleChartRef, width: roleWidth, height: roleHeight } = useContainerSize();

    const kpiCards = useMemo(() => [
        {
            label: "Total Businesses",
            value: stats.totalBusinesses.toString(),
            change: `${stats.bizGrowth > 0 ? "+" : ""}${stats.bizGrowth}%`,
            icon: "corporate_fare",
            trend: stats.bizGrowth >= 0 ? "up" : "down"
        },
        {
            label: "Active Branches",
            value: stats.totalBranches.toString(),
            change: "Platform-wide",
            icon: "storefront",
            trend: "up"
        },
        {
            label: "Platform Yield",
            value: formatCurrency(stats.projectedMRR),
            change: "Projected MRR",
            icon: "universal_currency_alt",
            trend: "up"
        },
        {
            label: "Economic Activity",
            value: formatCurrency(stats.totalRevenue),
            change: "Service Rev",
            icon: "payments",
            trend: "up"
        },
        {
            label: "Total Users",
            value: stats.totalUsers.toString(),
            change: "All Roles",
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
                        Platform <span className="text-[var(--color-primary)]/80">Governance & Yield</span>
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] font-medium opacity-60 italic">System-wide oversight of businesses, subscriptions, and platform health.</p>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                    <button className="px-5 py-2.5 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-card)]/30 text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:bg-[var(--bg-card)] hover:border-[var(--color-primary)]/30 shadow-sm group">
                        <span className="opacity-60 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">cloud_download</span>
                            Export Systems Data
                        </span>
                    </button>
                    <button className="px-6 py-2.5 rounded-xl bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center gap-2 group/btn">
                        <span className="material-symbols-outlined text-sm">shield_with_heart</span>
                        Compliance Audit
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    className="lg:col-span-8 rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-card)]/40 p-1 backdrop-blur-sm overflow-hidden group shadow-sm min-w-0"
                >
                    <div className="p-8 pb-0">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border-muted)] pb-6 relative z-10">
                            <div className="space-y-1">
                                <h3 className="text-xl font-serif font-bold text-[var(--text-main)] italic">Platform Expansion Trajectory</h3>
                                <p className="text-xs text-[var(--text-muted)] font-medium opacity-40">Monthly scaling of business registrations and user signups.</p>
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

                    <div ref={growthChartRef} className="h-[400px] w-full p-4 relative overflow-hidden">
                        {growthWidth > 0 && growthHeight > 0 && (
                            <AreaChart width={growthWidth} height={growthHeight} data={growthData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBiz" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                                />
                                <Tooltip {...CUSTOM_TOOLTIP_STYLE} />
                                <Area
                                    type="monotone"
                                    dataKey="businesses"
                                    stroke="var(--color-primary)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorBiz)"
                                    animationDuration={2000}
                                    name="New Businesses"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorUser)"
                                    animationDuration={2000}
                                    name="New Users"
                                />
                            </AreaChart>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-4 rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-card)]/40 p-8 backdrop-blur-sm shadow-sm flex flex-col gap-6 relative overflow-hidden min-w-0"
                >
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--color-primary)] opacity-[0.03] blur-[60px] rounded-full"></div>
                    <div className="space-y-1 border-b border-[var(--border-muted)] pb-6 relative z-10">
                        <h3 className="text-xl font-serif font-bold text-[var(--text-main)] italic">Subscription Breakdown</h3>
                        <p className="text-xs text-[var(--text-muted)] font-medium opacity-40">Business enrollment across platform tiers.</p>
                    </div>

                    <div ref={pieChartRef} className="flex-1 h-[220px] min-h-[220px] relative z-10">
                        {pieWidth > 0 && pieHeight > 0 && (
                            <PieChart width={pieWidth} height={pieHeight}>
                                <Pie
                                    data={subscriptionData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={8}
                                    dataKey="value"
                                    animationDuration={1500}
                                >
                                    {subscriptionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                                    ))}
                                </Pie>
                                <Tooltip {...CUSTOM_TOOLTIP_STYLE} />
                            </PieChart>
                        )}
                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="text-2xl font-black text-white/80 leading-none">Yield</span>
                            <p className="text-[7px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">Portfolio Distribution</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 relative z-10">
                        {subscriptionData.map((cat) => (
                            <div 
                                key={cat.name} 
                                className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                            >
                                <div
                                    className={`size-2 rounded-full shadow-sm ${getBgColorClass(cat.color)}`}
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
                {/* Top Corporates */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-7 rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-card)]/40 overflow-hidden shadow-sm flex flex-col backdrop-blur-sm min-w-0"
                >
                    <div className="p-8 border-b border-[var(--border-muted)] flex justify-between items-center bg-black/10">
                        <div className="space-y-1">
                            <h3 className="text-xl font-serif font-bold text-[var(--text-main)] italic">High-Yield Corporates</h3>
                            <p className="text-xs text-[var(--text-muted)] font-medium opacity-40">Top performing businesses by platform revenue (28d).</p>
                        </div>
                        <span className="px-5 py-2 bg-white text-black text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">Enterprise Yield</span>
                    </div>
                    <div className="flex-1">
                        {topCorporates.length > 0 ? topCorporates.map((corp, idx) => (
                            <div key={idx} className="flex items-center justify-between px-8 py-4 hover:bg-[var(--color-primary)]/[0.03] transition-all group/row cursor-pointer border-b border-[var(--border-muted)]/30 last:border-0 border-l-2 border-transparent hover:border-[var(--color-primary)]">
                                <div className="flex items-center gap-5">
                                    <div className="size-11 rounded-xl bg-[var(--bg-surface-muted)]/20 border border-[var(--border-muted)] flex items-center justify-center text-[var(--color-primary)] font-serif font-black shadow-inner shadow-black/20 group-hover/row:scale-105 transition-transform">{corp.initial}</div>
                                    <div className="space-y-0.5">
                                        <p className="font-serif font-bold text-base text-white/90 leading-tight group-hover/row:text-[var(--color-primary)] transition-colors italic">{corp.name}</p>
                                        <p className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-[0.15em] opacity-40 italic">{corp.location}</p>
                                    </div>
                                </div>
                                <p className="font-serif font-black text-xl text-[var(--color-primary)] tracking-tighter opacity-80 italic">{formatCurrency(corp.revenue)}</p>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-[var(--text-muted)] opacity-40 text-sm italic">
                                No corporate revenue recorded in the last 28 days.
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Role Composition */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-5 rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-card)]/40 p-1 backdrop-blur-sm overflow-hidden group shadow-sm flex flex-col min-w-0"
                >
                    <div className="p-8">
                        <div className="space-y-1 mb-6">
                            <h3 className="text-xl font-serif font-bold text-[var(--text-main)] italic">Platform Role Composition</h3>
                            <p className="text-xs text-[var(--text-muted)] font-medium opacity-40">User distribution across administration and operation levels.</p>
                        </div>
                        <div ref={roleChartRef} className="h-[200px] w-full">
                            {roleWidth > 0 && roleHeight > 0 && (
                                <BarChart width={roleWidth} height={roleHeight} data={roleData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--text-muted)', fontSize: 8, fontWeight: 700 }}
                                    />
                                    <Tooltip {...CUSTOM_TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                        {roleData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={index === 0 ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            )}
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40 italic">Compliance Health</h4>
                                <div className="space-y-2">
                                    {complianceData.map((item) => (
                                        <div key={item.name} className="flex items-center justify-between text-[10px] font-bold">
                                            <div className="flex items-center gap-2">
                                                <div className={`size-1.5 rounded-full ${getBgColorClass(item.color)}`} />
                                                <span className="text-white/60">{item.name}</span>
                                            </div>
                                            <span className="text-white">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col justify-center items-center text-center">
                                <span className="text-[7px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">Business Growth</span>
                                <p className={`text-2xl font-serif font-black italic ${stats.bizGrowth >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>{stats.bizGrowth >= 0 ? '+' : ''}{stats.bizGrowth}%</p>
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
                        <h3 className="text-xl font-serif font-bold text-[var(--text-main)] italic">Administrative Activity Feed</h3>
                        <p className="text-xs text-[var(--text-muted)] font-medium opacity-40">Real-time chronicle of administrative actions and system updates.</p>
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
                            <p className="text-sm font-black text-[var(--text-muted)] opacity-30 uppercase tracking-[0.3em] italic">No recent activity detected in logs.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
