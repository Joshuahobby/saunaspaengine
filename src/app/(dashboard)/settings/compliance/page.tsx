"use client";
import React, { useState } from "react";
import Link from "next/link";

const SAFETY_CHECKLISTS = [
    { icon: "hygiene", title: "Daily Hygiene Audit", desc: "Mandatory daily sanitization checks for all spa equipment and sauna rooms.", active: true },
    { icon: "thermometer", title: "Temperature Logs", desc: "Digital logging of sauna temperatures every 2 hours as per health regulations.", active: true },
    { icon: "vaccines", title: "Chemical Safety", desc: "Safety data sheets and concentration logs for pool/spa cleaning agents.", active: true },
    { icon: "emergency", title: "First Aid Readiness", desc: "Weekly verification of defib pads, first aid kits, and emergency exits.", active: false },
];

const SECURITY_PRESETS = [
    { title: "Anti-Screenshot Protection", desc: "Overlay a dynamic watermark on digital QR cards to prevent sharing.", active: true },
    { title: "Geo-Fencing Validation", desc: "Only accept QR scans within 100m of a registered branch location.", active: false },
    { title: "Device Binding", desc: "Lock QR codes to a single registered mobile device per member.", active: true },
    { title: "Offline Mode Fallback", desc: "Allow check-ins when connectivity is lost (syncs when online).", active: true },
];

export default function SafeSecureOperationsPage() {
    const [activeSection, setActiveSection] = useState<'safety' | 'security'>('safety');

    return (
        <main className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
            <div className="max-w-6xl mx-auto space-y-16 pb-24">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <Link href="/settings" className="size-10 rounded-xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors border border-[var(--border-muted)]">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] opacity-60">Control Center / Settings</span>
                </div>

                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter font-serif text-[var(--text-main)]">
                        Safe & <span className="text-emerald-500">Secure.</span>
                    </h1>
                    <p className="text-sm font-bold text-[var(--text-muted)] opacity-60 leading-relaxed">
                        Keep your business and your guests protected with unified safety checklists and digital security protocols.
                    </p>
                </div>

                <div className="flex w-full overflow-x-auto no-scrollbar pb-1">
                    <div className="flex gap-2 p-1 bg-[var(--bg-surface-muted)]/30 rounded-2xl w-fit border border-[var(--border-muted)] whitespace-nowrap">
                        <button 
                            onClick={() => setActiveSection('safety')}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSection === 'safety' ? "bg-[var(--color-primary)] text-white shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
                        >
                            Health & Safety
                        </button>
                        <button 
                            onClick={() => setActiveSection('security')}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSection === 'security' ? "bg-[var(--color-primary)] text-white shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
                        >
                            Security & Access
                        </button>
                    </div>
                </div>

                {/* Section Content */}
                {activeSection === 'safety' ? (
                    <div className="space-y-12 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                            <div className="xl:col-span-7 space-y-8">
                                <section className="glass-card rounded-[2.5rem] border border-[var(--border-muted)] overflow-hidden shadow-xl bg-[var(--bg-card)]">
                                    <div className="p-8 border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10">
                                        <h2 className="text-2xl font-bold font-serif">Daily Compliance Checklists</h2>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mt-1 opacity-60">Operations Safety</p>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        {SAFETY_CHECKLISTS.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 bg-[var(--bg-surface-muted)]/5 rounded-[2rem] border border-[var(--border-muted)] group hover:border-[var(--color-primary)]/30 transition-all">
                                                <div className="flex items-center gap-6">
                                                    <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-[var(--text-main)]">{item.title}</h4>
                                                        <p className="text-[11px] text-[var(--text-muted)] max-w-sm font-bold opacity-70">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${item.active ? "bg-emerald-500" : "bg-[var(--bg-surface-muted)]/50"}`}>
                                                    <div className={`absolute top-1 size-4 bg-white rounded-full transition-transform shadow-sm ${item.active ? "translate-x-7" : "translate-x-1"}`}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="xl:col-span-5">
                                <div className="p-10 glass-card bg-emerald-500 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                        <span className="material-symbols-outlined text-9xl">verified_user</span>
                                    </div>
                                    <h3 className="text-2xl font-bold font-serif leading-tight mb-6 relative z-10">All systems are <br /> <span className="text-emerald-950/40">Healthy.</span></h3>
                                    <p className="text-sm font-bold opacity-80 leading-relaxed relative z-10">Every location is currently up to date with its health audits. No critical issues reported in the last 24 hours.</p>
                                    
                                    <button className="mt-12 w-full py-4 bg-white text-emerald-500 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] transition-transform active:scale-95 relative z-10">
                                        Run Safety Audit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                            <div className="xl:col-span-8 space-y-10">
                                <section className="glass-card rounded-[2.5rem] border border-[var(--border-muted)] p-10 bg-[var(--bg-card)] shadow-xl">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="size-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                                            <span className="material-symbols-outlined text-3xl font-black">qr_code_2</span>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold font-serif">QR Security Protocol</h2>
                                            <p className="text-[10px] font-black tracking-widest text-[var(--text-muted)] uppercase opacity-60">Digital Gatekeeping</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Code Life Span</label>
                                            <select title="Code Life Span" className="bg-[var(--bg-surface-muted)]/5 border border-[var(--border-muted)] rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-[var(--color-primary)]/20 transition-all outline-none">
                                                <option>Permanent</option>
                                                <option>24 Hours</option>
                                                <option>Visit Session Only</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Scan Limits</label>
                                            <select title="Scan Limits" className="bg-[var(--bg-surface-muted)]/5 border border-[var(--border-muted)] rounded-2xl px-6 py-4 font-bold focus:ring-2 ring-[var(--color-primary)]/20 transition-all outline-none">
                                                <option>Unlimited Scans</option>
                                                <option>One-Time Use</option>
                                                <option>Maximum 5 Scans</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-12 space-y-4">
                                        {SECURITY_PRESETS.map((p, i) => (
                                            <div key={i} className="flex items-center justify-between p-5 bg-[var(--bg-surface-muted)]/5 rounded-2xl border border-[var(--border-muted)]/50">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold">{p.title}</p>
                                                    <p className="text-[11px] text-[var(--text-muted)] font-bold opacity-70">{p.desc}</p>
                                                </div>
                                                <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${p.active ? "bg-[var(--color-primary)]" : "bg-[var(--bg-surface-muted)]/50"}`}>
                                                    <div className={`absolute top-0.5 size-4 bg-white rounded-full transition-transform shadow-sm ${p.active ? "translate-x-5.5" : "translate-x-0.5"}`}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="xl:col-span-4 self-start">
                                <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] p-10 shadow-xl space-y-8">
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500">Physical Access</h4>
                                        <h3 className="text-xl font-bold font-serif leading-tight">Branch Gatekeepers</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { user: "Sarah J.", time: "2m ago", status: "Success" },
                                            { user: "Mike R.", time: "15m ago", status: "Denied" },
                                            { user: "Leo K.", time: "45m ago", status: "Success" },
                                        ].map((log, i) => (
                                            <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border-muted)] last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <div className={`size-2 rounded-full ${log.status === "Success" ? "bg-emerald-500" : "bg-red-500"}`}></div>
                                                    <span className="text-xs font-bold">{log.user}</span>
                                                </div>
                                                <span className="text-[10px] text-[var(--text-muted)] font-black uppercase">{log.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                                        View All Scans
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
