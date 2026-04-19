import React from "react";
import { format } from "date-fns";

interface Payment {
    id: string;
    amount: number;
    currency: string;
    createdAt: Date;
    status: string;
    phone: string;
}

interface BillingHistoryProps {
    payments: Payment[];
}

export default function BillingHistory({ payments }: BillingHistoryProps) {
    if (payments.length === 0) {
        return (
            <div className="py-12 text-center glass-card rounded-2xl border border-dashed border-[var(--border-muted)]">
                <span className="material-symbols-outlined text-[var(--text-muted)] opacity-20 text-4xl mb-2">receipt_long</span>
                <p className="text-[var(--text-muted)] text-sm opacity-40">No billing history found yet.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-[var(--border-muted)] glass-card">
            <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--bg-surface-muted)]/10 border-b border-[var(--border-muted)]">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-[var(--text-muted)]">Date</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-[var(--text-muted)]">Method</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-[var(--text-muted)] text-right">Amount</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-[var(--text-muted)] text-center">Status</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-[var(--text-muted)] text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-muted)]">
                    {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-[var(--bg-card)] transition-colors">
                            <td className="px-6 py-4 text-sm font-medium">
                                {format(new Date(payment.createdAt), "MMM d, yyyy")}
                            </td>
                            <td className="px-6 py-4 text-sm text-[var(--text-muted)] flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg opacity-40">smartphone</span>
                                {payment.phone}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-right">
                                {payment.amount.toLocaleString()} {payment.currency}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tight ${
                                    payment.status === "COMPLETED" 
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : payment.status === "FAILED"
                                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                }`}>
                                    {payment.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-[var(--color-primary)] hover:opacity-70 font-bold text-xs inline-flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">download</span>
                                    Receipt
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
