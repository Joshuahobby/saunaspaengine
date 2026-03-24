"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CheckoutButtonProps {
    recordId: string;
    currentStatus: string;
}

export default function CheckoutButton({ recordId, currentStatus }: CheckoutButtonProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [showPaymentSelect, setShowPaymentSelect] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState("CASH");

    if (currentStatus === "COMPLETED" || currentStatus === "CANCELLED") return null;

    async function handleCompleteVisit() {
        setIsUpdating(true);
        try {
            const res = await fetch("/api/operations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: recordId,
                    status: "COMPLETED",
                    paymentMode: selectedPayment,
                }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            setShowPaymentSelect(false);
            router.refresh();
        } catch (error) {
            alert("Error: " + (error instanceof Error ? error.message : "Something went wrong"));
        } finally {
            setIsUpdating(false);
        }
    }

    if (showPaymentSelect) {
        return (
            <div className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border-muted)] p-1 rounded-lg shadow-lg ring-2 ring-black/5 animate-in fade-in zoom-in duration-200">
                <select 
                    value={selectedPayment}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    aria-label="Payment Mode"
                    className="bg-transparent text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 outline-none text-[var(--text-main)] cursor-pointer"
                >
                    <option value="CASH">CASH</option>
                    <option value="MOMO">MOMO</option>
                    <option value="POS">POS</option>
                    <option value="MEMBERSHIP">MEMB</option>
                </select>
                <div className="flex gap-1 h-5">
                    <button
                        onClick={handleCompleteVisit}
                        disabled={isUpdating}
                        className="px-2 bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-[8px] font-black uppercase tracking-widest rounded-md hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center min-w-[45px]"
                    >
                        {isUpdating ? "..." : "DONE"}
                    </button>
                    <button
                        onClick={() => setShowPaymentSelect(false)}
                        className="px-1.5 bg-[var(--bg-surface-muted)] text-[var(--text-muted)] text-[8px] font-black uppercase tracking-widest rounded-md hover:text-[var(--text-main)] transition-all"
                    >
                        ESC
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowPaymentSelect(true)}
            disabled={isUpdating}
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-[9px] font-black uppercase tracking-[0.1em] rounded-lg hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-dark)] transition-all active:scale-95 disabled:opacity-50 group"
        >
            <span className="material-symbols-outlined text-[14px] group-hover:scale-110 transition-transform font-black">check_circle</span>
            DONE
        </button>
    );
}
