"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { CheckCircle2, Loader2 } from "lucide-react";

interface CompleteSessionButtonProps {
    recordId: string;
    boxName: string;
}

export default function CompleteSessionButton({ recordId, boxName }: CompleteSessionButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    async function handleComplete() {
        setShowConfirm(false);
        setIsLoading(true);
        try {
            const res = await fetch("/api/operations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: recordId,
                    status: "COMPLETED",
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to complete session");
            }

            toast.success("Session completed and recorded.");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirm(true);
                }}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50"
            >
                {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                    <CheckCircle2 className="w-3 h-3" />
                )}
                Finish
            </button>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-3xl p-8 w-full max-w-sm shadow-2xl space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)]">Complete Session</h3>
                                <p className="text-[10px] text-[var(--text-muted)] mt-1">This will mark the session as finished and log it for reporting.</p>
                            </div>
                        </div>
                        <p className="text-xs font-bold text-[var(--text-main)] px-1">
                            Finalize session for <span className="text-emerald-500">{boxName}</span>?
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 h-12 rounded-2xl border border-[var(--border-muted)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleComplete}
                                className="flex-1 h-12 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                Complete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
