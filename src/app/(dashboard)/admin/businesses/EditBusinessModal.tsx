import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { updateBusinessAction } from "./actions";

export function EditBusinessModal({ isOpen, onClose, business }: { isOpen: boolean, onClose: () => void, business: any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    
    const [formData, setFormData] = useState({
        name: business.name,
        taxId: business.taxId || "",
        headquarters: business.headquarters || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        
        const res = await updateBusinessAction(business.id, formData);
        
        setIsSubmitting(false);
        if (res.success) {
            router.refresh();
            onClose();
        } else {
            setError(res.error || "Failed to update branch.");
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 20, opacity: 0 }}
                    className="w-full max-w-md bg-[#0a0f0d] rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative"
                >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50"></div>
                    
                    <div className="p-10 pb-6 text-center">
                        <h2 className="text-3xl font-serif font-black text-white italic tracking-tight">Hub Architect</h2>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] mt-2 uppercase tracking-[0.3em] italic opacity-60">Updating Organizational Identity</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 pt-4 space-y-8">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] italic ml-2">Official Hub Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white font-serif italic text-lg focus:border-[var(--color-primary)]/50 focus:ring-0 outline-none transition-all placeholder:text-[var(--text-muted)]/20"
                                    placeholder="Sauna SPA Global..."
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] italic ml-2">Tax Identifier (TIN)</label>
                                <input
                                    type="text"
                                    value={formData.taxId}
                                    onChange={e => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
                                    className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white font-mono text-sm tracking-widest focus:border-[var(--color-primary)]/50 focus:ring-0 outline-none transition-all placeholder:text-[var(--text-muted)]/20"
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] italic ml-2">Headquarters Location</label>
                                <input
                                    type="text"
                                    value={formData.headquarters}
                                    onChange={e => setFormData(prev => ({ ...prev, headquarters: e.target.value }))}
                                    className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold focus:border-[var(--color-primary)]/50 focus:ring-0 outline-none transition-all placeholder:text-[var(--text-muted)]/20"
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-14 w-full rounded-2xl bg-white text-black hover:bg-[var(--color-primary)] hover:text-white transition-all duration-500 font-black tracking-[0.2em] text-[10px] uppercase disabled:opacity-50 flex items-center justify-center gap-3 group shadow-xl"
                            >
                                {isSubmitting ? <span className="material-symbols-outlined animate-spin">refresh</span> : (
                                    <>
                                        COMMIT CHANGES
                                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">bolt</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="h-10 w-full rounded-xl text-[var(--text-muted)] hover:text-white transition-colors font-bold tracking-widest text-[9px] uppercase disabled:opacity-50"
                            >
                                Discard Edits
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
} 
