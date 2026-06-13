"use client";
import React, { useState } from "react";

const ROWS = [
    { id: "#452", name: "Marcus Sterling", email: "m.sterling@domain", phone: "+1 555-0102", plan: "Pro Sauna Plus", error: "Invalid Email Format", errorIcon: "error", editing: false },
    { id: "#501", name: "Sarah Jenkins", email: "s.jenkins@gmail.com", phone: "000-000-0000", plan: "Deluxe Spa", error: "Invalid Phone Number", errorIcon: "call", editing: true },
    { id: "#523", name: "David Miller", email: "david@miller-spa.com", phone: "+1 415-555-1234", plan: "Basic Entry", error: "Duplicate Email", errorIcon: "content_copy", editing: false },
    { id: "#612", name: "Elena Rodriguez", email: "elena.r@cloud.net", phone: "555-098-7654", plan: "N/A", error: "Missing Required Field", errorIcon: "block", editing: false },
    { id: "#689", name: "Tom H. Thompson", email: "tom.t@outlook.com", phone: "111-222-3333", plan: "Premium Plus", error: "Unknown Plan ID", errorIcon: "inventory_2", editing: false },
];

export default function ImportErrorsPage() {
    const [editingId, setEditingId] = useState<string | null>("#501");

    return (
        <main className="flex-1 flex flex-col min-w-0">
            <div className="flex flex-wrap items-center gap-2 p-6 pb-0 text-sm text-[var(--text-muted)]">
                <span>Data Migration</span><span className="material-symbols-outlined text-xs">chevron_right</span><span>Import Session #842</span><span className="material-symbols-outlined text-xs">chevron_right</span><span className="text-[var(--text-main)] font-semibold">Import Error Management</span>
            </div>
            <div className="flex flex-wrap justify-between items-end gap-4 p-6">
                <div><h1 className="text-3xl font-black tracking-tight">Import Error Management</h1><p className="text-[var(--text-muted)]">Resolve 24 failed rows to complete your data migration from &quot;Mindbody_Export_July.csv&quot;.</p></div>
                <div className="flex gap-3">
                    <button className="flex items-center justify-center rounded-lg h-10 px-4 border border-[var(--border-muted)] font-bold text-sm hover:bg-[var(--bg-surface-muted)]/50 transition-colors"><span className="material-symbols-outlined mr-2 text-lg">download</span>Export Error Log</button>
                    <button className="flex items-center justify-center rounded-lg h-10 px-6 bg-[var(--color-primary)] text-[var(--bg-app)] font-bold text-sm shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90 transition-all"><span className="material-symbols-outlined mr-2 text-lg">sync</span>Re-import Corrected Rows</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 mb-6">
                <div className="flex flex-col gap-1 rounded-xl p-5 border border-[var(--border-muted)] glass-card"><p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider">Total Rows</p><div className="flex items-baseline gap-2"><p className="text-2xl font-black">1,250</p><span className="text-xs text-[var(--text-muted)]">Records processed</span></div></div>
                <div className="flex flex-col gap-1 rounded-xl p-5 border-2 border-red-500/20 bg-red-50/50 dark:bg-red-900/10"><p className="text-red-500 text-xs font-bold uppercase tracking-wider">Failed Rows</p><div className="flex items-baseline gap-2"><p className="text-2xl font-black text-red-600 dark:text-red-400">24</p><span className="text-xs text-red-500/60">Requires attention</span></div></div>
                <div className="flex flex-col gap-1 rounded-xl p-5 border border-[var(--border-muted)] glass-card"><p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider">Success Rate</p><div className="flex items-baseline gap-2"><p className="text-2xl font-black text-[var(--color-primary)]">98.1%</p><div className="w-16 h-1.5 bg-[var(--bg-surface-muted)]/30 rounded-full overflow-hidden"><div className="bg-[var(--color-primary)] h-full w-[98%]"></div></div></div></div>
            </div>
            <div className="flex-1 px-6 pb-6 overflow-hidden">
                <div className="h-full border border-[var(--border-muted)] rounded-xl glass-card overflow-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="sticky top-0 bg-[var(--bg-surface-muted)]/20 z-10"><tr className="border-b border-[var(--border-muted)]"><th className="px-4 py-4 text-xs font-bold uppercase text-[var(--text-muted)] w-12">ID</th><th className="px-4 py-4 text-xs font-bold uppercase text-[var(--text-muted)]">Full Name</th><th className="px-4 py-4 text-xs font-bold uppercase text-[var(--text-muted)]">Email Address</th><th className="px-4 py-4 text-xs font-bold uppercase text-[var(--text-muted)]">Phone</th><th className="px-4 py-4 text-xs font-bold uppercase text-[var(--text-muted)]">Service Plan</th><th className="px-4 py-4 text-xs font-bold uppercase text-red-500">Error Reason</th><th className="px-4 py-4 text-xs font-bold uppercase text-[var(--text-muted)] text-right">Actions</th></tr></thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {ROWS.map(r => (
                                <tr key={r.id} className={editingId === r.id ? "bg-[var(--color-primary)]/5 border-l-4 border-[var(--color-primary)]" : "hover:bg-[var(--bg-surface-muted)]/10 transition-colors"}>
                                    <td className="px-4 py-4 text-sm text-[var(--text-muted)]">{r.id}</td>
                                    <td className="px-4 py-4">{editingId === r.id ? <input title="Edit Name" aria-label="Edit name for this row" className="w-full h-8 rounded border-[var(--border-muted)] bg-[var(--bg-app)] text-sm focus:ring-[var(--color-primary)]" defaultValue={r.name} /> : <span className="text-sm font-medium">{r.name}</span>}</td>
                                    <td className="px-4 py-4">{editingId === r.id ? <input title="Edit Email" aria-label="Edit email for this row" className="w-full h-8 rounded border-[var(--border-muted)] bg-[var(--bg-app)] text-sm focus:ring-[var(--color-primary)]" defaultValue={r.email} /> : <span className="text-sm">{r.email}</span>}</td>
                                    <td className="px-4 py-4">{editingId === r.id ? <input title="Edit Phone" aria-label="Edit phone for this row" className="w-full h-8 rounded border-red-500 bg-[var(--bg-app)] text-sm focus:ring-red-500" defaultValue={r.phone} /> : <span className="text-sm">{r.phone}</span>}</td>
                                    <td className="px-4 py-4 text-sm">{r.plan}</td>
                                    <td className="px-4 py-4"><span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 w-fit"><span className="material-symbols-outlined text-sm">{r.errorIcon}</span>{r.error}</span></td>
                                    <td className="px-4 py-4 text-right">
                                        {editingId === r.id ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setEditingId(null)} className="text-[var(--text-muted)] text-xs font-bold">Cancel</button>
                                                <button onClick={() => setEditingId(null)} className="bg-[var(--color-primary)] text-[var(--bg-app)] px-3 py-1 rounded text-xs font-bold">Save</button>
                                            </div>
                                        ) : <button onClick={() => setEditingId(r.id)} className="text-[var(--color-primary)] hover:underline text-sm font-bold">Edit Row</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="p-6 pt-0 flex justify-between items-center text-sm text-[var(--text-muted)]">
                <p>Showing 5 of 24 errors</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1 rounded border border-[var(--border-muted)] opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 rounded bg-[var(--color-primary)]/20 font-bold border border-[var(--color-primary)]/30">1</button>
                    <button className="px-3 py-1 rounded border border-[var(--border-muted)] hover:bg-[var(--bg-surface-muted)]/50">2</button>
                    <button className="px-3 py-1 rounded border border-[var(--border-muted)] hover:bg-[var(--bg-surface-muted)]/50">Next</button>
                </div>
            </div>
        </main>
    );
}
