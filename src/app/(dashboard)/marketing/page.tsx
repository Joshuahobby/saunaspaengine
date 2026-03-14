"use client";

import React, { useState } from "react";

export default function MarketingCampaignPage() {
    const [selectedAudience, setSelectedAudience] = useState("inactive30");
    const [promoType, setPromoType] = useState("discount");
    const [messageChannel, setMessageChannel] = useState("sms");
    const [messageText, setMessageText] = useState(
        "Hi [Client Name]! We miss you at our spa. Use code [Promo Code] for 20% off your next booking before [Expiry Date]. Book here: [Booking Link]"
    );

    const audiences = [
        { id: "inactive30", icon: "person_off", label: "Inactive for 30 days", desc: "Clients who haven't booked in the last month.", count: 142 },
        { id: "lowpass", icon: "loyalty", label: "Low Pass Count", desc: "Members with < 2 passes remaining.", count: 87 },
        { id: "birthday", icon: "celebration", label: "Birthday Soon", desc: "Clients with birthdays in the next 7 days.", count: 12 },
    ];

    const selected = audiences.find(a => a.id === selectedAudience);

    return (
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
            {/* Breadcrumbs & Header */}
            <div className="mb-8">
                <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2">
                    <span>Marketing</span>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-[var(--text-main)] font-medium">Campaign Builder</span>
                </nav>
                <div className="flex flex-wrap justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Campaign &amp; Promotion Builder</h1>
                        <p className="text-[var(--text-muted)] mt-1">Re-engage your clients with targeted messaging and exclusive offers.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 rounded-lg border border-[var(--border-muted)] font-semibold text-sm hover:bg-[var(--bg-card)] transition-colors">Save Draft</button>
                        <button className="bg-[var(--color-primary)] px-5 py-2.5 rounded-lg text-[var(--bg-app)] font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">send</span>
                            Review &amp; Send
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Builder Controls (Left Column) */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Section 1: Audience */}
                    <section className="glass-card p-6 shadow-sm border border-[var(--border-muted)]">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="flex items-center justify-center size-8 bg-[var(--color-primary)] rounded-full text-xs font-bold text-[var(--bg-app)]">1</span>
                            <h2 className="text-xl font-bold text-[var(--text-main)]">Audience Selection</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {audiences.map((a) => (
                                <div
                                    key={a.id}
                                    onClick={() => setSelectedAudience(a.id)}
                                    className={`p-4 rounded-xl border-2 flex flex-col gap-2 cursor-pointer relative overflow-hidden group transition-all ${selectedAudience === a.id
                                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                                        : "border-[var(--border-muted)] hover:border-[var(--color-primary)]/50"
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={`material-symbols-outlined ${selectedAudience === a.id ? "text-[var(--color-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--color-primary)]"} transition-colors`}>{a.icon}</span>
                                        {selectedAudience === a.id && (
                                            <div className="size-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[14px] text-[var(--bg-app)] font-bold">check</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-bold text-[var(--text-main)]">{a.label}</p>
                                    <p className="text-xs text-[var(--text-muted)]">{a.desc}</p>
                                    <p className={`text-sm font-semibold mt-2 ${selectedAudience === a.id ? "text-[var(--color-primary)]" : "text-[var(--text-muted)]"}`}>{a.count} clients</p>
                                </div>
                            ))}
                            <div className="p-4 rounded-xl border border-dashed border-[var(--border-muted)] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[var(--bg-card)] transition-all">
                                <span className="material-symbols-outlined text-[var(--text-muted)]">add_circle</span>
                                <p className="text-sm font-bold text-[var(--text-muted)]">Custom Filter</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Promotion Type */}
                    <section className="glass-card p-6 shadow-sm border border-[var(--border-muted)]">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="flex items-center justify-center size-8 bg-[var(--color-primary)] rounded-full text-xs font-bold text-[var(--bg-app)]">2</span>
                            <h2 className="text-xl font-bold text-[var(--text-main)]">Promotion Type</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { id: "discount", label: "% Discount", desc: "Apply a percentage off any service or retail product.", badge: "20%" },
                                { id: "addon", label: "Free Add-on", desc: "Offer a complimentary upgrade like aromatherapy or foot soak.", icon: "redeem" },
                                { id: "bogo", label: "BOGO", desc: "Buy one service, get the second one free or half-off.", icon: "group" },
                            ].map((p) => (
                                <label key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-muted)] cursor-pointer hover:bg-[var(--bg-card)] transition-colors">
                                    <input checked={promoType === p.id} onChange={() => setPromoType(p.id)} className="w-5 h-5 text-[var(--color-primary)] border-[var(--border-muted)] focus:ring-[var(--color-primary)]" name="promo" type="radio" />
                                    <div className="flex-1">
                                        <p className="font-bold text-[var(--text-main)]">{p.label}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{p.desc}</p>
                                    </div>
                                    {p.badge ? (
                                        <div className="bg-[var(--bg-surface-muted)]/50 px-3 py-1 rounded text-sm font-mono font-bold text-[var(--text-main)]">{p.badge}</div>
                                    ) : (
                                        <span className="material-symbols-outlined text-[var(--text-muted)]">{p.icon}</span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Section 3: Composer */}
                    <section className="glass-card p-6 shadow-sm border border-[var(--border-muted)]">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="flex items-center justify-center size-8 bg-[var(--color-primary)] rounded-full text-xs font-bold text-[var(--bg-app)]">3</span>
                            <h2 className="text-xl font-bold text-[var(--text-main)]">Message Composer</h2>
                        </div>
                        <div className="flex gap-4 mb-4">
                            <button onClick={() => setMessageChannel("sms")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${messageChannel === "sms" ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20" : "bg-[var(--bg-surface-muted)]/50 text-[var(--text-muted)]"}`}>
                                <span className="material-symbols-outlined text-sm">sms</span> SMS Blast
                            </button>
                            <button onClick={() => setMessageChannel("email")} className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${messageChannel === "email" ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20" : "bg-[var(--bg-surface-muted)]/50 text-[var(--text-muted)]"}`}>
                                <span className="material-symbols-outlined text-sm">mail</span> Email Blast
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {["[Client Name]", "[Promo Code]", "[Expiry Date]", "[Booking Link]"].map((tag) => (
                                    <span key={tag} className="px-2 py-1 bg-[var(--bg-surface-muted)]/50 rounded border border-[var(--border-muted)] text-xs font-medium cursor-pointer hover:bg-[var(--color-primary)]/20 hover:border-[var(--color-primary)] transition-colors text-[var(--text-main)]">{tag}</span>
                                ))}
                            </div>
                            <textarea
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                className="w-full bg-[var(--bg-surface-muted)]/20 border border-[var(--border-muted)] rounded-xl p-4 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none resize-none text-[var(--text-main)]"
                                placeholder="Type your message here..."
                                rows={5}
                            />
                            <div className="flex justify-between items-center text-xs text-[var(--text-muted)]">
                                <p>{messageText.length} / 160 characters ({Math.ceil(messageText.length / 160)} SMS segment{Math.ceil(messageText.length / 160) > 1 ? "s" : ""})</p>
                                <p className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">auto_fix_high</span> AI Assist</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Preview Pane (Right Column) */}
                <div className="lg:col-span-5 relative">
                    <div className="sticky top-24">
                        {/* Phone Preview */}
                        <div className="bg-slate-900 rounded-[3rem] p-4 shadow-2xl border-[8px] border-slate-800 max-w-[320px] mx-auto aspect-[9/18.5] relative overflow-hidden">
                            <div className="flex justify-between items-center px-6 py-2 text-white/80 text-[10px]">
                                <span>9:41</span>
                                <div className="flex gap-1 items-center">
                                    <span className="material-symbols-outlined text-xs">signal_cellular_alt</span>
                                    <span className="material-symbols-outlined text-xs">wifi</span>
                                    <span className="material-symbols-outlined text-xs">battery_full</span>
                                </div>
                            </div>
                            <div className="h-full bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden flex flex-col">
                                <div className="bg-slate-100 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col items-center">
                                    <div className="size-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold mb-1">SS</div>
                                    <p className="text-[10px] font-bold text-slate-900 dark:text-white">Sauna SPA Engine</p>
                                </div>
                                <div className="flex-1 p-4 space-y-4">
                                    <div className="text-center">
                                        <span className="bg-slate-200 dark:bg-slate-800 text-[8px] text-slate-500 px-2 py-0.5 rounded-full">Today 10:48 AM</span>
                                    </div>
                                    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-3 text-xs leading-relaxed max-w-[85%]">
                                        {messageText.replace("[Client Name]", "Sarah").replace("[Promo Code]", "WELCOME20").replace("[Expiry Date]", "Oct 31").replace("[Booking Link]", "spaconnect.com/b/spa")}
                                    </div>
                                </div>
                                <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                    <div className="flex-1 h-8 bg-slate-100 dark:bg-slate-800 rounded-full px-4 flex items-center">
                                        <div className="h-4 w-px bg-[var(--color-primary)] animate-pulse"></div>
                                    </div>
                                    <div className="size-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[var(--bg-app)] text-sm">arrow_upward</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl"></div>
                        </div>

                        {/* Campaign Stats Preview Card */}
                        <div className="mt-8 glass-card p-6 shadow-lg border border-[var(--border-muted)] max-w-[320px] mx-auto">
                            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-[var(--text-main)]">
                                <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">insights</span> Estimated Reach
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-[var(--text-muted)]">Recipients</p>
                                    <p className="text-sm font-bold text-[var(--text-main)]">{selected?.count || 0}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-[var(--text-muted)]">Est. Open Rate</p>
                                    <p className="text-sm font-bold text-green-500">98%</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-[var(--text-muted)]">Cost per SMS</p>
                                    <p className="text-sm font-bold text-[var(--text-main)]">30 RWF</p>
                                </div>
                                <div className="pt-3 border-t border-[var(--border-muted)] flex justify-between items-center">
                                    <p className="text-xs font-bold text-[var(--text-main)]">Total Cost</p>
                                    <p className="text-lg font-black text-[var(--color-primary)]">{((selected?.count || 0) * 30).toLocaleString()} RWF</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="mt-12 glass-card border border-[var(--border-muted)] p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <p className="text-xs text-[var(--text-muted)]"><span className="font-bold text-[var(--text-main)]">{selected?.count || 0}</span> clients selected for this {messageChannel === "sms" ? "SMS" : "Email"} blast.</p>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <select title="Send timing" className="appearance-none bg-[var(--bg-surface-muted)]/50 border-none rounded-lg px-4 py-2.5 text-sm font-bold pr-10 focus:ring-[var(--color-primary)] text-[var(--text-main)]">
                            <option>Send Now</option>
                            <option>Schedule for later</option>
                            <option>Send in batches</option>
                        </select>
                        <button className="bg-[var(--color-primary)] px-8 py-2.5 rounded-lg text-[var(--bg-app)] font-bold text-sm shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90 transition-all flex-1 md:flex-none">
                            Launch Campaign
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
