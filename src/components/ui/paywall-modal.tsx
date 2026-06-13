"use client";
import React from "react";

interface PaywallModalProps { open: boolean; onClose: () => void; feature?: string; }

export default function PaywallModal({ open, onClose, feature = "Advanced Analytics" }: PaywallModalProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-[var(--bg-card)] rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-[var(--border-muted)] overflow-hidden">
                <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/70 p-8 text-center text-white">
                    <span className="material-symbols-outlined text-5xl mb-3">lock</span>
                    <h2 className="text-2xl font-black tracking-tight">Unlock {feature}</h2>
                    <p className="text-white/80 text-sm mt-2">This feature is available on the Professional plan and above.</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-3">
                        {[
                            { icon: "insights", text: "Advanced reporting & analytics dashboards" },
                            { icon: "group_add", text: "Unlimited staff accounts & role management" },
                            { icon: "support_agent", text: "Priority 24/7 support with dedicated agent" },
                            { icon: "integration_instructions", text: "API access & custom integrations" },
                        ].map((f) => (
                            <div key={f.icon} className="flex items-center gap-3"><span className="material-symbols-outlined text-[var(--color-primary)] text-lg">{f.icon}</span><span className="text-sm">{f.text}</span></div>
                        ))}
                    </div>
                    <div className="p-4 bg-[var(--color-primary)]/10 rounded-xl text-center border border-[var(--color-primary)]/20"><p className="text-[var(--color-primary)] font-black text-2xl">$49<span className="text-sm font-normal text-[var(--text-muted)]"> /month</span></p><p className="text-xs text-[var(--text-muted)] mt-1">Billed monthly • Cancel anytime</p></div>
                </div>
                <div className="p-6 pt-0 flex flex-col gap-3">
                    <button className="w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/30 flex items-center justify-center gap-2"><span className="material-symbols-outlined">rocket_launch</span>Upgrade to Professional</button>
                    <button onClick={onClose} className="w-full py-2 text-[var(--text-muted)] text-sm font-medium hover:text-[var(--text-main)] transition-colors">Maybe later</button>
                </div>
            </div>
        </div>
    );
}
