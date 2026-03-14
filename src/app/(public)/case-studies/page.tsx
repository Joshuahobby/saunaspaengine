"use client";
import React from "react";
import Link from "next/link";

export default function CaseStudyPage() {
    return (
        <main className="flex-1">
            <section className="py-16 lg:py-24 bg-gradient-to-br from-[var(--bg-app)] to-[var(--color-primary)]/5">
                <div className="max-w-4xl mx-auto px-6 text-center"><span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-4">Case Study</span><h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">How AquaLux Spa Increased Revenue by <span className="text-[var(--color-primary)]">340%</span></h1><p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">A premium urban spa chain's journey from manual operations to fully automated management with Sauna SPA Engine.</p></div>
            </section>
            <section className="max-w-4xl mx-auto px-6 -mt-8 mb-16"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[{ value: "340%", label: "Revenue Growth" }, { value: "12→3", label: "Hours on Admin" }, { value: "98.5%", label: "Client Retention" }, { value: "5x", label: "Booking Volume" }].map(s => (<div key={s.label} className="glass-card text-center p-6 rounded-2xl border border-[var(--border-muted)]"><p className="text-2xl font-black text-[var(--color-primary)]">{s.value}</p><p className="text-xs text-[var(--text-muted)] font-medium mt-1">{s.label}</p></div>))}</div></section>
            <article className="max-w-3xl mx-auto px-6 mb-16 prose-like">
                <div className="glass-card p-8 rounded-2xl border border-[var(--border-muted)] mb-8">
                    <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4">AquaLux Spa, a premium 3-location urban spa chain in Helsinki, was drowning in manual processes. Staff scheduling, client bookings, and inventory tracking were all handled via spreadsheets and phone calls, leading to constant double-bookings and missed revenue opportunities.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">{[{ icon: "error", text: "30% double-booking rate" }, { icon: "schedule", text: "12+ hrs/week on admin" }, { icon: "trending_down", text: "Declining client satisfaction" }].map(c => (<div key={c.text} className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800/30"><span className="material-symbols-outlined text-red-500 text-lg">{c.icon}</span><span className="text-xs font-medium text-red-800 dark:text-red-300">{c.text}</span></div>))}</div>
                </div>
                <div className="glass-card p-8 rounded-2xl border border-[var(--border-muted)] mb-8">
                    <h2 className="text-2xl font-bold mb-4">The Solution</h2>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">AquaLux adopted Sauna SPA Engine's Professional plan across all locations. Within the first week, they onboarded their entire team and migrated all client data.</p>
                    <div className="space-y-4">{[{ icon: "calendar_month", title: "Smart Booking System", desc: "AI-powered scheduling eliminated double bookings overnight." }, { icon: "monitoring", title: "Real-Time Analytics", desc: "Live dashboards gave managers instant visibility into performance." }, { icon: "loyalty", title: "Loyalty Program", desc: "Automated rewards program boosted repeat visits by 60%." }, { icon: "inventory_2", title: "Inventory Automation", desc: "Auto-reorder alerts prevented stockouts of essential supplies." }].map(s => (<div key={s.title} className="flex items-start gap-4"><div className="size-10 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined text-[var(--color-primary)]">{s.icon}</span></div><div><h4 className="text-sm font-bold mb-1">{s.title}</h4><p className="text-xs text-[var(--text-muted)]">{s.desc}</p></div></div>))}</div>
                </div>
                <div className="glass-card p-8 rounded-2xl border border-[var(--border-muted)] mb-8">
                    <h2 className="text-2xl font-bold mb-4">The Results</h2>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">After 6 months on Sauna SPA Engine, AquaLux saw transformative results across every metric.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[{ metric: "Revenue", before: "$42K/mo", after: "$185K/mo", color: "text-green-600" }, { metric: "Admin Time", before: "12 hrs/week", after: "3 hrs/week", color: "text-blue-600" }, { metric: "Client Retention", before: "72%", after: "98.5%", color: "text-purple-600" }, { metric: "Double Bookings", before: "30%", after: "0.1%", color: "text-orange-600" }].map(r => (<div key={r.metric} className="p-4 bg-[var(--bg-surface-muted)]/10 rounded-xl"><p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">{r.metric}</p><div className="flex items-center gap-3"><span className="text-sm text-[var(--text-muted)] line-through">{r.before}</span><span className="material-symbols-outlined text-[var(--color-primary)] text-lg">arrow_forward</span><span className={`text-lg font-bold ${r.color}`}>{r.after}</span></div></div>))}</div>
                </div>
                <blockquote className="p-6 bg-[var(--color-primary)]/10 rounded-2xl border border-[var(--color-primary)]/20 mb-8"><p className="text-lg italic font-medium mb-3">&quot;Sauna SPA Engine didn't just digitize our operations — it transformed our entire business model. We went from surviving to thriving.&quot;</p><p className="text-sm text-[var(--color-primary)] font-bold">— Maria Korhonen, CEO, AquaLux Spa</p></blockquote>
            </article>
            <section className="py-16 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--bg-app)] text-center">
                <div className="max-w-2xl mx-auto px-6"><h2 className="text-3xl font-bold mb-4">Ready to Transform Your Spa?</h2><p className="text-[var(--text-muted)] mb-8">Join 500+ spas already powered by Sauna SPA Engine.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><Link href="/demo" className="px-8 py-4 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/30 flex items-center justify-center gap-2"><span className="material-symbols-outlined">calendar_month</span>Book a Free Demo</Link><Link href="/pricing" className="px-8 py-4 bg-[var(--bg-card)] border border-[var(--border-muted)] font-bold rounded-xl hover:bg-[var(--bg-surface-muted)]/50 transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined">payments</span>See Pricing</Link></div></div>
            </section>
        </main>
    );
}
