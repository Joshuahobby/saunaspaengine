"use client";

import { useEffect } from "react";

export default function StaffError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Staff Hub] Page error:", error);
    }, [error]);

    return (
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-32 text-center space-y-6">
            <div className="size-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-red-400">group_off</span>
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold text-[var(--text-main)]">
                    Couldn&apos;t load the Staff Hub
                </h2>
                <p className="text-sm text-[var(--text-muted)] max-w-sm">
                    {error.message || "An unexpected error occurred loading this page."}
                </p>
            </div>
            <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-[var(--color-primary)]/15"
            >
                <span className="material-symbols-outlined text-lg">refresh</span>
                Try again
            </button>
        </div>
    );
}
