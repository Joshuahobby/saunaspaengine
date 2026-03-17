"use client";
import React from "react";

const HISTORY = [
    { date: "Sep 15, 2023", desc: "Professional Plan - Monthly", amount: "$49.00", status: "Paid" },
    { date: "Aug 15, 2023", desc: "Professional Plan - Monthly", amount: "$49.00", status: "Paid" },
    { date: "Jul 15, 2023", desc: "Professional Plan - Monthly", amount: "$49.00", status: "Paid" },
];

export default function BillingPage() {
    return (
        <main className="flex flex-1 justify-center py-8">
            <div className="flex flex-col max-w-[1024px] flex-1 px-4 md:px-10">
                <div className="flex flex-wrap justify-between items-end gap-4 mb-8"><div><h1 className="text-4xl font-black tracking-tight">My Subscription</h1><p className="text-[var(--text-muted)]">Manage your Sauna SPA Engine plan, billing methods, and payment history.</p></div></div>
                <section className="mb-10">
                    <h2 className="text-xl font-bold mb-4">Current Plan</h2>
                    <div className="flex flex-col md:flex-row items-stretch glass-card border border-[var(--border-muted)] rounded-xl overflow-hidden">
                        <div className="md:w-1/3 bg-[var(--color-primary)]/10 flex items-center justify-center p-8"><div className="flex flex-col items-center text-center"><span className="material-symbols-outlined text-[var(--color-primary)] text-6xl mb-2">workspace_premium</span><p className="text-[var(--color-primary)] font-bold tracking-wider text-xs uppercase">Premium Tier</p></div></div>
                        <div className="flex-1 flex flex-col gap-4 p-6">
                            <div className="flex justify-between items-start"><div><span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:text-green-400 mb-2">ACTIVE</span><p className="text-2xl font-bold">Professional Branch Plan</p></div><button className="rounded-lg h-10 px-5 bg-[var(--color-primary)] text-white text-sm font-bold hover:opacity-90 transition-all">Change Plan</button></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[var(--border-muted)] pt-4"><div><p className="text-[var(--text-muted)] text-sm">Monthly Price</p><p className="text-lg font-bold">$49.00 <span className="text-sm font-normal text-[var(--text-muted)]">/ month</span></p></div><div><p className="text-[var(--text-muted)] text-sm">Next Billing Date</p><p className="text-lg font-bold italic">Oct 15, 2023</p></div></div>
                        </div>
                    </div>
                </section>
                <section className="mb-10">
                    <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Payment Methods</h2><button className="text-[var(--color-primary)] text-sm font-bold flex items-center gap-1 hover:underline"><span className="material-symbols-outlined text-lg">add_circle</span>Add New Method</button></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 flex items-center justify-between"><div className="flex items-center gap-4"><div className="size-12 rounded-lg bg-[var(--bg-card)] flex items-center justify-center border border-[var(--border-muted)]"><span className="material-symbols-outlined">credit_card</span></div><div><div className="flex items-center gap-2"><p className="font-bold">Visa ending in 4242</p><span className="bg-[var(--color-primary)] text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-black">Default</span></div><p className="text-[var(--text-muted)] text-sm">Expires 12/25</p></div></div><button className="text-[var(--text-muted)]"><span className="material-symbols-outlined">more_vert</span></button></div>
                        <div className="p-4 rounded-xl border border-[var(--border-muted)] glass-card flex items-center justify-between"><div className="flex items-center gap-4"><div className="size-12 rounded-lg bg-[var(--bg-card)] flex items-center justify-center border border-[var(--border-muted)]"><span className="material-symbols-outlined">smartphone</span></div><div><p className="font-bold">M-Pesa / Mobile Money</p><p className="text-[var(--text-muted)] text-sm">+254 •••• 123</p></div></div><button className="text-[var(--text-muted)]"><span className="material-symbols-outlined">more_vert</span></button></div>
                    </div>
                </section>
                <section className="mb-10">
                    <div className="flex justify-between items-center mb-4 px-1"><h2 className="text-xl font-bold">Billing History</h2><button className="text-[var(--text-muted)] text-sm font-medium hover:text-[var(--color-primary)] flex items-center gap-1"><span className="material-symbols-outlined text-lg">filter_list</span>Filter</button></div>
                    <div className="overflow-hidden rounded-xl border border-[var(--border-muted)] glass-card">
                        <table className="w-full text-left border-collapse"><thead className="bg-[var(--bg-surface-muted)]/10 border-b border-[var(--border-muted)]"><tr><th className="px-6 py-4 text-xs font-bold uppercase text-[var(--text-muted)]">Date</th><th className="px-6 py-4 text-xs font-bold uppercase text-[var(--text-muted)]">Description</th><th className="px-6 py-4 text-xs font-bold uppercase text-[var(--text-muted)] text-right">Amount</th><th className="px-6 py-4 text-xs font-bold uppercase text-[var(--text-muted)] text-center">Status</th><th className="px-6 py-4 text-xs font-bold uppercase text-[var(--text-muted)] text-right">Action</th></tr></thead><tbody className="divide-y divide-[var(--border-muted)]">{HISTORY.map(h => (<tr key={h.date} className="hover:bg-[var(--bg-surface-muted)]/10 transition-colors"><td className="px-6 py-4 text-sm font-medium">{h.date}</td><td className="px-6 py-4 text-sm text-[var(--text-muted)]">{h.desc}</td><td className="px-6 py-4 text-sm font-bold text-right">{h.amount}</td><td className="px-6 py-4 text-center"><span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:text-green-400">{h.status}</span></td><td className="px-6 py-4 text-right"><button className="text-[var(--color-primary)] hover:opacity-70 font-bold text-sm inline-flex items-center gap-1"><span className="material-symbols-outlined text-lg">download</span>Invoice</button></td></tr>))}</tbody></table>
                        <div className="p-4 border-t border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10 text-center"><button className="text-[var(--color-primary)] text-sm font-bold hover:underline">View All History</button></div>
                    </div>
                </section>
                <section className="mt-8 p-6 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 flex items-start gap-4"><span className="material-symbols-outlined text-orange-500">info</span><div><p className="text-orange-800 dark:text-orange-400 font-bold mb-1">Need to cancel your subscription?</p><p className="text-orange-700 dark:text-orange-500 text-sm leading-relaxed">You can cancel your subscription at any time. Your plan will remain active until the end of the current billing cycle.</p></div></section>
            </div>
        </main>
    );
}
