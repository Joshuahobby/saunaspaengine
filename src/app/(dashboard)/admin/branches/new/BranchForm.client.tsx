"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createBranchAction } from "../actions";

import { Session } from "next-auth";

interface Business {
    id: string;
    name: string;
}

interface BranchFormProps {
    availableBusinesses: Business[];
    session: Session;
}

export function BranchForm({ availableBusinesses, session }: BranchFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedBusinessId = searchParams.get("businessId");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        businessId: session.user?.role === "OWNER" ? (session.user.businessId || "") : (preselectedBusinessId || ""),
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!formData.businessId) {
            setError("Please select an owning business.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await createBranchAction(formData);
            if (res.success) {
                router.push("/branches");
                router.refresh();
            } else {
                setError(res.error || "Failed to create branch");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to create branch";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2rem] p-8 shadow-2xl glass-card relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-[0.02] rounded-full blur-3xl -mr-16 -mt-16"></div>
                
                <div className="mb-8 space-y-2 relative z-10">
                    <h1 className="text-3xl font-serif font-black text-white italic tracking-tight">Register New Branch</h1>
                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest italic opacity-60">
                        {session.user?.role === "OWNER" ? "Expand your business footprint with a new location." : "Provision a new operational branch for the network."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50 italic">Owning Business</label>
                        {session.user?.role === "OWNER" ? (
                            <div className="w-full h-12 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-xl px-4 flex items-center font-bold text-sm text-white/50 cursor-not-allowed italic">
                                {availableBusinesses.find(b => b.id === session.user?.businessId)?.name || "Your Business"}
                            </div>
                        ) : (
                            <select
                                required
                                value={formData.businessId}
                                onChange={(e) => setFormData(d => ({ ...d, businessId: e.target.value }))}
                                title="Target Business Selection"
                                className="w-full h-12 bg-[var(--bg-app)] border border-[var(--border-muted)] rounded-xl px-4 font-bold text-sm text-white focus:border-[var(--color-primary)]/50 transition-all outline-none italic appearance-none"
                            >
                                <option value="" disabled className="bg-[#0a0f0d]">Select target business...</option>
                                {availableBusinesses.map(b => (
                                    <option key={b.id} value={b.id} className="bg-[#0a0f0d]">{b.name}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50 italic">Branch Name</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Kigali Downtown Hub"
                            value={formData.name}
                            onChange={(e) => setFormData(d => ({ ...d, name: e.target.value }))}
                            className="w-full h-12 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/40 focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all placeholder:text-[var(--text-muted)] placeholder:opacity-30 italic"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50 italic">Contact Email</label>
                            <input
                                type="email"
                                placeholder="kigali@spa.com"
                                value={formData.email}
                                onChange={(e) => setFormData(d => ({ ...d, email: e.target.value }))}
                                className="w-full h-12 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/40 focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all placeholder:text-[var(--text-muted)] placeholder:opacity-30 italic"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50 italic">Phone Line</label>
                            <input
                                type="tel"
                                placeholder="+250 780 000 000"
                                value={formData.phone}
                                onChange={(e) => setFormData(d => ({ ...d, phone: e.target.value }))}
                                className="w-full h-12 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/40 focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all placeholder:text-[var(--text-muted)] placeholder:opacity-30 italic"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50 italic">Physical Location</label>
                        <input
                            required
                            type="text"
                            placeholder="Street address, City, District"
                            value={formData.address}
                            onChange={(e) => setFormData(d => ({ ...d, address: e.target.value }))}
                            className="w-full h-12 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/40 focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all placeholder:text-[var(--text-muted)] placeholder:opacity-30 italic"
                        />
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 h-12 rounded-xl text-[10px] font-black tracking-widest uppercase text-[var(--text-muted)] border border-[var(--border-muted)] hover:bg-[var(--bg-surface-muted)]/5 transition-all"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] h-12 rounded-xl text-[10px] font-black tracking-widest uppercase bg-[var(--text-main)] text-[var(--bg-app)] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="size-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    Provision Branch
                                    <span className="material-symbols-outlined text-sm font-bold group-hover:translate-x-1 transition-transform italic">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
