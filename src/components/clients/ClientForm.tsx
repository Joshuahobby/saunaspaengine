"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerClient } from "@/app/(dashboard)/clients/new/actions";
import { updateClientAction } from "@/app/(dashboard)/clients/actions";
import PrintableMembershipCard, { PremiumCardThemes } from "@/components/clients/PrintableMembershipCard";

interface MembershipCategory {
    id: string;
    name: string;
    price: number;
    type: string;
}

interface ClientFormProps {
    membershipCategories?: MembershipCategory[];
    branches?: { id: string, name: string }[];
    initialData?: {
        id: string;
        fullName: string;
        phone: string;
        email?: string;
        clientType: string;
        branchId: string;
    };
    mode?: "create" | "edit";
}

export default function ClientForm({ 
    membershipCategories = [],
    branches = [],
    initialData,
    mode = "create"
}: ClientFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successData, setSuccessData] = useState<{ id?: string, fullName?: string, qrCode?: string, tierName?: string } | null>(null);
    const [clientType, setClientType] = useState<"WALK_IN" | "MEMBER">(
        initialData?.clientType === "WALK_IN" ? "WALK_IN" : "MEMBER"
    );
    const [activeThemeId, setActiveThemeId] = useState(PremiumCardThemes[0].id);
    const [selectedBranchId, setSelectedBranchId] = useState(initialData?.branchId || "");

    const isEdit = mode === "edit";

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        formData.append("clientType", clientType);
        if (selectedBranchId) {
            formData.append("branchId", selectedBranchId);
        }

        try {
            let res;
            if (isEdit && initialData?.id) {
                res = await updateClientAction(initialData.id, formData);
                if ("success" in res && res.success) {
                    router.push(`/clients/${initialData.id}`);
                    router.refresh();
                }
            } else {
                res = await registerClient(formData);
                if ("success" in res && res.success) {
                    const r = res as { client?: { id?: string; fullName?: string; qrCode?: string }; membership?: { categoryName?: string } };
                    setSuccessData({
                        ...(r.client || {}),
                        tierName: r.membership?.categoryName
                    });
                }
            }

            if ("error" in res && res.error) {
                setError(res.error);
            }
        } catch {
            setError("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (successData) {
        return (
            <div className="bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)] border-dashed rounded-xl p-6 flex flex-col items-center mt-6">
                <div className="w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-[var(--color-bg-dark)] mb-4">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Registration Success!</h3>
                <p className="text-sm text-slate-600 mb-6">Guest profile created.</p>
                {successData.qrCode && (
                    <div className="w-full max-w-sm flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-center">Card Theme</label>
                            <select 
                                title="Card Theme"
                                className="w-full rounded-lg border-slate-200 bg-white focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/50 h-10 px-4 mb-4"
                                onChange={(e) => setActiveThemeId(e.target.value)}
                                value={activeThemeId}
                            >
                                {PremiumCardThemes.map(t => (
                                    <option key={t.id} value={t.id}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                        <PrintableMembershipCard 
                            clientName={successData.fullName ?? "Guest"}
                            qrCodeString={successData.qrCode}
                            tier={successData.tierName}
                            theme={PremiumCardThemes.find(t => t.id === activeThemeId)}
                        />
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => {
                        router.push("/clients");
                        router.refresh();
                    }}
                    className="mt-6 px-6 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                    Return to Clients
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] rounded-[2.5rem] p-8 shadow-sm border border-[var(--border-muted)] space-y-6">
            <h2 className="text-2xl font-display font-bold text-[var(--text-main)]">
                {isEdit ? "Update Client Profile" : "Register New Guest"}
            </h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-[10px] text-red-600 dark:text-red-400 font-bold">
                    {error}
                </div>
            )}

            {branches.length > 0 && (
                <div className="flex flex-col gap-2 pb-6 border-b border-[var(--border-muted)]/30">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-60">Target Branch <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select 
                            title="Target Branch"
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            disabled={isEdit}
                            className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-4 py-3 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all outline-none font-bold text-[var(--text-main)] appearance-none cursor-pointer tracking-tight text-sm disabled:opacity-50"
                        >
                            <option value="">-- Select Branch --</option>
                            {branches.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)] opacity-50">
                            expand_more
                        </span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 col-span-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-60">Full Name <span className="text-red-500">*</span></label>
                    <input 
                        name="fullName" 
                        required 
                        defaultValue={initialData?.fullName}
                        className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-4 py-3 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all outline-none font-bold text-[var(--text-main)] tracking-tight text-sm" 
                        placeholder="e.g. Alexander Lindholm" type="text" 
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-60">Phone Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 material-symbols-outlined text-[var(--text-muted)] opacity-50">call</span>
                        <input 
                            name="phone" 
                            required 
                            defaultValue={initialData?.phone}
                            className="w-full pl-10 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-4 py-3 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all outline-none font-bold text-[var(--text-main)] tracking-tight text-sm" 
                            placeholder="+250 788 000 000" type="tel" 
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-60">Email Address (Optional)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 material-symbols-outlined text-[var(--text-muted)] opacity-50">mail</span>
                        <input 
                            name="email" 
                            defaultValue={initialData?.email}
                            className="w-full pl-10 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-4 py-3 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all outline-none font-bold text-[var(--text-main)] tracking-tight text-sm" 
                            placeholder="alexander@example.com" type="email" 
                        />
                    </div>
                </div>

                <div className="col-span-2 pt-4 border-t border-[var(--border-muted)]/30">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-60 block mb-3">Guest Category</label>
                    <div className="flex bg-[var(--bg-surface-muted)] p-1 rounded-2xl w-fit border border-[var(--border-muted)]/50">
                        <button
                            type="button"
                            onClick={() => setClientType("MEMBER")}
                            className={`px-6 py-2.5 rounded-xl shadow-sm text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all ${clientType === "MEMBER" ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20" : "text-[var(--text-muted)] hover:text-[var(--text-main)] border border-transparent"}`}
                        >
                            <span className="material-symbols-outlined text-lg">verified_user</span>
                            Member
                        </button>
                        <button
                            type="button"
                            onClick={() => setClientType("WALK_IN")}
                            className={`px-6 py-2.5 rounded-xl shadow-sm text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all ${clientType === "WALK_IN" ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20" : "text-[var(--text-muted)] hover:text-[var(--text-main)] border border-transparent"}`}
                        >
                            <span className="material-symbols-outlined text-lg">directions_walk</span>
                            Walk-In
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-[var(--border-muted)]">
                <button type="submit" disabled={isSubmitting} className="flex-[2] bg-[var(--color-primary)] text-[var(--color-bg-dark)] py-4 rounded-xl font-black text-[10px] hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest shadow-md shadow-[var(--color-primary)]/10">
                    <span className="material-symbols-outlined">{isEdit ? "save" : "how_to_reg"}</span>
                    {isSubmitting ? "Processing..." : isEdit ? "Save Changes" : "Create Profile & Activate"}
                </button>
                <button 
                    type="button" 
                    onClick={() => router.back()} 
                    className="flex-1 py-4 border border-[var(--border-muted)] bg-[var(--bg-surface-muted)] rounded-xl font-black text-[10px] text-[var(--text-muted)] hover:text-red-500 hover:border-red-500/30 transition-all disabled:opacity-50 uppercase tracking-widest" 
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
