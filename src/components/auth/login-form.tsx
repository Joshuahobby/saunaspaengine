"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/actions";
import Link from "next/link";

export default function LoginForm() {
    const [errorMessage, dispatch, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
        <div className="bg-white dark:bg-slate-900/50 p-6 md:p-8 rounded-xl shadow-lg border border-[#11d4c4]/5">
            <div className="text-center mb-8">
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold font-serif">Welcome Back</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Access your spa operations dashboard</p>
            </div>

            <form action={dispatch} className="space-y-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                            mail
                        </span>
                        <input
                            name="email"
                            type="email"
                            placeholder="name@saunaspa.com"
                            required
                            className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-[#11d4c4]/20 bg-[#f6f8f7] dark:bg-[#10221c] focus:border-[#11d4c4] focus:ring-1 focus:ring-[#11d4c4] outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all font-display"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
                            Password
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-[#11d4c4] text-xs font-bold hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                            lock
                        </span>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-[#11d4c4]/20 bg-[#f6f8f7] dark:bg-[#10221c] focus:border-[#11d4c4] focus:ring-1 focus:ring-[#11d4c4] outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all font-display"
                        />
                    </div>
                </div>

                {errorMessage && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                        <span className="material-symbols-outlined text-lg">error</span>
                        <p>{errorMessage}</p>
                    </div>
                )}

                <div className="flex items-center gap-2 px-1">
                    <input
                        id="remember"
                        type="checkbox"
                        className="rounded border-[#11d4c4]/30 text-[#11d4c4] focus:ring-[#11d4c4] bg-[#f6f8f7] dark:bg-[#10221c] cursor-pointer"
                    />
                    <label
                        htmlFor="remember"
                        className="text-slate-600 dark:text-slate-400 text-sm cursor-pointer select-none"
                    >
                        Remember this device
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-4 bg-[#11d4c4] hover:bg-[#11d4c4]/90 text-[#10221c] font-bold rounded-lg shadow-md shadow-[#11d4c4]/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <span className="size-5 border-2 border-[#10221c]/30 border-t-[#10221c] rounded-full animate-spin" />
                    ) : (
                        <>
                            <span className="material-symbols-outlined">login</span>
                            Sign In to Dashboard
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#11d4c4]/10 text-center">
                <p className="text-slate-400 text-xs flex items-center justify-center gap-2 font-display">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    256-bit Encrypted Connection
                </p>
            </div>
        </div>
    );
}
