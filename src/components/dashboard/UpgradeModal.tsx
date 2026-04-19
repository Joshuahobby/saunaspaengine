"use client";

import { motion, AnimatePresence } from "framer-motion";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    limit?: number;
    current?: number;
    featureName: string;
}

export default function UpgradeModal({ isOpen, onClose, title, message, limit, current, featureName }: UpgradeModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[var(--bg-app)]/80 backdrop-blur-md"
                />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute -top-24 -right-24 size-48 bg-[var(--color-primary)]/10 blur-[80px] rounded-full" />
                    <div className="absolute -bottom-24 -left-24 size-48 bg-[var(--color-primary)]/5 blur-[80px] rounded-full" />

                    <div className="relative space-y-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="size-20 rounded-[2rem] bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shadow-inner mb-2">
                                <span className="material-symbols-outlined text-4xl font-black">upgrade</span>
                            </div>
                            <h3 className="text-3xl font-display font-black text-[var(--text-main)] tracking-tight leading-tight">
                                {title}
                            </h3>
                            <p className="text-sm font-medium text-[var(--text-muted)] leading-relaxed max-w-sm">
                                {message}
                            </p>
                        </div>

                        {limit !== undefined && (
                            <div className="glass-card p-6 rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/30 space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Current Usage</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">{current} / {limit} {featureName}s</span>
                                </div>
                                <div className="w-full h-2 bg-[var(--border-muted)] rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        className="h-full bg-[var(--color-primary)] shadow-[0_0_12px_var(--color-primary)]/40"
                                    />
                                </div>
                                <p className="text-[9px] font-bold italic text-[var(--text-muted)] opacity-60 text-center">
                                    You have reached the maximum allowance for your current plan.
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => window.location.href = "/settings/billing#plans"}
                                className="w-full py-4 rounded-2xl bg-[var(--color-primary)] text-[var(--bg-app)] font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[var(--color-primary)]/20"
                            >
                                Upgrade Plan Now
                            </button>
                            <button 
                                onClick={onClose}
                                className="w-full py-4 rounded-2xl border border-[var(--border-muted)] text-[var(--text-muted)] font-black uppercase tracking-widest text-[11px] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)] transition-all"
                            >
                                Maybe Later
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-4 pt-4 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-xs">verified</span>
                                Secure Payment
                            </div>
                            <div className="size-1 rounded-full bg-[var(--border-muted)]" />
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-xs">rocket_launch</span>
                                Instant Activation
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
