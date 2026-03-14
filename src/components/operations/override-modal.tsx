"use client";
import React, { useState } from "react";

interface OverrideModalProps { open: boolean; onClose: () => void; onConfirm?: (reason: string, notes: string) => void; recordId?: string; originalValue?: string; newValue?: string; fieldName?: string; }

export default function OverrideModal({ open, onClose, onConfirm, recordId = "#SVC-2812", originalValue = "$85.00", newValue = "$0.00", fieldName = "Service Charge" }: OverrideModalProps) {
    const [reason, setReason] = useState("");
    const [notes, setNotes] = useState("");
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-[var(--bg-card)] rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-[var(--border-muted)]">
                <div className="p-6 border-b border-[var(--border-muted)]"><div className="flex items-center gap-3 mb-2"><span className="material-symbols-outlined text-orange-500 bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">gavel</span><h2 className="text-xl font-bold">Override Justification</h2></div><p className="text-sm text-[var(--text-muted)]">Provide a reason for overriding this service record. All overrides are visible in the audit log.</p></div>
                <div className="p-6 space-y-4">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800 text-sm">
                        <div className="grid grid-cols-2 gap-2"><span className="text-[var(--text-muted)]">Record:</span><span className="font-bold">{recordId}</span><span className="text-[var(--text-muted)]">Field:</span><span className="font-bold">{fieldName}</span><span className="text-[var(--text-muted)]">Original:</span><span className="font-bold">{originalValue}</span><span className="text-[var(--text-muted)]">New Value:</span><span className="font-bold text-orange-600">{newValue}</span></div>
                    </div>
                    <div><label htmlFor="override-reason" className="text-sm font-bold text-[var(--text-muted)] block mb-1">Override Reason *</label><select id="override-reason" title="Override Justification Reason" aria-label="Select a reason for the override" className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-2 text-sm" value={reason} onChange={e => setReason(e.target.value)}><option value="">Select a reason...</option><option>Customer complaint resolution</option><option>Manager-approved discount</option><option>Billing correction</option><option>Service was not completed</option><option>Other (explain below)</option></select></div>
                    <div><label className="text-sm font-bold text-[var(--text-muted)] block mb-1">Additional Notes</label><textarea className="w-full rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] px-4 py-2 text-sm" rows={3} placeholder="Optional details about this override..." value={notes} onChange={e => setNotes(e.target.value)} /></div>
                </div>
                <div className="p-6 border-t border-[var(--border-muted)] flex gap-3"><button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-muted)] rounded-lg font-bold text-sm hover:bg-[var(--bg-surface-muted)]/50 transition-colors">Cancel</button><button onClick={() => { onConfirm?.(reason, notes); onClose(); }} disabled={!reason} className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Confirm Override</button></div>
            </div>
        </div>
    );
}
