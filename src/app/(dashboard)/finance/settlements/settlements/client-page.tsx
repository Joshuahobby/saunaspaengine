"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";

interface PendingSettlement {
    employeeId: string;
    fullName: string;
    category: string;
    unpaidCount: number;
    unpaidTotal: number;
    commissionIds: string[];
}

export default function SettlementsClient({ pendingData }: { pendingData: PendingSettlement[] }) {
    const router = useRouter();
    const [isPayingOut, setIsPayingOut] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pendingSettlement, setPendingSettlement] = useState<PendingSettlement | null>(null);

    const formatRWF = (amount: number) => `RWF ${amount.toLocaleString()}`;

    const handlePayout = async (settlement: PendingSettlement) => {
        setPendingSettlement(null);
        setIsPayingOut(settlement.employeeId);
        setError(null);

        try {
            const res = await fetch("/api/settlements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    employeeId: settlement.employeeId,
                    amount: settlement.unpaidTotal,
                    commissionIds: settlement.commissionIds,
                }),
            });

            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data?.error || "Failed to process payout.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsPayingOut(null);
        }
    };

    if (pendingData.length === 0) {
        return (
            <EmptyState
                icon="paid"
                title="All Clear"
                description="There are currently no unpaid commissions. All therapists have been fully settled."
            />
        );
    }

    const totalOwed = pendingData.reduce((sum, s) => sum + s.unpaidTotal, 0);

    return (
        <>
        <div className="space-y-6">
            <div className="bg-[var(--bg-card)] p-6 flex flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--border-muted)] glass-card shadow-sm w-full md:w-1/3">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">account_balance_wallet</span>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-70">Total Pending Payouts</p>
                <div className="text-3xl font-display font-black text-[var(--text-main)] mt-1">{formatRWF(totalOwed)}</div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                </div>
            )}

            <div className="glass-card overflow-hidden border border-[var(--border-muted)] shadow-none rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-surface-muted)] border-b border-[var(--border-muted)]">
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Employee</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Category</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60 text-center">Unpaid Records</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60 text-right">Balance Due</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {pendingData.map((data) => (
                                <tr key={data.employeeId} className="hover:bg-[var(--bg-surface-muted)]/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-black text-[var(--text-main)]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-black text-[10px] border border-[var(--color-primary)]/20 shadow-sm">
                                                {data.fullName.charAt(0)}
                                            </div>
                                            {data.fullName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)]">
                                        {data.category}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-1 rounded-lg text-xs font-black">
                                            {data.unpaidCount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-black text-[var(--text-main)] text-right">
                                        {formatRWF(data.unpaidTotal)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() => setPendingSettlement(data)}
                                            disabled={isPayingOut === data.employeeId}
                                            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm transition-all ${
                                                isPayingOut === data.employeeId
                                                    ? 'bg-[var(--border-muted)] text-[var(--text-muted)]'
                                                    : 'bg-[var(--color-primary)] text-white hover:opacity-90 active:scale-95 shadow-[var(--color-primary)]/20'
                                            }`}
                                        >
                                            {isPayingOut === data.employeeId ? 'Processing...' : 'Settle Payout'}
                                            {isPayingOut !== data.employeeId && <span className="material-symbols-outlined text-sm font-black text-white/80">price_check</span>}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {pendingSettlement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-3xl p-8 w-full max-w-sm shadow-2xl space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">price_check</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)]">Confirm Payout</h3>
                                <p className="text-[10px] text-[var(--text-muted)] mt-1">This will mark the commission as settled.</p>
                            </div>
                        </div>
                        <p className="text-xs font-bold text-[var(--text-main)] px-1">
                            Mark <span className="text-[var(--color-primary)]">{formatRWF(pendingSettlement.unpaidTotal)}</span> as paid to <span className="text-[var(--color-primary)]">{pendingSettlement.fullName}</span>?
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setPendingSettlement(null)}
                                className="flex-1 h-12 rounded-2xl border border-[var(--border-muted)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePayout(pendingSettlement)}
                                className="flex-1 h-12 rounded-2xl bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/20"
                            >
                                Settle
                            </button>
                        </div>
                    </div>
                </div>
        )}
        </>
    );
}
