"use client";
import React from "react";
import Link from "next/link";

export default function OnboardingComplete() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[var(--bg-app)] to-[var(--color-primary)]/5">
            <div className="max-w-2xl w-full text-center">
                <div className="mb-8"><div className="inline-flex items-center justify-center w-24 h-24 bg-[var(--color-primary)]/20 rounded-full mb-6"><span className="material-symbols-outlined text-[var(--color-primary)] text-6xl">celebration</span></div><h1 className="text-4xl font-black tracking-tight mb-3">You're All Set! 🎉</h1><p className="text-[var(--text-muted)] text-lg max-w-md mx-auto">Congratulations! You've completed the onboarding tour and are ready to manage your spa like a pro.</p></div>
                <div className="glass-card rounded-2xl border border-[var(--border-muted)] p-8 mb-8">
                    <div className="flex items-center justify-center gap-4 mb-6"><div className="flex items-center gap-1 text-sm font-bold"><span className="size-6 bg-green-500 text-white rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-xs">check</span></span><div className="w-8 h-0.5 bg-green-500"></div><span className="size-6 bg-green-500 text-white rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-xs">check</span></span><div className="w-8 h-0.5 bg-green-500"></div><span className="size-6 bg-green-500 text-white rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-xs">check</span></span></div></div>
                    <h2 className="text-xl font-bold mb-6">What You've Learned</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        {[{ icon: "dashboard", title: "Dashboard Basics", desc: "Navigate stats, bookings & alerts" }, { icon: "meeting_room", title: "Room Management", desc: "Monitor and update room statuses" }, { icon: "group", title: "Team Coordination", desc: "Assign staff & manage shifts" }].map(f => (
                            <div key={f.title} className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800/30"><span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl mb-2">{f.icon}</span><h4 className="text-sm font-bold mb-1">{f.title}</h4><p className="text-xs text-[var(--text-muted)]">{f.desc}</p></div>
                        ))}
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">Recommended Next Steps</h3>
                    <div className="space-y-3 text-left">
                        {[{ icon: "person_add", label: "Add your first client", href: "/clients" }, { icon: "calendar_month", label: "Create a booking", href: "/bookings" }, { icon: "spa", label: "Set up your services", href: "/services" }].map(a => (
                            <Link key={a.label} href={a.href} className="flex items-center gap-3 p-3 bg-[var(--bg-surface-muted)]/10 rounded-lg hover:bg-[var(--color-primary)]/10 transition-colors"><span className="material-symbols-outlined text-[var(--color-primary)]">{a.icon}</span><span className="text-sm font-medium flex-1">{a.label}</span><span className="material-symbols-outlined text-[var(--text-muted)] text-lg">arrow_forward</span></Link>
                        ))}
                    </div>
                </div>
                <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/30 text-lg"><span className="material-symbols-outlined">rocket_launch</span>Go to Dashboard</Link>
            </div>
        </main>
    );
}
