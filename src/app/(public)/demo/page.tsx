"use client";
import React from "react";

export default function DemoRequestPage() {
    return (
        <main className="flex-1">
            <section className="py-16 lg:py-24 bg-gradient-to-br from-[var(--bg-app)] to-[var(--color-primary)]/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div><span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-4">Free Demo</span><h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">See Sauna SPA Engine <span className="text-[var(--color-primary)]">in Action</span></h1><p className="text-[var(--text-muted)] text-lg mb-8">Book a personalized 30-minute demo with one of our spa technology experts. No commitment required.</p>
                            <div className="space-y-4">
                                {[{ icon: "video_camera_front", text: "Live personalized walkthrough" }, { icon: "tune", text: "Configuration for your spa type" }, { icon: "question_answer", text: "Q&A with product specialists" }].map(f => (
                                    <div key={f.icon} className="flex items-center gap-3"><span className="material-symbols-outlined text-[var(--color-primary)]">{f.icon}</span><span className="text-sm font-medium">{f.text}</span></div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-card p-8 rounded-2xl border border-[var(--border-muted)]">
                            <h2 className="text-xl font-bold mb-6">Request Your Demo</h2>
                            <form className="space-y-4" onSubmit={e => { e.preventDefault(); window.location.href = "/demo/confirmation"; }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="flex flex-col gap-1"><label className="text-sm font-bold text-[var(--text-muted)]">First Name *</label><input className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" placeholder="Jane" required /></div><div className="flex flex-col gap-1"><label className="text-sm font-bold text-[var(--text-muted)]">Last Name *</label><input className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" placeholder="Smith" required /></div></div>
                                <div className="flex flex-col gap-1"><label className="text-sm font-bold text-[var(--text-muted)]">Work Email *</label><input className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" type="email" placeholder="jane@myspabranch.com" required /></div>
                                <div className="flex flex-col gap-1"><label className="text-sm font-bold text-[var(--text-muted)]">Spa Branch Name</label><input className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" placeholder="Serenity Wellness Center" /></div>
                                <div className="flex flex-col gap-1"><label htmlFor="locations" className="text-sm font-bold text-[var(--text-muted)]">Number of Locations</label><select id="locations" title="Select Number of Locations" aria-label="Number of branch locations" className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3"><option>1 Location</option><option>2-5 Locations</option><option>6-20 Locations</option><option>20+ Locations</option></select></div>
                                <div className="flex flex-col gap-1"><label className="text-sm font-bold text-[var(--text-muted)]">What interests you most?</label><textarea className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" rows={3} placeholder="Tell us about your needs..." /></div>
                                <button type="submit" className="w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/30 flex items-center justify-center gap-2"><span className="material-symbols-outlined">calendar_month</span>Book My Free Demo</button>
                                <p className="text-xs text-[var(--text-muted)] text-center">By submitting, you agree to our Privacy Policy. No credit card required.</p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16 max-w-6xl mx-auto px-6">
                <h2 className="text-2xl font-bold mb-8 text-center">Trusted by 500+ Spa Branches Worldwide</h2>
                <div className="flex flex-wrap justify-center gap-8 opacity-40">{["Zenith Spa", "AquaLux", "Pure Wellness", "Nordic Steam", "Vitality Hub"].map(b => (<div key={b} className="text-lg font-bold tracking-wider uppercase">{b}</div>))}</div>
            </section>
        </main>
    );
}
