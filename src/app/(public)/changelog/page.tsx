"use client";
import React, { useState } from "react";

const RELEASES = [
    { version: "v3.8.0", date: "Mar 10, 2026", tag: "Latest", tagColor: "bg-green-100 text-green-700", items: [
        { type: "feature", icon: "auto_awesome", text: "AI-powered booking suggestions based on client history" },
        { type: "feature", icon: "notifications_active", text: "Real-time push notifications for staff assignment changes" },
        { type: "improvement", icon: "speed", text: "Dashboard load time reduced by 40%" },
        { type: "fix", icon: "bug_report", text: "Fixed timezone offset in multi-location booking calendars" },
    ]},
    { version: "v3.7.2", date: "Feb 24, 2026", tag: "Stable", tagColor: "bg-blue-100 text-blue-700", items: [
        { type: "improvement", icon: "palette", text: "Updated dark mode color palette for better accessibility" },
        { type: "fix", icon: "bug_report", text: "Resolved duplicate SMS notifications for recurring clients" },
        { type: "fix", icon: "bug_report", text: "Fixed export formatting in inventory reports (CSV)" },
    ]},
    { version: "v3.7.0", date: "Feb 10, 2026", tag: null, tagColor: "", items: [
        { type: "feature", icon: "qr_code_2", text: "Bulk QR code printing tool for client membership cards" },
        { type: "feature", icon: "leaderboard", text: "Staff performance gamification board with weekly challenges" },
        { type: "improvement", icon: "security", text: "Enhanced data encryption for GDPR compliance" },
        { type: "fix", icon: "bug_report", text: "Fixed pagination in client directory for large datasets" },
    ]},
];

const TYPE_COLORS: Record<string, string> = { feature: "text-[var(--color-primary)]", improvement: "text-blue-500", fix: "text-orange-500" };
const TYPE_LABELS: Record<string, string> = { feature: "New", improvement: "Improved", fix: "Fixed" };

export default function ChangelogPage() {
    const [filter, setFilter] = useState("all");
    return (
        <main className="flex-1">
            <section className="py-16 lg:py-20 bg-gradient-to-br from-[var(--bg-app)] to-[var(--color-primary)]/5">
                <div className="max-w-4xl mx-auto px-6 text-center"><span className="material-symbols-outlined text-[var(--color-primary)] text-5xl mb-4">update</span><h1 className="text-4xl font-black tracking-tight mb-4">Release Notes &amp; Changelog</h1><p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">Stay up to date with the latest features, improvements, and bug fixes.</p></div>
            </section>
            <section className="max-w-3xl mx-auto px-6 py-12">
                <div className="flex items-center gap-2 mb-8">
                    {["all", "feature", "improvement", "fix"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${filter === f ? "bg-[var(--color-primary)] text-white" : "bg-[var(--bg-surface-muted)]/20 text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)]/40"}`}>{f === "all" ? "All" : TYPE_LABELS[f] || f}</button>
                    ))}
                </div>
                <div className="space-y-8">
                    {RELEASES.map(r => {
                        const filtered = filter === "all" ? r.items : r.items.filter(i => i.type === filter);
                        if (filtered.length === 0) return null;
                        return (
                            <div key={r.version} className="glass-card p-6 rounded-2xl border border-[var(--border-muted)]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3"><h3 className="text-xl font-black">{r.version}</h3>{r.tag && <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${r.tagColor}`}>{r.tag}</span>}</div>
                                    <span className="text-sm text-[var(--text-muted)]">{r.date}</span>
                                </div>
                                <div className="space-y-3">
                                    {filtered.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3"><span className={`material-symbols-outlined text-lg ${TYPE_COLORS[item.type]}`}>{item.icon}</span><div className="flex-1"><span className={`text-[10px] font-bold uppercase ${TYPE_COLORS[item.type]}`}>{TYPE_LABELS[item.type]}</span><p className="text-sm">{item.text}</p></div></div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
