"use client";

import { useState } from "react";

interface PaymentFormProps {
    email: string;
    amount: number;
    plan: string;
    cycle: string;
    hideFooter?: boolean;
}

type Stage = "idle" | "loading" | "pending" | "error" | "success";

function fmt(n: number) {
    return n.toLocaleString("en-RW");
}

export function PaymentForm({ email, amount, plan, cycle, hideFooter = false }: PaymentFormProps) {
    const [phone, setPhone] = useState("");
    const [stage, setStage] = useState<Stage>("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [depositId, setDepositId] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        // Validation: phone is only required if amount > 0
        if (amount > 0 && !phone) {
            setErrorMsg("MoMo phone number is required.");
            setStage("error");
            return;
        }

        setStage("loading");
        setErrorMsg("");

        try {
            const res = await fetch("/api/payments/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, phone, planId: "" }), // planId handled by business's current draft if skipped
            });

            const data = await res.json() as { depositId?: string; error?: string; status?: string; message?: string };

            if (!res.ok || data.error) {
                setErrorMsg(data.error ?? "Failed to initiate payment.");
                setStage("error");
                return;
            }

            if (data.status === "SUCCESS") {
                setSuccessMsg(data.message || "Plan activated successfully.");
                setStage("success");
                return;
            }

            setDepositId(data.depositId ?? "");
            setStage("pending");
        } catch {
            setErrorMsg("Network error. Please check your connection and try again.");
            setStage("error");
        }
    }

    if (stage === "success") {
        return (
            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[2.5rem] p-8 space-y-6 shadow-xl shadow-black/5">
                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-emerald-500">check_circle</span>
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="font-black text-[var(--text-main)] text-lg">Plan Activated!</h3>
                        <p className="text-[var(--text-muted)] text-sm font-medium leading-relaxed">
                            {successMsg} Your account is now fully operational.
                        </p>
                    </div>
                </div>

                <a
                    href="/dashboard"
                    className="w-full py-5 bg-[var(--color-primary)] hover:opacity-90 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-[var(--color-primary)]/20 transition-all text-center text-sm flex items-center justify-center gap-3"
                >
                    <span className="material-symbols-outlined font-black">dashboard</span>
                    Go to Dashboard
                </a>
            </div>
        );
    }

    if (stage === "pending") {
        return (
            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[2.5rem] p-8 space-y-6 shadow-xl shadow-black/5">
                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="size-16 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-[var(--color-primary)] animate-pulse">phone_in_talk</span>
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="font-black text-[var(--text-main)] text-lg">Check Your Phone</h3>
                        <p className="text-[var(--text-muted)] text-sm font-medium leading-relaxed">
                            A Mobile Money prompt has been sent to <span className="font-black text-[var(--text-main)]">{phone}</span>.
                            Approve the payment of <span className="font-black text-[var(--color-primary)]">RWF {fmt(amount)}</span> to activate your account.
                        </p>
                    </div>

                    <div className="w-full bg-[var(--bg-surface-muted)] rounded-2xl p-4 border border-[var(--border-muted)] space-y-2">
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                            <span className="material-symbols-outlined text-base text-[var(--color-primary)]">info</span>
                            <p className="text-xs font-bold">Payment reference: <span className="font-black text-[var(--text-main)] font-mono">{depositId.slice(0, 8).toUpperCase()}</span></p>
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] font-medium opacity-70 leading-relaxed">
                            The prompt expires in 5 minutes. Once you approve on your phone, your account activates automatically — no manual verification needed.
                        </p>
                    </div>

                    <p className="text-[10px] text-[var(--text-muted)] text-center opacity-60 font-medium">
                        Didn&apos;t receive the prompt? <button onClick={() => setStage("idle")} className="text-[var(--color-primary)] font-black hover:underline">Try again</button>
                    </p>
                </div>

                {!hideFooter && (
                    <a
                        href="/login"
                        className="w-full py-5 bg-[var(--color-primary)] hover:opacity-90 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-[var(--color-primary)]/20 transition-all text-center text-sm flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined font-black">login</span>
                        Sign In to Dashboard
                    </a>
                )}
            </div>
        );
    }

    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[2.5rem] p-8 space-y-6 shadow-xl shadow-black/5">
            <div className="flex items-center gap-3 border-b border-[var(--border-muted)] pb-5">
                <span className="material-symbols-outlined text-[var(--color-primary)]">mobile_friendly</span>
                <h2 className="text-lg font-black text-[var(--text-main)]">Pay via Mobile Money</h2>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Plan</p>
                    <p className="font-black text-[var(--text-main)] mt-1">{plan}</p>
                </div>
                <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Billing</p>
                    <p className="font-black text-[var(--text-main)] mt-1">{cycle}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Amount Due</p>
                    <p className="font-black text-3xl text-[var(--color-primary)] mt-1">
                        {fmt(amount)} <span className="text-sm text-[var(--text-muted)]">RWF</span>
                    </p>
                </div>
            </div>

            {/* Correspondent chips */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2.5">
                    <span className="material-symbols-outlined text-yellow-500 text-base">sim_card</span>
                    <span className="text-[10px] font-black text-yellow-600 dark:text-yellow-400 uppercase tracking-widest">MTN 078/079</span>
                </div>
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                    <span className="material-symbols-outlined text-red-500 text-base">sim_card</span>
                    <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">Airtel 072/073</span>
                </div>
            </div>

            {/* Phone form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {amount > 0 && (
                    <div>
                        <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">
                            Your MoMo Phone Number
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-black text-sm">+250</span>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    if (stage === "error") setStage("idle");
                                }}
                                placeholder="78 000 0000"
                                required
                                className="w-full pl-16 pr-4 py-4 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-xl text-sm font-bold text-[var(--text-main)] focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)]/40 outline-none transition-all"
                            />
                        </div>
                        {stage === "error" && (
                            <p className="mt-2 text-xs text-rose-500 font-bold">{errorMsg}</p>
                        )}
                    </div>
                )}

                <div className="bg-[var(--bg-surface-muted)] rounded-xl p-4 border border-[var(--border-muted)] flex items-start gap-3">
                    <span className="material-symbols-outlined text-[var(--color-primary)] text-base shrink-0 mt-0.5">info</span>
                    <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                        {amount > 0 
                            ? "You will receive a USSD push on your phone. Approve the prompt to complete payment. Your account activates instantly."
                            : "Click the button below to activate your Free Forever plan. You will be able to start managing your branch immediately."}
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={stage === "loading"}
                    className="w-full py-5 bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-[var(--color-primary)]/20 transition-all text-center text-sm flex items-center justify-center gap-3"
                >
                    {stage === "loading" ? (
                        <>
                            <span className="material-symbols-outlined font-black animate-spin">progress_activity</span>
                            {amount > 0 ? "Sending Prompt..." : "Activating..."}
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined font-black">{amount > 0 ? "send_money" : "check_circle"}</span>
                            {amount > 0 ? `Pay RWF ${fmt(amount)} via MoMo` : "Activate Free Plan"}
                        </>
                    )}
                </button>
            </form>

            {!hideFooter && (
                <p className="text-center text-[10px] text-[var(--text-muted)] opacity-60 font-medium">
                    Want to pay later?{" "}
                    <a href="/login" className="text-[var(--color-primary)] font-black hover:underline">Sign in</a>
                    {" "}— your account is active, payment required to keep access.
                </p>
            )}
        </div>
    );
}
