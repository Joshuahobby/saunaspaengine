"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { approvePaymentAction, rejectPaymentAction } from "./actions";

interface Payment {
    id: string;
    depositId: string;
    businessId: string;
    businessName: string;
    planName: string;
    cycle: string;
    amount: number;
    currency: string;
    phone: string;
    correspondent: string;
    status: string;
    failureReason: string | null;
    createdAt: string;
    businessApprovalStatus: string;
    businessSubStatus: string;
    creditApplied: number;
    isUpgrade: boolean;
}

interface Stats {
    total: number;
    pending: number;
    completed: number;
    failed: number;
    totalRevenue: number;
    totalCredits: number;
}

interface PageProps {
    payments: Payment[];
    stats: Stats;
}

function fmt(n: number) {
    return n.toLocaleString("en-RW");
}

function statusBadge(status: string) {
    switch (status) {
        case "COMPLETED":
            return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
        case "PENDING":
            return "text-amber-600 bg-amber-500/10 border-amber-500/20";
        case "FAILED":
            return "text-rose-600 bg-rose-500/10 border-rose-500/20";
        default:
            return "text-[var(--text-muted)] bg-[var(--bg-surface-muted)] border-[var(--border-muted)]";
    }
}

function statusIcon(status: string) {
    switch (status) {
        case "COMPLETED": return "check_circle";
        case "PENDING": return "pending";
        case "FAILED": return "cancel";
        default: return "help";
    }
}

export default function AdminPaymentsClientPage({ payments, stats }: PageProps) {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [confirmReject, setConfirmReject] = useState<Payment | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [isPending, startTransition] = useTransition();
    const [actionId, setActionId] = useState<string | null>(null);

    const filtered = payments.filter((p) => {
        const matchesSearch =
            p.businessName.toLowerCase().includes(search.toLowerCase()) ||
            p.phone.includes(search) ||
            p.depositId.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === "ALL" || p.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    function handleApprove(p: Payment) {
        setActionId(p.depositId);
        startTransition(async () => {
            await approvePaymentAction(p.depositId);
            setActionId(null);
        });
    }

    function handleReject(p: Payment) {
        setActionId(p.depositId);
        startTransition(async () => {
            await rejectPaymentAction(p.depositId, rejectReason);
            setConfirmReject(null);
            setRejectReason("");
            setActionId(null);
        });
    }

    return (
        <div className="max-w-[1440px] mx-auto w-full p-6 space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[var(--border-muted)] pb-6">
                <div className="flex items-center gap-4 flex-1 md:max-w-2xl w-full">
                    <div className="relative w-full text-[var(--text-muted)] focus-within:text-[var(--color-primary)] transition-all group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40 group-focus-within:opacity-100 transition-all">search</span>
                        <input
                            className="w-full bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-xl pl-12 pr-6 py-3 text-sm font-bold text-[var(--text-main)] focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)]/40 transition-all placeholder:text-[var(--text-muted)] placeholder:opacity-30 outline-none"
                            placeholder="Search by business, phone, or deposit ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 shrink-0">
                        {["ALL", "PENDING", "COMPLETED", "FAILED"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                    filterStatus === s
                                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                        : "bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-muted)] hover:border-[var(--color-primary)]/40"
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Title */}
            <div className="space-y-1">
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-[var(--text-main)] tracking-tight">
                    Subscription <span className="text-[var(--color-primary)]">Payments</span>
                </h1>
                <p className="text-[10px] text-[var(--text-muted)] font-medium opacity-50 uppercase tracking-[0.2em]">
                    PawaPay Mobile Money transactions — approve, reject, or monitor.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: "Total Txns", value: stats.total, icon: "receipt_long", color: "primary" },
                    { label: "Pending", value: stats.pending, icon: "pending", color: "amber" },
                    { label: "Completed", value: stats.completed, icon: "check_circle", color: "emerald" },
                    { label: "Failed", value: stats.failed, icon: "cancel", color: "rose" },
                    { label: "Revenue Collected", value: `${fmt(stats.totalRevenue)} RWF`, icon: "account_balance", color: "primary" },
                    { label: "Proration Credits", value: `${fmt(stats.totalCredits)} RWF`, icon: "loyalty", color: "amber" },
                ].map((card) => (
                    <div key={card.label} className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-muted)] shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-50">{card.label}</span>
                            <span className={`material-symbols-outlined text-base ${
                                card.color === "primary" ? "text-[var(--color-primary)]" :
                                card.color === "amber" ? "text-amber-500" :
                                card.color === "emerald" ? "text-emerald-500" : "text-rose-500"
                            }`}>{card.icon}</span>
                        </div>
                        <p className="text-2xl font-display font-bold text-[var(--text-main)]">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-[2rem] border border-[var(--border-muted)] bg-[var(--bg-card)] overflow-hidden shadow-2xl shadow-black/5">
                <div className="px-8 py-6 border-b border-[var(--border-muted)] flex items-center justify-between bg-[var(--bg-surface-muted)]/5">
                    <h3 className="text-xl font-display font-bold text-[var(--text-main)]">Transaction Ledger</h3>
                    <span className="px-3 py-1 rounded-full bg-[var(--bg-surface-muted)]/20 border border-[var(--border-muted)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                        {filtered.length} Records
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-[var(--bg-surface-muted)]/10 text-[var(--text-muted)] uppercase text-[9px] font-display font-black tracking-[0.2em] border-b border-[var(--border-muted)] opacity-50">
                            <tr>
                                <th className="px-8 py-5">Business</th>
                                <th className="px-4 py-5">Plan</th>
                                <th className="px-4 py-5 text-center">Amount</th>
                                <th className="px-4 py-5 text-center">Credit</th>
                                <th className="px-4 py-5 text-center">Total Value</th>
                                <th className="px-4 py-5">Phone / Network</th>
                                <th className="px-4 py-5 text-center">Status</th>
                                <th className="px-4 py-5">Date</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-12 text-center text-[var(--text-muted)] opacity-50 font-bold text-sm">
                                        No payments found.
                                    </td>
                                </tr>
                            ) : filtered.map((p) => (
                                <tr key={p.id} className="hover:bg-[var(--bg-surface-muted)]/5 transition-all group">
                                    <td className="px-8 py-5">
                                        <Link href={`/businesses/${p.businessId}`} className="flex items-center gap-3 group/link">
                                            <div className="size-9 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center font-black text-[var(--color-primary)] text-sm group-hover/link:scale-110 transition-transform">
                                                {p.businessName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[var(--text-main)] text-sm group-hover/link:text-[var(--color-primary)] transition-colors">{p.businessName}</p>
                                                <p className="text-[9px] text-[var(--text-muted)] font-mono opacity-40">{p.depositId.slice(0, 12)}…</p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-black text-[var(--text-main)]">{p.planName}</p>
                                            <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest opacity-50">{p.cycle}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <span className="font-black text-[var(--color-primary)] text-sm">{fmt(p.amount)}</span>
                                        <p className="text-[9px] text-[var(--text-muted)] opacity-50 uppercase tracking-widest leading-none mt-1">Realised</p>
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <span className={p.creditApplied > 0 ? "text-amber-600 font-bold text-xs" : "text-[var(--text-muted)] opacity-20 text-xs"}>
                                            {p.creditApplied > 0 ? `-${fmt(p.creditApplied)}` : "—"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 text-center opacity-60">
                                        <span className="font-bold text-xs">{fmt(p.amount + p.creditApplied)}</span>
                                        {p.isUpgrade && (
                                            <p className="text-[8px] text-amber-600 font-black uppercase tracking-tighter mt-1">Upgrade</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-[var(--text-main)] font-mono">{p.phone}</p>
                                            <span className={`inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                                                p.correspondent === "MTNRW"
                                                    ? "text-yellow-600 bg-yellow-500/10 border-yellow-500/20"
                                                    : "text-red-600 bg-red-500/10 border-red-500/20"
                                            }`}>
                                                <span className="material-symbols-outlined text-[10px]">sim_card</span>
                                                {p.correspondent === "MTNRW" ? "MTN" : "Airtel"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${statusBadge(p.status)}`}>
                                            <span className="material-symbols-outlined text-[10px]">{statusIcon(p.status)}</span>
                                            {p.status}
                                        </span>
                                        {p.failureReason && (
                                            <p className="text-[8px] text-rose-500 opacity-70 mt-1 max-w-[120px] truncate" title={p.failureReason}>
                                                {p.failureReason}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-4 py-5">
                                        <p className="text-[10px] text-[var(--text-muted)] font-bold">
                                            {new Date(p.createdAt).toLocaleDateString("en-RW", { day: "2-digit", month: "short", year: "numeric" })}
                                        </p>
                                        <p className="text-[9px] text-[var(--text-muted)] opacity-50">
                                            {new Date(p.createdAt).toLocaleTimeString("en-RW", { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {p.status === "PENDING" && (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleApprove(p)}
                                                    disabled={isPending && actionId === p.depositId}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                                                >
                                                    <span className="material-symbols-outlined text-xs">verified</span>
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => { setConfirmReject(p); setRejectReason(""); }}
                                                    disabled={isPending && actionId === p.depositId}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                                                >
                                                    <span className="material-symbols-outlined text-xs">cancel</span>
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {p.status !== "PENDING" && (
                                            <span className="text-[9px] text-[var(--text-muted)] opacity-40 font-bold uppercase tracking-widest">No action</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-5 bg-[var(--bg-surface-muted)]/5 border-t border-[var(--border-muted)]">
                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] opacity-40">
                        PawaPay webhook auto-confirms payments. Manual approval is a fallback only.
                    </p>
                </div>
            </div>

            {/* Reject confirmation modal */}
            {confirmReject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[2rem] p-8 w-full max-w-md shadow-2xl space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-rose-500">cancel</span>
                            </div>
                            <h3 className="font-black text-[var(--text-main)] text-lg">Reject Payment</h3>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] font-medium">
                            Rejecting <span className="font-black text-[var(--text-main)]">{confirmReject.businessName}</span>&apos;s payment of{" "}
                            <span className="font-black text-rose-500">{fmt(confirmReject.amount)} RWF</span>. The business will remain inactive.
                        </p>
                        <div>
                            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Reason (optional)</label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={3}
                                placeholder="e.g. Payment not received, wrong amount..."
                                className="w-full bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-xl p-4 text-sm font-bold text-[var(--text-main)] outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500/40 transition-all resize-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmReject(null)}
                                className="flex-1 py-3 rounded-xl border border-[var(--border-muted)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--bg-surface-muted)]/20 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(confirmReject)}
                                disabled={isPending}
                                className="flex-1 py-3 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                {isPending ? "Rejecting..." : "Confirm Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
