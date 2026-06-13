"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerBusinessAction } from "./actions";
import { signIn } from "next-auth/react";

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
                // Auto-login after successful registration
                const loginResult = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });

                if (loginResult?.error) {
                    setError("Account created, but failed to log in automatically. Please sign in manually.");
                    // Fallback to login page if auto-login fails
                    setTimeout(() => router.push("/login"), 2000);
                } else {
                    router.push("/onboarding");
                }
            }
        } catch (err) {
            console.error("Signup error:", err);
            setError("An unexpected error occurred. Please try again.");
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
                <div className="max-w-[540px] mx-auto w-full">
                    <form onSubmit={handleNext} className="space-y-5">
                        <div className="mb-8">
                            <h2 className="text-[var(--text-main)] text-2xl font-black font-serif">
                                Create Your <span className="text-[var(--color-primary)]">Account</span>
                            </h2>
                            <p className="text-[var(--text-muted)] text-sm mt-2 font-medium">
                                Set up your spa business and go live in minutes
                            </p>
                        </div>

                        {/* ... existing fields ... */}
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

                        <div className="mt-10 pt-8 border-t border-[var(--border-muted)]/50 text-center space-y-4">
                            <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em]">
                                Already have an account?
                            </p>
                            <Link 
                                href="/login" 
                                className="w-full py-4 rounded-xl border border-[var(--border-main)] bg-[var(--bg-surface-muted)] text-[var(--text-main)] text-[10px] font-black uppercase tracking-widest hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all flex items-center justify-center gap-2 group"
                            >
                                <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">login</span>
                                Sign In to Sanctuary
                            </Link>
                        </div>
                    </form>
                </div>
            )}

            {/* ── Step 2: Plan Selection ── */}
            {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center max-w-[600px] mx-auto mb-4">
                        <h2 className="text-[var(--text-main)] text-3xl md:text-4xl font-black font-serif tracking-tight">
                            Choose Your <span className="text-[var(--color-primary)]">Plan</span>
                        </h2>
                        <p className="text-[var(--text-muted)] text-sm mt-3 font-medium px-4">
                            All plans include a 14-day free trial. Select the best fit for your business to activate your workspace instantly.
                        </p>
                    </div>

                    {/* Billing toggle */}
                    <div className="flex items-center justify-center gap-3 p-1 bg-[var(--bg-surface-muted)] rounded-2xl border border-[var(--border-muted)] w-fit mx-auto scale-110">
                        {(["Monthly", "Yearly"] as const).map((cycle) => (
                            <button key={cycle} type="button" onClick={() => setBilling(cycle)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300
                                    ${billing === cycle
                                        ? "bg-[var(--color-primary)] text-white shadow-xl shadow-[var(--color-primary)]/20"
                                        : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}>
                                {cycle}
                                {cycle === "Yearly" && <span className="ml-2 text-[8px] opacity-70">Save 17%</span>}
                            </button>
                        ))}
                    </div>

                    {/* Plan cards */}
                    {/* Plan cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-4">
                        {plans.map((plan) => {
                            const price = billing === "Yearly" ? plan.priceYearly : plan.priceMonthly;
                            const isSelected = selectedPlanId === plan.id;
                            const isPopular = plan.name === "Premium";
                            const isElite = plan.isCustom;

                            return (
                                <label key={plan.id} htmlFor={`plan-${plan.id}`}
                                    className={`relative flex flex-col p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 h-full group
                                        ${isSelected
                                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-2xl shadow-[var(--color-primary)]/10 translate-y-[-4px]"
                                            : "border-[var(--border-muted)] hover:border-[var(--color-primary)]/40 bg-[var(--bg-surface-muted)] hover:translate-y-[-2px]"}`}>
                                    
                                    <input id={`plan-${plan.id}`} type="radio" name="planId" value={plan.id}
                                        checked={isSelected} onChange={() => setSelectedPlanId(plan.id)}
                                        className="sr-only" />

                                    {/* Selection indicator */}
                                    <div className={`absolute top-4 right-4 size-6 rounded-full border-2 flex items-center justify-center transition-all
                                        ${isSelected 
                                            ? "bg-[var(--color-primary)] border-[var(--color-primary)]" 
                                            : "border-[var(--border-muted)] group-hover:border-[var(--color-primary)]/40"}`}>
                                        {isSelected && <span className="material-symbols-outlined text-white text-sm font-black">check</span>}
                                    </div>

                                    {/* Plan Header */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            {isPopular && (
                                                <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-[9px] font-black uppercase rounded-full tracking-wider shadow-lg shadow-[var(--color-primary)]/20">Popular</span>
                                            )}
                                            {isElite && (
                                                <span className="px-3 py-1 bg-[var(--text-muted)]/10 text-[var(--text-muted)] text-[9px] font-black uppercase rounded-full tracking-wider border border-[var(--border-muted)]">Enterprise</span>
                                            )}
                                        </div>
                                        <h3 className="font-black text-[var(--text-main)] text-xl tracking-tight">{plan.name}</h3>
                                        <p className="text-[var(--text-muted)] text-[10px] font-medium mt-1 leading-relaxed line-clamp-2 h-8">{plan.description}</p>
                                    </div>

                                    {/* Pricing */}
                                    <div className="mb-8">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-[var(--text-main)]">{fmt(price)}</span>
                                            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">RWF</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                                            per {billing === "Yearly" ? "year" : "month"}
                                        </p>
                                    </div>

                                    <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-muted)] to-transparent mb-8" />

                                    {/* Features */}
                                    <div className="space-y-4 flex-1">
                                        <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2">Includes:</p>
                                        {plan.features.slice(0, 5).map((f) => (
                                            <div key={f} className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-[var(--color-primary)] text-base shrink-0 mt-0.5 font-black">check_circle</span>
                                                <span className="text-xs font-bold text-[var(--text-main)] leading-tight">{f}</span>
                                            </div>
                                        ))}
                                        {plan.features.length > 5 && (
                                            <p className="text-[10px] font-black text-[var(--color-primary)] pl-8 pt-1 italic">
                                                + {plan.features.length - 5} more features
                                            </p>
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>

                    {/* Footer Summary & Actions */}
                    <div className="max-w-[800px] mx-auto space-y-8 pt-4">
                        {/* Amount due summary */}
                        {selectedPlan && (
                            <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:bg-[var(--color-primary)]/[0.08] transition-colors font-sans">
                                <div className="text-center sm:text-left">
                                    <p className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.3em] mb-1">Due on Activation</p>
                                    <p className="text-[var(--text-main)] text-sm font-black">
                                        {selectedPlan.name} <span className="mx-2 text-[var(--border-muted)]">|</span> {billing} Billing
                                    </p>
                                </div>
                                <div className="text-center sm:text-right">
                                    <div className="flex items-baseline gap-1 justify-center sm:justify-end">
                                        <p className="text-3xl font-black text-[var(--text-main)] tracking-tight">{fmt(dueAmount)}</p>
                                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">RWF</p>
                                    </div>
                                    <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1 opacity-60 italic">Free trial applied automatically</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                                <span className="material-symbols-outlined text-lg shrink-0">error</span>
                                <p className="font-bold">{error}</p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <button type="button" onClick={() => { setStep(1); setError(null); }}
                                className="h-16 px-8 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-surface-muted)] font-black text-[10px] uppercase tracking-[0.2em] text-[var(--text-main)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all flex items-center justify-center gap-2 group">
                                <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                                Back to Details
                            </button>
                            <button type="submit" disabled={isPending || !selectedPlanId}
                                className="flex-1 h-16 bg-[var(--color-primary)] hover:opacity-90 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-[var(--color-primary)]/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm">
                                {isPending ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                        Onboarding Workspace...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined font-black">rocket_launch</span>
                                        Create Account & Launch
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-center text-[10px] text-[var(--text-muted)] opacity-50 font-bold uppercase tracking-widest leading-loose max-w-[500px] mx-auto">
                            No immediate charge. Account setup completes in seconds. 
                            <br />
                            Secured by pawaPay Enterprise Grade Infrastructure.
                        </p>
                    </div>
                </form>
            )}
        </div>
    );
}
