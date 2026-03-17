"use client";

import { useState } from "react";
// date-fns used via getTimeAgo util
import { updateBusinessApprovalAction } from "../actions";
import { getTimeAgo } from "@/lib/utils";

interface PendingBusiness {
    id: string;
    name: string;
    taxId: string | null;
    headquarters: string | null;
    createdAt: Date | string;
}

export default function ApprovalsClientPage({ businesses: initialBusinesses }: { businesses: PendingBusiness[] }) {
    const [businesses, setBusinesses] = useState(initialBusinesses);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleApproval = async (id: string, status: "APPROVED" | "REJECTED") => {
        setProcessingId(id);
        const result = await updateBusinessApprovalAction(id, { 
            approvalStatus: status,
            kycNotes: status === "APPROVED" ? "Verified via platform governance audit." : "Documentation incomplete or invalid."
        });
        
        if (result.success) {
            setBusinesses(prev => prev.filter(b => b.id !== id));
        } else {
            alert("Failed to process compliance action.");
        }
        setProcessingId(null);
    };

    return (
        <div className="max-w-[1440px] mx-auto w-full p-4 lg:p-6 space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-6 mt-2">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl lg:text-3xl font-display font-bold text-[var(--text-main)] tracking-tight">
                        Compliance <span className="text-amber-500">Queue</span>
                    </h1>
                    <p className="text-[10px] text-[var(--text-muted)] font-medium opacity-50 uppercase tracking-[0.2em]">
                        Manual verification of new-entry business organizations.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm animate-pulse">lock_person</span>
                        {businesses.length} Pending Verifications
                    </div>
                </div>
            </header>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {businesses.length > 0 ? businesses.map((b) => (
                    <div 
                        key={b.id} 
                        className="group rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-card)]/40 p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-[var(--color-primary)]/30 backdrop-blur-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/40"></div>
                        
                        <div className="flex items-center gap-5 flex-1">
                            <div className="size-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-[var(--color-primary)] font-display font-black text-xl shadow-inner group-hover:scale-110 transition-transform">
                                {b.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-display font-bold text-white tracking-tight">{b.name}</h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-500/70 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px]">inventory_2</span>
                                        TAX ID: {b.taxId || "UNSPECIFIED"}
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px]">location_on</span>
                                        {b.headquarters || "Remote Registry"}
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px]">schedule</span>
                                        Applied {getTimeAgo(b.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button 
                                onClick={() => handleApproval(b.id, "REJECTED")}
                                disabled={processingId === b.id}
                                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-rose-500/20 text-rose-500 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all disabled:opacity-20"
                            >
                                Reject Entry
                            </button>
                            <button 
                                onClick={() => handleApproval(b.id, "APPROVED")}
                                disabled={processingId === b.id}
                                className="flex-1 md:flex-none px-8 py-2.5 rounded-xl bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-20"
                            >
                                {processingId === b.id ? "Processing..." : "Verify & Approve"}
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-[var(--border-muted)] rounded-3xl opacity-40">
                        <span className="material-symbols-outlined text-6xl">verified_user</span>
                        <div className="space-y-1">
                            <h3 className="text-sm font-black uppercase tracking-[0.3em]">Queue Cleared</h3>
                            <p className="text-[10px] font-bold">All incoming business entities have been processed.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
