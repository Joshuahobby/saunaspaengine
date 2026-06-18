"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const justRegistered = searchParams.get("registered") === "true";

    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome back</h2>
                <p className="text-gray-500 text-sm font-medium mt-1">Sign in to your dashboard</p>
            </div>

            {justRegistered && (
                <div className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    <span className="material-symbols-outlined text-green-600 text-base mt-0.5 shrink-0">check_circle</span>
                    <p className="text-green-800 text-sm font-medium">Account created! Sign in to get started.</p>
                </div>
            )}

            <form action={dispatch} className="space-y-5">
                <input type="hidden" name="redirectTo" value={callbackUrl} />

                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        placeholder="you@yourspa.com"
                        required
                        aria-required="true"
                        autoComplete="username"
                        className="w-full h-11 bg-white border border-gray-300 rounded-lg px-3.5 text-sm text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10 transition-all"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                        <Link href="/forgot-password" className="text-xs font-semibold text-[#2d5a27] hover:text-[#21431d] transition-colors">
                            Forgot password?
                        </Link>
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                        aria-required="true"
                        autoComplete="current-password"
                        className="w-full h-11 bg-white border border-gray-300 rounded-lg px-3.5 text-sm text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10 transition-all"
                    />
                </div>

                {errorMessage && (
                    <div role="alert" aria-live="polite" className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                        <span className="material-symbols-outlined text-red-500 text-base mt-0.5 shrink-0">error</span>
                        <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
                    </div>
                )}

                <div className="flex items-center gap-2.5 pt-1">
                    <input
                        id="remember"
                        type="checkbox"
                        className="size-4 rounded border-gray-300 accent-[#2d5a27] cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-sm font-medium text-gray-600 cursor-pointer select-none">
                        Keep me signed in
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-11 rounded-lg text-sm font-bold text-white transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                    style={{ background: "linear-gradient(135deg, #2d5a27 0%, #1a3a1a 100%)" }}
                >
                    {isPending ? (
                        <>
                            <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        <>
                            Sign In
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 font-medium text-center">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="font-bold text-[#2d5a27] hover:text-[#21431d] transition-colors">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
}
