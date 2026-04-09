"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Branch {
    id: string;
    name: string;
}

interface BranchSwitcherProps {
    branches: Branch[];
    activeBranchId?: string;
}

export default function BranchSwitcher({ branches, activeBranchId: propActiveBranchId }: BranchSwitcherProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const activeBranchId = propActiveBranchId || searchParams.get("branchId");
    const activeBranch = branches.find(b => b.id === activeBranchId) || { id: "all", name: "All Branches" };

    const handleSelect = (id: string) => {
        setIsOpen(false);
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (id === "all") {
                params.delete("branchId");
            } else {
                params.set("branchId", id);
            }
            router.push(`?${params.toString()}`);
            router.refresh();
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                    isOpen 
                        ? "bg-[var(--bg-surface-muted)] border-[var(--color-primary)] text-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/5 scale-[1.02]" 
                        : "bg-transparent border-[var(--border-muted)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
                }`}
            >
                <span className="material-symbols-outlined text-[18px]">
                    {activeBranch.id === "all" ? "corporate_fare" : "storefront"}
                </span>
                <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 leading-none italic">
                        Branch Context
                    </span>
                    <span className="text-xs font-bold leading-none tracking-tight">
                        {activeBranch.name}
                    </span>
                </div>
                <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    expand_more
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40 bg-black/5 lg:bg-transparent"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute mt-2 w-64 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                        >
                            <div className="px-3 py-2 text-[9px] font-black uppercase tracking-[0.25em] text-[var(--text-muted)] opacity-50 mb-1">
                                Select Network Focus
                            </div>
                            
                            <button
                                onClick={() => handleSelect("all")}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                                    activeBranch.id === "all" 
                                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold shadow-sm border border-[var(--color-primary)]/10" 
                                        : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] hover:text-[var(--text-main)] font-semibold"
                                }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
                                <span className="text-xs tracking-tight">Aggregated Overview</span>
                            </button>

                            <div className="my-2 h-[1px] bg-[var(--border-muted)] opacity-30" />

                            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                                {branches.map((branch) => (
                                    <button
                                        key={branch.id}
                                        onClick={() => handleSelect(branch.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                                            activeBranch.id === branch.id 
                                                ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold shadow-sm border border-[var(--color-primary)]/10" 
                                                : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] hover:text-[var(--text-main)] font-semibold"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">storefront</span>
                                        <span className="text-xs tracking-tight">{branch.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
