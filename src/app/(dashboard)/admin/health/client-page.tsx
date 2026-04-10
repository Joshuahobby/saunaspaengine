"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HealthProps {
    metrics: {
        uptime: string;
        requestsToday: number;
        activeBranches: number;
        totalUsers: number;
        totalEmployees: number;
    };
    logEntries: {
        id: string;
        time: string;
        action: string;
        resource: string;
        userName: string;
    }[];
}

const SERVICE_INFRASTRUCTURE = [
    { name: "PostgreSQL Primary", region: "EU-West", latency: "12ms", uptime: "100%", status: "online" },
    { name: "Edge Middleware", region: "Global", latency: "4ms", uptime: "99.98%", status: "online" },
    { name: "QR Generation", region: "US-East", latency: "45ms", uptime: "98.5%", status: "degraded" },
    { name: "Auth Sentry", region: "Global", latency: "8ms", uptime: "100%", status: "online" },
    { name: "Media Assets", region: "Global-CDN", latency: "15ms", uptime: "100%", status: "online" },
];

export default function AdminHealthClientPage({ metrics, logEntries }: HealthProps) {
    const [activeTab, setActiveTab] = useState<"overview" | "infrastructure" | "logs">("overview");

    return (
        <div className="flex flex-col gap-8 px-4 lg:px-6 py-6 max-w-[1600px] mx-auto w-full">
            {/* Page Header with System Pulse */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-[var(--border-muted)] pb-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)] opacity-[0.03] blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
                 
                <div className="space-y-1 relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[var(--text-main)] italic tracking-tight leading-tight">
                        System <span className="text-[var(--color-primary)]">Integrity</span> & Pulse
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] font-medium italic">Deep architectural diagnostic stream for the platform layer.</p>
                </div>

                <div className="flex items-center gap-6 relative z-10">
                    {/* System Pulse Visualizer */}
                    <div className="hidden lg:flex items-center gap-3 px-6 py-3 rounded-2xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] backdrop-blur-md">
                        <div className="flex items-end gap-1 h-6">
                            {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.5, 0.3].map((h, i) => (
                                <motion.div 
                                    key={i}
                                    animate={{ height: [`${h * 100}%`, `${(h * 0.5) * 100}%`, `${h * 100}%`] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                                    className="w-1 bg-[var(--color-primary)] rounded-full opacity-60 shadow-[0_0_8px_var(--color-primary)]"
                                />
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] animate-pulse">Pulse Sync Active</span>
                            <span className="text-[10px] font-black text-[var(--text-main)]">98.4% Efficiency</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-[var(--bg-app)] rounded-xl border border-[var(--border-muted)]">
                        {(["overview", "infrastructure", "logs"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab ? "bg-[var(--color-primary)] text-white shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        {/* Metrics Hierarchy */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <DiagnosticStatCard title="Uptime (Cycle)" value={metrics.uptime} trend="Stable" icon="sensors" type="info" />
                            <DiagnosticStatCard title="Request Load" value={metrics.requestsToday.toLocaleString()} trend="+12% Vol" icon="speed" type="success" />
                            <DiagnosticStatCard title="Branches" value={metrics.activeBranches.toString()} trend="Active" icon="hub" type="info" />
                            <DiagnosticStatCard title="Thread Count" value={metrics.totalEmployees.toString()} trend="Active" icon="psychology" type="info" />
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                            {/* Latency Waveform */}
                            <div className="xl:col-span-8 rounded-[2rem] border border-[var(--border-muted)] bg-[var(--bg-card)]/40 p-8 shadow-sm relative overflow-hidden group backdrop-blur-md">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)] opacity-[0.03] rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
                                
                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-serif font-bold text-[var(--text-main)] italic">Response Resonance</h3>
                                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest italic">Global latency fluctuations across the edge network.</p>
                                    </div>
                                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest rounded-full">Optimal Range (2-14ms)</span>
                                </div>
                                
                                <div className="relative h-[250px] w-full flex flex-col justify-end p-2">
                                     {/* Waveform SVG */}
                                    <svg className="w-full h-48 absolute bottom-0 left-0 opacity-40" preserveAspectRatio="none" viewBox="0 0 1000 100">
                                        <defs>
                                            <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <motion.path 
                                            initial={{ d: "M0,50 Q100,30 200,60 T400,40 T600,70 T800,20 T1000,50 L1000,100 L0,100 Z" }}
                                            animate={{ d: [
                                                "M0,50 Q100,30 200,60 T400,40 T600,70 T800,20 T1000,50 L1000,100 L0,100 Z",
                                                "M0,60 Q100,80 200,40 T400,70 T600,20 T800,50 T1000,30 L1000,100 L0,100 Z",
                                                "M0,50 Q100,30 200,60 T400,40 T600,70 T800,20 T1000,50 L1000,100 L0,100 Z"
                                            ] }}
                                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                            fill="url(#waveGrad)"
                                        />
                                        <motion.path 
                                             initial={{ d: "M0,50 Q100,30 200,60 T400,40 T600,70 T800,20 T1000,50" }}
                                            animate={{ d: [
                                                "M0,50 Q100,30 200,60 T400,40 T600,70 T800,20 T1000,50",
                                                "M0,60 Q100,80 200,40 T400,70 T600,20 T800,50 T1000,30",
                                                "M0,50 Q100,30 200,60 T400,40 T600,70 T800,20 T1000,50"
                                            ] }}
                                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                            fill="none"
                                            stroke="var(--color-primary)"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    
                                    <div className="grid grid-cols-12 gap-1 h-full items-end relative z-10 px-4">
                                        {[14, 18, 12, 22, 19, 25, 14, 32, 18, 14, 12, 10].map((h, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                                                <motion.div 
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h * 3}px` }}
                                                    className={`w-1 rounded-full ${h > 25 ? 'bg-amber-500' : 'bg-white/10 group-hover/bar:bg-[var(--color-primary)]'} transition-colors duration-500`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between mt-6 px-4 relative z-10 opacity-30">
                                    {["T-12h", "T-8h", "T-4h", "Current Cycle"].map((t) => (
                                        <span key={t} className="text-[8px] font-black uppercase tracking-widest text-[var(--text-main)]">{t}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Anchor Status */}
                            <div className="xl:col-span-4 rounded-[2rem] border border-[var(--border-muted)] bg-[var(--bg-card)]/40 p-8 shadow-sm flex flex-col relative overflow-hidden backdrop-blur-md">
                                <div className="mb-6 border-b border-[var(--border-muted)] pb-6">
                                    <h3 className="text-xl font-serif font-bold text-white italic">Service Anchors</h3>
                                    <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40 mt-1">Health of foundational infrastructure services.</p>
                                </div>
                                <div className="space-y-3 flex-1">
                                    <DiagnosticServiceItem name="Prisma/Relational" status="Online" type="success" latency="2ms" />
                                    <DiagnosticServiceItem name="Next.js SSR/Edge" status="Online" type="success" latency="1ms" />
                                    <DiagnosticServiceItem name="Auth0/JWT Forge" status="Online" type="success" latency="14ms" />
                                    <DiagnosticServiceItem name="Stripe API Mirror" status="Delayed" type="warning" latency="450ms" />
                                    <DiagnosticServiceItem name="QR Blob Store" status="Online" type="success" latency="8ms" />
                                </div>
                                <button className="mt-6 w-full py-3 bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 border border-dashed border-[var(--color-primary)]/30 rounded-xl text-[8px] font-black uppercase tracking-widest text-[var(--color-primary)] transition-all">
                                    Initiate System Reset
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "infrastructure" && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-[2rem] border border-[var(--border-muted)] bg-[var(--bg-card)]/40 overflow-hidden shadow-sm backdrop-blur-md"
                    >
                        <div className="p-8 border-b border-[var(--border-muted)] flex justify-between items-center bg-[var(--bg-app)]/50">
                            <div className="space-y-1">
                                <h3 className="text-xl font-serif font-bold text-[var(--text-main)] italic">System Matrix</h3>
                                <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest italic">Live mapping of every edge and core sanctuary service.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">Active</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                    <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">Degraded</span>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[var(--border-muted)]/50 bg-[var(--bg-surface-muted)]/50">
                                        {["System Identity", "Region", "Latency", "Uptime (30d)", "Status", "Actions"].map((h) => (
                                            <th key={h} className="px-8 py-4 text-left text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] italic">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-muted)]/50 text-[var(--text-main)]">
                                    {SERVICE_INFRASTRUCTURE.map((node) => (
                                        <tr key={node.name} className="hover:bg-[var(--bg-surface-muted)]/20 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-8 rounded-lg bg-[var(--bg-surface-muted)]/20 border border-[var(--border-muted)] flex items-center justify-center text-[var(--color-primary)] shadow-inner">
                                                        <span className="material-symbols-outlined text-sm font-black italic">dns</span>
                                                    </div>
                                                    <span className="text-sm font-serif font-bold italic group-hover:text-[var(--color-primary)] transition-colors">{node.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest italic">{node.region}</td>
                                            <td className="px-8 py-5">
                                                <span className={`text-[10px] font-black italic ${parseInt(node.latency) > 30 ? 'text-amber-500' : 'text-[var(--color-primary)]'}`}>
                                                    {node.latency}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] italic">{node.uptime}</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest border ${node.status === 'online' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                                    {node.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <button className="p-2 h-8 w-8 rounded-lg bg-[var(--bg-app)] border border-[var(--border-muted)] text-[var(--text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 transition-all">
                                                    <span className="material-symbols-outlined text-sm">settings_ethernet</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === "logs" && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-[2rem] border border-[var(--border-muted)] bg-black h-[600px] shadow-sm flex flex-col overflow-hidden group/console"
                    >
                         <div className="p-8 border-b border-[var(--border-muted)] flex justify-between items-center bg-[var(--bg-app)]/40 backdrop-blur-md">
                            <div className="flex items-center gap-6">
                                <div className="size-12 rounded-xl bg-[var(--text-main)] text-[var(--bg-app)] flex items-center justify-center shadow-inner group-hover/console:scale-110 group-hover/console:-rotate-6 transition-transform">
                                    <span className="material-symbols-outlined text-xl italic font-bold">terminal</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-bold italic text-[var(--text-main)]">System Archetype Logs</h3>
                                    <p className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest italic animate-pulse mt-0.5">Live Diagnostic Stream</p>
                                </div>
                            </div>
                            <button className="text-[8px] font-black text-[var(--text-muted)] flex items-center gap-2 hover:text-[var(--text-main)] transition-colors uppercase tracking-widest italic border border-[var(--border-muted)] px-4 py-2 rounded-full">
                                <span className="material-symbols-outlined text-sm italic font-bold">cloud_download</span> Export Diagnostic Ledger
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 font-mono text-[11px] bg-slate-950/20 space-y-2 custom-scrollbar">
                            {logEntries.length > 0 ? logEntries.map((entry) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={entry.id} 
                                    className="flex items-center gap-8 py-2 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors rounded-lg px-4 group/entry"
                                >
                                    <span className="text-slate-600 w-24 tracking-tighter italic opacity-50 group-hover/entry:opacity-100">{entry.time}</span>
                                    <span className="font-black w-8 text-[var(--color-primary)]">200</span>
                                    <div className="flex items-baseline gap-4 flex-1">
                                        <span className="text-emerald-500 font-black tracking-tighter uppercase w-16">{entry.action}</span>
                                        <span className="text-[var(--text-muted)] truncate italic group-hover/entry:text-[var(--text-main)] transition-colors">{entry.resource}</span>
                                    </div>
                                    <span className="ml-auto text-[var(--text-muted)] font-black italic group-hover/entry:text-[var(--text-main)] transition-opacity whitespace-nowrap">{entry.userName}</span>
                                </motion.div>
                            )) : (
                                <p className="text-center text-white/20 italic p-12 uppercase tracking-widest text-[9px] font-black">No diagnostic resonance detected.</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DiagnosticStatCard({ title, value, trend, icon, type }: { title: string, value: string, trend: string, icon: string, type: 'info' | 'success' | 'warning' }) {
    return (
        <div className="group relative rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-card)]/40 p-8 shadow-sm backdrop-blur-md transition-all duration-700 hover:border-[var(--color-primary)]/40 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-[0.02] rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-[0.05] transition-opacity" />
            <div className="mb-6 flex items-center justify-between">
                <div className="size-12 rounded-xl bg-[var(--bg-app)]/50 border border-[var(--border-muted)] flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
                    <span className="material-symbols-outlined text-xl font-black italic">{icon}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest italic border ${type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-[var(--bg-surface-muted)] text-[var(--text-muted)] border-[var(--border-muted)]'}`}>
                    {trend}
                </span>
            </div>
            <div className="space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] italic">{title}</p>
                <h3 className="text-3xl font-serif font-black text-[var(--text-main)] tracking-tighter italic">{value}</h3>
            </div>
        </div>
    );
}

function DiagnosticServiceItem({ name, status, type, latency }: { name: string, status: string, type: 'success' | 'warning', latency: string }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-app)]/50 border border-[var(--border-muted)] hover:bg-[var(--bg-surface-muted)] hover:border-[var(--color-primary)]/20 transition-all group/node cursor-pointer">
            <div className="flex items-center gap-4">
                <div className={`size-10 rounded-xl flex items-center justify-center border ${type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500 animate-pulse-slow' : 'bg-amber-500/5 border-amber-500/10 text-amber-500'}`}>
                    <span className="material-symbols-outlined text-base font-black italic">{type === 'success' ? 'check_circle' : 'warning'}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-serif font-bold text-sm text-[var(--text-main)] italic group-node:text-[var(--color-primary)] transition-colors">{name}</span>
                    <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest italic">{latency} Resonance</span>
                </div>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${type === 'success' ? 'text-emerald-500 border-emerald-500/20' : 'text-amber-500 border-amber-500/20'}`}>{status}</span>
        </div>
    );
}
