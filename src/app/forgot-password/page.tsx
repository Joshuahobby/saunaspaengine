"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset, verifyResetOtp, performPasswordReset } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type Step = 1 | 2 | 3 | 4;

export default function PasswordRecoveryPage() {
    const [step, setStep] = useState<Step>(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function getStrength(): { level: string; width: string; color: string } {
        if (password.length === 0) return { level: "None", width: "w-0", color: "bg-[var(--bg-surface-muted)]" };
        if (password.length < 6) return { level: "Weak", width: "w-1/4", color: "bg-red-500" };
        if (password.length < 10) return { level: "Medium", width: "w-2/4", color: "bg-amber-500" };
        if (password.length < 14) return { level: "Strong", width: "w-3/4", color: "bg-[var(--color-primary)]" };
        return { level: "Very Strong", width: "w-full", color: "bg-[var(--color-primary)]" };
    }

    const strength = getStrength();

    function handleOtpChange(index: number, value: string) {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    }

    async function handleSendResetLink() {
        if (!email) return;
        setIsLoading(true);
        const result = await requestPasswordReset(email);
        setIsLoading(false);

        if (result.success) {
            toast.success("Verification code sent to your email!");
            setStep(2);
        } else {
            toast.error(result.error || "Failed to send reset code.");
        }
    }

    async function handleVerifyOtp() {
        const otpString = otp.join("");
        if (otpString.length < 6) return;
        setIsLoading(true);
        const result = await verifyResetOtp(email, otpString);
        setIsLoading(false);

        if (result.success) {
            toast.success("Identity verified!");
            setStep(3);
        } else {
            toast.error(result.error || "Invalid code.");
        }
    }

    async function handleResetPassword() {
        if (!password || password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        const otpString = otp.join("");
        setIsLoading(true);
        const result = await performPasswordReset(email, otpString, password);
        setIsLoading(false);

        if (result.success) {
            toast.success("Password updated successfully!");
            setStep(4);
        } else {
            toast.error(result.error || "Failed to reset password.");
        }
    }

    return (
        <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 lg:px-20 py-4 border-b border-[var(--border-main)] bg-[var(--bg-app)]/80 backdrop-blur-xl sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="size-9 bg-[var(--color-primary)] rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined font-bold">spa</span>
                    </div>
                    <h1 className="text-lg font-black font-serif tracking-tight italic group-hover:text-[var(--color-primary)] transition-colors">
                        Sauna <span className="not-italic text-[var(--color-primary)]">SPA</span> Engine
                    </h1>
                </Link>
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-[var(--text-muted)] text-xs font-black uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors hidden md:block"
                    >
                        Back to Login
                    </Link>
                    <ThemeToggle />
                </div>
            </header>

            <main className="flex-1 px-4 lg:px-20 py-8 max-w-[960px] mx-auto w-full">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 items-center text-sm font-medium mb-6">
                    <Link href="/login" className="text-[var(--color-primary)] hover:underline">Account</Link>
                    <span className="text-[var(--text-muted)]">/</span>
                    <span className="text-[var(--text-main)]">Recovery</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">Secure Account Recovery</h2>
                <p className="text-[var(--text-muted)] mb-8">Follow the steps below to reset your credentials and strengthen your account security.</p>

                {/* Stepper */}
                <div className="border-b border-[var(--border-main)] mb-8">
                    <div className="flex gap-8">
                        {[
                            { num: 1, label: "Forgot Password" },
                            { num: 2, label: "Verify Identity" },
                            { num: 3, label: "Set New Password" },
                        ].map(s => (
                            <div
                                key={s.num}
                                className={`flex items-center border-b-[3px] pb-3 pt-4 ${step >= s.num ? "border-[var(--color-primary)] text-[var(--text-main)]" : "border-transparent text-[var(--text-muted)]"}`}
                            >
                                <p className="text-sm font-bold">{s.num}. {s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Success State */}
                {step === 4 ? (
                    <div className="bg-[var(--bg-card)] p-8 rounded-xl border border-[var(--color-primary)]/20 shadow-sm text-center max-w-lg mx-auto">
                        <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">check_circle</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Password Reset Successful</h3>
                        <p className="text-[var(--text-muted)] mb-6">Your password has been updated. You can now sign in with your new credentials.</p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white font-bold py-3 px-8 rounded-lg hover:brightness-110 transition-all"
                        >
                            <span className="material-symbols-outlined">login</span>
                            Return to Sign In
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 flex flex-col gap-8">
                            {/* Step 1: Email */}
                            <section className={`bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-main)] shadow-sm ${step !== 1 ? "opacity-50 pointer-events-none" : ""}`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-[var(--color-primary)]">mail</span>
                                    <h3 className="text-xl font-bold">Step 1: Recovery Email</h3>
                                    {step > 1 && <span className="material-symbols-outlined text-[var(--color-primary)] ml-auto">check_circle</span>}
                                </div>
                                <div className="flex flex-col gap-4">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-[var(--text-main)]">Registered Email Address</span>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="e.g. mugisha@kigalioasis.rw"
                                            className="rounded-lg border border-[var(--border-main)] bg-[var(--bg-surface-muted)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] px-4 py-3 outline-none"
                                        />
                                    </label>
                                    <button
                                        onClick={handleSendResetLink}
                                        disabled={!email || isLoading}
                                        className="bg-[var(--color-primary)] text-white font-bold py-3 px-6 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading && step === 1 ? "Sending..." : "Send Reset Link"}
                                    </button>
                                </div>
                            </section>

                            {/* Step 2: OTP Verification */}
                            <section className={`bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-main)] shadow-sm ${step !== 2 ? "opacity-50 pointer-events-none" : ""}`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-[var(--color-primary)]">verified_user</span>
                                    <h3 className="text-xl font-bold">Step 2: Verify Identity</h3>
                                    {step > 2 && <span className="material-symbols-outlined text-[var(--color-primary)] ml-auto">check_circle</span>}
                                </div>
                                <p className="text-sm text-[var(--text-muted)] mb-4">Enter the 6-digit code sent to your email.</p>
                                <div className="flex gap-2 justify-between mb-6">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={e => handleOtpChange(i, e.target.value)}
                                            aria-label={`Verification code digit ${i + 1}`}
                                            className="w-12 h-12 text-center text-xl font-bold rounded-lg border border-[var(--border-main)] bg-[var(--bg-surface-muted)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={otp.some(d => !d) || isLoading}
                                    className="w-full bg-[var(--color-primary)] text-white font-bold py-3 px-6 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading && step === 2 ? "Verifying..." : "Verify Code"}
                                </button>
                            </section>

                            {/* Step 3: New Password */}
                            <section className={`bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-main)] shadow-sm ${step !== 3 ? "opacity-50 pointer-events-none" : ""}`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-[var(--color-primary)]">lock_reset</span>
                                    <h3 className="text-xl font-bold">Step 3: Set New Password</h3>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-[var(--text-main)]">New Password</span>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="rounded-lg border border-[var(--border-main)] bg-[var(--bg-surface-muted)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] px-4 py-3 outline-none"
                                        />
                                    </label>
                                    {/* Strength Meter */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                            <span>Strength</span>
                                            <span>{strength.level}</span>
                                        </div>
                                        <div className="h-2 w-full bg-[var(--bg-surface-muted)] rounded-full overflow-hidden">
                                            <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`}></div>
                                        </div>
                                    </div>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-[var(--text-main)]">Confirm Password</span>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className="rounded-lg border border-[var(--border-main)] bg-[var(--bg-surface-muted)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] px-4 py-3 outline-none"
                                        />
                                    </label>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="text-red-500 text-xs font-medium">Passwords do not match</p>
                                    )}
                                    <button
                                        onClick={handleResetPassword}
                                        disabled={!password || password !== confirmPassword || isLoading}
                                        className="bg-[var(--color-primary)] text-white font-bold py-3 px-6 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading && step === 3 ? "Resetting..." : "Reset Password"}
                                    </button>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar: Security Tips */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] p-6 rounded-xl shadow-sm">
                                <h4 className="font-bold text-sm mb-3 text-[var(--text-main)]">Security Tips</h4>
                                <ul className="text-xs text-[var(--text-muted)] space-y-3">
                                    {[
                                        "Use at least 12 characters",
                                        "Combine uppercase, lowercase, numbers, and symbols",
                                        "Avoid common dictionary words",
                                        "Never reuse passwords from other accounts",
                                    ].map(tip => (
                                        <li key={tip} className="flex gap-2">
                                            <span className="material-symbols-outlined text-[14px] text-[var(--color-primary)] shrink-0">check_circle</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
