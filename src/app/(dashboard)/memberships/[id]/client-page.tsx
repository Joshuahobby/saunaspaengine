"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Link from "next/link";
import { MembershipType, EntityStatus } from "@prisma/client";
import { updateMembershipCategoryAction } from "../actions";

interface Client {
    id: string;
    fullName: string;
    phone: string | null;
}

interface Membership {
    id: string;
    status: EntityStatus;
    startDate: Date;
    endDate: Date | null;
    balance: number | null;
    client: Client;
}

interface MembershipCategory {
    id: string;
    name: string;
    type: MembershipType;
    description: string | null;
    price: number;
    durationDays: number | null;
    usageLimit: number | null;
    status: EntityStatus;
    memberships: Membership[];
}

interface MembershipDetailsClientPageProps {
    category: MembershipCategory;
}

export default function MembershipDetailsClientPage({ category }: MembershipDetailsClientPageProps) {
    const [formData, setFormData] = useState({
        name: category.name,
        description: category.description || "",
        price: category.price.toString(),
        durationDays: category.durationDays?.toString() || "",
        usageLimit: category.usageLimit?.toString() || "",
        status: category.status
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const activeMemberships = category.memberships.filter(m => m.status === 'ACTIVE');
    const mrr = activeMemberships.length * category.price;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateMembershipCategoryAction(category.id, {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                durationDays: formData.durationDays ? parseInt(formData.durationDays) : undefined,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
                status: formData.status
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Premium Breadcrumbs & Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-[var(--border-muted)] pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-4">
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] italic">
                        <Link href="/dashboard" className="hover:text-[var(--color-primary)] transition-colors">Dashboard</Link>
                        <span className="opacity-20">/</span>
                        <Link href="/memberships" className="hover:text-[var(--color-primary)] transition-colors">Memberships</Link>
                        <span className="opacity-20">/</span>
                        <span className="text-[var(--text-main)]">{category.name}</span>
                    </nav>
                    <div className="flex items-center gap-4">
                        <div className="size-14 rounded-[1.5rem] bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-primary)]/20 shadow-xl">
                            <span className="material-symbols-outlined text-3xl">token</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-serif font-black italic tracking-tight text-[var(--text-main)]">{category.name}</h1>
                            <p className="text-[var(--text-muted)] font-medium italic opacity-60">Architecting the rules of access for this tier.</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setFormData({...formData, status: formData.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"})}
                        className={`h-14 px-8 rounded-full font-black uppercase tracking-widest text-[10px] border transition-all ${formData.status === "ACTIVE" ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"}`}
                    >
                        {formData.status === "ACTIVE" ? "Deactivate Tier" : "Activate Tier"}
                    </button>
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-14 px-10 rounded-full bg-[var(--text-main)] text-[var(--bg-app)] font-black uppercase tracking-[0.2em] text-xs flex items-center gap-3 shadow-2xl transition-all disabled:opacity-50"
                    >
                        {isSaving ? "Synchronizing..." : "Commit Refinements"}
                        {!isSaving && <span className="material-symbols-outlined">save</span>}
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Section: Settings & Rules */}
                <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
                    <section className="bg-[var(--bg-card)] p-10 rounded-[3rem] border border-[var(--border-muted)] shadow-2xl space-y-10">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[var(--color-primary)]">tune</span>
                            <h2 className="text-xl font-serif font-black italic text-[var(--text-main)]">Base Configuration</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label htmlFor="membership-name" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] italic ml-4">Tier Identity</label>
                                <input
                                    id="membership-name"
                                    title="Tier Identity"
                                    placeholder="e.g. Platinum Access"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full h-16 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-3xl px-8 text-[var(--text-main)] font-serif italic text-lg outline-none focus:border-[var(--color-primary)] transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label htmlFor="membership-price" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] italic ml-4">Unit Yield (RWF)</label>
                                <input
                                    id="membership-price"
                                    type="number"
                                    title="Unit Yield"
                                    placeholder="e.g. 50000"
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: e.target.value})}
                                    className="w-full h-16 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-3xl px-8 text-[var(--text-main)] font-mono font-black text-lg outline-none focus:border-[var(--color-primary)] transition-all"
                                />
                            </div>
                            <div className="space-y-3 col-span-2">
                                <label htmlFor="membership-description" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] italic ml-4">Philosophical Justification</label>
                                <textarea
                                    id="membership-description"
                                    title="Philosophical Justification"
                                    placeholder="Describe the intention behind this access tier..."
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="w-full min-h-[120px] bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-[2rem] p-8 text-[var(--text-main)] text-sm font-medium italic outline-none focus:border-[var(--color-primary)] transition-all resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-[var(--bg-card)] p-10 rounded-[3rem] border border-[var(--border-muted)] shadow-2xl space-y-10">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[var(--color-primary)]">gavel</span>
                            <h2 className="text-xl font-serif font-black italic text-[var(--text-main)]">Validation Mechanics</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center justify-between p-6 bg-[var(--bg-surface-muted)] rounded-3xl border border-[var(--border-muted)] group hover:border-[var(--color-primary)]/30 transition-all">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-50">Temporal Validity</p>
                                    <p className="text-[var(--text-main)] font-bold text-sm italic">Enrollment duration in solar days.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        title="Duration in days"
                                        value={formData.durationDays}
                                        onChange={e => setFormData({...formData, durationDays: e.target.value})}
                                        className="w-20 h-12 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl text-center text-[var(--text-main)] font-mono font-black"
                                        placeholder="∞"
                                    />
                                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-tighter">Days</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-[var(--bg-surface-muted)] rounded-3xl border border-[var(--border-muted)] group hover:border-[var(--color-primary)]/30 transition-all">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-50">Visit Lifecycle</p>
                                    <p className="text-[var(--text-main)] font-bold text-sm italic">Maximum session allowance.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        title="Usage limit in visits"
                                        value={formData.usageLimit}
                                        onChange={e => setFormData({...formData, usageLimit: e.target.value})}
                                        className="w-20 h-12 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl text-center text-[var(--text-main)] font-mono font-black"
                                        placeholder="∞"
                                    />
                                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-tighter">Uses</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Section: Analytics & Insights */}
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-1000">
                    <div className="bg-[var(--color-primary)]/5 p-10 rounded-[3rem] border border-[var(--color-primary)]/20 shadow-2xl space-y-8">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.3em] font-sans">Tier Insights</h3>
                            <p className="text-xl font-serif font-black italic text-[var(--text-main)]">Revenue Velocity</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1">
                                <p className="text-5xl font-mono font-black text-[var(--text-main)] tracking-tighter">{activeMemberships.length}</p>
                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60 italic">Active Enrolled Clients</p>
                            </div>
                            <div className="h-px bg-[var(--color-primary)]/10" />
                            <div className="space-y-1">
                                <p className="text-4xl font-mono font-black text-[var(--color-primary)] tracking-tighter">{mrr.toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60 italic text-right">Yield Performance (RWF)</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-card)] p-8 rounded-[2.5rem] border border-[var(--border-muted)] shadow-xl space-y-6">
                        <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest italic ml-2 opacity-50">Rapid Actions</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <button type="button" className="h-14 w-full rounded-2xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] flex items-center gap-4 px-6 text-[10px] font-black text-[var(--text-main)] uppercase tracking-widest hover:bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/30 transition-all">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">mail</span>
                                Broadcast Intelligence
                            </button>
                            <button type="button" className="h-14 w-full rounded-2xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] flex items-center gap-4 px-6 text-[10px] font-black text-[var(--text-main)] uppercase tracking-widest hover:bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/30 transition-all">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">download</span>
                                Extract Cohort Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enrolled Clients List */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-serif font-black italic text-[var(--text-main)] flex items-center gap-3">
                        <span className="material-symbols-outlined text-[var(--color-primary)]">group</span>
                        Enrolled Cohort
                    </h2>
                </div>
                <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[var(--bg-surface-muted)] border-b border-[var(--border-muted)]">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Guest Presence</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Operational Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Allowance Velocity</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60 text-right">Expiration</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]/50">
                            {category.memberships.map((membership) => (
                                <tr key={membership.id} className="group hover:bg-[var(--bg-surface-muted)] transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-[1.2rem] bg-[var(--color-primary)]/10 flex items-center justify-center font-serif font-black italic text-[var(--color-primary)] border border-[var(--border-muted)] shadow-lg">
                                                {membership.client.fullName.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <Link href={`/clients/${membership.client.id}`} className="font-serif font-bold italic text-[var(--text-main)] hover:text-[var(--color-primary)] transition-colors">
                                                    {membership.client.fullName}
                                                </Link>
                                                <span className="text-[9px] font-mono font-bold text-[var(--text-muted)] opacity-50 uppercase tracking-tighter">UID: {membership.client.id.slice(-6)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${membership.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                                            {membership.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-1.5 bg-[var(--bg-surface-muted)] rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${category.usageLimit ? ((membership.balance || 0) / category.usageLimit) * 100 : 100}%` }}
                                                    className="h-full bg-[var(--color-primary)] rounded-full"
                                                />
                                            </div>
                                            <span className="text-[10px] font-mono font-black text-[var(--text-main)]">{membership.balance || '∞'} <span className="opacity-30">/ {category.usageLimit || '∞'}</span></span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-tighter">
                                            {membership.endDate ? format(new Date(membership.endDate), 'MMM dd, yyyy') : 'Indefinite'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
