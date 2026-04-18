"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_LABELS: Record<string, string> = {
    ACTIVE: "Active",
    INACTIVE: "Inactive / Leave",
    ARCHIVED: "Archived",
};

interface StatusToggleProps {
    employeeId: string;
    initialStatus: string;
}

export function StatusToggle({ employeeId, initialStatus }: StatusToggleProps) {
    const [status, setStatus] = useState(initialStatus);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextStatus = e.target.value;
        if (nextStatus === status) return;
        setPendingStatus(nextStatus);
        setError(null);
    };

    const handleCancel = () => {
        setPendingStatus(null);
    };

    const handleConfirm = async () => {
        if (!pendingStatus) return;
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/employees/${employeeId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: pendingStatus }),
            });

            if (res.ok) {
                setStatus(pendingStatus);
                setPendingStatus(null);
                router.refresh();
            } else {
                setError("Failed to update status. Please try again.");
                setPendingStatus(null);
            }
        } catch {
            setError("Network error. Please try again.");
            setPendingStatus(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="relative inline-block">
                <select
                    aria-label="Employee Status"
                    title="Employee Status"
                    value={status}
                    onChange={handleStatusChange}
                    disabled={isLoading}
                    className={`appearance-none focus:outline-none focus:ring-2 flex items-center pr-8 pl-3 py-1.5 rounded-full transition-all border text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-sm
                        ${status === "ACTIVE"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 focus:ring-emerald-500/20"
                            : status === "ARCHIVED"
                                ? "bg-red-50 border-red-200 text-red-700 focus:ring-red-500/20"
                                : "bg-slate-50 border-slate-200 text-slate-500 focus:ring-slate-500/20"
                        } disabled:opacity-50`}
                >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive / Leave</option>
                    <option value="ARCHIVED">Archived</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    {isLoading ? (
                        <span className="material-symbols-outlined text-[14px] animate-spin opacity-50">sync</span>
                    ) : (
                        <span className="material-symbols-outlined text-[14px] opacity-50">arrow_drop_down</span>
                    )}
                </div>
            </div>

            {error && (
                <p className="mt-1 text-[10px] font-bold text-red-500">{error}</p>
            )}

            {/* Confirmation modal */}
            {pendingStatus && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCancel}
                    />
                    <div className="relative bg-[var(--bg-card)] rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-[var(--border-muted)]">
                        <div className="p-6 border-b border-[var(--border-muted)]">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-amber-500 bg-amber-100 p-2 rounded-lg">
                                    swap_horiz
                                </span>
                                <h2 className="text-base font-bold text-[var(--text-main)]">Change Status</h2>
                            </div>
                            <p className="text-sm text-[var(--text-muted)]">
                                Set this employee&apos;s status to{" "}
                                <span className="font-bold text-[var(--text-main)]">
                                    {STATUS_LABELS[pendingStatus] ?? pendingStatus}
                                </span>
                                ?
                            </p>
                        </div>
                        <div className="p-6 flex gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 py-2.5 border border-[var(--border-muted)] rounded-xl font-bold text-sm hover:bg-[var(--bg-surface-muted)]/50 transition-colors text-[var(--text-muted)]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className="flex-1 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Updating…" : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
