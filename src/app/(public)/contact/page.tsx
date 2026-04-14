import React from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ContactForm } from "@/components/forms/ContactForm";

export default function ContactPage() {
    return (
        <PublicLayout>
            <main className="flex-1">
                <section className="py-16 lg:py-24 bg-gradient-to-br from-[var(--bg-app)] to-[var(--color-primary)]/5">
                    <div className="max-w-6xl mx-auto px-6 text-center">
                        <span className="material-symbols-outlined text-[var(--color-primary)] text-6xl mb-4">support_agent</span>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">Get in Touch</h1>
                        <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">Have a question or need help? Our Kigali-based team is here to assist you during business hours.</p>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-6 -mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
                    {[
                        { icon: "mail", title: "Email Us", desc: "hello@saunaspa.rw", note: "Response within 24 hours", href: "mailto:hello@saunaspa.rw" },
                        { icon: "call", title: "Call Us", desc: "+250 793 895 236", note: "Mon-Fri, 8am-6pm CAT", href: "tel:+250793895236" },
                        { icon: "chat", title: "WhatsApp", desc: "Start a conversation", note: "Quick replies during business hours", href: "https://wa.me/250793895236" },
                    ].map(c => (
                        <a key={c.title} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined} className="glass-card p-8 rounded-2xl border border-[var(--border-muted)] text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer group block">
                            <div className="size-16 mx-auto bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)]/20 transition-colors">
                                <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">{c.icon}</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">{c.title}</h3>
                            <p className="font-medium text-[var(--color-primary)] mb-1">{c.desc}</p>
                            <p className="text-xs text-[var(--text-muted)]">{c.note}</p>
                        </a>
                    ))}
                </section>

                <section className="max-w-3xl mx-auto px-6 mb-16">
                    <div className="glass-card p-8 rounded-2xl border border-[var(--border-muted)]">
                        <h2 className="text-2xl font-bold mb-6 text-center">Send Us a Message</h2>
                        <ContactForm />
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-6 mb-16">
                    <h2 className="text-2xl font-bold mb-8 text-center">Our Office</h2>
                    <div className="max-w-md mx-auto">
                        <div className="p-6 bg-[var(--bg-surface-muted)]/10 rounded-xl border border-[var(--border-muted)] text-center">
                            <span className="text-3xl mb-2 block">🇷🇼</span>
                            <h4 className="font-bold mb-1">Kigali, Rwanda</h4>
                            <p className="text-sm text-[var(--text-muted)]">KG 15 Ave, Kicukiro</p>
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--bg-app)] text-center">
                    <div className="max-w-2xl mx-auto px-6">
                        <h2 className="text-2xl font-bold mb-4">Prefer WhatsApp?</h2>
                        <p className="text-[var(--text-muted)] mb-6">Most of our clients reach us directly on WhatsApp for the fastest response.</p>
                        <a href="https://wa.me/250793895236" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg">
                            <span className="material-symbols-outlined">chat</span>
                            Chat on WhatsApp
                        </a>
                    </div>
                </section>

                <div className="max-w-6xl mx-auto px-6 py-8 flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 text-[var(--color-primary)] text-sm font-bold hover:underline">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Home
                    </Link>
                    <span className="text-[var(--border-muted)]">•</span>
                    <Link href="/support" className="text-[var(--text-muted)] text-sm hover:text-[var(--color-primary)] transition-colors">Help Center</Link>
                    <Link href="/privacy" className="text-[var(--text-muted)] text-sm hover:text-[var(--color-primary)] transition-colors">Privacy</Link>
                </div>
            </main>
        </PublicLayout>
    );
}
