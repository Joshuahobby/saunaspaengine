"use client";

import { useState } from "react";

export default function SafetyHubPage() {
    const [alertSent, setAlertSent] = useState(false);
    const [panicTriggered, setPanicTriggered] = useState(false);

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-black tracking-tight">Safety & Assistance</h2>
                <p className="text-slate-500 text-lg max-w-xl">Immediate support tools. Silent alerts and critical panic controls are available 24/7 for your protection.</p>
            </div>

            {/* Main Safety Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Silent Assistance */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl">
                    <div className="size-20 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl text-[var(--color-primary)]">record_voice_over</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Request Assistance</h3>
                    <p className="text-slate-500 mb-8">Sends a silent notification to the management dashboard. Use for non-critical security needs or difficult guests.</p>
                    <button
                        onMouseDown={() => {
                            const timer = setTimeout(() => setAlertSent(true), 2000);
                            const up = () => { clearTimeout(timer); document.removeEventListener("mouseup", up); };
                            document.addEventListener("mouseup", up);
                        }}
                        className="w-full group relative h-20 bg-slate-100 border-2 border-[var(--color-primary)]/30 hover:border-[var(--color-primary)] rounded-xl overflow-hidden transition-all active:scale-95 flex items-center justify-center"
                    >
                        <span className="relative z-10 text-[var(--color-primary)] font-bold text-lg uppercase tracking-widest">Hold for 2 Seconds</span>
                        <div className="absolute inset-0 bg-[var(--color-primary)]/10 w-0 group-active:w-full transition-all duration-[2000ms] ease-linear"></div>
                    </button>
                    <p className="mt-4 text-xs text-slate-400 italic">Discreet and silent operation</p>
                </div>

                {/* Emergency Panic */}
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl shadow-rose-500/5">
                    <div className="size-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl text-rose-500">warning</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-rose-600">Critical Panic Alert</h3>
                    <p className="text-slate-600 mb-8">Triggers high-priority loud alarms and notifies all security personnel. Use only in life-threatening emergencies.</p>
                    <button
                        onClick={() => setPanicTriggered(true)}
                        className="w-full h-20 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-3 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined font-bold">emergency_home</span>
                        <span className="font-black text-xl uppercase tracking-tighter">EMERGENCY PANIC</span>
                    </button>
                    <p className="mt-4 text-xs text-rose-500 font-semibold uppercase">Immediate Response Protocol</p>
                </div>
            </div>

            {/* Confirmation Alert */}
            {(alertSent || panicTriggered) && (
                <div className={`rounded-xl p-6 flex items-center gap-6 shadow-lg ${panicTriggered ? "bg-rose-50 border border-rose-200" : "bg-emerald-50 border border-emerald-200"}`}>
                    <div className={`size-14 rounded-full flex items-center justify-center shrink-0 ${panicTriggered ? "bg-rose-500" : "bg-emerald-500"}`}>
                        <span className="material-symbols-outlined text-white text-3xl">{panicTriggered ? "emergency_home" : "check_circle"}</span>
                    </div>
                    <div className="flex-1">
                        <h4 className={`font-bold text-xl ${panicTriggered ? "text-rose-800" : "text-emerald-800"}`}>
                            {panicTriggered ? "Emergency Alert Triggered" : "Assistance is on the way"}
                        </h4>
                        <p className={`text-sm ${panicTriggered ? "text-rose-700/80" : "text-emerald-700/80"}`}>
                            {panicTriggered ? "All security personnel have been notified. Stay in a safe location." : "Security was notified. A responder is currently en route to your location."}
                        </p>
                    </div>
                    <button
                        onClick={() => { setAlertSent(false); setPanicTriggered(false); }}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            )}

            {/* Emergency Quick Dial */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">contact_phone</span>
                    Emergency Quick Dial
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { icon: "local_police", color: "text-blue-500", label: "Rwanda Police", number: "112" },
                        { icon: "security", color: "text-[var(--color-primary)]", label: "Security Desk", number: "EXT 404" },
                        { icon: "medical_services", color: "text-amber-500", label: "SAMU (Ambulance)", number: "912" },
                    ].map((contact) => (
                        <button key={contact.label} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <span className={`material-symbols-outlined ${contact.color}`}>{contact.icon}</span>
                                <div className="text-left">
                                    <p className="text-sm font-bold">{contact.label}</p>
                                    <p className="text-xs text-slate-500 font-mono">{contact.number}</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 group-hover:text-[var(--color-primary)] transition-colors">call</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Location Info */}
            <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--color-primary)]">location_on</span>
                        <span className="font-bold">Your Current Location</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Zone: Spa West Wing, Treatment Room 14</span>
                </div>
                <div className="h-48 w-full bg-slate-200 relative flex items-center justify-center">
                    <div className="size-6 bg-[var(--color-primary)] rounded-full ring-8 ring-[var(--color-primary)]/20 animate-pulse relative">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-lg">You are here</div>
                    </div>
                </div>
            </div>

            {/* Connection Status */}
            <div className="bg-[var(--color-primary)]/5 rounded-xl p-4 border border-[var(--color-primary)]/20">
                <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-sm text-slate-600">Connected to Security Network • Signal Strong</p>
                </div>
            </div>
        </div>
    );
}
