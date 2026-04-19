"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const justRegistered = searchParams.get("registered") === "true";

    const [errorMessage, dispatch, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
        <div className="bg-[var(--bg-card)] p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-black/5 border border-[var(--border-main)]">
            {justRegistered && (
                <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 p-4 rounded-xl flex items-center gap-3 text-[var(--color-primary)] text-sm mb-6 animate-fade-in">
                    <span className="material-symbols-outlined text-lg shrink-0">check_circle</span>
                    <p className="font-bold">Account created! Sign in to start setting up your branch.</p>
                </div>
            )}
            <div className="text-center mb-10">
                <h2 className="text-[var(--text-main)] text-3xl font-black font-serif">Welcome <span className="not-italic text-[var(--color-primary)]">Back</span></h2>
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
                            className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-[0.2em] hover:text-[var(--text-main)] transition-colors"
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
                    <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-sm animate-fade-in shadow-sm">
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
                        <>
                            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                            <span>Awakening Sanctuary...</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined font-black">login</span>
                            Enter Sanctuary
                        </>
                    )}
                </button>
                
                {isPending && (
                    <p className="text-center text-[10px] text-[var(--text-muted)] mt-5 font-black uppercase tracking-widest animate-pulse opacity-60">
                        Connecting to Secure Vault. This may take a few moments.
                    </p>
                )}

            </form>

            <div className="mt-10 pt-8 border-t border-[var(--border-muted)]/50 text-center space-y-6">
                <div className="flex flex-col gap-4 items-center">
                    <p className="text-[var(--text-muted)] text-xs font-black uppercase tracking-[0.2em]">
                        New to Sauna SPA Engine?
                    </p>
                    <Link 
                        href="/signup" 
                        className="w-full py-4 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface-muted)] text-[var(--text-main)] text-[10px] font-black uppercase tracking-widest hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all flex items-center justify-center gap-2 group"
                    >
                        <span className="material-symbols-outlined text-base group-hover:rotate-12 transition-transform">person_add</span>
                        Create Your Account
                    </Link>
                </div>
                
                <p className="text-[var(--text-muted)] text-[10px] flex items-center justify-center gap-2 font-black uppercase tracking-widest opacity-40">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    256-bit Encrypted Connection
                </p>
            </div>
        </div>
    );
}
