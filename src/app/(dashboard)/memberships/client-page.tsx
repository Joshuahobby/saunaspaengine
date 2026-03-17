"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MembershipType, EntityStatus } from "@prisma/client";
import { createMembershipCategoryAction, updateMembershipCategoryAction, deleteMembershipCategoryAction } from "./actions";
import Link from "next/link";
import Image from "next/image";

interface MembershipCategory {
    id: string;
    name: string;
    type: MembershipType;
    description: string | null;
    price: number;
    durationDays: number | null;
    usageLimit: number | null;
    isGlobal: boolean;
    status: EntityStatus;
    _count?: {
        memberships: number;
    };
}

interface MembershipsClientPageProps {
    categories: MembershipCategory[];
}

const TYPE_CONFIG = {
    SUBSCRIPTION: {
        label: "Subscription Pass",
        icon: "calendar_today",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        desc: "Automated recurring access for local regulars.",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    LIST_PASS: {
        label: "List Pass",
        icon: "counter_5",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        desc: "Pre-paid session bundles for casual visitors.",
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    FREE_PASS: {
        label: "Promotion",
        icon: "card_giftcard",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        desc: "Complimentary VIP or trial access for marketing.",
        image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
};

export default function MembershipsClientPage({ categories }: MembershipsClientPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<MembershipCategory | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenModal = (category?: MembershipCategory) => {
        setEditingCategory(category || null);
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-[var(--border-muted)] pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="size-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                            <span className="material-symbols-outlined text-3xl">loyalty</span>
                        </div>
                        <h1 className="text-4xl font-serif font-black italic tracking-tight text-white">Membership Hub</h1>
                    </div>
                    <p className="text-[var(--text-muted)] font-medium max-w-xl italic opacity-70">
                        Design your business&apos;s access tiers. From recurring subscriptions to flexible usage-based passes.
                    </p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenModal()}
                    className="h-14 px-8 rounded-full bg-white text-black font-black uppercase tracking-[0.2em] text-xs flex items-center gap-3 shadow-2xl transition-all"
                >
                    Create New Pass
                    <span className="material-symbols-outlined">add_circle</span>
                </motion.button>
            </div>

            {/* Pass Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.length === 0 ? (
                   <div className="col-span-3 py-20 text-center space-y-4 bg-[var(--bg-surface-muted)]/5 rounded-[3rem] border border-dashed border-[var(--border-muted)]">
                        <span className="material-symbols-outlined text-6xl text-[var(--text-muted)] opacity-20">category</span>
                        <p className="text-[var(--text-muted)] font-serif italic text-xl">No passes have been created yet.</p>
                   </div>
                ) : (
                    categories.map((category, idx) => {
                        const config = TYPE_CONFIG[category.type as keyof typeof TYPE_CONFIG];
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={category.id}
                                className="group relative bg-[#0f1412] border border-[var(--border-muted)] rounded-[2.5rem] overflow-hidden hover:border-[var(--color-primary)]/50 transition-all duration-500 shadow-xl flex flex-col"
                            >
                                <div className="h-48 relative overflow-hidden">
                                    <Image src={config.image} alt={category.name} width={800} height={400} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 grayscale group-hover:grayscale-0" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1412] via-[#0f1412]/40 to-transparent" />
                                    <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                        <div className={`size-10 rounded-xl ${config.bg} flex items-center justify-center ${config.color} backdrop-blur-md`}>
                                            <span className="material-symbols-outlined">{config.icon}</span>
                                        </div>
                                        <h3 className="text-2xl font-serif font-black italic text-white">{category.name}</h3>
                                    </div>
                                    <div className="absolute top-6 right-6 flex gap-2">
                                        {category.isGlobal && (
                                            <div className="px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-[9px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[12px]">public</span>
                                                Network-wide
                                            </div>
                                        )}
                                        <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-[var(--color-primary)]">
                                            {config.label}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 space-y-6 flex-1 flex flex-col">
                                    <div className="space-y-2 flex-1">
                                        <p className="text-sm text-[var(--text-muted)] italic leading-relaxed opacity-80">
                                            {category.description || config.desc}
                                        </p>
                                        <div className="flex items-center gap-4 pt-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-50">Tier Pricing</span>
                                                <span className="text-2xl font-mono font-black text-white">{category.price.toLocaleString()} <span className="text-xs italic opacity-50">RWF</span></span>
                                            </div>
                                            <div className="w-px h-10 bg-[var(--border-muted)]" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-50">Enrolled</span>
                                                <span className="text-2xl font-mono font-black text-[var(--color-primary)]">{category._count?.memberships || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleOpenModal(category)}
                                            className="h-12 flex-1 rounded-2xl bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] text-white font-bold uppercase tracking-widest text-[10px] hover:bg-[var(--color-primary)] hover:text-black transition-all"
                                        >
                                            Modify Rules
                                        </button>
                                        <Link 
                                            href={`/memberships/${category.id}`}
                                            className="size-12 rounded-2xl bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] flex items-center justify-center text-[var(--text-muted)] hover:text-white transition-all"
                                        >
                                            <span className="material-symbols-outlined">monitoring</span>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Configuration Summary Table */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-serif font-black italic text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-[var(--color-primary)]">analytics</span>
                        Configuration Summary
                    </h2>
                </div>
                <div className="bg-[#0f1412] border border-[var(--border-muted)] rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[var(--bg-surface-muted)]/10 border-b border-[var(--border-muted)]">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">creation date</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">access logic</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">unit yield</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">velocity</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60 text-right">actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]/50">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="group hover:bg-[var(--bg-surface-muted)]/5 transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-2 rounded-full ${TYPE_CONFIG[cat.type as keyof typeof TYPE_CONFIG].bg.replace('/10', '')} shadow-lg`} />
                                            <span className="font-serif font-bold italic text-white tracking-tight">{cat.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{cat.type === 'SUBSCRIPTION' ? `${cat.durationDays} Days Duration` : `${cat.usageLimit} Sessions Limit`}</span>
                                            <span className="text-[9px] text-[var(--text-muted)] font-black uppercase italic opacity-50">{TYPE_CONFIG[cat.type as keyof typeof TYPE_CONFIG].label}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="font-mono font-black text-white">{cat.price.toLocaleString()} RWF</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-1.5 bg-[var(--bg-surface-muted)]/20 rounded-full overflow-hidden">
                                                <div className="h-full bg-[var(--color-primary)] w-[40%] rounded-full" />
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">{(cat._count?.memberships || 0)} Enrolled</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(cat)} className="size-9 rounded-xl border border-[var(--border-muted)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-[var(--color-primary)] transition-all">
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                            <button onClick={() => deleteMembershipCategoryAction(cat.id)} className="size-9 rounded-xl border border-[var(--border-muted)] flex items-center justify-center text-red-500/50 hover:text-red-500 hover:border-red-500/50 transition-all">
                                                <span className="material-symbols-outlined text-sm">archive</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Category Modal */}
            <CategoryModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                category={editingCategory}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
        </div>
    );
}

function CategoryModal({ isOpen, onClose, category, isLoading, setIsLoading }: { 
    isOpen: boolean, 
    onClose: () => void, 
    category: MembershipCategory | null,
    isLoading: boolean,
    setIsLoading: (val: boolean) => void
}) {
    const [formData, setFormData] = useState({
        name: category?.name || "",
        type: category?.type || "SUBSCRIPTION" as MembershipType,
        description: category?.description || "",
        price: category?.price?.toString() || "",
        durationDays: category?.durationDays?.toString() || "30",
        usageLimit: category?.usageLimit?.toString() || "10",
        isGlobal: category?.isGlobal || false
    });

    // Sync form data when category changes
    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                type: category.type,
                description: category.description || "",
                price: category.price.toString(),
                durationDays: category.durationDays?.toString() || "30",
                usageLimit: category.usageLimit?.toString() || "10",
                isGlobal: category.isGlobal
            });
        }
    }, [category]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const payload = {
                name: formData.name,
                type: formData.type,
                description: formData.description,
                price: parseFloat(formData.price),
                durationDays: formData.type === 'SUBSCRIPTION' ? parseInt(formData.durationDays) : undefined,
                usageLimit: formData.type === 'LIST_PASS' ? parseInt(formData.usageLimit) : undefined,
                isGlobal: formData.isGlobal
            };

            if (category) {
                await updateMembershipCategoryAction(category.id, payload);
            } else {
                await createMembershipCategoryAction(payload);
            }
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#050706]/90 backdrop-blur-xl"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0f1412] border border-[var(--border-muted)] rounded-[3rem] shadow-2xl overflow-hidden"
                    >
                        <div className="p-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-serif font-black italic text-white">{category ? "Modify Pass" : "Create New Pass"}</h2>
                                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] italic opacity-60">Defining access mechanics for your business</p>
                                </div>
                                <button onClick={onClose} className="size-12 rounded-full bg-[var(--bg-surface-muted)]/10 flex items-center justify-center text-[var(--text-muted)] hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3 col-span-2">
                                    <label htmlFor="pass-name" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] italic ml-4">Pass Nomenclature</label>
                                    <input 
                                        id="pass-name"
                                        title="Pass Nomenclature"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        placeholder="e.g. Zen Monthly Ritual"
                                        className="w-full h-16 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-3xl px-8 text-white font-serif italic text-lg outline-none focus:border-[var(--color-primary)] transition-all"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="pass-type" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] italic ml-4">Logic Archetype</label>
                                    <select 
                                        id="pass-type"
                                        title="Logic Archetype"
                                        value={formData.type}
                                        onChange={e => setFormData({...formData, type: e.target.value as MembershipType})}
                                        className="w-full h-16 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-3xl px-8 text-sm font-black text-white uppercase tracking-widest outline-none focus:border-[var(--color-primary)] transition-all appearance-none"
                                    >
                                        <option value="SUBSCRIPTION" className="bg-[#0f1412]">Subscription Pass</option>
                                        <option value="LIST_PASS" className="bg-[#0f1412]">List / Usage Pass</option>
                                        <option value="FREE_PASS" className="bg-[#0f1412]">Free / Promotional</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="pass-price" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] italic ml-4">Unit Yield (RWF)</label>
                                    <input 
                                        id="pass-price"
                                        title="Unit Yield"
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({...formData, price: e.target.value})}
                                        placeholder="45000"
                                        className="w-full h-16 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-3xl px-8 text-white font-mono font-black text-lg outline-none focus:border-[var(--color-primary)] transition-all"
                                    />
                                </div>

                                <div className="space-y-3 col-span-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] italic ml-4">Network Scope</label>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, isGlobal: !formData.isGlobal})}
                                        className={`w-full h-16 rounded-3xl px-8 flex items-center justify-between transition-all border ${formData.isGlobal ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-[var(--bg-surface-muted)]/10 border-[var(--border-muted)] text-[var(--text-muted)]'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined">{formData.isGlobal ? 'public' : 'location_on'}</span>
                                            <span className="font-bold tracking-widest text-[10px] uppercase">{formData.isGlobal ? 'Global Portability Active' : 'Restricted to this Branch'}</span>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full relative transition-all ${formData.isGlobal ? 'bg-blue-500' : 'bg-zinc-800'}`}>
                                            <div className={`absolute top-1 size-4 rounded-full bg-white transition-all ${formData.isGlobal ? 'right-1' : 'left-1'}`} />
                                        </div>
                                    </button>
                                    <p className="text-[9px] text-[var(--text-muted)] opacity-50 ml-4 italic leading-tight">
                                        Global passes can be redeemed at any branch within your corporate network.
                                    </p>
                                </div>

                                {formData.type === 'SUBSCRIPTION' && (
                                    <div className="space-y-3 col-span-2 md:col-span-1">
                                        <label htmlFor="pass-duration" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] italic ml-4">Active Duration (Days)</label>
                                        <input 
                                            id="pass-duration"
                                            title="Active Duration"
                                            type="number"
                                            value={formData.durationDays}
                                            onChange={e => setFormData({...formData, durationDays: e.target.value})}
                                            className="w-full h-16 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-3xl px-8 text-white font-mono font-black text-lg outline-none focus:border-[var(--color-primary)] transition-all"
                                        />
                                    </div>
                                )}

                                {formData.type === 'LIST_PASS' && (
                                    <div className="space-y-3 col-span-2 md:col-span-1">
                                        <label htmlFor="pass-usage" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] italic ml-4">Session Quantifier</label>
                                        <input 
                                            id="pass-usage"
                                            title="Session Quantifier"
                                            type="number"
                                            value={formData.usageLimit}
                                            onChange={e => setFormData({...formData, usageLimit: e.target.value})}
                                            className="w-full h-16 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-3xl px-8 text-white font-mono font-black text-lg outline-none focus:border-[var(--color-primary)] transition-all"
                                        />
                                    </div>
                                )}

                                <div className="space-y-3 col-span-2">
                                    <label htmlFor="pass-description" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] italic ml-4">Philosophical Description</label>
                                    <textarea 
                                        id="pass-description"
                                        title="Philosophical Description"
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        placeholder="Describe the value proposition..."
                                        className="w-full min-h-[120px] bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-[2rem] p-8 text-white text-sm font-medium italic outline-none focus:border-[var(--color-primary)] transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={onClose}
                                    className="h-16 flex-1 rounded-3xl border border-[var(--border-muted)] text-[var(--text-muted)] font-black tracking-widest uppercase text-[10px] hover:bg-white/5 transition-all"
                                >
                                    Relinquish
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading || !formData.name || !formData.price}
                                    className="h-16 flex-[2] rounded-3xl bg-white text-black font-black tracking-[0.2em] uppercase text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <span className="animate-spin material-symbols-outlined">sync</span>
                                    ) : (
                                        <>
                                            {category ? "Commit Refinement" : "Create Pass"}
                                            <span className="material-symbols-outlined transition-transform group-hover:rotate-12">auto_awesome</span>
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
