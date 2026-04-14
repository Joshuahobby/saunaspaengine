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
    const router = useRouter();

    async function handleComplete() {
        if (!confirm(`Are you sure you want to complete the session for ${boxName}?`)) return;

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
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleComplete();
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
    );
}
