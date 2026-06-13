"use client";

import React from "react";

export default function AuditLogsTab() {
    return (
        <div className="space-y-10">
            {/* Legend & Summary */}
            <div className="flex flex-wrap items-center justify-between gap-6 px-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold font-serif italic text-emerald-500">Immutable Timeline</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">Operations Tracking</p>
                </div>
                <div className="flex gap-4">
                     <button className="px-6 py-2.5 bg-[var(--bg-surface-muted)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest rounded-xl border border-[var(--border-muted)] hover:text-emerald-500 transition-colors">
                        Download CSV
                    </button>
                    <div className="h-10 w-[1px] bg-[var(--border-muted)] self-center"></div>
                    <select title="Filter Action Type" className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] outline-none cursor-pointer hover:text-emerald-500">
                        <option>All Actions</option>
                        <option>Security</option>
                        <option>Financial</option>
                    </select>
                </div>
            </div>

            {/* Log Table */}
            <div className="glass-card rounded-[2.5rem] border border-[var(--border-muted)] overflow-hidden bg-[var(--bg-card)] shadow-xl overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-[var(--bg-surface-muted)]/10 border-b border-[var(--border-muted)]">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Occurred At</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Actor</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Narrative Action</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Target Identity</th>
                            <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Integrity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-muted)]/30">
                        <AuditRow 
                            time="Oct 24, 14:32" 
                            actor="Alice N." 
                            role="Admin" 
                            action="Financial Override" 
                            target="#INV-98214" 
                            status="Verified" 
                        />
                        <AuditRow 
                            time="Oct 24, 11:15" 
                            actor="System Core" 
                            role="Automated" 
                            action="Inventory Sync" 
                            target="#PO-L-442" 
                            status="Verified" 
                        />
                        <AuditRow 
                            time="Oct 24, 09:02" 
                            actor="Jean M." 
                            role="Reception" 
                            action="Security Access" 
                            target="/admin/reports" 
                            status="Blocked" 
                            critical
                        />
                    </tbody>
                </table>
            </div>
            
            <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] flex items-center gap-6 max-w-2xl group">
                <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined font-black">verified_user</span>
                </div>
                <p className="text-xs font-bold text-[var(--text-muted)] leading-relaxed italic">
                    All records in this hub are cryptographically locked. <span className="text-emerald-500 underline decoration-dotted">Chain of custody</span> is maintained by the platform&apos;s immutable vault.
                </p>
            </div>
        </div>
    );
}

function AuditRow({ time, actor, role, action, target, status, critical }: { time: string; actor: string; role: string; action: string; target: string; status: string; critical?: boolean }) {
    return (
        <tr className={`group hover:bg-[var(--bg-surface-muted)]/10 transition-all ${critical ? "bg-red-500/[0.02]" : ""}`}>
            <td className="px-8 py-5">
                <p className="text-xs font-bold text-[var(--text-main)]">{time}</p>
                <p className="text-[10px] text-[var(--text-muted)] font-black uppercase transition-opacity">Central African Time</p>
            </td>
            <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-lg ${critical ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"} flex items-center justify-center text-[10px] font-black`}>
                        {actor.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                        <p className="text-xs font-black text-[var(--text-main)] italic">{actor}</p>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{role}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-5 text-xs font-bold text-[var(--text-main)] italic">
                {action}
            </td>
            <td className="px-8 py-5 text-xs font-bold text-emerald-500/70 underline decoration-dotted underline-offset-4 cursor-help">
                {target}
            </td>
            <td className="px-8 py-5 text-right">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${critical ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                    {status}
                </span>
            </td>
        </tr>
    );
}
