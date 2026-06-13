"use client";

import { useTransition } from "react";
import { updateBusinessProfileAction } from "@/app/actions/business";

interface BusinessProfileFormProps {
    business: {
        id: string;
        name: string;
        taxId: string | null;
        headquarters: string | null;
        phone: string | null;
    };
}

export default function BusinessProfileForm({ business }: BusinessProfileFormProps) {
    const [isPending, startTransition] = useTransition();

    async function action(formData: FormData) {
        startTransition(async () => {
            try {
                await updateBusinessProfileAction(formData);
                // We could add a toast here
            } catch (err) {
                console.error("Update failed:", err);
            }
        });
    }

    return (
        <form action={action} className="space-y-8 flex flex-col h-full justify-between">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60 px-2">Brand Identity</label>
                    <input 
                        name="name"
                        defaultValue={business.name}
                        placeholder="Business Name"
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl px-6 py-4 text-sm font-bold focus:border-[var(--color-primary)] outline-none transition-all placeholder:opacity-20"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60 px-2">Tax Identifier / TIN</label>
                    <input 
                        name="taxId"
                        defaultValue={business.taxId || ""}
                        placeholder="TIN / VAT Number"
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl px-6 py-4 text-sm font-bold focus:border-[var(--color-primary)] outline-none transition-all placeholder:opacity-20"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60 px-2">Global Headquarters</label>
                    <textarea 
                        name="headquarters"
                        defaultValue={business.headquarters || ""}
                        placeholder="Address"
                        rows={3}
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl px-6 py-4 text-sm font-bold focus:border-[var(--color-primary)] outline-none transition-all placeholder:opacity-20 resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60 px-2">Corporate Contact / Phone</label>
                    <input 
                        name="phone"
                        defaultValue={business.phone || ""}
                        placeholder="+250 ..."
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl px-6 py-4 text-sm font-bold focus:border-[var(--color-primary)] outline-none transition-all placeholder:opacity-20"
                    />
                </div>
            </div>

            <div className="pt-6 border-t border-[var(--border-muted)]/50 mt-auto">
                <button 
                    disabled={isPending}
                    type="submit"
                    className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                >
                    {isPending ? (
                        <>
                            <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                            Synchronizing...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[18px]">verified_user</span>
                            Commit Profile Changes
                        </>
                    )}
                </button>
                <p className="text-[8px] font-bold text-center mt-4 text-[var(--text-muted)] uppercase tracking-widest opacity-30">Changes propagate across all networked branches instantly</p>
            </div>
        </form>
    );
}
