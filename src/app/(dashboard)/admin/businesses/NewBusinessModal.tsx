import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createBusinessAction } from "./actions";

export function NewBusinessModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    
    const [formData, setFormData] = useState({
        name: "",
        taxId: "",
        headquarters: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        
        const res = await createBusinessAction(formData);
        
        setIsSubmitting(false);
        if (res.success) {
            router.refresh();
            onClose();
        } else {
            setError(res.error || "Failed to create branch.");
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="w-full max-w-md bg-[var(--bg-card)] rounded-[2rem] border border-[var(--border-muted)] overflow-hidden shadow-2xl relative"
                >
                    <div className="p-8 pb-6 border-b border-[var(--border-muted)]">
                        <h2 className="text-2xl font-serif font-bold text-[var(--text-main)] italic">New Branch Hub</h2>
                        <p className="text-sm text-[var(--text-muted)] mt-2">Establish a new parent company.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {error && (
                            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest pl-2">Hub Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full h-12 px-5 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-2xl text-[var(--text-main)] focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/50 outline-none transition-all placeholder:text-[var(--text-muted)]/50"
                                    placeholder="e.g. Wellness Holding Group"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest pl-2">Tax ID</label>
                                <input
                                    type="text"
                                    value={formData.taxId}
                                    onChange={e => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
                                    className="w-full h-12 px-5 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-2xl text-[var(--text-main)] focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/50 outline-none transition-all placeholder:text-[var(--text-muted)]/50"
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest pl-2">Headquarters</label>
                                <input
                                    type="text"
                                    value={formData.headquarters}
                                    onChange={e => setFormData(prev => ({ ...prev, headquarters: e.target.value }))}
                                    className="w-full h-12 px-5 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-2xl text-[var(--text-main)] focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/50 outline-none transition-all placeholder:text-[var(--text-muted)]/50"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 h-12 rounded-2xl bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)]/30 transition-colors font-bold tracking-wide disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.name}
                                className="flex-1 h-12 rounded-2xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 transition-colors font-bold tracking-wide disabled:opacity-50 flex items-center justify-center"
                            >
                                {isSubmitting ? <span className="material-symbols-outlined animate-spin">refresh</span> : "Establish Hub"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
} 
