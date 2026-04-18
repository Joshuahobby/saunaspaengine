"use client";

import { useState } from "react";
import { 
    createPlatformPackageAction, 
    updatePlatformPackageAction, 
    deletePlatformPackageAction 
} from "../actions";
import { motion } from "framer-motion";

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

export default function PlatformPackagesClientPage({ initialPackages }: { initialPackages: PlatformPackage[] }) {
    const [packages, setPackages] = useState(initialPackages);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<PlatformPackage | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        setDeletingId(null);
        setDeleteError(null);
        const res = await deletePlatformPackageAction(id);
        if (res.success) {
            setPackages(packages.filter(p => p.id !== id));
        } else {
            setDeleteError(res.error ?? "Failed to delete package.");
        }
    };

    return (
        <div className="max-w-[1440px] mx-auto w-full p-6 space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[var(--border-muted)]">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-bold text-[var(--text-main)] tracking-tight">Platform <span className="text-[var(--color-primary)]">Packages</span></h1>
                    <p className="text-[var(--text-muted)] font-medium opacity-70">Manage subscription tiers, branch limits, and feature sets.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => {
                            setEditingPackage(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-[var(--color-primary)] text-slate-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.05] active:scale-[0.98] transition-all shadow-xl shadow-[var(--color-primary)]/20 flex items-center gap-3"
                    >
                        <span className="material-symbols-outlined font-black">add_card</span>
                        Define New Package
                    </button>
                </div>
            </header>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                    <div 
                        key={pkg.id}
                        className="glass-card bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] p-8 space-y-6 hover:border-[var(--color-primary)]/40 transition-all duration-500 group relative overflow-hidden flex flex-col"
                    >
                        <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-display font-bold text-[var(--text-main)]">{pkg.name}</h3>
                                {pkg.isCustom && (
                                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">Custom Plan</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingPackage(pkg);
                                        setIsModalOpen(true);
                                    }}
                                    className="size-10 rounded-xl bg-[var(--bg-surface-muted)]/10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-all border border-[var(--border-muted)]"
                                >
                                    <span className="material-symbols-outlined text-xl">edit</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setDeletingId(pkg.id); setDeleteError(null); }}
                                    className="size-10 rounded-xl bg-[var(--bg-surface-muted)]/10 flex items-center justify-center text-[var(--text-muted)] hover:text-rose-500 transition-all border border-[var(--border-muted)]"
                                >
                                    <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 py-4 border-y border-[var(--border-muted)] border-dashed relative z-10">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-display font-black text-[var(--text-main)]">${pkg.priceMonthly}</span>
                                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">/ Monthly</span>
                            </div>
                            <div className="flex items-baseline gap-2 opacity-60">
                                <span className="text-xl font-display font-bold text-[var(--text-main)]">${pkg.priceYearly}</span>
                                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">/ Yearly</span>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1 relative z-10">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">account_tree</span>
                                <span className="text-sm font-bold text-[var(--text-main)]">Limit: {pkg.branchLimit} Branches</span>
                            </div>
                            <ul className="space-y-3">
                                {pkg.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">
                                        <span className="material-symbols-outlined text-[10px] text-emerald-500">check_circle</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <p className="text-xs text-[var(--text-muted)] italic opacity-60 line-clamp-2">{pkg.description}</p>
                    </div>
                ))}
            </div>

            {deleteError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">error</span>
                    {deleteError}
                </div>
            )}

            {deletingId && (() => {
                const pkg = packages.find(p => p.id === deletingId);
                if (!pkg) return null;
                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-3xl p-8 w-full max-w-sm shadow-2xl space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-red-500 text-2xl">delete</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)]">Delete Package</h3>
                                    <p className="text-[10px] text-[var(--text-muted)] mt-1">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="text-xs font-bold text-[var(--text-main)] px-1">
                                Delete the <span className="text-red-500">{pkg.name}</span> package permanently?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDeletingId(null)}
                                    className="flex-1 h-12 rounded-2xl border border-[var(--border-muted)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(deletingId)}
                                    className="flex-1 h-12 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Modal placeholder - for brevity I'll implement logic, but ideally it's a separate component */}
            <PackageModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={(newPkg) => {
                    if (editingPackage) {
                        setPackages(packages.map(p => p.id === newPkg.id ? newPkg : p));
                    } else {
                        setPackages([...packages, newPkg]);
                    }
                }}
                pkg={editingPackage}
            />
        </div>
    );
}

// Minimal internal modal for now, or I'll split it if needed
function PackageModal({ isOpen, onClose, onSave, pkg }: { isOpen: boolean, onClose: () => void, onSave: (p: PlatformPackage) => void, pkg: PlatformPackage | null }) {
    const [name, setName] = useState(pkg?.name || "");
    const [priceMonthly, setPriceMonthly] = useState(pkg?.priceMonthly || 0);
    const [priceYearly, setPriceYearly] = useState(pkg?.priceYearly || 0);
    const [isCustom, setIsCustom] = useState(pkg?.isCustom || false);
    const [branchLimit, setBranchLimit] = useState(pkg?.branchLimit || 3);
    const [features, setFeatures] = useState(pkg?.features.join(", ") || "");
    const [isLoading, setIsLoading] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Ensure state updates when pkg changes (modal reuse)
    useState(() => {
        if (pkg) {
            setName(pkg.name);
            setPriceMonthly(pkg.priceMonthly);
            setPriceYearly(pkg.priceYearly);
            setIsCustom(pkg.isCustom);
            setBranchLimit(pkg.branchLimit);
            setFeatures(pkg.features.join(", "));
        }
    });

    const handleSave = async () => {
        setIsLoading(true);
        const data = {
            name,
            priceMonthly: Number(priceMonthly),
            priceYearly: Number(priceYearly),
            isCustom,
            description: pkg?.description || "",
            branchLimit: Number(branchLimit),
            features: features.split(",").map(f => f.trim()).filter(Boolean),
        };

        const res = pkg 
            ? await updatePlatformPackageAction(pkg.id, data)
            : await createPlatformPackageAction(data);

        if (res.success) {
            onSave({ ...data, id: pkg?.id || Date.now().toString() }); // Simplified ID for local state
            onClose();
        } else {
            setSaveError(res.error ?? "Failed to save package.");
        }
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] w-full max-w-2xl p-8 lg:p-10 space-y-8 my-auto"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-serif font-bold italic text-[var(--text-main)]">{pkg ? "Edit" : "New"} Platform Package</h2>
                    <button type="button" onClick={onClose} className="size-10 rounded-full bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="package-name" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-2">Package Name</label>
                        <input id="package-name" title="Package Name" placeholder="e.g. Enterprise" value={name} onChange={e => setName(e.target.value)} className="w-full h-14 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-6 text-[var(--text-main)] font-bold outline-none focus:border-[var(--color-primary)]/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="branch-limit" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-2">Branch Limit</label>
                        <input id="branch-limit" title="Branch Limit" placeholder="e.g. 5" type="number" value={branchLimit} onChange={e => setBranchLimit(Number(e.target.value))} className="w-full h-14 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-6 text-[var(--text-main)] font-bold outline-none focus:border-[var(--color-primary)]/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="price-monthly" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-2">Monthly Price ($)</label>
                        <input id="price-monthly" title="Monthly Price" placeholder="e.g. 99" type="number" value={priceMonthly} onChange={e => setPriceMonthly(Number(e.target.value))} className="w-full h-14 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-6 text-[var(--text-main)] font-bold outline-none focus:border-[var(--color-primary)]/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="price-yearly" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-2">Yearly Price ($)</label>
                        <input id="price-yearly" title="Yearly Price" placeholder="e.g. 990" type="number" value={priceYearly} onChange={e => setPriceYearly(Number(e.target.value))} className="w-full h-14 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-6 text-[var(--text-main)] font-bold outline-none focus:border-[var(--color-primary)]/50 transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label htmlFor="features" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-2">Features (comma separated)</label>
                        <textarea id="features" title="Package Features" placeholder="e.g. Multi-location, Analytics, Support" value={features} onChange={e => setFeatures(e.target.value)} className="w-full h-24 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-6 py-4 text-[var(--text-main)] font-bold outline-none focus:border-[var(--color-primary)]/50 transition-all resize-none" />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-4 px-4 py-2 bg-[var(--bg-surface-muted)] rounded-2xl border border-dashed border-[var(--border-muted)]">
                        <input type="checkbox" checked={isCustom} onChange={e => setIsCustom(e.target.checked)} id="isCustom" className="size-5 rounded border-[var(--border-muted)] bg-transparent text-[var(--color-primary)] focus:ring-0" />
                        <label htmlFor="isCustom" className="text-sm font-bold text-[var(--text-muted)] cursor-pointer">Mark as Custom/Enterprise Plan (API, White-labeling)</label>
                    </div>
                </div>

                {saveError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {saveError}
                    </div>
                )}
                <div className="flex gap-4 pt-4">
                    <button type="button" onClick={onClose} className="h-14 flex-1 rounded-2xl border border-[var(--border-muted)] text-[var(--text-muted)] font-bold uppercase text-xs hover:bg-[var(--bg-surface-muted)] transition-all">Cancel</button>
                    <button type="button" onClick={handleSave} disabled={isLoading} className="h-14 flex-[2] rounded-2xl bg-[var(--text-main)] text-[var(--bg-app)] font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        {isLoading ? <span className="animate-spin material-symbols-outlined">sync</span> : "Save Package"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
