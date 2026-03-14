"use client";

import { useState } from "react";

export default function FeedbackManagementPage() {
    const [filterRating, setFilterRating] = useState("All Ratings");
    const [filterCategory, setFilterCategory] = useState("All Service Categories");

    return (
        <div className="flex h-full min-h-screen w-full flex-col">
            <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-10">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                        <div>
                            <h1 className="text-4xl font-display font-bold leading-tight tracking-tight text-[var(--text-main)]">
                                Client Feedback <span className="text-[var(--color-primary)] opacity-50">&</span> Management
                            </h1>
                            <p className="text-lg font-bold text-[var(--text-muted)] mt-2">
                                Monitor, respond and optimize your spa services based on guest insights.
                            </p>
                        </div>
                        <button className="flex items-center justify-center gap-3 rounded-[1.5rem] bg-[var(--text-main)] px-8 py-4 font-bold text-[var(--bg-app)] shadow-xl shadow-[var(--text-main)]/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <span className="material-symbols-outlined font-bold">download</span>
                            Export Insight Report
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Average Rating */}
                        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-[var(--border-muted)] bg-[var(--bg-card)] p-10 text-center shadow-sm group hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all duration-500">
                            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">
                                Average Excellence
                            </p>
                            <div className="mb-4 text-7xl font-display font-bold text-[var(--text-main)] group-hover:scale-110 transition-transform duration-700">
                                4.8
                            </div>
                            <div className="mb-4 flex gap-2 text-[var(--color-primary)] bg-[var(--color-primary)]/5 px-4 py-2 rounded-full">
                                <span className="material-symbols-outlined fill-1 text-2xl">star</span>
                                <span className="material-symbols-outlined fill-1 text-2xl">star</span>
                                <span className="material-symbols-outlined fill-1 text-2xl">star</span>
                                <span className="material-symbols-outlined fill-1 text-2xl">star</span>
                                <span className="material-symbols-outlined text-2xl">star_half</span>
                            </div>
                            <p className="text-sm font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-4 py-1.5 rounded-full animate-pulse">
                                +0.2 from last month
                            </p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="rounded-[2.5rem] border border-[var(--border-muted)] bg-[var(--bg-card)] p-10 shadow-sm lg:col-span-2 group hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all duration-500">
                            <div className="mb-8 flex items-end justify-between">
                                <div>
                                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">
                                        Sentiment Analysis
                                    </p>
                                    <p className="text-3xl font-display font-bold text-[var(--text-main)]">
                                        1,240 <span className="text-lg opacity-50 font-sans font-bold">Total Reviews</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-6 py-2 text-sm font-bold text-[var(--color-primary)]">
                                        92% Positive
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <DistributionRow stars="5 ★" percentage={70} color="bg-[var(--color-primary)]" />
                                <DistributionRow stars="4 ★" percentage={20} color="bg-[var(--color-primary)]/70" />
                                <DistributionRow stars="3 ★" percentage={5} color="bg-[var(--color-primary)]/40" />
                                <DistributionRow stars="2 ★" percentage={3} color="bg-amber-400/80" />
                                <DistributionRow stars="1 ★" percentage={2} color="bg-red-400/80" />
                            </div>
                        </div>
                    </div>

                    {/* Feedback List Container */}
                    <div className="overflow-hidden rounded-[2.5rem] border border-[var(--border-muted)] bg-[var(--bg-card)] shadow-sm">
                        {/* Filters */}
                        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-[var(--border-muted)] p-8">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3 bg-[var(--bg-surface-muted)]/30 px-4 py-2 rounded-2xl border border-[var(--border-muted)]">
                                    <span className="material-symbols-outlined text-[var(--color-primary)] font-bold">filter_list</span>
                                    <span className="text-sm font-bold text-[var(--text-main)]">
                                        Refine Search
                                    </span>
                                </div>
                                <div className="flex gap-4">
                                    <div className="relative group">
                                        <select
                                            title="Filter by Rating"
                                            value={filterRating}
                                            onChange={(e) => setFilterRating(e.target.value)}
                                            className="h-12 px-6 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/50 text-xs font-bold text-[var(--text-main)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all appearance-none pr-10"
                                        >
                                            <option>All Ratings</option>
                                            <option>5 Stars</option>
                                            <option>4 Stars</option>
                                            <option>3 Stars</option>
                                            <option>2 Stars</option>
                                            <option>1 Star</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none text-sm font-bold">expand_more</span>
                                    </div>
                                    <div className="relative group">
                                        <select
                                            title="Filter by Service Category"
                                            value={filterCategory}
                                            onChange={(e) => setFilterCategory(e.target.value)}
                                            className="h-12 px-6 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/50 text-xs font-bold text-[var(--text-main)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all italic appearance-none pr-10"
                                        >
                                            <option>All Categories</option>
                                            <option>Traditional Sauna</option>
                                            <option>Infrared Sauna</option>
                                            <option>Massage</option>
                                            <option>Hydrotherapy</option>
                                            <option>Facials</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none text-sm font-bold">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 bg-[var(--bg-surface-muted)]/30 p-1.5 rounded-2xl border border-[var(--border-muted)]">
                                <button className="rounded-xl bg-[var(--text-main)] px-6 py-2.5 text-xs font-bold text-[var(--bg-app)] transition-all">
                                    Latest
                                </button>
                                <button className="rounded-xl px-6 py-2.5 text-xs font-bold text-[var(--text-muted)] transition-all hover:bg-[var(--bg-card)]">
                                    Unanswered
                                </button>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="divide-y divide-[var(--border-muted)]">
                            <ReviewCard
                                name="Sarah Connor"
                                initials="SC"
                                date="Oct 24, 2023 • 2 days ago"
                                service="Traditional Sauna"
                                stars={5}
                                text="The traditional Finnish sauna experience was incredible. The facility was spotless, and the staff was very professional. Highly recommend the eucalyptus infusions!"
                                status="unreplied"
                            />
                            <ReviewCard
                                name="Marcus King"
                                initials="MK"
                                date="Oct 22, 2023 • 4 days ago"
                                service="Deep Tissue Massage"
                                stars={4}
                                text="Great massage session. The therapist was attentive to my needs. However, the reception area was a bit noisy which slightly disrupted the relaxation at the start."
                                status="replied"
                                reply="Thank you for the feedback, Marcus! We're glad you enjoyed the massage. We've taken note of the noise level and are working on soundproofing the transition area."
                            />
                            <ReviewCard
                                name="Jane Doe"
                                initials="JD"
                                date="Oct 20, 2023 • 6 days ago"
                                service="Hydrotherapy"
                                stars={2}
                                text="The water temperature in the hydrotherapy pool was inconsistent. It was too cold for the first 10 minutes. I expected better given the premium price point."
                                status="action_required"
                            />
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between border-t border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10 p-8">
                            <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-muted)] text-[var(--text-muted)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] group">
                                <span className="material-symbols-outlined font-bold group-hover:-translate-x-1 transition-transform">west</span>
                            </button>
                            <div className="flex gap-3">
                                <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--text-main)] text-sm font-bold text-[var(--bg-app)] transition-transform hover:scale-105">
                                    1
                                </button>
                                <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-muted)] text-sm font-bold text-[var(--text-muted)] transition-all hover:bg-[var(--bg-card)] italic">
                                    2
                                </button>
                                <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-muted)] text-sm font-bold text-[var(--text-muted)] transition-all hover:bg-[var(--bg-card)] italic">
                                    3
                                </button>
                                <span className="flex items-center px-4 text-[var(--text-muted)] opacity-40 font-bold">...</span>
                                <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-muted)] text-sm font-bold text-[var(--text-muted)] transition-all hover:bg-[var(--bg-card)] italic">
                                    42
                                </button>
                            </div>
                            <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-muted)] text-[var(--text-muted)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] group">
                                <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">east</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function DistributionRow({ stars, percentage, color }: { stars: string; percentage: number; color: string }) {
    // Map percentage to Tailwind width classes
    const widthClass = {
        70: 'w-[70%]',
        20: 'w-[20%]',
        5: 'w-[5%]',
        3: 'w-[3%]',
        2: 'w-[2%]'
    }[percentage] || 'w-[0%]';

    return (
        <div className="grid grid-cols-[60px_1fr_60px] items-center gap-8 group">
            <span className="text-xs font-bold text-[var(--text-main)] tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{stars}</span>
            <div className="h-4 overflow-hidden rounded-full bg-[var(--bg-surface-muted)]/50 border border-[var(--border-muted)] shadow-inner">
                <div 
                    className={`h-full rounded-full ${color} transition-all duration-1000 group-hover:opacity-100 opacity-60 shadow-lg ${widthClass}`} 
                />
            </div>
            <span className="text-right text-xs font-bold text-[var(--text-muted)] tracking-widest opacity-40 group-hover:opacity-80 transition-opacity">{percentage}%</span>
        </div>
    );
}

function ReviewCard({
    name,
    initials,
    date,
    service,
    stars,
    text,
    status,
    reply,
}: {
    name: string;
    initials: string;
    date: string;
    service: string;
    stars: number;
    text: string;
    status: "unreplied" | "replied" | "action_required";
    reply?: string;
}) {
    // Dynamic styles based on status
    const isActionRequired = status === "action_required";

    return (
        <div className="p-10 transition-all duration-500 hover:bg-[var(--bg-surface-muted)]/20 border-l-4 border-transparent hover:border-[var(--color-primary)] group">
            <div className="mb-8 flex items-start justify-between">
                <div className="flex items-center gap-6">
                    <div
                        className={`flex size-16 items-center justify-center rounded-[1.25rem] border-2 font-display font-bold text-xl shadow-lg ${isActionRequired
                            ? "border-red-200 bg-red-50 text-red-500"
                            : "border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                            }`}
                    >
                        {initials}
                    </div>
                    <div>
                        <h4 className="text-xl font-display font-bold text-[var(--text-main)] tracking-tight">{name}</h4>
                        <p className="text-xs font-bold text-[var(--text-muted)] opacity-60 tracking-widest uppercase mt-1">Service Date: {date}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="flex gap-1 text-[var(--color-primary)] bg-[var(--color-primary)]/5 px-3 py-1.5 rounded-full border border-[var(--color-primary)]/10">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <span
                                key={s}
                                className={`material-symbols-outlined text-xl ${s <= stars ? "fill-1" : "text-[var(--text-muted)] opacity-20"
                                    }`}
                            >
                                star
                            </span>
                        ))}
                    </div>
                    <span className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-main)]">
                        {service}
                    </span>
                </div>
            </div>

            <p className="mb-8 text-base leading-relaxed text-[var(--text-main)] font-bold opacity-80 pl-2 border-l-2 border-[var(--border-muted)]/30">
                &ldquo;{text}&rdquo;
            </p>

            {status === "replied" && reply && (
                <div className="mb-8 rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-8 relative overflow-hidden group/reply">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover/reply:scale-150 transition-transform duration-1000"></div>
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                        The Spa Response
                    </p>
                    <p className="text-sm font-bold text-[var(--text-main)] opacity-90 leading-relaxed relative z-10">&quot;{reply}&quot;</p>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    {status === "unreplied" && (
                        <>
                            <button className="flex items-center gap-3 rounded-2xl bg-[var(--text-main)] px-8 py-3.5 text-xs font-bold text-[var(--bg-app)] transition-all hover:scale-105 shadow-lg shadow-[var(--text-main)]/10">
                                <span className="material-symbols-outlined text-lg font-bold">reply_all</span>
                                Crafted Response
                            </button>
                            <button className="flex items-center gap-3 rounded-2xl border border-[var(--border-muted)] px-6 py-3.5 text-xs font-bold text-[var(--text-muted)] transition-all hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]">
                                <span className="material-symbols-outlined text-lg font-bold">flag</span>
                                Flag Review
                            </button>
                        </>
                    )}
                    {status === "replied" && (
                        <>
                            <button className="flex cursor-not-allowed items-center gap-3 rounded-2xl bg-[var(--bg-surface-muted)] px-8 py-3.5 text-xs font-bold text-[var(--text-muted)]">
                                <span className="material-symbols-outlined text-lg font-bold">edit_note</span>
                                Edit Response
                            </button>
                            <button className="flex items-center gap-3 rounded-2xl border border-[var(--border-muted)] px-6 py-3.5 text-xs font-bold text-[var(--text-muted)] transition-all hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]">
                                <span className="material-symbols-outlined text-lg font-bold">outlined_flag</span>
                                Keep Flagged
                            </button>
                        </>
                    )}
                    {status === "action_required" && (
                        <>
                            <button className="flex items-center gap-3 rounded-2xl bg-[var(--color-primary)] px-8 py-3.5 text-xs font-bold text-[var(--bg-app)] shadow-xl shadow-[var(--color-primary)]/20 transition-all hover:scale-105">
                                <span className="material-symbols-outlined text-lg font-bold">priority_high</span>
                                Urgent Reply
                            </button>
                            <button className="flex items-center gap-3 rounded-2xl border-2 border-red-500/30 px-6 py-3 text-xs font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white">
                                <span className="material-symbols-outlined text-lg font-bold">emergency</span>
                                Escalation
                            </button>
                        </>
                    )}
                </div>

                <div className={`flex items-center gap-3 text-xs font-bold tracking-widest uppercase ${status === "unreplied" ? "text-[var(--text-muted)] opacity-60" :
                    status === "replied" ? "text-[var(--color-primary)]" : "text-red-500 animate-pulse"
                    }`}>
                    <span className="material-symbols-outlined text-lg font-bold">
                        {status === "unreplied" ? "public" : status === "replied" ? "verified" : "warning"}
                    </span>
                    {status === "unreplied" ? "Public Narrative" : status === "replied" ? "Addressed" : "Action Critical"}
                </div>
            </div>
        </div>
    );
}
