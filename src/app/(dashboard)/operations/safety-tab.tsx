import React from "react";

export default function SafetyTab() {
    const CHECKS = [
        { id: "sauna-temp", label: "Sauna Temperature Calibration", category: "Physical Plant", freq: "Every 4 Hours" },
        { id: "water-quality", label: "Dip Tank Water Analysis", category: "Hygiene", freq: "Daily" },
        { id: "sanitation", label: "Room Sanitation Protocols", category: "Hygiene", freq: "After Every Session" },
        { id: "fire-ex", label: "Fire Exit Accessibility", category: "Safety", freq: "Daily" },
        { id: "first-aid", label: "First Aid Kit Inventory", category: "Safety", freq: "Weekly" },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
            {/* Active Checklist */}
            <div className="lg:col-span-8 space-y-8">
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-serif font-black italic text-[var(--text-main)] underline decoration-[var(--color-primary)]/20 underline-offset-8">
                        Daily <span className="text-[var(--color-primary)]">Compliance.</span>
                    </h2>
                    <button className="h-10 px-6 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-black uppercase tracking-widest text-[9px] hover:bg-[var(--color-primary)]/20 transition-all">
                        History
                    </button>
                 </div>

                 <div className="space-y-4">
                    {CHECKS.map((check) => (
                        <div key={check.id} className="glass-card p-8 rounded-[2.5rem] border border-[var(--border-muted)] flex items-center justify-between group hover:border-[var(--color-primary)]/40 transition-all">
                            <div className="flex items-center gap-6">
                                <button className="size-10 rounded-2xl border-2 border-[var(--border-muted)] flex items-center justify-center group-hover:border-[var(--color-primary)] transition-all">
                                    <span className="material-symbols-outlined text-transparent group-hover:text-[var(--color-primary)]/40">check</span>
                                </button>
                                <div>
                                    <p className="font-bold text-lg leading-tight">{check.label}</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40 mt-1">
                                        {check.category} • {check.freq}
                                    </p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-[var(--text-muted)] opacity-20">inventory_2</span>
                        </div>
                    ))}
                 </div>
            </div>

            {/* Safety Score / Summary */}
            <div className="lg:col-span-4 space-y-8">
                <section className="glass-card p-10 rounded-[3rem] border border-[var(--border-muted)] bg-[var(--text-main)] text-[var(--bg-app)] relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Operations Health Score</p>
                        <p className="text-7xl font-black">98<span className="text-3xl opacity-40">%</span></p>
                        <p className="text-xs font-bold italic opacity-80 leading-relaxed">
                            Your facility is operating at peak safety standards. 98% of checks completed on time this week.
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
                    <h3 className="text-xl font-serif font-black italic">Incident <span className="text-[var(--color-primary)]">Report.</span></h3>
                    <p className="text-xs font-bold text-[var(--text-muted)] italic leading-relaxed">
                        Need to log a spill, equipment failure, or client concern? Record it instantly for management review.
                    </p>
                    <button className="w-full h-14 rounded-2xl bg-[var(--text-main)] text-[var(--bg-app)] font-black uppercase tracking-widest text-[9px]">
                        Open Report
                    </button>
                </section>
            </div>
        </div>
    );
}
