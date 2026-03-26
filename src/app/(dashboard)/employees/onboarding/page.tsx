"use client";
import React from "react";
import Link from "next/link";

export default function OnboardingStep1() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[var(--bg-app)] to-[var(--color-primary)]/5">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8"><span className="material-symbols-outlined text-[var(--color-primary)] text-6xl mb-4">waving_hand</span><h1 className="text-4xl font-black tracking-tight mb-3">Welcome to <span className="text-[var(--color-primary)]">Sauna SPA Engine</span></h1><p className="text-[var(--text-muted)] text-lg max-w-md mx-auto">Let's get you set up in just a few steps. This tour will show you the essentials.</p></div>
                <div className="glass-card rounded-2xl border border-[var(--border-muted)] p-8">
                    <div className="flex items-center gap-4 mb-6"><div className="flex items-center gap-1 text-sm font-bold text-[var(--text-muted)]"><span className="size-6 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-xs">1</span><div className="w-8 h-0.5 bg-[var(--color-primary)]"></div><span className="size-6 bg-[var(--bg-surface-muted)]/30 rounded-full flex items-center justify-center text-xs">2</span><div className="w-8 h-0.5 bg-[var(--bg-surface-muted)]/30"></div><span className="size-6 bg-[var(--bg-surface-muted)]/30 rounded-full flex items-center justify-center text-xs">3</span></div></div>
                    <h2 className="text-xl font-bold mb-4">Your Dashboard Overview</h2>
                    <p className="text-[var(--text-muted)] text-sm mb-6">Your dashboard is your command center. Here you'll find real-time statistics, quick actions, and alerts about your spa operations.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        {[{ icon: "calendar_month", title: "Bookings", desc: "View and manage all appointments" }, { icon: "people", title: "Clients", desc: "Access member profiles and history" }, { icon: "monitoring", title: "Analytics", desc: "Track revenue, footfall & trends" }].map(f => (
                            <div key={f.title} className="p-4 bg-[var(--bg-surface-muted)]/10 rounded-xl text-center"><span className="material-symbols-outlined text-[var(--color-primary)] text-3xl mb-2">{f.icon}</span><h4 className="text-sm font-bold mb-1">{f.title}</h4><p className="text-xs text-[var(--text-muted)]">{f.desc}</p></div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center"><Link href="/dashboard" className="text-[var(--text-muted)] text-sm font-medium hover:text-[var(--text-main)]">Skip Tour</Link><Link href="/employees/onboarding/rooms" className="px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2">Next: Room Status <span className="material-symbols-outlined text-lg">arrow_forward</span></Link></div>
                </div>
            </div>
        </main>
    );
}
