"use client";
import React from "react";

const OVERRIDES = [
    { category: "Massage Therapy", rate: "8.0%", status: "Active", statusColor: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" },
    { category: "Retail Products", rate: "20.0%", status: "Active", statusColor: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" },
    { category: "Membership Fees", rate: "0.0%", status: "Tax Exempt", statusColor: "bg-[var(--bg-surface-muted)]/50 text-[var(--text-muted)]" },
];

export default function TaxSettingsPage() {
    return (
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
                <div><nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2"><span>Settings</span><span>/</span><span className="text-[var(--text-main)]">Tax &amp; Fiscal Configuration</span></nav><h1 className="text-3xl font-black tracking-tight">Tax &amp; Fiscal Configuration</h1><p className="text-[var(--text-muted)]">Configure how your spa handles taxation, fiscal reporting, and digital receipt compliance.</p></div>
                <section className="glass-card rounded-xl border border-[var(--border-muted)] p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-2 border-b border-[var(--border-muted)] pb-4"><span className="material-symbols-outlined text-[var(--color-primary)]">info</span><h2 className="text-xl font-bold">General Tax Information</h2></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2"><label htmlFor="tax-id" className="text-sm font-bold text-[var(--text-muted)]">Business Tax ID</label><input id="tax-id" className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] px-4 py-2" defaultValue="US-987654321-VAT" /><p className="text-xs text-[var(--text-muted)]">Publicly visible on your invoices and receipts.</p></div>
                        <div className="flex flex-col gap-2"><label htmlFor="tax-label" className="text-sm font-bold text-[var(--text-muted)]">Tax Label</label><input id="tax-label" className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] px-4 py-2" defaultValue="VAT" /><p className="text-xs text-[var(--text-muted)]">The term displayed for tax on the customer side.</p></div>
                        <div className="flex flex-col gap-2"><label htmlFor="tax-rate" className="text-sm font-bold text-[var(--text-muted)]">Default Tax Rate (%)</label><div className="relative"><input id="tax-rate" className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] px-4 py-2 pr-10" type="number" defaultValue="15.0" /><span className="absolute right-4 top-2 text-[var(--text-muted)]">%</span></div><p className="text-xs text-[var(--text-muted)]">Default rate applied to all services and products.</p></div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="tax-basis" className="text-sm font-bold text-[var(--text-muted)]">Tax Basis</label>
                            <select 
                                id="tax-basis"
                                title="Tax Basis Calculation Mode"
                                aria-label="Select tax basis calculation mode"
                                className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] px-4 py-2"
                            >
                                <option>Net Price (Exclude Tax)</option>
                                <option>Gross Price (Include Tax)</option>
                            </select>
                            <p className="text-xs text-[var(--text-muted)]">How prices are calculated and shown in the POS.</p>
                        </div>
                    </div>
                </section>
                <section className="glass-card rounded-xl border border-[var(--border-muted)] overflow-hidden">
                    <div className="p-6 border-b border-[var(--border-muted)] flex justify-between items-center"><div className="flex items-center gap-2"><span className="material-symbols-outlined text-[var(--color-primary)]">table_rows</span><h2 className="text-xl font-bold">Service-Specific Tax Overrides</h2></div><button className="flex items-center gap-1 text-sm font-bold text-[var(--color-primary)] hover:underline"><span className="material-symbols-outlined text-lg">add_circle</span>Add Override</button></div>
                    <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-[var(--bg-surface-muted)]/10 text-[var(--text-muted)] text-sm uppercase tracking-wider"><tr><th className="px-6 py-4 font-bold">Category</th><th className="px-6 py-4 font-bold">Override Rate (%)</th><th className="px-6 py-4 font-bold">Status</th><th className="px-6 py-4 font-bold text-right">Actions</th></tr></thead><tbody className="divide-y divide-[var(--border-muted)]">{OVERRIDES.map(o => (<tr key={o.category} className="hover:bg-[var(--bg-surface-muted)]/10 transition-colors"><td className="px-6 py-4 font-medium">{o.category}</td><td className="px-6 py-4">{o.rate}</td><td className="px-6 py-4"><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${o.statusColor}`}>{o.status}</span></td><td className="px-6 py-4 text-right"><button className="text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors"><span className="material-symbols-outlined">edit</span></button></td></tr>))}</tbody></table></div>
                </section>
                <section className="glass-card rounded-xl border border-[var(--border-muted)] p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-2 border-b border-[var(--border-muted)] pb-4"><span className="material-symbols-outlined text-[var(--color-primary)]">description</span><h2 className="text-xl font-bold">Legal Receipt Configuration</h2></div>
                    <div className="flex flex-col gap-2"><label htmlFor="legal-info" className="text-sm font-bold text-[var(--text-muted)]">Legal Header/Footer Information</label><textarea id="legal-info" className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] px-4 py-2" rows={4} defaultValue="Sauna SPA Engine Ltd. 123 Wellness Way, Helsinki, Finland. Registered Business: 2024-HEALTH-001. All prices include applicable VAT." /><p className="text-xs text-[var(--text-muted)]">This text will appear at the bottom of all digital and printed receipts.</p></div>
                    <div className="flex items-center justify-between p-4 bg-[var(--bg-surface-muted)]/10 rounded-lg"><div><span className="text-sm font-bold">Enable Digital Signing</span><p className="text-xs text-[var(--text-muted)]">Automatically cryptographically sign every receipt for fiscal authorities.</p></div><div className="w-11 h-6 bg-[var(--color-primary)] rounded-full relative cursor-pointer"><div className="absolute top-0.5 right-0.5 size-5 bg-white rounded-full shadow-sm"></div></div></div>
                </section>
                <div className="p-6 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-xl flex gap-4"><span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">verified_user</span><div><h4 className="font-bold">Fiscal Compliance Verified</h4><p className="text-sm text-[var(--text-muted)] leading-relaxed">Your current settings meet the standard requirements for North American and EU digital receipting.</p></div></div>
                <div className="flex items-center justify-end gap-4 pb-10"><button className="px-6 py-2.5 rounded-lg border border-[var(--border-muted)] font-bold hover:bg-[var(--bg-surface-muted)]/50 transition-colors">Discard Changes</button><button className="px-8 py-2.5 rounded-lg bg-[var(--color-primary)] text-[var(--bg-app)] font-bold hover:opacity-90 shadow-lg shadow-[var(--color-primary)]/20 transition-all">Update Fiscal Profile</button></div>
            </div>
        </main>
    );
}
