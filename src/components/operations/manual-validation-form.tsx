"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManualValidationForm() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState("");
    const errorId = "validation-error";

    async function handleValidate() {
        if (!query.trim()) return;

        setIsValidating(true);
        setError("");

        try {
            const res = await fetch(`/api/clients/search?query=${encodeURIComponent(query)}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Guest not found");
            }

            const client = await res.json();
            // Redirect to check-in with the found client ID
            router.push(`/check-in?clientId=${client.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Validation failed");
        } finally {
            setIsValidating(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <label className="text-[var(--text-muted)] text-sm font-medium">Identify by QR, Phone, or ID</label>
                <div className="flex">
                    <div className="bg-[var(--bg-surface-muted)] border border-[var(--border-main)] border-r-0 rounded-l-lg px-3 flex items-center text-[var(--text-muted)]">
                        <span className="material-symbols-outlined text-xl">search</span>
                    </div>
                    <input
                        className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-main)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] rounded-r-lg p-3 placeholder:text-[var(--text-muted)]"
                        placeholder="Scan code or enter phone/ID..."
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleValidate()}
                        aria-invalid={!!error}
                        aria-describedby={error ? errorId : undefined}
                        aria-required="true"
                    />
                </div>
                {error && <p id={errorId} role="alert" className="text-xs text-red-500 font-bold mt-1 px-1">{error}</p>}
            </div>

            <button
                onClick={handleValidate}
                disabled={isValidating || !query.trim()}
                className="w-full bg-[var(--color-primary)] hover:opacity-90 text-[var(--bg-app)] font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-[var(--color-primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isValidating ? (
                    <span className="size-5 border-2 border-[var(--bg-app)]/30 border-t-[var(--bg-app)] rounded-full animate-spin" />
                ) : (
                    <>
                        <span className="material-symbols-outlined">verified</span>
                        Verify Membership
                    </>
                )}
            </button>
        </div>
    );
}
