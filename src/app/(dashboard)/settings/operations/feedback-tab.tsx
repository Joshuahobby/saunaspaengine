"use client";

import { useState } from "react";

export default function FeedbackTab() {
    const [filterRating, setFilterRating] = useState("All Ratings");

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 p-10 glass-card rounded-[2.5rem] border border-[var(--border-muted)] bg-[var(--bg-card)] shadow-xl flex flex-col items-center justify-center text-center group hover:scale-[1.02] transition-transform">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60 mb-2">Excellence Score</p>
                    <div className="text-6xl font-black font-serif text-[var(--text-main)] drop-shadow-sm">4.8</div>
                    <div className="flex gap-1 mt-4 text-emerald-500">
                        {Array(5).fill(0).map((_, i) => (
                            <span key={i} className="material-symbols-outlined text-lg fill-1">star</span>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3 p-10 glass-card rounded-[2.5rem] border border-[var(--border-muted)] bg-[var(--bg-card)] shadow-xl relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">Sentiment Trend</p>
                                <h3 className="text-3xl font-bold font-serif mt-1">92% Positive</h3>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 italic">Stable Path</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <DistributionBar label="5 Stars" percent={70} color="bg-emerald-500" />
                            <DistributionBar label="4 Stars" percent={20} color="bg-emerald-500/70" />
                            <DistributionBar label="3 Stars" percent={6} color="bg-orange-400" />
                            <DistributionBar label="1-2 Stars" percent={4} color="bg-red-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* List Header */}
            <div className="flex items-center justify-between px-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold font-serif text-[var(--color-primary)]">Client Reviews</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-50 italic">Listening to the Spa Community</p>
                </div>
                <div className="flex gap-4">
                    <select 
                        title="Filter by Rating"
                        className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl px-6 py-3 font-bold text-xs outline-none focus:ring-2 ring-emerald-500/20"
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                    >
                        <option>All Feedback</option>
                        <option>5 Star Only</option>
                        <option>Needs Action</option>
                    </select>
                </div>
            </div>

            {/* Narrative List */}
            <div className="space-y-6 pb-12">
                <ReviewEntry 
                    name="Sarah Connor"
                    initials="SC"
                    rating={5}
                    text="The traditional Finnish sauna experience was incredible. The facility was spotless, and the staff was very professional. Highly recommend the eucalyptus infusions!"
                    replied={false}
                />
                <ReviewEntry 
                    name="Marcus King"
                    initials="MK"
                    rating={4}
                    text="Great massage session. The therapist was attentive to my needs. However, the reception area was a bit noisy which slightly disrupted the relaxation."
                    replied={true}
                    reply="Thank you, Marcus! We're addressing the acoustic insulation in the reception foyer immediately."
                />
            </div>
        </div>
    );
}

function DistributionBar({ label, percent, color }: { label: string; percent: number; color: string }) {
    return (
        <div className="flex items-center gap-4 group">
            <span className="text-[10px] font-bold text-[var(--text-muted)] w-16">{label}</span>
            <div className="flex-1 h-2 bg-[var(--bg-surface-muted)]/20 rounded-full overflow-hidden border border-[var(--border-muted)]/10">
                <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
            </div>
            <span className="text-[10px] font-bold text-[var(--text-muted)] w-10 text-right">{percent}%</span>
        </div>
    );
}

function ReviewEntry({ name, initials, rating, text, replied, reply }: { name: string; initials: string; rating: number; text: string; replied: boolean; reply?: string }) {
    return (
        <div className="glass-card rounded-[2.5rem] border border-[var(--border-muted)] p-10 bg-[var(--bg-card)] hover:border-emerald-500/30 transition-all shadow-lg group">
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                    <div className="size-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-500/20">
                        {initials}
                    </div>
                    <div>
                        <h4 className="text-xl font-bold font-serif">{name}</h4>
                        <div className="flex gap-0.5 text-emerald-500 mt-1">
                            {Array(5).fill(0).map((_, i) => (
                                <span key={i} className={`material-symbols-outlined text-xs ${i < rating ? "fill-1" : "opacity-20"}`}>star</span>
                            ))}
                        </div>
                    </div>
                </div>
                {!replied && <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20 animate-pulse">Needs Response</span>}
            </div>

            <p className="text-base font-bold text-[var(--text-main)] opacity-80 leading-relaxed pl-6 border-l-2 border-emerald-500/20 italic mb-8">
                "{text}"
            </p>

            {replied && reply && (
                <div className="p-8 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10 mb-8">
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-2">Spa Management Response</p>
                    <p className="text-sm font-bold opacity-90 leading-relaxed italic">"{reply}"</p>
                </div>
            )}

            <div className="flex gap-4">
                <button className="px-8 py-3 bg-[var(--text-main)] text-[var(--bg-app)] text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform">
                    {replied ? "Update Reply" : "Craft Narrative"}
                </button>
                <button className="px-8 py-3 bg-[var(--bg-surface-muted)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[var(--border-muted)]/50 transition-colors">
                    Archive Insight
                </button>
            </div>
        </div>
    );
}
