import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { deleteBusinessAction } from "./actions";

export function DeleteBusinessModal({ isOpen, onClose, business }: { isOpen: boolean; onClose: () => void; business: { id: string; name: string } }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmationName, setConfirmationName] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (confirmationName !== business.name) {
            setError("Branch name does not match.");
            return;
        }

        setIsSubmitting(true);
        const res = await deleteBusinessAction(business.id);
        
        setIsSubmitting(false);
        if (res.success) {
            router.refresh();
            onClose();
        } else {
            setError(res.error || "Failed to delete branch.");
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
                    className="w-full max-w-md bg-[var(--bg-card)] rounded-[2rem] border border-rose-500/20 overflow-hidden shadow-2xl relative"
                >
                    <div className="absolute top-0 inset-x-0 h-1 bg-rose-500"></div>

                    <div className="p-8 pb-6 border-b border-[var(--border-muted)] text-center">
                        <div className="size-16 mx-auto bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-6 border border-rose-500/20">
                            <span className="material-symbols-outlined text-3xl">delete_forever</span>
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-rose-500 italic">Delete Branch Hub</h2>
                        <p className="text-sm text-[var(--text-muted)] mt-3 leading-relaxed">
                            This action is permanent. All branches, services, revenue records, and clients associated with <b className="text-[var(--text-main)] not-italic">{business.name}</b> will be <u className="decoration-rose-500">destroyed completely</u>.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {error && (
                            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest pl-2">Type &quot;{business.name}&quot;</label>
                            <input
                                required
                                type="text"
                                value={confirmationName}
                                onChange={e => setConfirmationName(e.target.value)}
                                className="w-full h-12 px-5 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-2xl text-[var(--text-main)] focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 outline-none transition-all font-mono"
                                placeholder="..."
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 h-12 rounded-2xl bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)]/30 transition-colors font-bold tracking-wide disabled:opacity-50"
                            >
                                Keep Hub
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || confirmationName !== business.name}
                                className="flex-1 h-12 rounded-2xl bg-rose-500 text-white hover:bg-rose-600 transition-colors font-bold tracking-wide disabled:opacity-50 flex items-center justify-center"
                            >
                                {isSubmitting ? <span className="material-symbols-outlined animate-spin">refresh</span> : "Destroy Permanently"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
} 
