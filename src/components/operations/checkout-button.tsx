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

    if (currentStatus === "COMPLETED" || currentStatus === "CANCELLED") return null;

    async function handleCheckout() {
        if (!confirm("Mark this service as completed?")) return;

        setIsUpdating(true);
        try {
            const res = await fetch("/api/operations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: recordId,
                    status: "COMPLETED",
                }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            router.refresh();
        } catch (error) {
            alert("Error: " + (error instanceof Error ? error.message : "Something went wrong"));
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <button
            onClick={handleCheckout}
            disabled={isUpdating}
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-xs font-bold rounded-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
        >
            {isUpdating ? (
                <span className="size-3 border-2 border-[var(--color-bg-dark)]/30 border-t-[var(--color-bg-dark)] rounded-full animate-spin" />
            ) : (
                <span className="material-symbols-outlined text-sm">check_circle</span>
            )}
            Checkout
        </button>
    );
}
