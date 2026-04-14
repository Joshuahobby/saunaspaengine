"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface SafetyAlert {
    id: string;
    type: string;
    location: string | null;
    message: string | null;
    status: string;
    createdAt: string;
}

const CHECKS = [
    { id: "sauna-temp", label: "Sauna Temperature Calibration", category: "Physical Plant", freq: "Every 4 Hours" },
    { id: "water-quality", label: "Dip Tank Water Analysis", category: "Hygiene", freq: "Daily" },
    { id: "sanitation", label: "Room Sanitation Protocols", category: "Hygiene", freq: "After Every Session" },
    { id: "fire-ex", label: "Fire Exit Accessibility", category: "Safety", freq: "Daily" },
    { id: "first-aid", label: "First Aid Kit Inventory", category: "Safety", freq: "Weekly" },
];

const ALERT_TYPES = [
    { value: "CRITICAL", label: "Critical" },
    { value: "SILENT", label: "Silent" },
];

export default function SafetyTab() {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportType, setReportType] = useState("INCIDENT");
    const [reportLocation, setReportLocation] = useState("");
    const [reportMessage, setReportMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const healthScore = CHECKS.length > 0
        ? Math.round((checkedItems.size / CHECKS.length) * 100)
        : 0;

    const fetchAlerts = useCallback(() => {
        fetch("/api/safety/alerts")
            .then(r => r.json())
            .then(data => setAlerts(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, []);

    useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

    const toggleCheck = (id: string) => {
        setCheckedItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const handleResolveAlert = async (alertId: string) => {
        try {
            await fetch("/api/safety/alerts", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: alertId, status: "RESOLVED" }),
            });
            setAlerts(prev => prev.filter(a => a.id !== alertId));
        } catch {
            // silently fail
        }
    };

    const handleSubmitReport = async () => {
        if (!reportMessage.trim()) { setFormError("Please describe the incident."); return; }
        setIsSubmitting(true);
        setFormError(null);
        try {
            const res = await fetch("/api/safety/alerts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: reportType, location: reportLocation || null, message: reportMessage }),
            });
            if (!res.ok) throw new Error("Failed to submit report");
            const newAlert: SafetyAlert = await res.json();
            setAlerts(prev => [newAlert, ...prev]);
            setShowReportModal(false);
            setReportMessage("");
            setReportLocation("");
            setReportType("INCIDENT");
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Failed to submit report");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
                {/* Active Checklist */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-display font-black text-[var(--text-main)] tracking-tight">
                            Daily <span className="text-[var(--color-primary)]">Compliance.</span>
                        </h2>
                        <Link href="/audit" className="h-10 px-6 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-black uppercase tracking-widest text-[9px] hover:bg-[var(--color-primary)]/20 transition-all flex items-center justify-center">
                            History
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {CHECKS.map((check) => {
                            const isChecked = checkedItems.has(check.id);
                            return (
                                <div
                                    key={check.id}
                                    onClick={() => toggleCheck(check.id)}
                                    className={`glass-card p-8 rounded-[2.5rem] border flex items-center justify-between group transition-all cursor-pointer select-none ${
                                        isChecked
                                            ? "border-[var(--color-primary)]/40 bg-[var(--color-primary)]/[0.03]"
                                            : "border-[var(--border-muted)] hover:border-[var(--color-primary)]/40"
                                    }`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`size-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                                            isChecked
                                                ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                                                : "border-[var(--border-muted)] group-hover:border-[var(--color-primary)]"
                                        }`}>
                                            <span className={`material-symbols-outlined text-lg transition-all ${
                                                isChecked ? "text-white" : "text-transparent group-hover:text-[var(--color-primary)]/40"
                                            }`}>check</span>
                                        </div>
                                        <div>
                                            <p className={`font-bold text-lg leading-tight transition-all ${isChecked ? "line-through opacity-50" : ""}`}>{check.label}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40 mt-1">
                                                {check.category} • {check.freq}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`material-symbols-outlined transition-all ${
                                        isChecked ? "text-[var(--color-primary)]" : "text-[var(--text-muted)] opacity-20"
                                    }`}>
                                        {isChecked ? "task_alt" : "inventory_2"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Active Alerts */}
                    {alerts.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-display font-black text-[var(--text-main)] tracking-tight flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-500 text-xl">warning</span>
                                Active Alerts
                            </h3>
                            {alerts.map(alert => (
                                <div key={alert.id} className="glass-card p-6 rounded-[2rem] border border-red-500/20 bg-red-500/[0.02] flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">{alert.type}</span>
                                            {alert.location && (
                                                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">{alert.location}</span>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-[var(--text-main)]">{alert.message}</p>
                                        <p className="text-[9px] text-[var(--text-muted)] opacity-40 mt-1">{new Date(alert.createdAt).toLocaleString()}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleResolveAlert(alert.id)}
                                        className="shrink-0 px-4 py-2 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[9px] font-black uppercase tracking-widest hover:bg-[var(--color-primary)]/20 transition-all"
                                    >
                                        Resolve
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Safety Score / Summary */}
                <div className="lg:col-span-4 space-y-8">
                    <section className="glass-card p-10 rounded-[3rem] border border-[var(--border-muted)] bg-[var(--text-main)] text-[var(--bg-app)] relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Operations Health Score</p>
                            <p className="text-7xl font-black">{healthScore}<span className="text-3xl opacity-40">%</span></p>
                            <p className="text-xs font-medium opacity-80 leading-relaxed">
                                {checkedItems.size} of {CHECKS.length} checks completed today.
                                {healthScore === 100
                                    ? " Your facility is operating at peak safety standards."
                                    : " Complete all checks to reach 100%."}
                            </p>
                        </div>
                        <div className="absolute -right-10 -bottom-10 opacity-5">
                            <span className="material-symbols-outlined text-[15rem] font-black">verified_user</span>
                        </div>
                    </section>

                    <section className="glass-card p-8 rounded-[2.5rem] border border-[var(--border-muted)] space-y-6 bg-[var(--color-primary)]/5">
                        <div className="size-14 rounded-2xl bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)]">
                            <span className="material-symbols-outlined text-3xl">emergency</span>
                        </div>
                        <h3 className="text-xl font-display font-black tracking-tight">Incident <span className="text-[var(--color-primary)]">Report</span></h3>
                        <p className="text-xs font-medium text-[var(--text-muted)] leading-relaxed">
                            Need to log a spill, equipment failure, or client concern? Record it instantly for management review.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowReportModal(true)}
                            className="w-full h-14 rounded-2xl bg-[var(--text-main)] text-[var(--bg-app)] font-black uppercase tracking-widest text-[9px] hover:opacity-80 transition-opacity"
                        >
                            Open Report
                        </button>
                    </section>
                </div>
            </div>

            {/* Incident Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-card rounded-[2.5rem] border border-[var(--border-muted)] p-10 w-full max-w-md space-y-8 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-display font-black text-[var(--text-main)] tracking-tight">
                                New <span className="text-red-500">Incident</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowReportModal(false)}
                                className="size-10 rounded-2xl border border-[var(--border-muted)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">Type</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {ALERT_TYPES.map(t => (
                                        <button
                                            type="button"
                                            key={t.value}
                                            onClick={() => setReportType(t.value)}
                                            className={`py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                                                reportType === t.value
                                                    ? "bg-[var(--text-main)] text-[var(--bg-app)] border-[var(--text-main)]"
                                                    : "border-[var(--border-muted)] text-[var(--text-muted)] hover:border-[var(--border-main)]"
                                            }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">Location</p>
                                <input
                                    type="text"
                                    value={reportLocation}
                                    onChange={e => setReportLocation(e.target.value)}
                                    placeholder="e.g. Sauna Room 2, Pool Deck..."
                                    className="w-full h-12 px-5 rounded-2xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] focus:outline-none focus:border-[var(--color-primary)] text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] placeholder:opacity-40"
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">Description *</p>
                                <textarea
                                    value={reportMessage}
                                    onChange={e => setReportMessage(e.target.value)}
                                    placeholder="Describe the incident in detail..."
                                    rows={4}
                                    className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] focus:outline-none focus:border-[var(--color-primary)] text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] placeholder:opacity-40 resize-none"
                                />
                            </div>

                            {formError && <p className="text-xs font-bold text-red-500">{formError}</p>}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => { setShowReportModal(false); setFormError(null); }}
                                className="flex-1 h-12 rounded-2xl border border-[var(--border-muted)] text-[var(--text-muted)] text-[9px] font-black uppercase tracking-widest hover:text-[var(--text-main)] hover:border-[var(--border-main)] transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitReport}
                                disabled={isSubmitting}
                                className="flex-1 h-12 rounded-2xl bg-[var(--text-main)] text-[var(--bg-app)] text-[9px] font-black uppercase tracking-widest hover:opacity-80 disabled:opacity-40 transition-all"
                            >
                                {isSubmitting ? "Logging..." : "Log Incident"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
