"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset, performPasswordReset } from "@/lib/actions";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleSendCode() {
        if (!email) { toast.error("Please enter your email address."); return; }
        setIsSendingCode(true);
        const result = await requestPasswordReset(email);
        setIsSendingCode(false);
        if (result.success) {
            toast.success("Recovery code sent — check your inbox.");
            setCodeSent(true);
        } else {
            toast.error(result.error || "Failed to send code. Please try again.");
        }
    }

    async function handleReset(e: React.FormEvent) {
        e.preventDefault();
        if (otp.length !== 6) { toast.error("Enter the 6-digit code from your email."); return; }
        if (!password) { toast.error("Please enter a new password."); return; }
        if (password !== confirmPassword) { toast.error("Passwords do not match."); return; }
        if (password.length < 8) { toast.error("Password must be at least 8 characters."); return; }

        setIsResetting(true);
        const result = await performPasswordReset(email, otp, password);
        setIsResetting(false);

        if (result.success) {
            setIsSuccess(true);
        } else {
            toast.error(result.error || "Invalid or expired code. Please try again.");
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Brand Panel */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col relative overflow-hidden"
                style={{ background: "linear-gradient(160deg, #1a3a1a 0%, #0f2410 50%, #0a1a0a 100%)" }}>

                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, #4a8c43 0%, transparent 70%)" }} />

                <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
                    <Link href="/" className="flex items-center gap-3 group w-fit">
                        <div className="size-10 rounded-xl flex items-center justify-center border border-white/20 bg-white/10 backdrop-blur-sm group-hover:bg-white/15 transition-colors">
                            <span className="material-symbols-outlined text-white text-xl">spa</span>
                        </div>
                        <div>
                            <p className="text-white font-black text-sm tracking-tight leading-none">Sauna SPA</p>
                            <p className="text-green-400/80 text-[10px] font-bold tracking-widest uppercase">Engine</p>
                        </div>
                    </Link>

                    <div className="flex-1 flex flex-col justify-center">
                        {/* Lock icon visual */}
                        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-8">
                            <span className="material-symbols-outlined text-green-400 text-3xl">lock_reset</span>
                        </div>

                        <h1 className="text-white text-3xl xl:text-4xl font-black leading-tight tracking-tight">
                            Account<br />
                            <span className="text-green-400">recovery.</span>
                        </h1>
                        <p className="text-white/50 text-sm font-medium mt-4 leading-relaxed max-w-xs">
                            Enter your email, get a one-time code, and set your new password — all in one step.
                        </p>

                        {/* Steps */}
                        <div className="mt-10 space-y-4">
                            {[
                                { step: "1", title: "Enter your email", desc: "We'll send a 6-digit code to your inbox" },
                                { step: "2", title: "Enter the code", desc: "Check your email — it expires in 15 minutes" },
                                { step: "3", title: "Set new password", desc: "Choose a strong, unique password" },
                            ].map(s => (
                                <div key={s.step} className="flex items-start gap-3">
                                    <div className="size-7 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-green-400 text-xs font-black">{s.step}</span>
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-bold">{s.title}</p>
                                        <p className="text-white/40 text-xs font-medium mt-0.5">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-white/20 text-[10px] font-medium">© 2026 Sauna SPA Engine. All rights reserved.</p>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg flex items-center justify-center bg-[#1a3a1a]">
                            <span className="material-symbols-outlined text-white text-sm">spa</span>
                        </div>
                        <span className="text-gray-900 font-black text-sm tracking-tight">Sauna SPA Engine</span>
                    </Link>
                    <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                        Back to Login
                    </Link>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-10">
                    <div className="w-full max-w-[400px]">

                        {isSuccess ? (
                            /* ── Success State ── */
                            <div className="text-center">
                                <div className="size-16 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
                                    <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Password updated</h2>
                                <p className="text-gray-500 text-sm font-medium mt-2">Your password has been successfully reset. You can now sign in.</p>
                                <Link
                                    href="/login"
                                    className="mt-8 w-full h-11 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
                                    style={{ background: "linear-gradient(135deg, #2d5a27 0%, #1a3a1a 100%)" }}
                                >
                                    Go to Login
                                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                                </Link>
                            </div>
                        ) : (
                            /* ── Recovery Form ── */
                            <div>
                                <div className="mb-8">
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Reset password</h2>
                                    <p className="text-gray-500 text-sm font-medium mt-1">
                                        Fill in all fields — send the code to your email, then set your new password.
                                    </p>
                                </div>

                                <form onSubmit={handleReset} className="space-y-5">
                                    {/* Email + Send Code */}
                                    <div>
                                        <label htmlFor="fp-email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                                        <div className="flex gap-2">
                                            <input
                                                id="fp-email"
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder="you@yourspa.com"
                                                className="flex-1 h-11 bg-white border border-gray-300 rounded-lg px-3.5 text-sm text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10 transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleSendCode}
                                                disabled={!email || isSendingCode}
                                                className="h-11 px-4 rounded-lg text-sm font-bold text-white shrink-0 disabled:opacity-50 flex items-center gap-1.5 transition-all whitespace-nowrap"
                                                style={{ background: "linear-gradient(135deg, #2d5a27 0%, #1a3a1a 100%)" }}
                                            >
                                                {isSendingCode
                                                    ? <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                    : codeSent ? "Resend" : "Send Code"
                                                }
                                            </button>
                                        </div>
                                        {codeSent && (
                                            <p className="mt-2 text-xs font-medium text-green-700 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-sm">mark_email_read</span>
                                                Code sent! Check your inbox.
                                            </p>
                                        )}
                                    </div>

                                    {/* OTP */}
                                    <div>
                                        <label htmlFor="fp-otp" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            6-digit verification code
                                        </label>
                                        <input
                                            id="fp-otp"
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={otp}
                                            onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                                            placeholder="e.g. 123456"
                                            className="w-full h-11 bg-white border border-gray-300 rounded-lg px-3.5 text-sm text-gray-900 font-bold tracking-[0.3em] placeholder:tracking-normal placeholder:font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10 transition-all"
                                        />
                                    </div>

                                    {/* Divider */}
                                    <div className="flex items-center gap-3 py-1">
                                        <div className="flex-1 h-px bg-gray-100" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Password</span>
                                        <div className="flex-1 h-px bg-gray-100" />
                                    </div>

                                    {/* New password */}
                                    <div>
                                        <label htmlFor="fp-password" className="block text-sm font-semibold text-gray-700 mb-1.5">New password</label>
                                        <input
                                            id="fp-password"
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="Min. 8 characters"
                                            className="w-full h-11 bg-white border border-gray-300 rounded-lg px-3.5 text-sm text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#2d5a27] focus:ring-2 focus:ring-[#2d5a27]/10 transition-all"
                                        />
                                    </div>

                                    {/* Confirm password */}
                                    <div>
                                        <label htmlFor="fp-confirm" className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm password</label>
                                        <input
                                            id="fp-confirm"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            placeholder="Repeat your new password"
                                            className={`w-full h-11 bg-white border rounded-lg px-3.5 text-sm text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                                                confirmPassword && password !== confirmPassword
                                                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                                    : "border-gray-300 focus:border-[#2d5a27] focus:ring-[#2d5a27]/10"
                                            }`}
                                        />
                                        {confirmPassword && password !== confirmPassword && (
                                            <p className="mt-1.5 text-xs font-medium text-red-600">Passwords do not match</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isResetting || !otp || !password || password !== confirmPassword}
                                        className="w-full h-11 rounded-lg text-sm font-bold text-white transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                                        style={{ background: "linear-gradient(135deg, #2d5a27 0%, #1a3a1a 100%)" }}
                                    >
                                        {isResetting ? (
                                            <>
                                                <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                Update Password
                                                <span className="material-symbols-outlined text-base">lock_open</span>
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <p className="text-sm text-gray-500 font-medium text-center">
                                        Remembered your password?{" "}
                                        <Link href="/login" className="font-bold text-[#2d5a27] hover:text-[#21431d] transition-colors">
                                            Back to Login
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
