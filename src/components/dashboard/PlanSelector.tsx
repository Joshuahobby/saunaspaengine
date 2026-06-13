"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Package {
    id: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    description: string | null;
    features: string[];
    isCustom: boolean;
}

interface PlanSelectorProps {
    packages: Package[];
    currentPlanId?: string;
    businessEmail: string;
}

export default function PlanSelector({ packages, currentPlanId, businessEmail }: PlanSelectorProps) {
    const [cycle, setCycle] = useState<"Monthly" | "Yearly">("Monthly");
    const [loading, setLoading] = useState<string | null>(null);
    const [phone, setPhone] = useState("");
    const [showPayInput, setShowPayInput] = useState<string | null>(null);
    const router = useRouter();

    async function handleInitiateSubscription(planId: string, amount: number) {
        if (!phone) {
            alert("Please enter your MoMo phone number.");
            return;
        }

        setLoading(planId);
        try {
            const res = await fetch("/api/payments/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: businessEmail,
                    phone: phone,
                    planId: planId,
                    cycle: cycle,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to initiate payment");

            alert("Payment initiated! Please check your phone for the MoMo prompt.");
            router.refresh();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(null);
        }
    }

    // Sort packages by price
    const sortedPackages = [...packages].sort((a, b) => a.priceMonthly - b.priceMonthly);

    return (
        <div className="space-y-12">
            {/* Cycle Toggle */}
            <div className="flex flex-col items-center gap-6">
                <div className="flex p-1.5 bg-[var(--bg-surface-muted)]/50 backdrop-blur-md rounded-2xl border border-[var(--border-muted)] w-fit">
                    <button
                        onClick={() => setCycle("Monthly")}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            cycle === "Monthly" ? "bg-[var(--text-main)] text-[var(--bg-app)] shadow-lg scale-105" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setCycle("Yearly")}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            cycle === "Yearly" ? "bg-[var(--text-main)] text-[var(--bg-app)] shadow-lg scale-105" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                        }`}
                    >
                        Yearly
                        <span className="bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-[8px] px-1.5 py-0.5 rounded-full">-20%</span>
                    </button>
                </div>
                <p className="text-[var(--text-muted)] text-xs font-medium opacity-60">
                    Switch to yearly billing to save up to 2 months of subscription costs.
                </p>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedPackages.map((pkg) => {
                    const isCurrent = pkg.id === currentPlanId;
                    const price = cycle === "Monthly" ? pkg.priceMonthly : pkg.priceYearly;
                    const displayPrice = price === 0 ? "Free" : (price / (cycle === "Monthly" ? 1 : 12)).toLocaleString();

                    return (
                        <div 
                            key={pkg.id} 
                            className={`relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                                pkg.name === "Premium" 
                                    ? "bg-[var(--bg-card)] border-[var(--color-primary)]/40 shadow-2xl scale-105 z-10" 
                                    : "bg-[var(--bg-card)]/50 border-[var(--border-muted)] hover:border-[var(--color-primary)]/20"
                            }`}
                        >
                            {pkg.name === "Premium" && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-[var(--bg-app)] text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-[0.2em] shadow-lg">
                                    Best Value
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-2">{pkg.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black tracking-tight">{price === 0 ? "Free" : displayPrice}</span>
                                    {price > 0 && <span className="text-[var(--text-muted)] text-xs lowercase">RWF{cycle === "Monthly" ? "/mo" : "/mo equiv."}</span>}
                                </div>
                                <p className="text-[var(--text-muted)] text-[10px] font-bold mt-4 leading-relaxed opacity-60 min-h-[40px]">
                                    {pkg.description}
                                </p>
                            </div>

                            {showPayInput === pkg.id ? (
                                <div className="space-y-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <input 
                                        type="tel"
                                        placeholder="078... Momo Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-[var(--bg-surface-muted)] border-[var(--border-muted)] rounded-2xl px-4 py-3 text-sm font-bold focus:ring-[var(--color-primary)]"
                                    />
                                    {currentPlanId && (
                                        <p className="text-[9px] font-bold text-[var(--color-primary)] uppercase tracking-widest text-center opacity-80">
                                            Mid-cycle adjustment will be applied
                                        </p>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleInitiateSubscription(pkg.id, price)}
                                            disabled={loading === pkg.id}
                                            className="flex-1 h-12 bg-[var(--color-primary)] text-[var(--bg-app)] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-lg"
                                        >
                                            {loading === pkg.id ? "Processing..." : "Confirm Pay"}
                                        </button>
                                        <button
                                            onClick={() => setShowPayInput(null)}
                                            className="size-12 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (price === 0 || isCurrent) return;
                                        setShowPayInput(pkg.id);
                                    }}
                                    disabled={isCurrent || (price === 0 && !isCurrent)}
                                    className={`w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all mb-8 ${
                                        isCurrent 
                                            ? "bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] cursor-default"
                                            : pkg.name === "Premium"
                                            ? "bg-[var(--text-main)] text-[var(--bg-app)] hover:bg-[var(--color-primary)] hover:text-white shadow-xl"
                                            : "bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] hover:border-[var(--color-primary)]/50"
                                    }`}
                                >
                                    {isCurrent ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-sm">check_circle</span>
                                            Current Plan
                                        </span>
                                    ) : price === 0 ? "Default Plan" : "Select Plan"}
                                </button>
                            )}

                            <div className="space-y-4">
                                {pkg.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">check_circle</span>
                                        <span className="text-[10px] font-bold text-[var(--text-main)] opacity-80 leading-tight">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Comparison Footnote */}
            <div className="p-8 rounded-[2rem] bg-orange-500/5 border border-orange-500/10 flex items-start gap-4">
                <span className="material-symbols-outlined text-orange-500 text-2xl">info</span>
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-orange-800 dark:text-orange-400 uppercase tracking-tight">Need a custom enterprise solution?</h4>
                    <p className="text-[10px] font-medium text-orange-700 dark:text-orange-500 opacity-80 leading-relaxed">
                        For businesses with more than 50 branches or custom integration needs, contact our Elite support team at <span className="font-black underline">support@saunaspa.rw</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
