"use client";
import React from "react";
import Link from "next/link";

const ERRORS = [
    { row: 42, name: "Marcus Johansson", error: "Invalid Phone Format" },
    { row: 89, name: "Elena Petrova", error: "Duplicate Email Address" },
    { row: 156, name: "Samantha Reed", error: "Missing Required Field: DOB" },
    { row: 211, name: "Liam Wilson", error: "Invalid Zip Code" },
];

export default function ImportSuccessPage() {
    return (
        <main className="max-w-4xl mx-auto py-12 px-6">
            <header className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--color-primary)]/20 rounded-full mb-6">
                    <span className="material-symbols-outlined text-[var(--color-primary)] text-5xl">check_circle</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Import Successful!</h1>
                <p className="text-[var(--text-muted)]">Your client database has been successfully migrated to Sauna SPA Engine.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: "Total Records", value: "500", sub: "Processed" },
                    { label: "Success", value: "492", sub: "Imported", color: "text-[var(--color-primary)]" },
                    { label: "Errors", value: "8", sub: "Skipped", color: "text-red-500" },
                ].map(s => (
                    <div key={s.label} className="glass-card p-6 border border-[var(--border-muted)]">
                        <p className="text-sm font-medium text-[var(--text-muted)] mb-1">{s.label}</p>
                        <div className="flex items-end gap-2">
                            <span className={`text-3xl font-bold ${s.color || ""}`}>{s.value}</span>
                            <span className={`text-xs mb-1.5 font-medium uppercase tracking-wider ${s.color ? s.color + "/70" : "text-[var(--text-muted)]"}`}>{s.sub}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="glass-card border border-[var(--border-muted)] overflow-hidden mb-10">
                <div className="p-6 border-b border-[var(--border-muted)] flex justify-between items-center">
                    <div><h2 className="text-lg font-bold">Data Summary Report</h2><p className="text-sm text-[var(--text-muted)]">Review flagged entries below</p></div>
                    <button className="inline-flex items-center px-4 py-2 bg-[var(--bg-surface-muted)]/50 rounded-lg font-medium text-sm hover:bg-[var(--bg-surface-muted)] transition-colors"><span className="material-symbols-outlined text-sm mr-2">download</span>Export Error Log</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-[var(--bg-surface-muted)]/10"><th className="px-6 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Row</th><th className="px-6 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Client Name</th><th className="px-6 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Error Description</th><th className="px-6 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider text-right">Status</th></tr></thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {ERRORS.map(e => (
                                <tr key={e.row}><td className="px-6 py-4 text-sm font-medium">{e.row}</td><td className="px-6 py-4 text-sm">{e.name}</td><td className="px-6 py-4 text-sm text-red-500">{e.error}</td><td className="px-6 py-4 text-sm text-right"><span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs font-bold uppercase">Skipped</span></td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-[var(--bg-surface-muted)]/10 text-center"><button className="text-sm font-medium text-[var(--color-primary)] hover:underline">Show all 8 errors</button></div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/clients" className="w-full sm:w-auto px-8 py-3 bg-[var(--color-primary)] text-[var(--bg-app)] font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center"><span className="material-symbols-outlined mr-2">people</span>Go to Client Records</Link>
                <Link href="/settings/import" className="w-full sm:w-auto px-8 py-3 bg-[var(--bg-card)] border border-[var(--border-muted)] font-bold rounded-xl hover:bg-[var(--bg-surface-muted)]/50 transition-colors flex items-center justify-center"><span className="material-symbols-outlined mr-2">upload_file</span>Import More Data</Link>
            </div>
            <div className="mt-12 text-center border-t border-[var(--border-muted)] pt-8">
                <p className="text-sm text-[var(--text-muted)] mb-4">Need help fixing your data errors?</p>
                <div className="flex justify-center gap-8">
                    <Link className="flex items-center text-sm font-medium hover:text-[var(--color-primary)]" href="/support"><span className="material-symbols-outlined text-sm mr-1">menu_book</span>Import Guide</Link>
                    <Link className="flex items-center text-sm font-medium hover:text-[var(--color-primary)]" href="/support"><span className="material-symbols-outlined text-sm mr-1">support_agent</span>Contact Support</Link>
                </div>
            </div>
        </main>
    );
}
