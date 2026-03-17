"use client";
import React from "react";

const PRESETS = [
    { icon: "database", title: "GDPR Data Handling", desc: "Automatic consent modals, data portability exports, and right-to-be-forgotten logic for EU residents.", active: true },
    { icon: "calculate", title: "Tax Calculation (OSS VAT)", desc: "Dynamic tax application based on customer's residence within the EU Single Market.", active: true },
    { icon: "receipt_long", title: "Legal Receipt Format", desc: "Includes mandatory branch registration numbers, VAT IDs, and localized billing addresses.", active: true },
    { icon: "gavel", title: "Local Content Moderation", desc: "Regional filtering of prohibited content types as required by specific national legislations.", active: false },
];

export default function CompliancePage() {
    return (
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
            <div className="mb-8"><h1 className="text-3xl font-black tracking-tight">Regional Compliance &amp; Tax Presets</h1><p className="text-[var(--text-muted)] mt-2 max-w-2xl text-lg">Manage international regulatory standards and automated tax logic for global scaling from a single interface.</p></div>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-7 flex flex-col gap-6">
                    <div className="glass-card rounded-2xl border border-[var(--border-muted)] overflow-hidden">
                        <div className="p-5 border-b border-[var(--border-muted)] flex justify-between items-center"><h2 className="text-lg font-bold">Select Global Region</h2><select title="Select Global Region" aria-label="Select global region for compliance presets" className="bg-[var(--bg-surface-muted)]/30 border-none rounded-lg text-sm font-semibold focus:ring-[var(--color-primary)] py-1.5 pl-4 pr-10"><option>European Union</option><option>North America</option><option>GCC Countries</option><option>Asia Pacific</option></select></div>
                        <div className="relative aspect-video bg-[var(--bg-surface-muted)]/20 flex items-center justify-center p-4">
                            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--bg-surface-muted)]/20 flex items-center justify-center"><span className="material-symbols-outlined text-8xl text-[var(--color-primary)]/30">public</span></div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="size-6 bg-[var(--color-primary)] rounded-full animate-ping opacity-75"></div><div className="absolute size-4 bg-[var(--color-primary)] border-2 border-white rounded-full"></div></div>
                            <div className="absolute bottom-4 left-4 bg-[var(--bg-card)] backdrop-blur p-3 rounded-lg border border-[var(--border-muted)] shadow-lg text-xs"><p className="font-bold flex items-center gap-2"><span className="size-2 bg-green-500 rounded-full"></span>Active Region: European Union</p><p className="text-[var(--text-muted)] mt-1">27 Member States | VAT Logic: Active</p></div>
                        </div>
                    </div>
                    <div className="glass-card rounded-2xl border border-[var(--border-muted)] p-6"><h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Regional Summary</h3><div className="grid grid-cols-3 gap-4">{[{ label: "Tax Engine", value: "OSS VAT" }, { label: "Currency", value: "EUR (€)" }, { label: "Privacy Standard", value: "GDPR" }].map(s => (<div key={s.label} className="p-4 bg-[var(--bg-surface-muted)]/10 rounded-xl"><p className="text-xs text-[var(--text-muted)] mb-1">{s.label}</p><p className="text-lg font-bold text-[var(--color-primary)]">{s.value}</p></div>))}</div></div>
                </div>
                <div className="xl:col-span-5 flex flex-col gap-6">
                    <div className="glass-card rounded-2xl border border-[var(--border-muted)] p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-bold">Compliance Presets</h2><span className="px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-black rounded uppercase">Standard v2.4</span></div>
                        <div className="space-y-6 flex-1">
                            {PRESETS.map(p => (
                                <div key={p.title} className={`flex items-start justify-between gap-4 p-4 border border-[var(--border-muted)] rounded-xl hover:bg-[var(--bg-surface-muted)]/10 transition-colors ${!p.active ? "opacity-60" : ""}`}>
                                    <div className="flex-1"><div className="flex items-center gap-2 mb-1"><span className={`material-symbols-outlined text-sm ${p.active ? "text-[var(--color-primary)]" : "text-[var(--text-muted)]"}`}>{p.icon}</span><h4 className="font-bold text-sm">{p.title}</h4></div><p className="text-xs text-[var(--text-muted)] leading-relaxed">{p.desc}</p></div>
                                    <button title={`Toggle ${p.title}`} aria-label={`Toggle ${p.title} preset`} className={`w-9 h-5 rounded-full relative transition-colors ${p.active ? "bg-[var(--color-primary)]" : "bg-[var(--bg-surface-muted)]/50"}`}><div className={`absolute top-0.5 size-4 bg-white rounded-full transition-transform shadow-sm ${p.active ? "translate-x-4" : "translate-x-0.5"}`}></div></button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-[var(--border-muted)]"><button className="w-full bg-[var(--color-primary)] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-colors shadow-lg shadow-[var(--color-primary)]/20">Apply Global Presets</button><p className="text-[11px] text-center text-[var(--text-muted)] mt-3">Changes will propagate to all 12 platform nodes within 5 minutes.</p></div>
                    </div>
                </div>
            </div>
            <div className="mt-8 glass-card rounded-2xl border border-[var(--border-muted)] p-6">
                <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold">Recent Compliance Updates</h3><button className="text-[var(--color-primary)] text-xs font-bold hover:underline">View Full Audit Log</button></div>
                <table className="w-full text-left text-sm"><thead><tr className="text-[var(--text-muted)] border-b border-[var(--border-muted)]"><th className="pb-3 font-medium">Timestamp</th><th className="pb-3 font-medium">Administrator</th><th className="pb-3 font-medium">Region</th><th className="pb-3 font-medium">Action</th><th className="pb-3 font-medium">Status</th></tr></thead><tbody className="divide-y divide-[var(--border-muted)]"><tr><td className="py-4 text-xs">Oct 24, 2023 14:22</td><td className="py-4 font-medium">Alex Rivera</td><td className="py-4">EU West</td><td className="py-4">Enabled GDPR Auto-Purge</td><td className="py-4"><span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-[10px] font-bold">SUCCESS</span></td></tr><tr><td className="py-4 text-xs">Oct 23, 2023 09:15</td><td className="py-4 font-medium">Sarah Chen</td><td className="py-4">GCC South</td><td className="py-4">Updated VAT logic to 5%</td><td className="py-4"><span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-[10px] font-bold">SUCCESS</span></td></tr></tbody></table>
            </div>
        </main>
    );
}
