"use client";

import React from "react";

export function ContactForm() {
    return (
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-[var(--text-muted)]">Full Name *</label>
                    <input className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" placeholder="Jean Pierre" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-[var(--text-muted)]">Email Address *</label>
                    <input className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" type="email" placeholder="jean@example.com" />
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="subject" className="text-sm font-bold text-[var(--text-muted)]">Subject</label>
                <select id="subject" title="Select Inquiry Subject" aria-label="Select the subject of your inquiry" className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Billing &amp; Mobile Money</option>
                    <option>Feature Request</option>
                    <option>Partnership</option>
                </select>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-[var(--text-muted)]">Message *</label>
                <textarea className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" rows={5} placeholder="How can we help you?" />
            </div>
            <button className="w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/30 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">send</span>Send Message
            </button>
        </form>
    );
}
