"use client";

import { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface AuditLog {
    id: string;
    createdAt: string | Date;
    action: string;
    entity: string;
    entityId: string;
    details: string | null;
    reason: string | null;
    user: {
        fullName: string;
        role: string;
    };
    business?: {
        name: string;
    } | null;
}

interface AdminAuditClientPageProps {
    initialLogs: AuditLog[];
    initialTab?: string;
}

export default function AdminAuditClientPage({ initialLogs, initialTab = "Logs" }: AdminAuditClientPageProps) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [logs] = useState<AuditLog[]>(initialLogs);
    const [searchQuery, setSearchQuery] = useState("");

    const getActionIcon = (action: string) => {
        switch (action) {
            case "CREATE": return "add_circle";
            case "UPDATE": return "edit";
            case "DELETE": return "delete";
            case "OVERRIDE": return "warning";
            case "LOGIN": return "login";
            case "SYSTEM": return "settings_applications";
            default: return "info";
        }
    };

    const getResonanceTheme = (role: string) => {
        switch (role) {
            case "ADMIN": return {
                color: "text-purple-400",
                bg: "bg-purple-500/10",
                border: "border-purple-500/20",
                shadow: "shadow-purple-500/10"
            };
            case "OWNER": return {
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20",
                shadow: "shadow-emerald-500/10"
            };
            default: return {
                color: "text-slate-400",
                bg: "bg-slate-500/10",
                border: "border-slate-500/20",
                shadow: "shadow-slate-500/10"
            };
        }
    };

    const getStatusStyle = (action: string) => {
        if (action === "OVERRIDE") return "text-orange-400 bg-orange-500/5 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]";
        if (action === "DELETE") return "text-rose-400 bg-rose-500/5 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]";
        return "text-emerald-400 bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
    };

    return (
        <div className="flex flex-col gap-8 px-4 lg:px-6 py-6 max-w-[1600px] mx-auto w-full">
            {/* Audit Hub Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/[0.03] pb-8 relative group">
                 <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-primary)] opacity-[0.02] blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
                 
                 <div className="space-y-1 relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-serif font-bold text-white italic tracking-tight leading-tight">
                        Audit <span className="text-[var(--color-primary)]">Integrity</span> Hub
                    </h1>
                    <p className="text-sm text-white/40 font-medium italic opacity-60">Architectural record of platform resonance and structural shifts.</p>
                 </div>

                 <div className="flex items-center gap-4 relative z-10">
                    <div className="flex items-center gap-2 p-1 bg-black/40 rounded-xl border border-white/5 backdrop-blur-md">
                        {["Logs", "Matrix"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20" : "text-white/40 hover:text-white"}`}
                            >
                                {tab === "Logs" ? "Audit Logs" : "Permissions Matrix"}
                            </button>
                        ))}
                    </div>
                    
                    <button className="px-6 py-2.5 rounded-xl bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center gap-2 group/export">
                         <span className="material-symbols-outlined text-sm">cloud_download</span>
                         Export Nexus Logs
                    </button>
                 </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "Logs" ? (
                    <motion.div 
                        key="logs"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        {/* Filters Bar */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex-1 relative min-w-[300px] group">
                                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--color-primary)] transition-colors">search</span>
                                <input 
                                    className="w-full h-12 bg-black/20 border border-white/5 rounded-xl pl-12 pr-6 text-[11px] font-bold text-white placeholder:text-white/10 outline-none focus:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all"
                                    placeholder="SEARCH ACTOR OR SIGNAL ENTITY..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl group/filter">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">Actor Spectrum</span>
                                <select 
                                    title="Filter by Role"
                                    aria-label="Filter logs by actor role"
                                    className="bg-transparent border-none p-0 focus:ring-0 text-[10px] font-black text-white uppercase tracking-widest cursor-pointer outline-none"
                                >
                                    <option>All Archetypes</option>
                                    <option>System Admin</option>
                                    <option>Node Owner</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl group/filter">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">Signal Scope</span>
                                <select 
                                    title="Filter by Action"
                                    aria-label="Filter logs by action type"
                                    className="bg-transparent border-none p-0 focus:ring-0 text-[10px] font-black text-white uppercase tracking-widest cursor-pointer outline-none"
                                >
                                    <option>All Action Variants</option>
                                    <option>CREATE</option>
                                    <option>UPDATE</option>
                                    <option>DELETE</option>
                                    <option>OVERRIDE</option>
                                </select>
                            </div>

                            <button className="h-12 px-6 rounded-xl border border-dashed border-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)] transition-all flex items-center gap-2 italic">
                                <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                                Reset Signal Null
                            </button>
                        </div>

                        {/* Immutable Log Matrix */}
                        <div className="rounded-[2rem] border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[1100px]">
                                    <thead>
                                        <tr className="bg-black/20 border-b border-white/[0.03]">
                                            {["Nexus Timing", "Resonant Actor", "Signal Signature", "Nexus Entity", "Resonance Details", "Manifest Status"].map((h) => (
                                                <th key={h} className="px-8 py-5 text-[8px] font-black uppercase tracking-[0.2em] text-white/20 italic">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.02] text-white">
                                        {logs.length > 0 ? (
                                            logs.map((log, idx) => {
                                                const theme = getResonanceTheme(log.user.role);
                                                return (
                                                    <motion.tr 
                                                        key={log.id} 
                                                        initial={{ opacity: 0, x: -5 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.02 }}
                                                        className={`group hover:bg-white/[0.02] transition-colors ${log.action === 'OVERRIDE' ? 'bg-orange-500/[0.02]' : ''}`}
                                                    >
                                                        <td className="px-8 py-5">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter italic whitespace-nowrap">{format(new Date(log.createdAt), "MMM dd, yyyy")}</span>
                                                                <span className="text-[11px] font-serif font-bold text-[var(--color-primary)] italic opacity-60 group-hover:opacity-100 transition-opacity">{format(new Date(log.createdAt), "HH:mm:ss")}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`size-10 rounded-xl flex items-center justify-center text-[10px] font-black border group-hover:scale-110 group-hover:-rotate-6 transition-all ${theme.bg} ${theme.color} ${theme.border} ${theme.shadow}`}>
                                                                    {log.user.fullName.substring(0, 2).toUpperCase()}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-serif font-black italic group-hover:text-white transition-colors">{log.user.fullName}</span>
                                                                    <span className={`text-[8px] font-black uppercase tracking-widest mt-0.5 opacity-60 ${theme.color}`}>{log.user.role}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`size-8 rounded-lg bg-black/20 border border-white/5 flex items-center justify-center ${log.action === 'OVERRIDE' ? 'text-orange-400' : 'text-white/20'}`}>
                                                                    <span className="material-symbols-outlined text-base italic">{getActionIcon(log.action)}</span>
                                                                </div>
                                                                <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${log.action === "OVERRIDE" ? "text-orange-400" : "text-white/60"}`}>
                                                                    {log.action}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest italic italic">{log.entity}</span>
                                                                <span className="text-[11px] font-mono font-black text-white/80 tabular-nums truncate max-w-[120px]" title={log.entityId}>{log.entityId}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="max-w-[280px]">
                                                                <p className="text-[11px] font-serif font-medium text-white/50 italic leading-relaxed group-hover:text-white/80 transition-colors line-clamp-2" title={log.details || ""}>
                                                                    {log.details || "Manifest records verified."}
                                                                </p>
                                                                {log.reason && (
                                                                    <div className="flex items-center gap-1.5 mt-2 text-orange-400/60 group-hover:text-orange-400 transition-colors">
                                                                         <span className="material-symbols-outlined text-xs">edit_note</span>
                                                                         <span className="text-[8px] font-black uppercase tracking-widest italic">Reason: {log.reason}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <span className={`px-4 py-1.5 rounded-full border text-[7px] font-black uppercase tracking-[0.2em] shadow-sm backdrop-blur-md transition-all ${getStatusStyle(log.action)}`}>
                                                                {log.action === "OVERRIDE" ? "Override Imprinted" : "Sync Success"}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-8 py-24 text-center">
                                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                                        <span className="material-symbols-outlined text-4xl">inventory_2</span>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] font-serif italic text-white/80">Signal Nexus Empty</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Nexus Pagination */}
                        <div className="flex items-center justify-between border-t border-white/[0.03] pt-8">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">Current resonance scan: <span className="text-white/60">1-50 entries</span></p>
                            <div className="flex gap-4">
                                <button disabled className="px-6 py-2.5 rounded-xl border border-white/5 bg-white/5 text-[9px] font-black text-white/20 uppercase tracking-widest cursor-not-allowed italic transition-all">Previous Nexus</button>
                                <button className="px-8 py-2.5 rounded-xl bg-white text-black text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.05] active:scale-[0.98] transition-all italic">Next Spectrum</button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="matrix"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-8"
                    >
                        {/* Search & Tooling */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 relative group">
                                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--color-primary)] transition-colors">search</span>
                                <input 
                                    className="w-full h-14 bg-black/20 border border-white/5 rounded-2xl pl-12 pr-6 text-[11px] font-bold text-white placeholder:text-white/10 outline-none focus:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all"
                                    placeholder="SEARCH ARCHETYPAL PERMISSIONS..."
                                />
                            </div>
                            <div className="flex gap-4">
                                <button className="flex-1 h-14 bg-black/40 border border-white/5 rounded-2xl text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-white hover:border-white/10 transition-all italic">All Categories</button>
                                <button className="flex-1 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-emerald-500/20 transition-all italic">Active Shifts</button>
                            </div>
                        </div>

                        {/* Permissions Matrix */}
                        <div className="rounded-[3rem] border border-white/[0.05] bg-white/[0.01] backdrop-blur-md overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[1000px]">
                                    <thead>
                                        <tr className="bg-black/30 border-b border-white/[0.05]">
                                            <th className="px-10 py-8 w-1/3">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.2em] italic">nexus domain</span>
                                                    <span className="text-[12px] font-serif font-black text-white italic">Signal Functionality Mapping</span>
                                                </div>
                                            </th>
                                            {["Nexus Admin", "Vessel Owner", "Lead Manager", "Staff Node"].map((role) => (
                                                <th key={role} className="px-6 py-8 text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] italic">archetype</span>
                                                        <span className="text-[11px] font-serif font-black text-white italic">{role}</span>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        <PermissionCategory title="Financial Orchestration" />
                                        <PermissionRow 
                                            title="Nexus Financial Reporting" 
                                            desc="Depth view of platform-wide yield metrics and revenue resonance." 
                                            checks={[true, true, true, false]}
                                        />
                                        <PermissionRow 
                                            title="Signal Refund Nexus" 
                                            desc="Authorization to reverse financial imprints and process returns." 
                                            checks={[true, true, false, false]}
                                        />
                                        
                                        <PermissionCategory title="Operational Currents" />
                                        <PermissionRow 
                                            title="Vessel Service Mapping" 
                                            desc="Modify and calibrate logistical logs for active service nodes." 
                                            checks={[true, true, true, true]}
                                        />
                                        <PermissionRow 
                                            title="Architectural Override" 
                                            desc="Force calibrate records finalized by the core platform engine." 
                                            checks={[true, true, false, false]}
                                        />
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Save Changes Footer */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col sm:flex-row items-center justify-between p-8 bg-[var(--text-main)] text-black rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
                        >
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                             
                             <div className="flex items-center gap-6 relative z-10">
                                <div className="size-14 bg-black/5 rounded-full flex items-center justify-center border border-black/10 shadow-inner">
                                    <span className="material-symbols-outlined text-black text-2xl font-black italic">verified_user</span>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xl font-serif font-black italic">Nexus Audit Active</p>
                                    <p className="text-[10px] font-black text-black/50 uppercase tracking-widest italic leading-tight">Every shift is securely recorded in the platform nexus history.</p>
                                </div>
                             </div>

                             <div className="flex gap-4 w-full sm:w-auto relative z-10">
                                <button className="flex-1 sm:flex-none px-10 py-4 bg-black/5 hover:bg-black/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic transition-all border border-black/10">Discard Shifts</button>
                                <button className="flex-1 sm:flex-none px-12 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic hover:scale-[1.05] active:scale-[0.98] transition-all shadow-xl shadow-black/20">Imprint Matrix</button>
                             </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PermissionCategory({ title }: { title: string }) {
    return (
        <tr className="bg-white/[0.03]">
            <td colSpan={5} className="px-10 py-3">
                <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-[0.4em] italic">{title}</span>
            </td>
        </tr>
    );
}

function PermissionRow({ title, desc, checks }: { title: string, desc: string, checks: boolean[] }) {
    return (
        <tr className="group hover:bg-white/[0.01] transition-colors border-l-2 border-transparent hover:border-[var(--color-primary)]/40">
            <td className="px-10 py-8">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-serif font-black text-white italic group-hover:text-[var(--color-primary)] transition-colors">{title}</span>
                    <span className="text-[10px] text-white/30 font-medium italic max-w-sm group-hover:text-white/60 transition-colors leading-relaxed">{desc}</span>
                </div>
            </td>
            {checks.map((checked, i) => (
                <td key={i} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer group/toggle">
                            <input 
                                type="checkbox" 
                                defaultChecked={checked} 
                                className="sr-only peer"
                                aria-label={`Toggle ${title} permission for archetype ${i}`}
                            />
                            <div className="w-12 h-6 bg-white/5 border border-white/10 rounded-full peer peer-checked:bg-[var(--color-primary)]/20 peer-checked:border-[var(--color-primary)]/40 transition-all duration-500 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white/10 peer-checked:after:bg-[var(--color-primary)] after:rounded-lg after:h-4 after:w-4 after:transition-all after:duration-500 peer-checked:after:translate-x-6 peer-checked:after:rotate-[360deg] shadow-inner group-hover/toggle:scale-110" />
                        </label>
                    </div>
                </td>
            ))}
        </tr>
    );
}
