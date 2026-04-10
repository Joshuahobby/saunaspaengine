"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function PromotionsTab() {
    const [selectedAudience, setSelectedAudience] = useState("inactive30");
    const [promoType, setPromoType] = useState("discount");
    const [messageChannel, setMessageChannel] = useState("sms");
    const [messageText, setMessageText] = useState(
        "Hi [Client Name]! We miss you at our spa. Use code [Offer Code] for 20% off your next booking before [Expiry Date]. Book here: [Link]"
    );

    const audiences = [
        { id: "inactive30", icon: "person_off", label: "Quiet for 30 days", desc: "Clients who haven't visited in a month.", count: 142 },
        { id: "lowpass", icon: "loyalty", label: "Low Pass Count", desc: "Members with < 2 sessions remaining.", count: 87 },
        { id: "birthday", icon: "celebration", label: "Celebrations Soon", desc: "Clients with birthdays in the next 7 days.", count: 12 },
    ];

    const selected = audiences.find(a => a.id === selectedAudience);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
            {/* Left side: Builder */}
            <div className="lg:col-span-7 space-y-10">
                {/* 1. Recipient List */}
                <section className="glass-card p-8 rounded-[2.5rem] border border-[var(--border-muted)] space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center font-black">1</div>
                        <h2 className="text-2xl font-serif font-black italic">Who are we <span className="text-[var(--color-primary)]">reaching?</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {audiences.map((a) => (
                            <button
                                key={a.id}
                                onClick={() => setSelectedAudience(a.id)}
                                className={`p-6 rounded-3xl border-2 text-left transition-all ${
                                    selectedAudience === a.id
                                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-lg scale-[1.02]"
                                        : "border-[var(--border-muted)] hover:border-[var(--color-primary)]/30"
                                }`}
                            >
                                <span className={`material-symbols-outlined text-2xl mb-4 block ${selectedAudience === a.id ? "text-[var(--color-primary)]" : "text-[var(--text-muted)]"}`}>{a.icon}</span>
                                <p className="font-bold text-sm mb-1">{a.label}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-primary)]">{a.count} clients</p>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 2. The offer */}
                <section className="glass-card p-8 rounded-[2.5rem] border border-[var(--border-muted)] space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center font-black">2</div>
                        <h2 className="text-2xl font-serif font-black italic">What is the <span className="text-[var(--color-primary)]">offer?</span></h2>
                    </div>
                    <div className="space-y-3">
                        {["discount", "addon", "bogo"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setPromoType(type)}
                                className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all ${
                                    promoType === type ? "bg-[var(--text-main)] text-[var(--bg-app)] border-transparent" : "bg-[var(--bg-app)]/50 border-[var(--border-muted)]"
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`size-10 rounded-xl flex items-center justify-center ${promoType === type ? "bg-white/10" : "bg-[var(--bg-surface-muted)] text-[var(--color-primary)]"}`}>
                                        <span className="material-symbols-outlined">{type === 'discount' ? 'percent' : type === 'addon' ? 'redeem' : 'group'}</span>
                                    </div>
                                    <span className="font-bold uppercase tracking-widest text-[10px]">{type === 'discount' ? 'Percent Discount' : type === 'addon' ? 'Free Gift/Add-on' : 'Buy One Get One'}</span>
                                </div>
                                {promoType === type && <span className="material-symbols-outlined">check_circle</span>}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 3. The Message */}
                <section className="glass-card p-8 rounded-[2.5rem] border border-[var(--border-muted)] space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center font-black">3</div>
                        <h2 className="text-2xl font-serif font-black italic">The <span className="text-[var(--color-primary)]">Message.</span></h2>
                    </div>
                    <div className="space-y-6">
                        <div className="flex p-1 bg-[var(--bg-surface-muted)]/50 rounded-2xl gap-1">
                            {["sms", "email"].map((ch) => (
                                <button
                                    key={ch}
                                    onClick={() => setMessageChannel(ch)}
                                    className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 transition-all ${
                                        messageChannel === ch ? "bg-[var(--text-main)] text-[var(--bg-app)] shadow-md" : "text-[var(--text-muted)]"
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-sm">{ch === 'sms' ? 'chat' : 'mail'}</span>
                                    {ch} Blast
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="w-full bg-[var(--bg-app)] border-2 border-[var(--border-muted)] rounded-[2rem] p-8 outline-none focus:border-[var(--color-primary)] transition-all min-h-[200px] font-bold text-lg italic tracking-tight"
                            placeholder="Type your promotion here..."
                        />
                        <div className="flex justify-between items-center px-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">
                                {messageText.length} Characters • {Math.ceil(messageText.length / 160)} Segment(s)
                            </p>
                            <button className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                                AI Polish
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* Right side: Preview */}
            <div className="lg:col-span-5 relative">
                <div className="sticky top-10 space-y-10">
                    <div className="bg-slate-900 rounded-[4rem] p-6 shadow-2xl border-[12px] border-slate-800 max-w-[340px] mx-auto aspect-[9/18.5] relative">
                         <div className="h-full bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden flex flex-col border border-white/5">
                            {/* Phone top */}
                            <div className="h-10 w-full flex justify-between items-end px-8 pb-3">
                                <span className="text-[10px] font-bold">9:41</span>
                                <div className="flex gap-1">
                                    <div className="w-4 h-2 bg-[var(--text-main)]/20 rounded-full"></div>
                                    <div className="w-2 h-2 bg-[var(--text-main)]/20 rounded-full"></div>
                                </div>
                            </div>
                            
                            {/* Message Header */}
                            <div className="p-6 border-b border-[var(--border-muted)]/20 text-center">
                                <div className="size-12 rounded-full bg-[var(--color-primary)] mx-auto mb-2 shadow-lg shadow-[var(--color-primary)]/20 flex items-center justify-center text-white font-black text-xs">S</div>
                                <p className="text-[10px] font-black tracking-widest uppercase opacity-40">Sauna Connect</p>
                            </div>

                            {/* Message Bubble */}
                            <div className="flex-1 p-6 space-y-4">
                                <div className="text-center opacity-30 text-[8px] font-black uppercase tracking-widest mb-6">Today 10:48 AM</div>
                                <div className="bg-[var(--bg-card)] border border-[var(--border-muted)]/20 p-5 rounded-3xl rounded-tl-lg text-sm font-bold italic leading-relaxed shadow-sm">
                                    {messageText}
                                </div>
                            </div>

                            {/* Keyboard Placeholder */}
                            <div className="h-8 w-full bg-[var(--bg-surface-muted)]/30"></div>
                         </div>
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-slate-900 rounded-b-3xl"></div>
                    </div>

                    <button className="w-full h-20 rounded-[2.5rem] bg-[var(--color-primary)] text-[var(--color-teal-900)] flex items-center justify-center font-black uppercase tracking-widest text-xs gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-[var(--color-primary)]/30 group">
                        <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">send</span>
                        Launch Promotion
                    </button>
                </div>
            </div>
        </div>
    );
}
