"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerBusinessAction } from "./actions";
import { signIn } from "next-auth/react";

export function SignupForm() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [businessName, setBusinessName] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setIsPending(true);
        try {
            const fd = new FormData();
            fd.append("businessName", businessName);
            fd.append("fullName", fullName);
            fd.append("email", email);
            fd.append("password", password);
            fd.append("confirmPassword", confirmPassword);

            const result = await registerBusinessAction(fd);

            if (result.error) {
                setError(result.error);
            } else if (result.success) {
                const loginResult = await signIn("credentials", { email, password, redirect: false });
                if (loginResult?.error) {
                    setError("Failed to log in automatically. Please try again.");
                    setTimeout(() => router.push("/login"), 2000);
                } else {
                    router.push("/onboarding");
                }
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Create your account</h2>
                <p className="text-gray-500 text-sm font-medium mt-1">Get your spa business set up in under 2 minutes</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-1.5">Business name</label>
                        <input
                            id="businessName"
                            name="businessName"
                            type="text"
                            value={businessName}
                            onChange={e => setBusinessName(e.target.value)}
                            placeholder="Nordic Calm Wellness"
                            required
                            aria-required="true"
                            className="w-full h-11 bg-white border border-gray-300 rounded-lg px-3.5 text-sm text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10 transition-all"
                        />
                    </div>

                    <div className="col-span-2">
                        <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1.5">Your full name</label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder="Amani Uwase"
                            required
                            aria-required="true"
                            autoComplete="name"
                            className="w-full h-11 bg-white border border-gray-300 rounded-lg px-3.5 text-sm text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10 transition-all"
                        />
                    </div>

                    <div className="col-span-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Work email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@yourspa.com"
                            required
                            aria-required="true"
                            autoComplete="email"
                            className="w-full h-11 bg-white border border-gray-300 rounded-lg px-3.5 text-sm text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10 transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            required
                            aria-required="true"
                            minLength={8}
                            autoComplete="new-password"
                            className="w-full h-11 bg-white border border-gray-300 rounded-lg px-3.5 text-sm text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10 transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Repeat password"
                            required
                            aria-required="true"
                            minLength={8}
                            autoComplete="new-password"
                            className={`w-full h-11 bg-white border rounded-lg px-3.5 text-sm text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                password === "" || confirmPassword === "" || password !== confirmPassword
                                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                    : "border-gray-300 focus:border-[#2d5a27] focus:ring-[#2d5a27]/10"
                            }`}
                        />
                    </div>
                </div>

                {error && (
                    <div role="alert" aria-live="polite" className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                        <span className="material-symbols-outlined text-red-500 text-base mt-0.5 shrink-0">error</span>
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-11 rounded-lg text-sm font-bold text-white transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                    style={{ background: "linear-gradient(135deg, #2d5a27 0%, #1a3a1a 100%)" }}
                >
                    {isPending ? (
                        <>
                            <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        <>
                            Create Account
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </>
                    )}
                </button>

                <p className="text-[11px] text-gray-400 font-medium text-center pt-1">
                    By creating an account you agree to our{" "}
                    <Link href="/terms" className="text-gray-600 hover:text-gray-900 underline underline-offset-2">Terms</Link>
                    {" & "}
                    <Link href="/privacy" className="text-gray-600 hover:text-gray-900 underline underline-offset-2">Privacy Policy</Link>.
                </p>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 font-medium text-center">
                    Already have an account?{" "}
                    <Link href="/login" className="font-bold text-[#2d5a27] hover:text-[#21431d] transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
