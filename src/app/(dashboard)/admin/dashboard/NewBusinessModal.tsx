"use client";

import { useState } from "react";
import { createBusinessAction } from "./actions";
import { motion, AnimatePresence } from "framer-motion";

interface NewBusinessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SuccessData {
    businessId: string;
    username: string;
}

export function NewBusinessModal({ isOpen, onClose }: NewBusinessModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successData, setSuccessData] = useState<SuccessData | null>(null);

    // Form states
    const [businessName, setBusinessName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if (!isOpen) return null;

    async function handleFinalSubmit() {
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("businessName", businessName);
        formData.append("ownerName", ownerName);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);

        try {
            const result = await createBusinessAction(formData);
            if (result?.error) {
                setError(result.error);
            } else if (result?.success && result.data) {
                setSuccessData(result.data);
            } else {
                onClose();
            }
        } catch {
            setError("A communication error occurred with the registry.");
        } finally {
            setLoading(false);
        }
    }

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 20 }
    };

    const stepVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <motion.div 
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={modalVariants}
                className="bg-[var(--bg-card)] border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] relative"
            >
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)] opacity-5 rounded-full blur-[6rem] -mr-32 -mt-32 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 opacity-5 rounded-full blur-[6rem] -ml-32 -mb-32 pointer-events-none"></div>

                {/* Header */}
                <div className="px-8 py-7 border-b border-white/5 flex items-center justify-between relative z-10">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-[var(--text-main)] tracking-tight">
                            {successData ? "Registration Complete" : "Register New Business"}
                        </h2>
                        {!successData && (
                            <div className="flex gap-1.5 mt-2">
                                <div className={`h-1 w-8 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-[var(--color-primary)]' : 'bg-white/10'}`}></div>
                                <div className={`h-1 w-8 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-[var(--color-primary)]' : 'bg-white/10'}`}></div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="size-10 rounded-full border border-white/5 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5 transition-all outline-none"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <div className="relative min-h-[400px]">
                    <AnimatePresence mode="wait" custom={step}>
                        {!successData ? (
                            <motion.div
                                key={step}
                                custom={step}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="p-8 space-y-6 flex flex-col h-full"
                            >
                                {error && (
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold animate-shake">
                                        {error}
                                    </div>
                                )}

                                {step === 1 ? (
                                    <div className="space-y-6 flex-1">
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-bold">Business Details</h3>
                                            <p className="text-sm text-[var(--text-muted)] leading-relaxed">Provide the basic information for the new business.</p>
                                        </div>
                                        <div className="group">
                                            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 ml-1">
                                                Business Name
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={businessName}
                                                    onChange={(e) => setBusinessName(e.target.value)}
                                                    autoFocus
                                                    placeholder="e.g. Serenity Bay Spa"
                                                    className="w-full bg-white/5 border border-white/5 rounded-2xl h-14 px-5 text-base font-medium focus:bg-white/[0.08] focus:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all placeholder:text-white/20 outline-none"
                                                />
                                                <span className="absolute right-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20 group-focus-within:text-[var(--color-primary)]/50 transition-colors">
                                                    spa
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 flex-1">
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-bold">Administrator Account</h3>
                                            <p className="text-sm text-[var(--text-muted)] leading-relaxed">Set up the primary administrator account for this business.</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1 opacity-50">Administrator Name</label>
                                                <input
                                                    type="text"
                                                    value={ownerName}
                                                    onChange={(e) => setOwnerName(e.target.value)}
                                                    placeholder="Full Name"
                                                    className="w-full bg-white/5 border border-white/5 rounded-xl h-12 px-4 text-sm font-medium focus:bg-white/[0.08] focus:border-[var(--color-primary)]/30 transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1 opacity-50">Username</label>
                                                <input
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    placeholder="unique_id"
                                                    className="w-full bg-white/5 border border-white/5 rounded-xl h-12 px-4 text-sm font-medium focus:bg-white/[0.08] focus:border-[var(--color-primary)]/30 transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1 opacity-50">Email Address</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="owner@domain.com"
                                                className="w-full bg-white/5 border border-white/5 rounded-xl h-12 px-4 text-sm font-medium focus:bg-white/[0.08] focus:border-[var(--color-primary)]/30 transition-all outline-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1 opacity-50">Password (Temporary)</label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-white/5 border border-white/5 rounded-xl h-12 px-4 text-sm font-medium focus:bg-white/[0.08] focus:border-[var(--color-primary)]/30 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={step === 1 ? onClose : () => setStep(1)}
                                        className="h-14 px-6 rounded-2xl border border-white/5 font-bold hover:bg-white/5 hover:text-[var(--text-main)] transition-all text-[var(--text-muted)] text-sm flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">{step === 1 ? 'close' : 'arrow_back'}</span>
                                        {step === 1 ? 'Cancel' : 'Previous Step'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={step === 1 ? () => setStep(2) : handleFinalSubmit}
                                        disabled={loading || (step === 1 && !businessName) || (step === 2 && (!ownerName || !username || !email || !password))}
                                        className="flex-1 h-14 bg-[var(--text-main)] text-[var(--bg-app)] rounded-2xl font-bold shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:hover:scale-100 group"
                                    >
                                        {loading ? (
                                            <span className="size-5 border-3 border-[var(--bg-app)] border-t-transparent rounded-full animate-spin"></span>
                                        ) : (
                                            <>
                                                {step === 1 ? 'Admin Account' : 'Create Business'}
                                                <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">
                                                    {step === 1 ? 'arrow_forward' : 'bolt'}
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-8 space-y-8 relative z-10"
                            >
                                <div className="flex flex-col items-center text-center gap-5">
                                    <div className="size-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] relative">
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", delay: 0.2 }}
                                            className="material-symbols-outlined text-4xl"
                                        >
                                            verified_user
                                        </motion.div>
                                        <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-20"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-display font-bold text-[var(--text-main)]">Business Registered</h3>
                                        <p className="text-sm text-[var(--text-muted)] max-w-[80%] mx-auto leading-relaxed">
                                            The <span className="text-[var(--text-main)] font-semibold">{businessName}</span> has been successfully registered in the system.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-black/20 backdrop-blur-sm border border-white/5 rounded-[2rem] p-6 space-y-5">
                                    <div className="flex items-center justify-between group">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em]">Business ID</p>
                                            <p className="text-sm font-mono font-bold text-[var(--color-primary)]">{successData.businessId}</p>
                                        </div>
                                        <button 
                                            onClick={() => navigator.clipboard.writeText(successData.businessId)}
                                            className="size-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/20 hover:text-white/60 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <span className="material-symbols-outlined text-lg">content_copy</span>
                                        </button>
                                    </div>
                                    <div className="h-px bg-white/5 w-full"></div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em]">Admin Username</p>
                                            <p className="text-sm font-bold text-[var(--text-main)]">{successData.username}</p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em]">Status</p>
                                            <p className="text-sm font-bold text-emerald-400">Registered</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button 
                                        onClick={() => {
                                            const text = `Welcome to Sauna SPA Engine! 🌿\n\nYour sanctuary node is ready for setup.\nBusiness ID: ${successData.businessId}\nLogin: ${successData.username}\n\nGet started at: ${window.location.origin}/login`;
                                            navigator.clipboard.writeText(text);
                                        }}
                                        className="w-full h-16 bg-[var(--text-main)] text-[var(--bg-app)] rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20"
                                    >
                                        <span className="material-symbols-outlined text-xl">ios_share</span>
                                        Copy Welcome Details
                                    </button>
                                    <button 
                                        onClick={onClose}
                                        className="w-full h-14 bg-white/5 border border-white/10 text-[var(--text-main)] rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
