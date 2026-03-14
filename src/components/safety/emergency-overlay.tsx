"use client";
import React from "react";

interface EmergencyOverlayProps { open: boolean; onClose: () => void; }

export default function EmergencyOverlay({ open, onClose }: EmergencyOverlayProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center" aria-modal="true" role="dialog">
            <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm animate-pulse" onClick={onClose}></div>
            <div className="relative bg-[var(--bg-card)] rounded-2xl shadow-2xl shadow-red-500/30 max-w-lg w-full mx-4 overflow-hidden border-2 border-red-500">
                <div className="bg-red-600 p-6 text-center text-white">
                    <span className="material-symbols-outlined text-5xl mb-2 animate-bounce">emergency</span>
                    <h2 className="text-2xl font-black tracking-tight">EMERGENCY RESPONSE</h2>
                    <p className="text-red-100 text-sm mt-1">Immediate action required</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-3 mb-2"><span className="material-symbols-outlined text-red-500">person_alert</span><span className="font-bold text-red-800 dark:text-red-300">Panic Alert Triggered</span></div>
                        <p className="text-sm text-red-700 dark:text-red-400">Staff member <strong>Elena Rodriguez</strong> activated panic button in <strong>Room B3 — Steam Suite</strong>.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 bg-[var(--bg-surface-muted)]/10 rounded-lg"><span className="text-xs font-bold text-[var(--text-muted)] uppercase">Time</span><p className="font-bold">Just Now</p></div>
                        <div className="p-3 bg-[var(--bg-surface-muted)]/10 rounded-lg"><span className="text-xs font-bold text-[var(--text-muted)] uppercase">Location</span><p className="font-bold">Room B3</p></div>
                    </div>
                    <div className="flex flex-col gap-3 pt-4">
                        <button className="w-full py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"><span className="material-symbols-outlined">call</span>Call Emergency Services (911)</button>
                        <button className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined">security</span>Dispatch On-Site Security</button>
                        <button onClick={onClose} className="w-full py-3 border border-[var(--border-muted)] text-[var(--text-muted)] font-bold rounded-xl hover:bg-[var(--bg-surface-muted)]/50 transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined">check_circle</span>Mark as Resolved</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
