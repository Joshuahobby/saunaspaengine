"use client";
import React, { useState } from "react";

const CATEGORIES = [
    { id: "clients", label: "Full Client List", desc: "Profiles, contact details, and preferences.", checked: true },
    { id: "transactions", label: "Transaction History", desc: "Invoices, payments, and refunds.", checked: true },
    { id: "employees", label: "Employee Records", desc: "Payroll, schedules, and performance.", checked: false },
    { id: "audit", label: "Audit Logs", desc: "System access and modification history.", checked: false },
    { id: "inventory", label: "Inventory & Stock", desc: "Products, equipment, and supply chains.", checked: false },
    { id: "marketing", label: "Marketing Analytics", desc: "Campaign performance and customer opt-ins.", checked: false },
];
const FORMATS = ["CSV", "XLSX", "PDF", "JSON"];
const EXPORTS = [
    { name: "Full_Clients_Export_Q3.csv", date: "Oct 24, 10:15 AM", size: "14.2 MB", status: "Ready", statusColor: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
    { name: "Transactions_All_2023.xlsx", date: "Oct 25, 08:30 AM", size: null, status: "Processing", statusColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", progress: 65 },
    { name: "Audit_Logs_Sept.json", date: "Sep 15, 02:45 PM", size: null, status: "Expired", statusColor: "bg-[var(--bg-surface-muted)]/50 text-[var(--text-muted)]", expired: true },
];

export default function DataExportPage() {
    const [format, setFormat] = useState("CSV");
    const [cats, setCats] = useState(CATEGORIES);
    const toggle = (id: string) => setCats(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));

    return (
        <main className="flex-1 p-6 lg:p-8 max-w-6xl mx-auto w-full">
            <nav className="flex items-center gap-2 mb-6 text-sm text-[var(--text-muted)]"><span>Settings</span><span className="material-symbols-outlined text-xs">chevron_right</span><span className="text-[var(--color-primary)] font-medium">Data Export & Portability</span></nav>
            <div className="flex flex-wrap justify-between items-start gap-4 mb-10">
                <div><h1 className="text-3xl font-black tracking-tight mb-2">Data Export & Portability Center</h1><p className="text-[var(--text-muted)] text-lg">Request bulk data downloads for portability, audits, and GDPR compliance.</p></div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-surface-muted)]/50 rounded-lg font-bold text-sm hover:bg-[var(--bg-surface-muted)] transition-colors"><span className="material-symbols-outlined text-sm">policy</span>View GDPR Policy</button>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 flex flex-col gap-8">
                    <section className="glass-card p-6 border border-[var(--border-muted)]">
                        <div className="flex items-center gap-2 mb-6"><span className="bg-[var(--color-primary)] text-white text-xs font-bold rounded-full size-6 flex items-center justify-center">1</span><h2 className="text-xl font-bold">Select Data Categories</h2></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cats.map(c => (
                                <label key={c.id} onClick={() => toggle(c.id)} className={`relative flex cursor-pointer rounded-lg border p-4 hover:border-[var(--color-primary)] transition-all ${c.checked ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-[var(--border-muted)]"}`}>
                                    <input checked={c.checked} readOnly className="h-5 w-5 rounded border-[var(--border-muted)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" />
                                    <div className="ml-3"><span className="block text-sm font-bold">{c.label}</span><span className="block text-xs text-[var(--text-muted)]">{c.desc}</span></div>
                                </label>
                            ))}
                        </div>
                    </section>
                    <section className="glass-card p-6 border border-[var(--border-muted)]">
                        <div className="flex items-center gap-2 mb-6"><span className="bg-[var(--color-primary)] text-white text-xs font-bold rounded-full size-6 flex items-center justify-center">2</span><h2 className="text-xl font-bold">Select Export Format</h2></div>
                        <div className="flex flex-wrap gap-4">
                            {FORMATS.map(f => (
                                <button key={f} onClick={() => setFormat(f)} className={`flex-1 min-w-[120px] flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${format === f ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10"}`}>
                                    <span className={`material-symbols-outlined text-3xl mb-1 ${format === f ? "text-[var(--color-primary)]" : "text-[var(--text-muted)]"}`}>{f === "CSV" ? "csv" : f === "PDF" ? "picture_as_pdf" : f === "JSON" ? "code" : "description"}</span>
                                    <span className="text-sm font-bold uppercase">{f}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                    <div className="flex items-center justify-between p-6 bg-[var(--color-primary)]/10 rounded-xl border border-[var(--color-primary)]/20">
                        <div className="flex items-center gap-3"><span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">info</span><div><p className="font-bold">Security Verification Required</p><p className="text-[var(--text-muted)] text-sm">Large exports may require up to 24 hours to process.</p></div></div>
                        <button className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-lg font-black text-lg shadow-lg shadow-[var(--color-primary)]/30 hover:opacity-90 transition-all flex items-center gap-2"><span className="material-symbols-outlined">data_saver_on</span>Request Export</button>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <section className="glass-card p-6 border border-[var(--border-muted)] flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold">Recent Exports</h2><button className="text-[var(--color-primary)] text-sm font-bold hover:underline">Refresh</button></div>
                        <div className="flex flex-col gap-4 flex-1">
                            {EXPORTS.map(e => (
                                <div key={e.name} className={`p-4 rounded-lg bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] ${e.expired ? "opacity-60" : ""}`}>
                                    <div className="flex items-start justify-between mb-2">
                                        <div><p className={`text-sm font-bold ${e.expired ? "line-through" : ""}`}>{e.name}</p><p className="text-xs text-[var(--text-muted)]">Requested: {e.date}</p></div>
                                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${e.statusColor}`}>{e.status}</span>
                                    </div>
                                    {e.size && <div className="flex items-center justify-between mt-4"><span className="text-xs font-medium text-[var(--text-muted)]">{e.size}</span><button className="flex items-center gap-1 text-[var(--color-primary)] text-xs font-bold hover:underline"><span className="material-symbols-outlined text-sm">download</span>Download</button></div>}
                                    {e.progress && <div className="w-full bg-[var(--bg-surface-muted)]/30 h-1.5 rounded-full mt-4 overflow-hidden"><div className={`bg-[var(--color-primary)] h-full rounded-full w-[${e.progress}%]`}></div></div>}
                                    {e.expired && <div className="flex items-center justify-between mt-4"><p className="text-[10px] italic text-[var(--text-muted)]">Link expired after 30 days</p><button className="text-[var(--text-muted)] text-xs font-bold hover:text-[var(--color-primary)]">Retry</button></div>}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
            <div className="mt-12 p-6 bg-[var(--bg-surface-muted)]/10 rounded-xl border-l-4 border-[var(--color-primary)]">
                <h3 className="font-bold flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-[var(--color-primary)]">verified_user</span>Data Security Notice</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">All data exports are encrypted using AES-256 standard and logged in the security audit trail. Download links are valid for 30 days.</p>
            </div>
        </main>
    );
}
