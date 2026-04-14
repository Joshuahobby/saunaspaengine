"use client";

import React from "react";

export function DemoForm() {
    return (
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); window.location.href = "/demo/confirmation"; }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-[var(--text-muted)]">First Name *</label>
                    <input className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" placeholder="Jean" required />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-[var(--text-muted)]">Last Name *</label>
                    <input className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" placeholder="Mugabo" required />
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-[var(--text-muted)]">Work Email *</label>
                <input className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" type="email" placeholder="jean@myspa.rw" required />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-[var(--text-muted)]">Phone (WhatsApp preferred)</label>
                <input className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" type="tel" placeholder="+250 7XX XXX XXX" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-[var(--text-muted)]">Spa / Business Name</label>
                <input className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" placeholder="e.g. Inzozi Wellness Center" />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="locations" className="text-sm font-bold text-[var(--text-muted)]">Number of Locations</label>
                <select id="locations" title="Select Number of Locations" aria-label="Number of branch locations" className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3">
                    <option>1 Location</option>
                    <option>2-5 Locations</option>
                    <option>6-20 Locations</option>
                    <option>20+ Locations</option>
                </select>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-[var(--text-muted)]">What interests you most?</label>
                <textarea className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" rows={3} placeholder="Tell us about your needs..." />
            </div>
            <button type="submit" className="w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/30 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">calendar_month</span>
                Book My Free Demo
            </button>
            <p className="text-xs text-[var(--text-muted)] text-center">By submitting, you agree to our Privacy Policy. No credit card required.</p>
        </form>
    );
}
