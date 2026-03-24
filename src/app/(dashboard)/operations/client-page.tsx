"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import CheckoutButton from "@/components/operations/checkout-button";
import { EmptyState } from "@/components/ui/empty-state";
import Pagination from "@/components/ui/Pagination";

interface RecordData {
    id: string;
    status: string;
    amount: number;
    boxNumber: string | null;
    createdAt: string;
    clientName: string;
    serviceName: string;
    serviceCategory: string | null;
    employeeName: string | null;
}

const STATUS_STYLES: Record<string, { dot: string; text: string; label: string }> = {
    CREATED: { dot: "bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]", text: "text-[var(--color-primary)]", label: "Created" },
    IN_PROGRESS: { dot: "bg-[var(--color-primary)] animate-pulse shadow-[0_0_8px_var(--color-primary)]", text: "text-[var(--color-primary)]", label: "In Progress" },
    COMPLETED: { dot: "bg-[var(--text-muted)] opacity-60", text: "text-[var(--text-muted)]", label: "Completed" },
    CANCELLED: { dot: "bg-red-500/60", text: "text-red-500", label: "Cancelled" },
};

function getInitials(name: string) {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatRWF(amount: number) {
    return `RWF ${amount.toLocaleString()}`;
}

export default function OperationsClient({
    records,
    todayRevenueAmount,
    activeCount,
    completedCount
}: {
    records: RecordData[];
    todayRevenueAmount: number;
    activeCount: number;
    completedCount: number;
}) {
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [dateFilter, setDateFilter] = useState<"all" | "today" | "week">("all");
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [page, setPage] = useState(1);
    const perPage = 15;

    const filtered = useMemo(() => {
        let result = records;

        // Status filter
        if (statusFilter !== "all") {
            result = result.filter(r => r.status === statusFilter);
        }

        // Date filter
        if (dateFilter !== "all") {
            const now = new Date();
            const start = new Date();
            if (dateFilter === "today") {
                start.setHours(0, 0, 0, 0);
            } else {
                start.setDate(now.getDate() - 7);
                start.setHours(0, 0, 0, 0);
            }
            result = result.filter(r => new Date(r.createdAt) >= start);
        }

        return result;
    }, [records, statusFilter, dateFilter]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const pagedRecords = filtered.slice((page - 1) * perPage, page * perPage);

    const statusOptions = [
        { value: "all", label: "All Statuses" },
        { value: "CREATED", label: "Created" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "COMPLETED", label: "Completed" },
        { value: "CANCELLED", label: "Cancelled" },
    ];

    const dateOptions = [
        { value: "all" as const, label: "All Time" },
        { value: "today" as const, label: "Today" },
        { value: "week" as const, label: "This Week" },
    ];

    const currentStatusLabel = statusOptions.find(o => o.value === statusFilter)?.label || "All Statuses";

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-display font-black tracking-tighter text-[var(--text-main)] italic">Daily <span className="text-[var(--color-primary)]">Activity</span></h2>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 font-bold uppercase tracking-widest opacity-70">Guest visits and service records</p>
                </div>
                <Link
                    href="/check-in"
                    className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-[var(--color-primary)]/10 w-fit text-[9px] uppercase tracking-[0.15em] font-black"
                >
                    <span className="material-symbols-outlined text-sm font-black">add_circle</span>
                    New Entry
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center p-4 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl shadow-none">
                <div className="flex items-center gap-2 pr-6 border-r border-[var(--border-muted)]">
                    <span className="material-symbols-outlined text-[var(--color-primary)] text-sm font-bold">filter_alt</span>
                    <span className="text-[9px] font-black text-[var(--text-main)] uppercase tracking-[0.15em]">Filters</span>
                </div>
                <div className="flex gap-2 flex-wrap ml-4">
                    {/* Status Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-[0.15em] transition-all bg-[var(--color-primary)] text-white"
                        >
                            {currentStatusLabel}
                            <span className="material-symbols-outlined text-xs">keyboard_arrow_down</span>
                        </button>
                        {showStatusDropdown && (
                            <div className="absolute top-full mt-1 left-0 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-lg shadow-xl z-50 min-w-[140px] overflow-hidden">
                                {statusOptions.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setStatusFilter(opt.value); setShowStatusDropdown(false); setPage(1); }}
                                        className={`w-full text-left px-4 py-2 text-[10px] font-bold transition-colors ${statusFilter === opt.value ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)]"}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Date Filter Buttons */}
                    {dateOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => { setDateFilter(opt.value); setPage(1); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-[0.15em] transition-all ${dateFilter === opt.value ? "bg-[var(--text-main)] text-[var(--bg-app)]" : "bg-[var(--bg-surface-muted)] text-[var(--text-main)] border border-[var(--border-muted)] hover:bg-[var(--border-muted)]"}`}
                        >
                            {opt.label}
                            {opt.value !== "all" && <span className="material-symbols-outlined text-xs">calendar_month</span>}
                        </button>
                    ))}
                </div>
                <div className="ml-auto text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em] opacity-50">
                    {filtered.length} of {records.length} records
                </div>
            </div>

            {/* Transaction Table */}
            {filtered.length === 0 ? (
                <EmptyState
                    icon="receipt_long"
                    title={statusFilter !== "all" || dateFilter !== "all" ? "No Matching Records" : "No Activity Recorded"}
                    description={statusFilter !== "all" || dateFilter !== "all" ? "Try adjusting your filters to see more records." : "There are no guest records for this period. Start by checking in a guest."}
                    actionLabel="New Entry"
                    actionHref="/check-in"
                />
            ) : (
                <>
                <div className="glass-card overflow-hidden border border-[var(--border-muted)] shadow-none rounded-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--bg-surface-muted)] border-b border-[var(--border-muted)]">
                                    <th className="px-5 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">ID</th>
                                    <th className="px-5 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Guest</th>
                                    <th className="px-5 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60 text-center">Station</th>
                                    <th className="px-5 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Service</th>
                                    <th className="px-5 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Attendant</th>
                                    <th className="px-5 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Status</th>
                                    <th className="px-5 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60 text-right">Revenue</th>
                                    <th className="px-5 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-muted)]">
                                {pagedRecords.map((record) => {
                                    const statusStyle = STATUS_STYLES[record.status] || STATUS_STYLES.CREATED;
                                    const isCompleted = record.status === "COMPLETED";
                                    return (
                                        <tr key={record.id} className={`transition-all ${isCompleted ? "opacity-60 bg-[var(--bg-surface-muted)]/50" : "hover:bg-[var(--bg-surface-muted)]/30"}`}>
                                            <td className="px-5 py-3 text-[10px] font-bold text-[var(--text-main)] italic">
                                                #{record.id.slice(-4).toUpperCase()}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[8px] ${isCompleted ? "bg-[var(--border-muted)] text-[var(--text-muted)]" : "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 shadow-sm"}`}>
                                                        {getInitials(record.clientName)}
                                                    </div>
                                                    <span className={`text-xs font-black text-[var(--text-main)] ${isCompleted ? "text-[var(--text-muted)] opacity-50" : ""}`}>{record.clientName}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                <span className="bg-[var(--bg-card)] border border-[var(--border-muted)] px-3 py-1 rounded-lg text-[8px] font-black text-[var(--text-main)] shadow-sm">{record.boxNumber || "—"}</span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${isCompleted ? "bg-[var(--border-muted)] text-[var(--text-muted)]" : "bg-[var(--color-primary)]/5 text-[var(--color-primary)] border border-[var(--color-primary)]/10"}`}>
                                                    {record.serviceName}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-[10px] font-bold text-[var(--text-muted)]">{record.employeeName || "—"}</td>
                                            <td className="px-5 py-3">
                                                <span className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.1em] ${statusStyle.text}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                                                    {statusStyle.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-xs font-black text-[var(--text-main)] text-right">{formatRWF(record.amount)}</td>
                                            <td className="px-5 py-3 text-right">
                                                <CheckoutButton recordId={record.id} currentStatus={record.status} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Pagination */}
                <div className="py-2">
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
                </>
            )}

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--bg-card)] p-5 flex items-center gap-5 rounded-2xl border border-[var(--border-muted)] hover:scale-[1.01] transition-all shadow-sm glass-card">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface-muted)] text-[var(--color-primary)] flex items-center justify-center border border-[var(--color-primary-border)]/10 shadow-sm">
                        <span className="material-symbols-outlined text-xl font-bold">trending_up</span>
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1 opacity-60">Daily Revenue</p>
                        <p className="text-xl font-sans font-black text-[var(--text-main)]">{formatRWF(todayRevenueAmount)}</p>
                    </div>
                </div>
                <div className="bg-[var(--bg-card)] p-5 flex items-center gap-5 rounded-2xl border border-[var(--border-muted)] hover:scale-[1.01] transition-all shadow-sm glass-card">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface-muted)] text-[var(--color-primary)] flex items-center justify-center border border-[var(--color-primary-border)]/10 shadow-sm">
                        <span className="material-symbols-outlined text-xl font-bold">group</span>
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1 opacity-60">Guests On-Site</p>
                        <p className="text-xl font-sans font-black text-[var(--text-main)]">{activeCount}</p>
                    </div>
                </div>
                <div className="bg-[var(--bg-card)] p-5 flex items-center gap-5 rounded-2xl border border-[var(--border-muted)] hover:scale-[1.01] transition-all shadow-sm glass-card">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface-muted)] text-[var(--color-primary)] flex items-center justify-center border border-[var(--color-primary-border)]/10 shadow-sm">
                        <span className="material-symbols-outlined text-xl font-bold">event_available</span>
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1 opacity-60">Completed Visits</p>
                        <p className="text-xl font-sans font-black text-[var(--text-main)]">{completedCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
