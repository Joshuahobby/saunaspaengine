"use client";
import React from "react";
import Link from "next/link";

export default function DemoConfirmationPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[var(--bg-app)] to-[var(--color-primary)]/5">
            <div className="max-w-lg w-full text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6"><span className="material-symbols-outlined text-green-600 dark:text-green-400 text-5xl">check_circle</span></div>
                <h1 className="text-3xl font-black tracking-tight mb-3">Demo Request Confirmed!</h1>
                <p className="text-[var(--text-muted)] text-lg mb-8">Thank you! A member of our team will reach out within 24 hours to schedule your personalized demo.</p>
                <div className="glass-card p-8 rounded-2xl border border-[var(--border-muted)] text-left mb-8">
                    <h2 className="text-lg font-bold mb-4">What Happens Next?</h2>
                    <div className="space-y-4">
                        {[
                            { step: "1", title: "Confirmation Email", desc: "Check your inbox for a confirmation with demo details.", icon: "mail" },
                            { step: "2", title: "Schedule Call", desc: "Our team will call to find the best time for your demo.", icon: "calendar_month" },
                            { step: "3", title: "Live Demo", desc: "30-minute walkthrough customized to your spa's needs.", icon: "video_camera_front" },
                        ].map(s => (
                            <div key={s.step} className="flex items-start gap-4">
                                <div className="size-8 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">{s.step}</div>
                                <div><h4 className="text-sm font-bold">{s.title}</h4><p className="text-xs text-[var(--text-muted)]">{s.desc}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/" className="px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"><span className="material-symbols-outlined">home</span>Back to Home</Link>
                    <Link href="/pricing" className="px-6 py-3 bg-[var(--bg-card)] border border-[var(--border-muted)] font-bold rounded-xl hover:bg-[var(--bg-surface-muted)]/50 transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined">payments</span>View Pricing</Link>
                </div>
            </div>
        </main>
    );
}
