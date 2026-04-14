"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerBusinessAction } from "./actions";

interface Plan {
    id: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    branchLimit: number;
    features: string[];
    description: string | null;
    isCustom: boolean;
}

interface SignupFormProps {
    plans: Plan[];
}

function fmt(n: number) {
    return n.toLocaleString("en-RW");
}

export function SignupForm({ plans }: SignupFormProps) {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Step 1 state
    const [businessName, setBusinessName] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Step 2 state
    const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id ?? "");
    const [billing, setBilling] = useState<"Monthly" | "Yearly">("Monthly");

    const selectedPlan = plans.find((p) => p.id === selectedPlanId);
    const dueAmount = selectedPlan
        ? billing === "Yearly"
            ? selectedPlan.priceYearly
            : selectedPlan.priceMonthly
        : 0;

    function validateStep1() {
        if (!businessName.trim()) return "Business name is required.";
        if (!fullName.trim()) return "Your full name is required.";
        if (!email.trim() || !email.includes("@")) return "A valid email address is required.";
        if (password.length < 8) return "Password must be at least 8 characters.";
        if (password !== confirmPassword) return "Passwords do not match.";
        return null;
    }

    function handleNext(e: React.FormEvent) {
        e.preventDefault();
        const err = validateStep1();
        if (err) { setError(err); return; }
        setError(null);
        setStep(2);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedPlanId) { setError("Please select a plan."); return; }
        setError(null);
        setIsPending(true);
        try {
            const fd = new FormData();
            fd.append("businessName", businessName);
            fd.append("fullName", fullName);
            fd.append("email", email);
            fd.append("password", password);
            fd.append("confirmPassword", confirmPassword);
            fd.append("planId", selectedPlanId);
            fd.append("billingCycle", billing);

            const result = await registerBusinessAction(fd);
            if (result.error) {
                setError(result.error);
                setStep(1);
            } else if (result.success) {
                const params = new URLSearchParams({
                    plan: selectedPlan?.name ?? "",
                    cycle: billing,
                    amount: String(dueAmount),
                    email,
                });
                router.push(`/signup/payment?${params.toString()}`);
            }
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="bg-[var(--bg-card)] p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-black/5 border border-[var(--border-main)]">

            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-8">
                {[1, 2].map((n) => (
                    <div key={n} className="flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center text-xs font-black transition-all
                            ${step >= n
                                ? "bg-[var(--color-primary)] text-white"
                                : "bg-[var(--bg-surface-muted)] text-[var(--text-muted)] border border-[var(--border-muted)]"}`}>
                            {n}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block
                            ${step >= n ? "text-[var(--text-main)]" : "text-[var(--text-muted)] opacity-40"}`}>
                            {n === 1 ? "Account Details" : "Choose Plan"}
                        </span>
                        {n < 2 && <div className={`h-px w-8 md:w-16 ${step > n ? "bg-[var(--color-primary)]" : "bg-[var(--border-muted)]"}`} />}
                    </div>
                ))}
            </div>

            {/* ── Step 1: Account Details ── */}
            {step === 1 && (
                <form onSubmit={handleNext} className="space-y-5">
                    <div className="mb-8">
                        <h2 className="text-[var(--text-main)] text-2xl font-black font-serif">
                            Create Your <span className="text-[var(--color-primary)]">Account</span>
                        </h2>
                        <p className="text-[var(--text-muted)] text-sm mt-2 font-medium">
                            Set up your spa business and go live in minutes
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Business Name</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl transition-colors group-focus-within:text-[var(--color-primary)] font-black">storefront</span>
                            <input name="businessName" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                                placeholder="e.g. Nordic Calm Wellness Center" required
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all font-bold text-sm" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Your Full Name</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl transition-colors group-focus-within:text-[var(--color-primary)] font-black">person</span>
                            <input name="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                                placeholder="e.g. Amani Uwase" required autoComplete="name"
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all font-bold text-sm" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl transition-colors group-focus-within:text-[var(--color-primary)] font-black">mail</span>
                            <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@yourspa.com" required autoComplete="email"
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all font-bold text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Password</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl transition-colors group-focus-within:text-[var(--color-primary)] font-black">lock</span>
                                <input name="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 8 chars" required minLength={8} autoComplete="new-password"
                                    className="w-full pl-12 pr-10 py-4 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all font-bold text-sm" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors" aria-label="Toggle password">
                                    <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl transition-colors group-focus-within:text-[var(--color-primary)] font-black">lock_reset</span>
                                <input name="confirmPassword" type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat password" required autoComplete="new-password"
                                    className="w-full pl-12 pr-10 py-4 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all font-bold text-sm" />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors" aria-label="Toggle confirm password">
                                    <span className="material-symbols-outlined text-xl">{showConfirm ? "visibility_off" : "visibility"}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                            <span className="material-symbols-outlined text-lg shrink-0">error</span>
                            <p className="font-bold">{error}</p>
                        </div>
                    )}

                    <button type="submit"
                        className="w-full py-5 bg-[var(--color-primary)] hover:opacity-90 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-[var(--color-primary)]/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 mt-6 text-sm">
                        Continue — Choose Plan
                        <span className="material-symbols-outlined font-black">arrow_forward</span>
                    </button>

                    <div className="pt-4 border-t border-[var(--border-muted)] text-center space-y-2">
                        <p className="text-[var(--text-muted)] text-sm font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="text-[var(--color-primary)] font-black hover:underline">Sign in</Link>
                        </p>
                    </div>
                </form>
            )}

            {/* ── Step 2: Plan Selection ── */}
            {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="mb-2">
                        <h2 className="text-[var(--text-main)] text-2xl font-black font-serif">
                            Choose Your <span className="text-[var(--color-primary)]">Plan</span>
                        </h2>
                        <p className="text-[var(--text-muted)] text-sm mt-2 font-medium">
                            All plans include a 14-day free trial. Payment activates your account.
                        </p>
                    </div>

                    {/* Billing toggle */}
                    <div className="flex items-center justify-center gap-3 p-1 bg-[var(--bg-surface-muted)] rounded-xl border border-[var(--border-muted)] w-fit mx-auto">
                        {(["Monthly", "Yearly"] as const).map((cycle) => (
                            <button key={cycle} type="button" onClick={() => setBilling(cycle)}
                                className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all
                                    ${billing === cycle
                                        ? "bg-[var(--color-primary)] text-white shadow-sm"
                                        : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}>
                                {cycle}
                                {cycle === "Yearly" && <span className="ml-2 text-[9px] opacity-80">Save 17%</span>}
                            </button>
                        ))}
                    </div>

                    {/* Plan cards */}
                    <div className="space-y-3">
                        {plans.map((plan) => {
                            const price = billing === "Yearly" ? plan.priceYearly : plan.priceMonthly;
                            const isSelected = selectedPlanId === plan.id;
                            const isPopular = plan.name === "Premium";
                            return (
                                <label key={plan.id} htmlFor={`plan-${plan.id}`}
                                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all
                                        ${isSelected
                                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-lg shadow-[var(--color-primary)]/10"
                                            : "border-[var(--border-muted)] hover:border-[var(--color-primary)]/40 bg-[var(--bg-surface-muted)]"}`}>
                                    <input id={`plan-${plan.id}`} type="radio" name="planId" value={plan.id}
                                        checked={isSelected} onChange={() => setSelectedPlanId(plan.id)}
                                        className="mt-1 accent-[var(--color-primary)] size-4 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-black text-[var(--text-main)] text-base">{plan.name}</span>
                                            {isPopular && (
                                                <span className="px-2 py-0.5 bg-[var(--color-primary)] text-white text-[9px] font-black uppercase rounded-full tracking-wider">Popular</span>
                                            )}
                                            {plan.isCustom && (
                                                <span className="px-2 py-0.5 bg-[var(--text-muted)]/10 text-[var(--text-muted)] text-[9px] font-black uppercase rounded-full tracking-wider border border-[var(--border-muted)]">Enterprise</span>
                                            )}
                                        </div>
                                        <p className="text-[var(--text-muted)] text-xs mt-1 font-medium leading-relaxed">{plan.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {plan.features.slice(0, 3).map((f) => (
                                                <span key={f} className="text-[9px] font-black uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full border border-[var(--color-primary)]/20">
                                                    {f}
                                                </span>
                                            ))}
                                            {plan.features.length > 3 && (
                                                <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text-muted)] opacity-60">
                                                    +{plan.features.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-xl font-black text-[var(--text-main)]">
                                            {fmt(price)}
                                        </div>
                                        <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                            RWF / {billing === "Yearly" ? "yr" : "mo"}
                                        </div>
                                    </div>
                                </label>
                            );
                        })}
                    </div>

                    {/* Amount due summary */}
                    {selectedPlan && (
                        <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-2xl p-4 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">Due on Activation</p>
                                <p className="text-[var(--text-muted)] text-xs mt-0.5 font-medium">
                                    {selectedPlan.name} · {billing} · via Mobile Money
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-[var(--text-main)]">{fmt(dueAmount)}</p>
                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">RWF</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                            <span className="material-symbols-outlined text-lg shrink-0">error</span>
                            <p className="font-bold">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => { setStep(1); setError(null); }}
                            className="h-14 px-6 rounded-2xl border border-[var(--border-muted)] font-bold text-sm text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] hover:text-[var(--text-main)] transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Back
                        </button>
                        <button type="submit" disabled={isPending || !selectedPlanId}
                            className="flex-1 py-4 bg-[var(--color-primary)] hover:opacity-90 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-[var(--color-primary)]/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                            {isPending ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined font-black">rocket_launch</span>
                                    Create Account & Pay
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-[var(--text-muted)] opacity-50 font-medium">
                        Payment instructions via Mobile Money will be shown after account creation.
                    </p>
                </form>
            )}
        </div>
    );
}
