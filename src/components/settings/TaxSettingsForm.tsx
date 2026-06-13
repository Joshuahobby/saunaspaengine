"use client";

import React, { useState } from "react";
import { updateBranchSettingsAction } from "@/lib/settings-actions";
import { toast } from "react-hot-toast";

interface TaxSettingsFormProps {
    branchId: string;
    initialData: {
        taxId: string | null;
        taxLabel: string;
        corporateTaxId: string | null;
        corporateTaxLabel: string;
    };
}

export function TaxSettingsForm({ branchId, initialData }: TaxSettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const [taxId, setTaxId] = useState(initialData.taxId || "");
    const [taxLabel, setTaxLabel] = useState(initialData.taxLabel || "VAT");

    const isInheritingTaxId = !initialData.taxId && initialData.corporateTaxId;
    const isInheritingTaxLabel = initialData.taxLabel === initialData.corporateTaxLabel;

    async function handleUpdate() {
        setLoading(true);
        try {
            const res = await updateBranchSettingsAction(branchId, {
                taxId: taxId || null,
                taxLabel: taxLabel || null,
            });

            if (res.success) {
                toast.success("Fiscal profile updated successfully.");
            } else {
                toast.error(res.error || "Failed to update.");
            }
        } catch (err) {
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-8">
            <section className="glass-card rounded-xl border border-[var(--border-muted)] p-6 flex flex-col gap-6">
                <div className="flex items-center gap-2 border-b border-[var(--border-muted)] pb-4">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">info</span>
                    <h2 className="text-xl font-bold">General Tax Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tax ID */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label htmlFor="tax-id" className="text-sm font-bold text-[var(--text-muted)]">Branch Tax ID</label>
                            {isInheritingTaxId && (
                                <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full font-bold uppercase tracking-tighter">
                                    Inherited from Corporate
                                </span>
                            )}
                        </div>
                        <input 
                            id="tax-id" 
                            className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] px-4 py-2" 
                            placeholder={initialData.corporateTaxId || "Enter Tax ID"}
                            value={taxId}
                            onChange={(e) => setTaxId(e.target.value)}
                        />
                        <p className="text-xs text-[var(--text-muted)]">Leave empty to use business default: {initialData.corporateTaxId || 'N/A'}</p>
                    </div>

                    {/* Tax Label */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label htmlFor="tax-label" className="text-sm font-bold text-[var(--text-muted)]">Tax Label</label>
                            {isInheritingTaxLabel && (
                                <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full font-bold uppercase tracking-tighter">
                                    Corporate Default
                                </span>
                            )}
                        </div>
                        <input 
                            id="tax-label" 
                            className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] px-4 py-2" 
                            placeholder="e.g., VAT, Sales Tax"
                            value={taxLabel}
                            onChange={(e) => setTaxLabel(e.target.value)}
                        />
                        <p className="text-xs text-[var(--text-muted)]">Term displayed on customer invoices.</p>
                    </div>
                </div>
            </section>

            {/* Legal Receipt Config (Static Placeholder for now, but UI preserved) */}
            <section className="glass-card rounded-xl border border-[var(--border-muted)] p-6 flex flex-col gap-6">
                <div className="flex items-center gap-2 border-b border-[var(--border-muted)] pb-4">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">description</span>
                    <h2 className="text-xl font-bold">Legal Receipt Configuration</h2>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="legal-info" className="text-sm font-bold text-[var(--text-muted)]">Legal Header/Footer Information</label>
                    <textarea 
                        id="legal-info" 
                        className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] px-4 py-2" 
                        rows={4} 
                        defaultValue="All prices include applicable taxes. Sauna SPA Engine Ltd." 
                    />
                    <p className="text-xs text-[var(--text-muted)]">Appears at the bottom of all receipts.</p>
                </div>
            </section>

            <div className="flex items-center justify-end gap-4 pb-10">
                <button 
                    type="button"
                    className="px-6 py-2.5 rounded-lg border border-[var(--border-muted)] font-bold hover:bg-[var(--bg-surface-muted)]/50 transition-colors"
                >
                    Discard
                </button>
                <button 
                    onClick={handleUpdate}
                    disabled={loading}
                    className="px-8 py-2.5 rounded-lg bg-[var(--color-primary)] text-[var(--bg-app)] font-bold hover:opacity-90 shadow-lg shadow-[var(--color-primary)]/20 transition-all disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update Fiscal Profile"}
                </button>
            </div>
        </div>
    );
}
