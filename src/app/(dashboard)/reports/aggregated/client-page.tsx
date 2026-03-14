"use client";

import React, { useState } from "react";
import Pagination from "@/components/ui/Pagination";

interface ReportRow {
    id: string;
    businessName: string;
    serviceName: string;
    employeeName: string;
    clientName: string;
    clientType: string;
    amount: number;
    paymentMode: string;
    completedAt: string;
}

interface Props {
    reports: ReportRow[];
    businesses: string[];
}

export default function AggregatedReportsClient({ reports, businesses }: Props) {
    const [filterBranch, setFilterBranch] = useState("All Sanctuaries");
    const [page, setPage] = useState(1);
    const perPage = 10;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(amount);

    const filteredReports = filterBranch === "All Sanctuaries"
        ? reports
        : reports.filter(r => r.businessName === filterBranch);

    const totalPages = Math.ceil(filteredReports.length / perPage);
    const pagedReports = filteredReports.slice((page - 1) * perPage, page * perPage);

    const handleFilterChange = (val: string) => {
        setFilterBranch(val);
        setPage(1);
    };

    return (
        <main className="flex flex-col flex-1 gap-10 max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-12 overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-[var(--border-muted)] pb-8">
                <h1 className="text-4xl font-display font-bold text-[var(--text-main)]">Aggregated Flow Records</h1>
                <p className="text-lg text-[var(--text-muted)] font-medium opacity-80">
                    Comprehensive cross-node transaction ledger.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60 ml-2 mb-2">Entity Filter</label>
                    <select
                        value={filterBranch}
                        onChange={e => handleFilterChange(e.target.value)}
                        title="Branch Filter"
                        className="h-12 rounded-xl bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] px-6 text-sm font-display font-bold text-[var(--text-main)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none appearance-none hover:border-[var(--color-primary)]/30 min-w-[240px]"
                    >
                        <option value="All Sanctuaries">All Sanctuaries</option>
                        {businesses.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] overflow-hidden shadow-sm flex-1 flex flex-col min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-[var(--bg-surface-muted)]/5 border-b border-[var(--border-muted)]">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Origin Node</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Timeline Space</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Spirit / Guest</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Service Rendered</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Energy Exchange</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {pagedReports.map((row) => (
                                <tr key={row.id} className="hover:bg-[var(--bg-surface-muted)]/5 transition-colors">
                                    <td className="px-8 py-5">
                                        <p className="font-display font-bold text-[var(--text-main)]">{row.businessName}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-medium text-[var(--text-main)]">{new Date(row.completedAt).toLocaleDateString()}</p>
                                        <p className="text-xs text-[var(--text-muted)] opacity-70">{new Date(row.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-[var(--text-main)]">{row.clientName}</p>
                                        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest opacity-60">{row.clientType}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="font-medium text-[var(--text-main)]">{row.serviceName}</p>
                                        <p className="text-xs text-[var(--text-muted)] opacity-70">by {row.employeeName}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="font-sans font-black text-lg text-[var(--text-main)]">{formatCurrency(row.amount)}</p>
                                        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest opacity-60">{row.paymentMode}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredReports.length === 0 && (
                        <div className="py-24 text-center">
                            <span className="material-symbols-outlined text-4xl text-[var(--text-muted)] opacity-20 mb-2">receipt_long</span>
                            <p className="text-[var(--text-muted)] italic">No financial flow recorded yet.</p>
                        </div>
                    )}
                </div>
                {/* Pagination */}
                <div className="px-8 py-4 border-t border-[var(--border-muted)]">
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
            </div>
        </main>
    );
}
