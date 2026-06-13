"use client";

import { useState } from "react";

export default function SavePresetForm({
    region,
    saveAction,
}: {
    region: { id: string; region: string; gdprFlag: boolean; taxRate: number };
    saveAction: (formData: FormData) => Promise<void>;
}) {
    const [isSaving, setIsSaving] = useState(false);

    async function handleAction(formData: FormData) {
        setIsSaving(true);
        await saveAction(formData);
        setTimeout(() => setIsSaving(false), 500);
    }

    return (
        <form action={handleAction} className="flex flex-col flex-1">
            <input type="hidden" name="id" value={region.id} />
            <input type="hidden" name="region" value={region.region} />

            <div className="space-y-6 flex-1">
                {/* Rule 1: GDPR */}
                <div className="flex items-start justify-between gap-4 p-4 border border-[var(--border-main)] rounded-xl hover:bg-[var(--bg-surface-muted)]/50 transition-colors">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-[var(--color-primary)] text-sm">
                                database
                            </span>
                            <h4 className="font-bold text-sm">GDPR Data Handling</h4>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                            Automatic consent modals, data portability exports, and right-to-be-forgotten logic for regional residents.
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input
                            type="checkbox"
                            name="gdprFlag"
                            className="sr-only peer"
                            defaultChecked={region.gdprFlag}
                            aria-label="Toggle GDPR Data Handling"
                        />
                        <div className="w-11 h-6 bg-[var(--bg-surface-muted)] peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--bg-card)] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                    </label>
                </div>

                {/* Rule 2: Tax Calculation */}
                <div className="flex items-start justify-between gap-4 p-4 border border-[var(--border-main)] rounded-xl hover:bg-[var(--bg-surface-muted)]/50 transition-colors">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-[var(--color-primary)] text-sm">
                                calculate
                            </span>
                            <h4 className="font-bold text-sm">Tax Calculation (VAT)</h4>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                            Dynamic tax application based on the active region.
                        </p>
                        <div className="mt-3 flex items-center gap-2 bg-[var(--bg-surface-muted)]/50 p-2 rounded-lg max-w-[200px]">
                            <span className="text-sm font-semibold text-[var(--text-muted)] pl-2">Rate:</span>
                            <input
                                type="number"
                                name="taxRate"
                                step="0.01"
                                aria-label="Tax Rate Percentage"
                                defaultValue={region.taxRate}
                                className="w-full bg-transparent border-none text-right font-bold text-lg text-[var(--color-primary)] p-0 focus:ring-0 outline-none"
                            />
                            <span className="text-sm font-bold text-[var(--text-muted)] pr-2">%</span>
                        </div>
                    </div>
                </div>

                {/* Rule 3 */}
                <div className="flex items-start justify-between gap-4 p-4 border border-[var(--border-main)] rounded-xl hover:bg-[var(--bg-surface-muted)]/50 transition-colors">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-[var(--color-primary)] text-sm">
                                receipt_long
                            </span>
                            <h4 className="font-bold text-sm">Legal Receipt Format</h4>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                            Includes mandatory branch registration numbers, VAT IDs, and localized billing addresses.
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                            aria-label="Toggle Legal Receipt Format"
                        />
                        <div className="w-11 h-6 bg-[var(--bg-surface-muted)] peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--bg-card)] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                    </label>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border-main)] mt-auto">
                <button
                    type="submit"
                    disabled={isSaving}
                    className={`w-full bg-[var(--color-primary)] text-[var(--text-main)] font-bold py-3 rounded-xl hover:bg-[var(--color-primary)]/90 transition-all shadow-lg shadow-[var(--color-primary)]/20 flex items-center justify-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isSaving ? "Saving..." : "Save Global Settings"}
                    {isSaving && <span className="material-symbols-outlined animate-spin text-sm">sync</span>}
                </button>
                <p className="text-[11px] text-center text-[var(--text-muted)] mt-3 italic opacity-60">
                    Settings will be applied to all branches in the {region.region} region shortly.
                </p>
            </div>
        </form>
    );
}
