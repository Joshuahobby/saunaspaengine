"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManualValidationForm() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState("");

    async function handleValidate() {
        if (!query.trim()) return;

        setIsValidating(true);
        setError("");

        try {
            const res = await fetch(`/api/clients/search?query=${encodeURIComponent(query)}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Client not found");
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
                <label className="text-slate-600 text-sm font-medium">Identify by QR, Phone, or ID</label>
                <div className="flex">
                    <div className="bg-slate-50 border border-slate-200 border-r-0 rounded-l-lg px-3 flex items-center text-slate-400">
                        <span className="material-symbols-outlined text-xl">search</span>
                    </div>
                    <input
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] rounded-r-lg p-3 placeholder:text-slate-400"
                        placeholder="Scan code or enter phone/ID..."
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleValidate()}
                    />
                </div>
                {error && <p className="text-xs text-red-500 font-bold mt-1 px-1">{error}</p>}
            </div>

            <button
                onClick={handleValidate}
                disabled={isValidating || !query.trim()}
                className="w-full bg-[var(--color-primary)] hover:opacity-90 text-[var(--color-bg-dark)] font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-[var(--color-primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isValidating ? (
                    <span className="size-5 border-2 border-[var(--color-bg-dark)]/30 border-t-[var(--color-bg-dark)] rounded-full animate-spin" />
                ) : (
                    <>
                        <span className="material-symbols-outlined">verified</span>
                        Validate Member
                    </>
                )}
            </button>
        </div>
    );
}
