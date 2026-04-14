"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateBusinessAction } from "../actions";

interface PlatformPackage {
    id: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    isCustom: boolean;
    description: string | null;
    branchLimit: number;
    features: string[];
}

interface AssignPackageModalProps {
    isOpen: boolean;
    onClose: () => void;
    availablePackages: PlatformPackage[];
    business: {
        id: string;
        name: string;
        subscriptionPlanId?: string | null;
        subscriptionCycle?: string | null;
        subscriptionStatus?: string | null;
    };
}

export function AssignPackageModal({ isOpen, onClose, business, availablePackages }: AssignPackageModalProps) {
    const [selectedPlanId, setSelectedPlanId] = useState(business.subscriptionPlanId || (availablePackages.length > 0 ? availablePackages[0].id : ""));
    const [cycle, setCycle] = useState(business.subscriptionCycle || "Monthly");
    const [status, setStatus] = useState(business.subscriptionStatus || "ACTIVE");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (business.subscriptionPlanId) setSelectedPlanId(business.subscriptionPlanId);
        if (business.subscriptionCycle) setCycle(business.subscriptionCycle);
        if (business.subscriptionStatus) setStatus(business.subscriptionStatus);
    }, [business]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateBusinessAction(business.id, {
                subscriptionPlanId: selectedPlanId,
                subscriptionCycle: cycle,
                subscriptionStatus: status,
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 lg:p-10 space-y-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <div className="flex items-center justify-between sticky top-0 bg-[var(--bg-card)] z-20 pb-4">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-serif font-bold text-[var(--text-main)] italic">Package Management</h2>
                                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest italic opacity-60">Provisioning Access for {business.name}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="size-10 rounded-full bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availablePackages.map((plan) => (
                                    <div
                                        key={plan.id}
                                        onClick={() => setSelectedPlanId(plan.id)}
                                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden group/plan ${selectedPlanId === plan.id ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-[var(--border-muted)] hover:border-[var(--color-primary)]/30"}`}
                                    >
                                        {plan.isCustom && (
                                            <div className="absolute -right-8 top-5 rotate-45 bg-amber-500 text-black text-[7px] font-black py-1 px-10 uppercase tracking-widest shadow-lg">Enterprise</div>
                                        )}
                                        <div className="space-y-1">
                                            <h3 className="font-serif font-black italic text-lg text-[var(--text-main)] group-hover/plan:text-[var(--color-primary)] transition-colors">{plan.name}</h3>
                                            <p className="text-2xl font-mono font-bold text-[var(--color-primary)]">
                                                ${cycle === "Monthly" ? plan.priceMonthly : plan.priceYearly}
                                                <span className="text-[10px] text-[var(--text-muted)] tracking-tighter">/{cycle === "Monthly" ? "mo" : "yr"}</span>
                                            </p>
                                        </div>
                                        <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest border-b border-[var(--border-muted)] border-dashed pb-2">
                                            Branch Limit: {plan.branchLimit}
                                        </div>
                                        <ul className="space-y-2 flex-1">
                                            {plan.features.slice(0, 4).map(f => (
                                                <li key={f} className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[10px] text-emerald-500">check_circle</span>
                                                    {f}
                                                </li>
                                            ))}
                                            {plan.features.length > 4 && (
                                                <li className="text-[8px] font-bold text-[var(--text-muted)] opacity-50 uppercase italic">+ {plan.features.length - 4} more features</li>
                                            )}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border-muted)]/30">
                                <div className="space-y-3">
                                    <label htmlFor="billing-cycle" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] italic ml-2">Billing Cycle</label>
                                    <select
                                        id="billing-cycle"
                                        title="Select Billing Cycle"
                                        aria-label="Billing cycle selection"
                                        value={cycle}
                                        onChange={(e) => setCycle(e.target.value)}
                                        className="w-full h-14 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-6 text-sm font-bold text-[var(--text-main)] outline-none focus:border-[var(--color-primary)]/50 transition-all appearance-none"
                                    >
                                        <option value="Monthly" className="bg-[var(--bg-card)]">Monthly Billing</option>
                                        <option value="Yearly" className="bg-[var(--bg-card)]">Yearly Billing (Discounted)</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="account-status" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] italic ml-2">Account Status</label>
                                    <select
                                        id="account-status"
                                        title="Select Account Status"
                                        aria-label="Account status selection"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full h-14 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-6 text-sm font-bold text-[var(--text-main)] outline-none focus:border-[var(--color-primary)]/50 transition-all appearance-none"
                                    >
                                        <option value="ACTIVE" className="bg-[var(--bg-card)]">Active / Delighted</option>
                                        <option value="EXPIRING" className="bg-[var(--bg-card)]">Expiring / At Risk</option>
                                        <option value="CANCELLED" className="bg-[var(--bg-card)]">Cancelled / Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="h-14 flex-1 rounded-2xl border border-[var(--border-muted)] text-[var(--text-muted)] font-bold tracking-widest uppercase text-xs hover:bg-[var(--bg-surface-muted)] transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isLoading || !selectedPlanId}
                                    className="h-14 flex-[2] rounded-2xl bg-[var(--text-main)] text-[var(--bg-app)] font-bold tracking-[0.2em] uppercase text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <span className="animate-spin material-symbols-outlined">sync</span>
                                    ) : (
                                        <>
                                            Save Package Changes
                                            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">bolt</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
