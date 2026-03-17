"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateBranchAction } from "./actions";

interface EditBranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    branch: {
        id: string;
        name: string;
        email?: string | null;
        phone?: string | null;
        address?: string | null;
    };
}

export function EditBranchModal({ isOpen, onClose, branch }: EditBranchModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: branch.name || "",
        email: branch.email || "",
        phone: branch.phone || "",
        address: branch.address || "",
    });

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await updateBranchAction(branch.id, formData);
            if (res.success) {
                onClose();
            } else {
                setError(res.error || "Failed to update branch");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-left">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2rem] shadow-2xl overflow-hidden glass-card z-10"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-[var(--border-muted)] flex items-center justify-between">
                            <h2 className="text-2xl font-serif font-black text-[var(--text-main)] italic">
                                Edit Branch
                            </h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="size-8 flex items-center justify-center rounded-full bg-[var(--bg-surface-muted)]/10 text-[var(--text-muted)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                        
                        {/* Body */}
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Branch Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(state => ({ ...state, name: e.target.value }))}
                                        className="w-full h-12 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/40 focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all placeholder:text-[var(--text-muted)] placeholder:opacity-30"
                                        placeholder="Branch Name"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(state => ({ ...state, email: e.target.value }))}
                                            className="w-full h-12 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/40 focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all placeholder:text-[var(--text-muted)] placeholder:opacity-30"
                                            placeholder="contact@spaname.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(state => ({ ...state, phone: e.target.value }))}
                                            className="w-full h-12 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/40 focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all placeholder:text-[var(--text-muted)] placeholder:opacity-30"
                                            placeholder="+250 700 000"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Physical Address</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData(state => ({ ...state, address: e.target.value }))}
                                        className="w-full h-12 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/40 focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all placeholder:text-[var(--text-muted)] placeholder:opacity-30"
                                        placeholder="Kigali Heights, Rwanda"
                                    />
                                </div>
                                
                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={loading}
                                        className="flex-1 h-12 rounded-xl text-sm font-bold text-[var(--text-muted)] border border-[var(--border-muted)] hover:bg-[var(--bg-surface-muted)]/5 hover:text-[var(--text-main)] hover:border-[var(--text-main)]/20 transition-all disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] h-12 rounded-xl text-sm font-bold bg-[var(--text-main)] text-[var(--bg-app)] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        {loading ? (
                                            <span className="size-4 border-2 border-[var(--bg-app)] border-t-transparent rounded-full animate-spin"></span>
                                        ) : (
                                            <>
                                                Save Changes
                                                <span className="material-symbols-outlined text-sm font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
