"use client";

import React, { useState } from "react";

const CARD_FIELDS = [
    { id: "name", label: "Client Name", checked: true },
    { id: "tier", label: "Membership Tier", checked: true },
    { id: "qr", label: "QR Code", checked: true },
    { id: "expiry", label: "Expiry Date", checked: true },
];

const COLORS = [
    { id: "dark", color: "bg-slate-900" },
    { id: "emerald", color: "bg-emerald-600" },
    { id: "amber", color: "bg-amber-500" },
    { id: "blue", color: "bg-blue-600" },
];

export default function MembershipCardDesignPage() {
    const [activeColor, setActiveColor] = useState("dark");
    const [cardSide, setCardSide] = useState<"front" | "back">("front");
    const [logoPos, setLogoPos] = useState<"left" | "center" | "right">("center");

    return (
        <main className="flex flex-col lg:flex-row flex-1 min-h-0">
            {/* Sidebar Controls */}
            <aside className="w-full lg:w-80 border-r border-[var(--border-muted)] bg-[var(--bg-card)] p-6 flex flex-col gap-8 overflow-y-auto">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Branding</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block text-[var(--text-main)]">Upload Background Image</label>
                            <div className="border-2 border-dashed border-[var(--border-muted)] rounded-xl p-4 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer bg-[var(--bg-surface-muted)]/10">
                                <span className="material-symbols-outlined text-[var(--text-muted)] mb-1">image</span>
                                <p className="text-xs text-[var(--text-muted)]">PNG or JPG up to 5MB</p>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block text-[var(--text-main)]">Primary Brand Color</label>
                            <div className="flex gap-2">
                                {COLORS.map((c) => (
                                    <div
                                        key={c.id}
                                        onClick={() => setActiveColor(c.id)}
                                        className={`size-8 rounded-full ${c.color} cursor-pointer hover:scale-110 transition-transform ${activeColor === c.id ? "ring-2 ring-[var(--color-primary)] ring-offset-2" : ""}`}
                                    />
                                ))}
                                <button className="size-8 rounded-full border border-[var(--border-muted)] flex items-center justify-center hover:bg-[var(--bg-surface-muted)]/50">
                                    <span className="material-symbols-outlined text-sm text-[var(--text-muted)]">add</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block text-[var(--text-main)]">Logo Placement</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(["left", "center", "right"] as const).map((pos) => (
                                    <button
                                        key={pos}
                                        onClick={() => setLogoPos(pos)}
                                        className={`p-2 border rounded-lg text-xs capitalize ${logoPos === pos
                                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold"
                                            : "border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10 text-[var(--text-main)]"
                                            }`}
                                    >
                                        {pos}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Card Fields</h3>
                    <div className="space-y-2">
                        {CARD_FIELDS.map((field) => (
                            <label key={field.id} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10">
                                <input defaultChecked={field.checked} className="rounded border-[var(--border-muted)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" />
                                <span className="text-sm text-[var(--text-main)]">{field.label}</span>
                                <span className="material-symbols-outlined ml-auto text-[var(--text-muted)] text-sm">drag_indicator</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="mt-auto pt-6 border-t border-[var(--border-muted)]">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Export Options</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-[var(--border-muted)] hover:bg-[var(--bg-card)] text-xs font-medium gap-2 text-[var(--text-main)]">
                            <span className="material-symbols-outlined text-[var(--color-primary)]">account_balance_wallet</span>
                            Digital Wallet
                        </button>
                        <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-[var(--border-muted)] hover:bg-[var(--bg-card)] text-xs font-medium gap-2 text-[var(--text-main)]">
                            <span className="material-symbols-outlined text-[var(--color-primary)]">print</span>
                            PVC Printing
                        </button>
                    </div>
                </div>
            </aside>

            {/* Designer View */}
            <div className="flex-1 flex flex-col p-6 lg:p-10">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[var(--text-main)]">Card Designer</h1>
                        <p className="text-[var(--text-muted)]">Manage the visual identity of your membership program.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-[var(--bg-card)] p-1 rounded-lg border border-[var(--border-muted)] w-fit">
                        <button onClick={() => setCardSide("front")} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${cardSide === "front" ? "bg-[var(--color-primary)] text-[var(--bg-app)]" : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)]/50"}`}>Front</button>
                        <button onClick={() => setCardSide("back")} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${cardSide === "back" ? "bg-[var(--color-primary)] text-[var(--bg-app)]" : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)]/50"}`}>Back</button>
                    </div>
                </div>

                {/* Card Preview Container */}
                <div className="flex-1 flex items-center justify-center py-10">
                    <div className="w-full max-w-md relative group">
                        {/* Card Shadow/Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)]/30 to-purple-500/30 rounded-2xl blur-xl opacity-50"></div>
                        {/* The Physical Card */}
                        <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-2xl transition-transform hover:scale-[1.02] cursor-default border border-white/10 aspect-[1.586/1]">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/60 via-transparent to-slate-950/90"></div>
                            <div className="absolute inset-0 p-8 flex flex-col">
                                <div className={`flex items-start ${logoPos === "center" ? "justify-center" : logoPos === "right" ? "justify-end" : "justify-start"}`}>
                                    <div className="flex items-center gap-2">
                                        <div className="size-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-lg">spa</span>
                                        </div>
                                        <span className="font-bold tracking-tight text-lg">SAUNA SPA</span>
                                    </div>
                                </div>
                                <div className="mt-auto mb-auto flex flex-col items-center">
                                    <div className="size-32 bg-white p-2 rounded-xl shadow-lg mb-4 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-slate-900 text-6xl">qr_code_2</span>
                                    </div>
                                    <span className="text-xs font-medium text-white/60 tracking-widest uppercase">Member ID: #SSA-2024-88</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] uppercase text-white/50 font-bold mb-1 tracking-wider">Member Name</p>
                                        <h4 className="text-xl font-bold tracking-tight">Alexander West</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase text-white/50 font-bold mb-1 tracking-wider">Valid Thru</p>
                                        <p className="font-bold">12 / 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center mt-6 text-[var(--text-muted)] text-sm font-medium">Live Preview Mode</p>
                    </div>
                </div>

                {/* Integration Shortcuts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="glass-card p-6 border border-[var(--border-muted)] shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-[var(--bg-surface-muted)]/10 flex items-center justify-center text-[var(--text-main)]">
                            <span className="material-symbols-outlined">add_to_home_screen</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-[var(--text-main)]">Apple &amp; Google Wallet</h4>
                            <p className="text-sm text-[var(--text-muted)]">Enable one-tap card adding for mobile members.</p>
                        </div>
                        <button className="text-[var(--color-primary)] font-bold text-sm">Configure</button>
                    </div>
                    <div className="glass-card p-6 border border-[var(--border-muted)] shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-[var(--bg-surface-muted)]/10 flex items-center justify-center text-[var(--text-main)]">
                            <span className="material-symbols-outlined">sim_card</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-[var(--text-main)]">Bulk Export (PVC)</h4>
                            <p className="text-sm text-[var(--text-muted)]">Download high-res PDF for professional printing.</p>
                        </div>
                        <button className="text-[var(--color-primary)] font-bold text-sm">Generate</button>
                    </div>
                </div>
            </div>
        </main>
    );
}
