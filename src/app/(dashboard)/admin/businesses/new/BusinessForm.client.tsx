"use client";

import { useState } from "react";
import { createBusinessAction } from "./actions";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PlatformPackage } from "@prisma/client";

interface BusinessFormClientProps {
    packages: PlatformPackage[];
}

interface SuccessData {
    businessId: string;
    username: string;
}

export default function BusinessFormClient({ packages }: BusinessFormClientProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successData, setSuccessData] = useState<SuccessData | null>(null);

    // Form states
    const [businessName, setBusinessName] = useState("");
    const [managerName, setManagerName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [platformPackageId, setPlatformPackageId] = useState(packages[0]?.id || "");

    async function handleFinalSubmit() {
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("businessName", businessName);
        formData.append("managerName", managerName);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("platformPackageId", platformPackageId);

        try {
            const result = await createBusinessAction(formData);
            if (result?.error) {
                setError(result.error);
            } else if (result?.success && result.data) {
                setSuccessData(result.data);
            }
        } catch {
            setError("A communication error occurred with the registry.");
        } finally {
            setLoading(false);
        }
    }

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

    if (successData) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2rem] p-8 space-y-8 shadow-sm relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-5 rounded-full blur-[6rem] -mr-32 -mt-32 pointer-events-none"></div>

                <div className="flex flex-col items-center text-center gap-5 relative z-10">
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
                        <h3 className="text-2xl font-display font-bold text-[var(--text-main)]">Business Registration Successful</h3>
                        <p className="text-sm text-[var(--text-muted)] max-w-[80%] mx-auto leading-relaxed">
                            The business <span className="text-[var(--text-main)] font-semibold">{businessName}</span> has been successfully registered and the primary branch was provisioned.
                        </p>
                    </div>
                </div>

                <div className="bg-[var(--bg-app)]/30 border border-[var(--border-muted)] rounded-[2rem] p-6 space-y-5 relative z-10">
                    <div className="flex items-center justify-between group">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.15em] opacity-60">Business ID</p>
                            <p className="text-sm font-mono font-bold text-[var(--color-primary)]">{successData.businessId}</p>
                        </div>
                        <button 
                            onClick={() => navigator.clipboard.writeText(successData.businessId)}
                            className="size-8 rounded-lg hover:bg-[var(--bg-surface-muted)]/20 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all opacity-0 group-hover:opacity-100"
                        >
                            <span className="material-symbols-outlined text-lg">content_copy</span>
                        </button>
                    </div>
                    <div className="h-px bg-[var(--border-muted)] w-full"></div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.15em] opacity-60">Owner Username</p>
                            <p className="text-sm font-bold text-[var(--text-main)]">{successData.username}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.15em] opacity-60">Status</p>
                            <p className="text-sm font-bold text-emerald-500">Active</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 relative z-10">
                    <button 
                        onClick={() => {
                            const text = `Welcome to Sauna SPA Engine! 🌿\n\nYour business is ready.\nBusiness ID: ${successData.businessId}\nLogin Username: ${successData.username}\n\nGet started at: ${window.location.origin}/login`;
                            navigator.clipboard.writeText(text);
                        }}
                        className="w-full h-16 bg-[var(--text-main)] text-[var(--bg-app)] rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10"
                    >
                        <span className="material-symbols-outlined text-xl">ios_share</span>
                        Copy Welcome Details
                    </button>
                    <Link 
                        href="/dashboard"
                        className="flex items-center justify-center w-full h-14 bg-[var(--bg-surface-muted)]/5 border border-[var(--border-muted)] text-[var(--text-main)] rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-[var(--bg-surface-muted)]/20 transition-all"
                    >
                        Return to Business Portfolio
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2rem] overflow-hidden shadow-sm relative min-h-[500px] flex flex-col">
            <div className="px-8 py-6 border-b border-[var(--border-muted)] flex items-center justify-between relative z-10 bg-[var(--bg-surface-muted)]/5">
                <div>
                    <h2 className="text-xl font-display font-bold text-[var(--text-main)] tracking-tight">
                        Business Registration
                    </h2>
                    <div className="flex gap-1.5 mt-3">
                        <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]' : 'bg-[var(--border-muted)]'}`}></div>
                        <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]' : 'bg-[var(--border-muted)]'}`}></div>
                    </div>
                </div>
                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-50 bg-[var(--bg-app)]/50 px-3 py-1.5 rounded-lg border border-[var(--border-muted)]">
                    Step {step} of 2
                </div>
            </div>

            <div className="relative flex-1 p-8">
                <AnimatePresence mode="wait" custom={step}>
                    <motion.div
                        key={step}
                        custom={step}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="space-y-6 flex flex-col h-full"
                    >
                        {error && (
                            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold animate-shake flex items-center gap-3">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </div>
                        )}

                        {step === 1 ? (
                            <div className="space-y-8 flex-1">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold">Business Details</h3>
                                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">Set the organizational name and choose the platform subscription.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 ml-1">
                                            Business Entity Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={businessName}
                                                onChange={(e) => setBusinessName(e.target.value)}
                                                autoFocus
                                                placeholder="e.g. Sauna SPA Global"
                                                className="w-full bg-[var(--bg-app)]/30 border border-[var(--border-muted)] rounded-2xl h-14 px-5 text-base font-medium focus:bg-[var(--bg-surface-muted)]/10 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all outline-none text-[var(--text-main)] placeholder:text-[var(--text-muted)]/30"
                                            />
                                            <span className="absolute right-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[var(--text-muted)]/40 group-focus-within:text-[var(--color-primary)] transition-colors">
                                                domain
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">
                                            Platform Package
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {packages.map((pkg) => (
                                                <button
                                                    key={pkg.id}
                                                    type="button"
                                                    onClick={() => setPlatformPackageId(pkg.id)}
                                                    className={`p-4 rounded-2xl border text-left transition-all ${
                                                        platformPackageId === pkg.id 
                                                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-[0_0_20px_var(--color-primary)_inset] scale-[1.02]' 
                                                            : 'border-[var(--border-muted)] hover:border-[var(--text-muted)]/30 opacity-70 hover:opacity-100'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className={`text-xs font-black uppercase tracking-widest ${platformPackageId === pkg.id ? 'text-[var(--color-primary)]' : 'text-[var(--text-main)]'}`}>
                                                            {pkg.name}
                                                        </span>
                                                        {platformPackageId === pkg.id && (
                                                            <span className="material-symbols-outlined text-[var(--color-primary)] text-sm">check_circle</span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-[var(--text-muted)] font-medium">Up to {pkg.branchLimit} branches</p>
                                                    <p className="mt-2 text-sm font-bold text-[var(--text-main)]">${pkg.priceMonthly}<span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-normal">/mo</span></p>
                                                </button>
                                            ))}
                                            {packages.length === 0 && (
                                                <div className="col-span-3 p-4 text-sm text-[var(--text-muted)] text-center bg-rose-500/5 rounded-2xl border border-rose-500/20 text-rose-500">
                                                    No subscription packages defined in the database. Please run the seed command.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 flex-1">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold">Owner Credential Settings</h3>
                                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">Provision the high-level `OWNER` account for this business.</p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2 group">
                                        <label className="block text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1 opacity-70">Owner Full Name</label>
                                        <input
                                            type="text"
                                            value={managerName}
                                            onChange={(e) => setManagerName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full bg-[var(--bg-app)]/30 border border-[var(--border-muted)] rounded-xl h-12 px-4 text-sm font-medium focus:bg-[var(--bg-surface-muted)]/10 focus:border-[var(--color-primary)] transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="block text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1 opacity-70">Unique Username</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="ceo_sauna_global"
                                            className="w-full bg-[var(--bg-app)]/30 border border-[var(--border-muted)] rounded-xl h-12 px-4 text-sm font-medium focus:bg-[var(--bg-surface-muted)]/10 focus:border-[var(--color-primary)] transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="block text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1 opacity-70">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="owner@businessdomain.com"
                                        className="w-full bg-[var(--bg-app)]/30 border border-[var(--border-muted)] rounded-xl h-12 px-4 text-sm font-medium focus:bg-[var(--bg-surface-muted)]/10 focus:border-[var(--color-primary)] transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-2 group">
                                    <label className="block text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider ml-1 opacity-70">Password (Temporary)</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-[var(--bg-app)]/30 border border-[var(--border-muted)] rounded-xl h-12 px-4 text-sm font-medium focus:bg-[var(--bg-surface-muted)]/10 focus:border-[var(--color-primary)] transition-all outline-none"
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="px-8 py-5 border-t border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/5 flex gap-4 mt-auto">
                <Link
                    href="/dashboard"
                    className={`h-14 px-6 rounded-2xl border border-[var(--border-muted)] font-bold hover:bg-[var(--bg-surface-muted)]/20 transition-all text-[var(--text-muted)] text-sm flex items-center justify-center gap-2 ${step > 1 ? 'hidden' : 'flex'}`}
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                    Cancel
                </Link>
                {step > 1 && (
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="h-14 px-6 rounded-2xl border border-[var(--border-muted)] font-bold hover:bg-[var(--bg-surface-muted)]/20 transition-all text-[var(--text-muted)] text-sm flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Previous
                    </button>
                )}
                
                <button
                    type="button"
                    onClick={step === 1 ? () => setStep(2) : handleFinalSubmit}
                    disabled={loading || (step === 1 && !businessName) || (step === 2 && (!managerName || !username || !email || !password))}
                    className="flex-1 h-14 bg-[var(--text-main)] text-[var(--bg-app)] rounded-2xl font-bold shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:hover:scale-100 group"
                >
                    {loading ? (
                        <span className="size-5 border-3 border-[var(--bg-app)] border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        <>
                            {step === 1 ? 'Configure Business Owner' : 'Register Business'}
                            <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">
                                {step === 1 ? 'arrow_forward' : 'bolt'}
                            </span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
