"use client";

import React, { useState } from "react";
import Link from "next/link";

const PLANS = [
    {
        name: "Basic",
        monthly: "50,000",
        annual: "40,000",
        desc: "Perfect for boutique spas and single locations starting their digital journey.",
        cta: "Start Free Trial",
        ctaStyle: "bg-[var(--bg-surface-muted)]/50 text-[var(--text-main)] hover:bg-[var(--color-primary)]/20",
        features: [
            { text: "Up to 5 Employees", included: true },
            { text: "500 QR Scans /mo", included: true },
            { text: "1 Branch Location", included: true },
            { text: "Advanced Analytics", included: false },
        ],
        popular: false,
    },
    {
        name: "Pro",
        monthly: "150,000",
        annual: "120,000",
        desc: "Our most comprehensive plan for growing branches with multiple teams.",
        cta: "Start Free Trial",
        ctaStyle: "bg-[var(--color-primary)] text-[var(--bg-app)] hover:opacity-90",
        features: [
            { text: "Unlimited Employees", included: true },
            { text: "Unlimited QR Scans", included: true },
            { text: "Multi-Branch Support", included: true },
            { text: "Advanced Analytics", included: true },
        ],
        popular: true,
    },
    {
        name: "Enterprise",
        monthly: null,
        annual: null,
        desc: "Bespoke solutions for large-scale spa chains and wellness centers.",
        cta: "Contact Sales",
        ctaStyle: "bg-[var(--text-main)] text-white dark:bg-[var(--color-primary)]/20 dark:text-[var(--color-primary)] hover:opacity-90",
        features: [
            { text: "Custom Branch Limits", included: true },
            { text: "Priority 24/7 Support", included: true },
            { text: "Audit Logs & Security", included: true },
            { text: "Dedicated Manager", included: true },
        ],
        popular: false,
    },
];

const COMPARISON = [
    { section: "Usage Limits", rows: [
        { feature: "Monthly QR Scans", basic: "500", pro: "Unlimited", enterprise: "Unlimited" },
        { feature: "Staff Accounts", basic: "Up to 5", pro: "Unlimited", enterprise: "Unlimited" },
        { feature: "Branch Locations", basic: "1", pro: "Up to 5", enterprise: "Unlimited" },
    ]},
    { section: "Platform Capabilities", rows: [
        { feature: "Booking Management", basic: true, pro: true, enterprise: true },
        { feature: "Multi-Branch Sync", basic: false, pro: true, enterprise: true },
        { feature: "Custom Reporting", basic: false, pro: true, enterprise: true },
        { feature: "API Access", basic: false, pro: "Basic", enterprise: "Full" },
    ]},
    { section: "Payments & Security", rows: [
        { feature: "Mobile Money (MTN/Airtel)", basic: true, pro: true, enterprise: true },
        { feature: "Audit Logs", basic: false, pro: false, enterprise: true },
        { feature: "SLA Guarantee", basic: false, pro: false, enterprise: "99.99%" },
        { feature: "Priority Support", basic: false, pro: false, enterprise: true },
    ]},
];

const FAQS = [
    { q: "Can I upgrade or downgrade my plan?", a: "Yes, you can change your plan at any time. If you upgrade, the new pricing is prorated. If you downgrade, your new rate starts at the next billing cycle." },
    { q: "What happens after my 14-day free trial?", a: "At the end of your trial, you'll be prompted to select a plan and provide payment details. Your data will be preserved so you can pick up where you left off." },
    { q: "What payment methods do you accept?", a: "We accept MTN MoMo, Airtel Money, bank transfers, and cash payments for annual plans." },
];

function renderCell(val: boolean | string) {
    if (val === true) return <span className="material-symbols-outlined text-[var(--color-primary)]">check</span>;
    if (val === false) return <span className="text-[var(--text-muted)] opacity-30">—</span>;
    return <span className="text-sm font-bold">{val}</span>;
}

export default function PricingPage() {
    const [billing, setBilling] = useState<"monthly" | "annual">("annual");

    return (
        <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)]">
            {/* Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-[var(--border-muted)] px-6 lg:px-10 py-3 bg-[var(--bg-app)]">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">spa</span>
                    <h2 className="text-lg font-bold tracking-tight">Sauna SPA Engine</h2>
                </div>
                <div className="flex items-center gap-4">
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium hover:text-[var(--color-primary)] transition-colors">Features</Link>
                        <span className="text-[var(--color-primary)] text-sm font-bold">Pricing</span>
                        <Link href="/case-studies" className="text-sm font-medium hover:text-[var(--color-primary)] transition-colors">Case Studies</Link>
                    </nav>
                    <div className="flex gap-2">
                        <Link href="/login" className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--bg-app)] text-sm font-bold hover:opacity-90 transition-opacity">Get Started</Link>
                        <Link href="/login" className="px-4 py-2 rounded-lg bg-[var(--bg-surface-muted)]/50 text-sm font-bold hover:bg-[var(--color-primary)]/20 transition-colors">Login</Link>
                    </div>
                </div>
            </header>

            <main className="flex flex-1 flex-col items-center py-12 px-4 md:px-20 lg:px-40">
                {/* Header Section */}
                <div className="max-w-[960px] w-full text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">Choose the plan that&apos;s right for your sauna or spa branch operations. All prices in RWF.</p>
                    {/* Toggle */}
                    <div className="flex justify-center mt-10">
                        <div className="flex h-12 w-full max-w-sm items-center justify-center rounded-xl bg-[var(--bg-surface-muted)]/30 p-1.5 border border-[var(--border-muted)]">
                            <button onClick={() => setBilling("monthly")} className={`flex-1 h-full rounded-lg px-4 text-sm font-bold transition-all ${billing === "monthly" ? "bg-[var(--bg-card)] shadow-sm text-[var(--text-main)]" : "text-[var(--text-muted)]"}`}>Monthly</button>
                            <button onClick={() => setBilling("annual")} className={`flex-1 h-full rounded-lg px-4 text-sm font-bold transition-all flex items-center justify-center gap-2 ${billing === "annual" ? "bg-[var(--bg-card)] shadow-sm text-[var(--text-main)]" : "text-[var(--text-muted)]"}`}>
                                Annual <span className="text-[10px] bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-2 py-0.5 rounded-full uppercase tracking-wider">-20%</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1100px] mb-20">
                    {PLANS.map((plan) => (
                        <div key={plan.name} className={`flex flex-col gap-6 rounded-xl p-8 transition-shadow ${plan.popular ? "relative border-2 border-[var(--color-primary)] bg-[var(--bg-card)] shadow-2xl scale-105 z-10" : "border border-[var(--border-muted)] bg-[var(--bg-card)] hover:shadow-xl"}`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-[var(--bg-app)] text-[11px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-lg">Most Popular</div>
                            )}
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[var(--color-primary)] text-sm font-bold uppercase tracking-widest">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black leading-tight tracking-tight">{plan.monthly ? `${billing === "annual" ? plan.annual : plan.monthly}` : "Custom"}</span>
                                    {plan.monthly && <span className="text-base font-medium opacity-70">RWF/mo</span>}
                                </div>
                                <p className="text-[var(--text-muted)] text-sm mt-2 leading-relaxed">{plan.desc}</p>
                            </div>
                            <button className={`w-full flex items-center justify-center rounded-lg h-12 px-4 text-sm font-bold transition-all ${plan.ctaStyle}`}>{plan.cta}</button>
                            <div className="flex flex-col gap-4 mt-2">
                                {plan.features.map((f) => (
                                    <div key={f.text} className={`text-sm font-medium flex gap-3 ${f.included ? "" : "opacity-50 line-through"}`}>
                                        <span className={`material-symbols-outlined text-xl ${f.included ? "text-[var(--color-primary)]" : ""}`}>{f.included ? "check_circle" : "block"}</span>
                                        {f.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Feature Comparison */}
                <div className="w-full max-w-[1100px] mb-20 overflow-x-auto">
                    <h2 className="text-3xl font-black leading-tight tracking-tight mb-8 text-center">Detailed Feature Comparison</h2>
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-[var(--border-muted)]">
                                <th className="py-6 px-4 text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest w-1/4">Features</th>
                                <th className="py-6 px-4 text-base font-bold text-center">Basic</th>
                                <th className="py-6 px-4 text-base font-bold text-center bg-[var(--color-primary)]/5">Pro</th>
                                <th className="py-6 px-4 text-base font-bold text-center">Enterprise</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {COMPARISON.map((section) => (
                                <React.Fragment key={section.section}>
                                    <tr className="bg-[var(--bg-surface-muted)]/10">
                                        <td className="py-3 px-4 text-[11px] font-black uppercase text-[var(--color-primary)] tracking-[0.2em]" colSpan={4}>{section.section}</td>
                                    </tr>
                                    {section.rows.map((row) => (
                                        <tr key={row.feature}>
                                            <td className="py-5 px-4 text-sm font-medium">{row.feature}</td>
                                            <td className="py-5 px-4 text-center">{renderCell(row.basic)}</td>
                                            <td className="py-5 px-4 text-center bg-[var(--color-primary)]/5">{renderCell(row.pro)}</td>
                                            <td className="py-5 px-4 text-center">{renderCell(row.enterprise)}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* FAQ */}
                <div className="w-full max-w-[800px] mb-20">
                    <h2 className="text-2xl font-black mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {FAQS.map((faq) => (
                            <div key={faq.q} className="p-6 rounded-lg bg-[var(--bg-card)] border border-[var(--border-muted)]">
                                <h4 className="font-bold mb-2">{faq.q}</h4>
                                <p className="text-sm text-[var(--text-muted)]">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="w-full max-w-[960px] bg-[var(--color-primary)] rounded-2xl p-10 md:p-16 text-center text-[var(--bg-app)] overflow-hidden relative">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to fuel your spa engine?</h2>
                        <p className="text-lg mb-8 opacity-80 font-medium">Join wellness branches across Rwanda optimizing their operations daily.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/login" className="bg-[var(--bg-app)] text-[var(--text-main)] px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all">Get Started Now</Link>
                            <Link href="/demo" className="bg-white/30 backdrop-blur-md px-8 py-4 rounded-xl font-bold border border-[var(--bg-app)]/10 hover:bg-white/50 transition-all">Schedule a Demo</Link>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--bg-app)]/5 rounded-full -ml-20 -mb-20 blur-3xl"></div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-[var(--border-muted)] py-12 px-10">
                <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--color-primary)]">spa</span>
                        <span className="font-bold">Sauna SPA Engine</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">© 2026 Sauna SPA Engine. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
