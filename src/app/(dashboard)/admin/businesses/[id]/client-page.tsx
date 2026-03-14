"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { EditCorporateModal } from "../EditCorporateModal";
import { AssignPackageModal } from "./AssignPackageModal";

interface Branch {
    id: string;
    name: string;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    status: string;
    onboardingCompleted: boolean;
}

interface Corporate {
    id: string;
    name: string;
    taxId?: string | null;
    headquarters?: string | null;
    status: string;
    subscriptionPlan?: string | null;
    subscriptionCycle?: string | null;
    subscriptionStatus?: string | null;
    subscriptionRenewal?: string | null;
    createdAt: string;
    businesses: Branch[];
}

interface PlatformPackage {
    id: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    isCustom: boolean;
    description: string | null;
    branchLimit: number;
    features: string[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

export default function BusinessDetailsClientPage({ corporate, platformPackages }: { corporate: Corporate, platformPackages: PlatformPackage[] }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);

    const activeBranches = corporate.businesses.filter(b => b.status === "ACTIVE").length;

    return (
        <motion.main 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 p-4 lg:p-6 w-full max-w-7xl mx-auto flex flex-col gap-6"
        >
            {/* Breadcrumb Navigation - Compact */}
            <motion.div variants={itemVariants} className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-bold italic uppercase tracking-[0.2em] border-b border-[var(--border-muted)] pb-4">
                <Link href="/admin/businesses" className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5 group">
                    <span className="material-symbols-outlined text-[12px]">domain</span>
                    <span>Hubs</span>
                </Link>
                <span className="material-symbols-outlined text-[10px] opacity-30 font-bold">chevron_right</span>
                <span className="text-[var(--text-main)] opacity-100">{corporate.name}</span>
            </motion.div>

            {/* Hub Header - Compact & Professional */}
            <motion.div 
                variants={itemVariants}
                className="relative group h-40 rounded-[1.5rem] overflow-hidden border border-[var(--border-muted)] bg-[#0a0f0d] flex items-center px-8"
            >
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-[var(--color-primary)]/5 blur-[80px] rounded-full"></div>
                
                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay noise-overlay"></div>

                <div className="relative z-10 w-full flex justify-between items-center gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl lg:text-4xl font-display font-bold text-white tracking-tight drop-shadow-md">
                                {corporate.name}
                            </h1>
                            <motion.span 
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${corporate.status === "ACTIVE" ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/10" : "text-rose-500 border-rose-500/20 bg-rose-500/10"}`}>
                                {corporate.status}
                            </motion.span>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            {corporate.taxId && (
                                <div className="flex items-baseline gap-2 opacity-60">
                                    <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest italic">TIN</span>
                                    <span className="text-xs font-mono text-white tracking-tight">{corporate.taxId}</span>
                                </div>
                            )}
                            {corporate.headquarters && (
                                <div className="flex items-baseline gap-2 opacity-60">
                                    <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest italic">HQ</span>
                                    <span className="text-xs font-bold text-white tracking-tight">{corporate.headquarters}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditModalOpen(true)}
                            className="group h-12 px-6 rounded-xl bg-white text-black hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 font-bold tracking-widest text-[10px] uppercase flex items-center gap-2 shadow-lg"
                        >
                            <span className="material-symbols-outlined text-lg">edit_note</span>
                            RECONFIGURE
                        </motion.button>
                        <div className="flex items-center gap-2 opacity-30">
                            <span className="material-symbols-outlined text-xs">history</span>
                            <span suppressHydrationWarning className="text-[8px] font-bold uppercase tracking-[0.2em]">Updated: {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* KPI Grid - Compact High-Density */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AdminStatCard 
                    label="Vessel Network"
                    value={corporate.businesses.length.toString()}
                    subtitle={`${activeBranches} Online / ${corporate.businesses.length - activeBranches} Reserved`}
                    icon="hub"
                />
                <AdminStatCard 
                    label="Resource Tier"
                    value={corporate.subscriptionPlan || "N/A"}
                    subtitle={corporate.subscriptionStatus || "No Plan Active"}
                    icon="workspace_premium"
                    actionLabel="UPGRADE"
                    onAction={() => setIsPackageModalOpen(true)}
                />
                <AdminStatCard 
                    label="Neural Yield"
                    value="Syncing..."
                    subtitle="Propagating nodes"
                    icon="monitoring"
                />
            </div>

            {/* Vessel Network - High Density List */}
            <motion.div variants={itemVariants} className="flex flex-col gap-6 mt-2">
                <div className="flex justify-between items-end border-b border-[var(--border-muted)] pb-4">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-display font-bold text-white tracking-tight">Active Nodes</h3>
                        <p className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] opacity-40 italic">Operating infrastructure segment.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/admin/branches"
                            className="h-9 px-4 rounded-lg border border-[var(--border-muted)] text-[var(--text-muted)] hover:border-[var(--color-primary)] hover:text-white transition-all text-[9px] font-black tracking-widest flex items-center uppercase"
                        >
                            Registry
                        </Link>
                        <Link 
                            href="/admin/branches/new"
                            className="h-9 px-4 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-all text-[9px] font-black tracking-widest flex items-center uppercase shadow-sm"
                        >
                            Provision
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {corporate.businesses.map((branch, idx) => (
                        <motion.div 
                            key={branch.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="group relative p-4 rounded-2xl bg-[#0a0f0d] border border-[var(--border-muted)] hover:border-[var(--color-primary)]/40 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`size-10 rounded-xl flex items-center justify-center border shrink-0 ${branch.status === "ACTIVE" ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-500" : "bg-rose-500/5 border-rose-500/10 text-rose-500"}`}>
                                        <span className="material-symbols-outlined text-lg">
                                            {branch.status === "ACTIVE" ? "vital_signs" : "power_off"}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-white truncate leading-tight mb-0.5">{branch.name}</h4>
                                        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest truncate flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[10px] opacity-40">location_on</span>
                                            {branch.address || "Unset"}
                                        </p>
                                    </div>
                                </div>
                                <Link 
                                    href={`/admin/branches/${branch.id}`}
                                    className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all shrink-0"
                                >
                                    <span className="material-symbols-outlined text-sm font-bold italic">arrow_forward</span>
                                </Link>
                            </div>
                        </motion.div>
                    ))}

                    {corporate.businesses.length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-[var(--border-muted)] rounded-2xl opacity-40">
                            <span className="material-symbols-outlined text-3xl mb-3 block">hub</span>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em]">No clusters assigned</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Modals */}
            <EditCorporateModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} corporate={corporate} />
            <AssignPackageModal 
                isOpen={isPackageModalOpen} 
                onClose={() => setIsPackageModalOpen(false)} 
                corporate={corporate} 
                availablePackages={platformPackages} 
            />
        </motion.main>
    );
}

function AdminStatCard({ label, value, subtitle, icon, actionLabel, onAction }: { label: string, value: string, subtitle: string, icon: string, actionLabel?: string, onAction?: () => void }) {
    return (
        <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--border-muted)] group hover:border-[var(--color-primary)]/30 transition-all shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="size-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                </div>
                {actionLabel && (
                    <button 
                        onClick={onAction}
                        className="text-[8px] font-black text-[var(--color-primary)] uppercase tracking-widest px-2 py-1 rounded-md bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 transition-colors"
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
            <div className="space-y-0.5">
                <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60 italic">{label}</p>
                <h3 className="text-2xl lg:text-3xl font-display font-bold text-white tracking-tight">{value}</h3>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.1em]">{subtitle}</p>
            </div>
        </div>
    );
}
