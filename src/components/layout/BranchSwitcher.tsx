"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
        
        // PERSISTENCE: Set cookie for server-side context resolution
        if (id === "all") {
            document.cookie = "sauna_active_branch=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        } else {
            // Set cookie for 30 days
            const date = new Date();
            date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
            document.cookie = `sauna_active_branch=${id}; path=/; expires=${date.toUTCString()}`;
        }

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
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 leading-none">
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
                                    <div key={branch.id} className="group relative flex items-center gap-1 px-1">
                                        <button
                                            onClick={() => handleSelect(branch.id)}
                                            className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                                                activeBranch.id === branch.id 
                                                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold shadow-sm border border-[var(--color-primary)]/10" 
                                                    : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] hover:text-[var(--text-main)] font-semibold"
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">storefront</span>
                                            <span className="text-xs tracking-tight truncate max-w-[140px]">{branch.name}</span>
                                        </button>
                                        
                                        <Link
                                            href={`/branches/${branch.id}`}
                                            onClick={() => setIsOpen(false)}
                                            className="size-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-all border border-transparent hover:border-[var(--color-primary)]/20 shadow-sm"
                                            title="View Executive Hub"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">query_stats</span>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
