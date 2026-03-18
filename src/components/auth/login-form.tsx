"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    const [errorMessage, dispatch, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
        <div className="bg-[var(--bg-card)] p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-black/5 border border-[var(--border-main)]">
            <div className="text-center mb-10">
                <h2 className="text-[var(--text-main)] text-3xl font-black font-serif italic">Welcome <span className="not-italic text-[var(--color-primary)]">Back</span></h2>
                <p className="text-[var(--text-muted)] text-sm mt-3 font-medium">Access your spa operations dashboard</p>
            </div>

            <form action={dispatch} className="space-y-5">
                <input type="hidden" name="redirectTo" value={callbackUrl} />
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">
                        Email or Username
                    </label>
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl transition-colors group-focus-within:text-[var(--color-primary)] font-black">
                            account_circle
                        </span>
                        <input
                            name="email"
                            type="text"
                            placeholder="Email or username"
                            required
                            autoComplete="username"
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all font-bold text-sm"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">
                            Password
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl transition-colors group-focus-within:text-[var(--color-primary)] font-black">
                            lock
                        </span>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all font-bold"
                        />
                    </div>
                </div>

                {errorMessage && (
                    <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-sm animate-fade-in">
                        <span className="material-symbols-outlined text-lg shrink-0">error</span>
                        <p className="font-bold">{errorMessage}</p>
                    </div>
                )}

                <div className="flex items-center gap-3 px-1">
                    <input
                        id="remember"
                        type="checkbox"
                        className="size-5 rounded-lg border-[var(--border-muted)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-[var(--bg-surface-muted)] cursor-pointer accent-[var(--color-primary)]"
                    />
                    <label
                        htmlFor="remember"
                        className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] cursor-pointer select-none"
                    >
                        Remember this device
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-5 bg-[var(--color-primary)] hover:opacity-90 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-[var(--color-primary)]/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-sm"
                >
                    {isPending ? (
                        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                    ) : (
                        <>
                            <span className="material-symbols-outlined font-black">login</span>
                            Enter Sanctuary
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--border-muted)] text-center">
                <p className="text-[var(--text-muted)] text-xs flex items-center justify-center gap-2 font-medium opacity-60">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    256-bit Encrypted Connection
                </p>
            </div>
        </div>
    );
}
