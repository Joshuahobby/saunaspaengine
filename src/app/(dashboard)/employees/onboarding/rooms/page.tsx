"use client";
import React from "react";
import Link from "next/link";

export default function OnboardingStep2() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[var(--bg-app)] to-[var(--color-primary)]/5">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8"><span className="material-symbols-outlined text-[var(--color-primary)] text-6xl mb-4">meeting_room</span><h1 className="text-3xl font-black tracking-tight mb-2">Room Status Management</h1><p className="text-[var(--text-muted)] text-lg">Learn how to monitor and manage your spa rooms in real-time.</p></div>
                <div className="glass-card rounded-2xl border border-[var(--border-muted)] p-8">
                    <div className="flex items-center gap-4 mb-6"><div className="flex items-center gap-1 text-sm font-bold text-[var(--text-muted)]"><span className="size-6 bg-green-500 text-white rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-xs">check</span></span><div className="w-8 h-0.5 bg-[var(--color-primary)]"></div><span className="size-6 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-xs">2</span><div className="w-8 h-0.5 bg-[var(--bg-surface-muted)]/30"></div><span className="size-6 bg-[var(--bg-surface-muted)]/30 rounded-full flex items-center justify-center text-xs">3</span></div></div>
                    <h2 className="text-xl font-bold mb-4">Understanding Room Statuses</h2>
                    <p className="text-[var(--text-muted)] text-sm mb-6">The Floor Manager view shows all your rooms and their current status. Here's what each status means:</p>
                    <div className="space-y-3 mb-8">
                        {[
                            { color: "bg-green-500", label: "Available", desc: "Room is clean and ready for the next guest." },
                            { color: "bg-blue-500", label: "Occupied", desc: "Session is currently in progress." },
                            { color: "bg-orange-500", label: "Cleaning", desc: "Room is being prepared between sessions." },
                            { color: "bg-red-500", label: "Maintenance", desc: "Room is out of service for repairs." },
                        ].map(s => (
                            <div key={s.label} className="flex items-center gap-4 p-4 bg-[var(--bg-surface-muted)]/10 rounded-xl">
                                <div className={`size-3 rounded-full ${s.color}`}></div>
                                <div><span className="text-sm font-bold">{s.label}</span><p className="text-xs text-[var(--text-muted)]">{s.desc}</p></div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-[var(--color-primary)]/10 rounded-xl border border-[var(--color-primary)]/20 mb-6"><p className="text-sm text-[var(--text-muted)]"><span className="text-[var(--color-primary)] font-bold">Pro Tip:</span> Click on any room card to change its status, add notes, or assign a staff member.</p></div>
                    <div className="flex justify-between items-center"><Link href="/employees/onboarding" className="text-[var(--text-muted)] text-sm font-medium hover:text-[var(--text-main)] flex items-center gap-1"><span className="material-symbols-outlined text-lg">arrow_back</span>Back</Link><Link href="/dashboard" className="px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2">Finish Tour <span className="material-symbols-outlined text-lg">arrow_forward</span></Link></div>
                </div>
            </div>
        </main>
    );
}
