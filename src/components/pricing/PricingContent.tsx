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

function renderCell(val: boolean | string) {
    if (val === true) return <span className="material-symbols-outlined text-[var(--color-primary)]">check</span>;
    if (val === false) return <span className="text-[var(--text-muted)] opacity-30">—</span>;
    return <span className="text-sm font-bold">{val}</span>;
}

export function PricingContent() {
    const [billing, setBilling] = useState<"monthly" | "annual">("annual");

    return (
        <div className="w-full flex flex-col items-center">
            {/* Toggle */}
            <div className="flex justify-center mb-16">
                <div className="flex h-12 w-full max-w-sm items-center justify-center rounded-xl bg-[var(--bg-surface-muted)]/30 p-1.5 border border-[var(--border-muted)]">
                    <button onClick={() => setBilling("monthly")} className={`flex-1 h-full rounded-lg px-4 text-sm font-bold transition-all ${billing === "monthly" ? "bg-[var(--bg-card)] shadow-sm text-[var(--text-main)]" : "text-[var(--text-muted)]"}`}>Monthly</button>
                    <button onClick={() => setBilling("annual")} className={`flex-1 h-full rounded-lg px-4 text-sm font-bold transition-all flex items-center justify-center gap-2 ${billing === "annual" ? "bg-[var(--bg-card)] shadow-sm text-[var(--text-main)]" : "text-[var(--text-muted)]"}`}>
                        Annual <span className="text-[10px] bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-2 py-0.5 rounded-full uppercase tracking-wider">-20%</span>
                    </button>
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
        </div>
    );
}
