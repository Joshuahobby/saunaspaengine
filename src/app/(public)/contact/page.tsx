"use client";
import React from "react";

export default function ContactPage() {
    return (
        <main className="flex-1">
            <section className="py-16 lg:py-24 bg-gradient-to-br from-[var(--bg-app)] to-[var(--color-primary)]/5">
                <div className="max-w-6xl mx-auto px-6 text-center"><span className="material-symbols-outlined text-[var(--color-primary)] text-6xl mb-4">support_agent</span><h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">Get in Touch</h1><p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">Have a question or need help? Our global support team is here 24/7 to assist you.</p></div>
            </section>
            <section className="max-w-6xl mx-auto px-6 -mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
                {[
                    { icon: "mail", title: "Email Us", desc: "support@saunaspa.io", note: "Response within 2 hours" },
                    { icon: "call", title: "Call Us", desc: "+1 (800) SAUNA-01", note: "Mon-Fri, 9am-9pm EST" },
                    { icon: "chat", title: "Live Chat", desc: "Start a conversation", note: "Average wait: 30 seconds" },
                ].map(c => (
                    <div key={c.title} className="glass-card p-8 rounded-2xl border border-[var(--border-muted)] text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer group">
                        <div className="size-16 mx-auto bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)]/20 transition-colors"><span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">{c.icon}</span></div>
                        <h3 className="text-lg font-bold mb-2">{c.title}</h3>
                        <p className="font-medium text-[var(--color-primary)] mb-1">{c.desc}</p>
                        <p className="text-xs text-[var(--text-muted)]">{c.note}</p>
                    </div>
                ))}
            </section>
            <section className="max-w-3xl mx-auto px-6 mb-16">
                <div className="glass-card p-8 rounded-2xl border border-[var(--border-muted)]">
                    <h2 className="text-2xl font-bold mb-6 text-center">Send Us a Message</h2>
                    <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="flex flex-col gap-1"><label className="text-sm font-bold text-[var(--text-muted)]">Full Name *</label><input className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" placeholder="Jane Smith" /></div><div className="flex flex-col gap-1"><label className="text-sm font-bold text-[var(--text-muted)]">Email Address *</label><input className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" type="email" placeholder="jane@example.com" /></div></div>
                        <div className="flex flex-col gap-1"><label htmlFor="subject" className="text-sm font-bold text-[var(--text-muted)]">Subject</label><select id="subject" title="Select Inquiry Subject" aria-label="Select the subject of your inquiry" className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3"><option>General Inquiry</option><option>Technical Support</option><option>Billing</option><option>Feature Request</option><option>Partnership</option></select></div>
                        <div className="flex flex-col gap-1"><label className="text-sm font-bold text-[var(--text-muted)]">Message *</label><textarea className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-3" rows={5} placeholder="How can we help you?" /></div>
                        <button className="w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/30 flex items-center justify-center gap-2"><span className="material-symbols-outlined">send</span>Send Message</button>
                    </form>
                </div>
            </section>
            <section className="max-w-6xl mx-auto px-6 mb-16">
                <h2 className="text-2xl font-bold mb-8 text-center">Global Offices</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { city: "Helsinki, Finland", address: "123 Wellness Way, FI-00100", flag: "🇫🇮" },
                        { city: "New York, USA", address: "789 Fifth Avenue, NY 10022", flag: "🇺🇸" },
                        { city: "Kigali, Rwanda", address: "KG 15 Ave, Kicukiro", flag: "🇷🇼" },
                    ].map(o => (
                        <div key={o.city} className="p-6 bg-[var(--bg-surface-muted)]/10 rounded-xl border border-[var(--border-muted)]"><span className="text-3xl mb-2 block">{o.flag}</span><h4 className="font-bold mb-1">{o.city}</h4><p className="text-sm text-[var(--text-muted)]">{o.address}</p></div>
                    ))}
                </div>
            </section>
        </main>
    );
}
