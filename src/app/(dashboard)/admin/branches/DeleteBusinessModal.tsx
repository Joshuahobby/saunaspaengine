"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteBusinessAction } from "./actions";

interface DeleteBusinessModalProps {
    isOpen: boolean;
    onClose: () => void;
    business: {
        id: string;
        name: string;
    };
}

export function DeleteBusinessModal({ isOpen, onClose, business }: DeleteBusinessModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmName, setConfirmName] = useState("");

    if (!isOpen) return null;

    async function handleDelete() {
        if (confirmName !== business.name) {
            setError("Business name does not match.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await deleteBusinessAction(business.id);
            if (res.success) {
                onClose();
            } else {
                setError(res.error || "Failed to delete business");
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
                        className="relative w-full max-w-lg bg-[var(--bg-card)] border border-red-500/20 rounded-[2rem] shadow-2xl shadow-red-500/10 overflow-hidden glass-card z-10"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-[var(--border-muted)] flex items-center justify-between bg-red-500/5">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                    <span className="material-symbols-outlined">warning</span>
                                </div>
                                <h2 className="text-xl font-serif font-black text-[var(--text-main)] italic">
                                    Delete Business
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="size-8 flex items-center justify-center rounded-full bg-[var(--bg-surface-muted)]/10 text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                        
                        {/* Body */}
                        <div className="p-8 space-y-6">
                            <p className="text-sm text-[var(--text-muted)] font-medium">
                                You are about to permanently delete <strong className="text-[var(--text-main)]">{business.name}</strong>. This action is irreversible and will cascade-delete all associated employees, services, records, and client info.
                            </p>
                            
                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Type <span className="text-[var(--text-main)]">{business.name}</span> to confirm</label>
                                <input
                                    type="text"
                                    value={confirmName}
                                    onChange={(e) => setConfirmName(e.target.value)}
                                    className="w-full h-12 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-red-500/40 focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-[var(--text-muted)] placeholder:opacity-30"
                                    placeholder={business.name}
                                />
                            </div>
                            
                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="flex-1 h-12 rounded-xl text-sm font-bold text-[var(--text-muted)] border border-[var(--border-muted)] hover:bg-[var(--bg-surface-muted)]/5 hover:text-[var(--text-main)] transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading || confirmName !== business.name}
                                    className="flex-[2] h-12 rounded-xl text-sm font-bold bg-red-500 text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <>
                                            Yes, Delete Everything
                                            <span className="material-symbols-outlined text-sm font-bold">delete_forever</span>
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
