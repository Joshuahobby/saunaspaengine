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
                    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                        <div>
                            <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-slate-100">
                                Client Feedback & Management
                            </h1>
                            <p className="text-base font-normal text-slate-500 dark:text-slate-400">
                                Monitor, respond and optimize your spa services based on guest insights.
                            </p>
                        </div>
                        <button className="flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 font-bold text-[var(--color-bg-dark)] shadow-[var(--color-primary)]/20 transition-all hover:shadow-lg">
                            <span className="material-symbols-outlined">download</span>
                            Export Report
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Average Rating */}
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-surface-light)] p-6 text-center shadow-sm">
                            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Average Rating
                            </p>
                            <div className="mb-2 text-5xl font-black text-slate-900 dark:text-slate-100">
                                4.8
                            </div>
                            <div className="mb-2 flex gap-1 text-[var(--color-primary)]">
                                <span className="material-symbols-outlined fill-1">star</span>
                                <span className="material-symbols-outlined fill-1">star</span>
                                <span className="material-symbols-outlined fill-1">star</span>
                                <span className="material-symbols-outlined fill-1">star</span>
                                <span className="material-symbols-outlined">star_half</span>
                            </div>
                            <p className="text-sm font-medium text-[var(--color-primary)]">
                                +0.2 from last month
                            </p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-surface-light)] p-6 shadow-sm lg:col-span-2">
                            <div className="mb-4 flex items-end justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Rating Distribution
                                    </p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        1,240 Total Reviews
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="rounded bg-[var(--color-primary)]/10 px-2 py-1 text-sm font-bold text-[var(--color-primary)]">
                                        92% Positive
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <DistributionRow stars="5 ★" percentage={70} color="bg-[var(--color-primary)]" />
                                <DistributionRow stars="4 ★" percentage={20} color="bg-[var(--color-primary)] opacity-70" />
                                <DistributionRow stars="3 ★" percentage={5} color="bg-[var(--color-primary)] opacity-40" />
                                <DistributionRow stars="2 ★" percentage={3} color="bg-amber-400" />
                                <DistributionRow stars="1 ★" percentage={2} color="bg-red-400" />
                            </div>
                        </div>
                    </div>

                    {/* Feedback List Container */}
                    <div className="overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-surface-light)] shadow-sm">
                        {/* Filters */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">filter_list</span>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Filter By:
                                </span>
                                <div className="flex gap-2">
                                    <select
                                        aria-label="Filter by Rating"
                                        value={filterRating}
                                        onChange={(e) => setFilterRating(e.target.value)}
                                        className="form-select rounded-lg border-slate-200 bg-slate-50 text-xs font-medium focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20 dark:border-slate-700 dark:bg-slate-800"
                                    >
                                        <option>All Ratings</option>
                                        <option>5 Stars</option>
                                        <option>4 Stars</option>
                                        <option>3 Stars</option>
                                        <option>2 Stars</option>
                                        <option>1 Star</option>
                                    </select>
                                    <select
                                        aria-label="Filter by Service Category"
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="form-select rounded-lg border-slate-200 bg-slate-50 text-xs font-medium focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20 dark:border-slate-700 dark:bg-slate-800"
                                    >
                                        <option>All Service Categories</option>
                                        <option>Traditional Sauna</option>
                                        <option>Infrared Sauna</option>
                                        <option>Full Body Massage</option>
                                        <option>Hydrotherapy</option>
                                        <option>Facial Treatment</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
                                    Latest
                                </button>
                                <button className="rounded-lg px-4 py-2 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                                    Unanswered
                                </button>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
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
                        <div className="flex items-center justify-center gap-4 border-t border-slate-100 bg-[var(--color-surface-light)] p-6 dark:border-slate-800">
                            <button className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:text-[var(--color-primary)] dark:border-slate-700">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <div className="flex gap-2">
                                <button className="flex size-10 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-bold text-[var(--color-bg-dark)]">
                                    1
                                </button>
                                <button className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                                    2
                                </button>
                                <button className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                                    3
                                </button>
                                <span className="flex items-center px-2 text-slate-400">...</span>
                                <button className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                                    42
                                </button>
                            </div>
                            <button className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:text-[var(--color-primary)] dark:border-slate-700">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function DistributionRow({ stars, percentage, color }: { stars: string; percentage: number; color: string }) {
    return (
        <div className="grid grid-cols-[30px_1fr_45px] items-center gap-4">
            <span className="text-xs font-bold text-slate-500">{stars}</span>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                {/* eslint-disable-next-line react/forbid-dom-props */}
                <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
            </div>
            <span className="text-right text-xs text-slate-400">{percentage}%</span>
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
        <div className="p-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div
                        className={`flex size-12 items-center justify-center rounded-full border font-bold ${isActionRequired
                            ? "border-red-200 bg-red-100 text-red-500 dark:border-red-800/50 dark:bg-red-900/30"
                            : "border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                            }`}
                    >
                        {initials}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">{name}</h4>
                        <p className="text-xs text-slate-500">Service Date: {date}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-0.5 text-[var(--color-primary)]">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <span
                                key={s}
                                className={`material-symbols-outlined text-xl ${s <= stars ? "fill-1" : "text-slate-300 dark:text-slate-700"
                                    }`}
                            >
                                star
                            </span>
                        ))}
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-tighter text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {service}
                    </span>
                </div>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {text}
            </p>

            {status === "replied" && reply && (
                <div className="mb-6 rounded-r-lg border-l-4 border-[var(--color-primary)] bg-[var(--color-primary)]/5 p-4">
                    <p className="mb-1 text-xs font-bold uppercase text-[var(--color-primary)]">
                        Your Response
                    </p>
                    <p className="text-sm italic text-slate-600 dark:text-slate-400">&quot;{reply}&quot;</p>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex gap-3">
                    {status === "unreplied" && (
                        <>
                            <button className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)]/10 px-4 py-2 text-xs font-bold text-slate-900 transition-all hover:bg-[var(--color-primary)] dark:text-slate-100">
                                <span className="material-symbols-outlined text-sm">reply</span>
                                Reply
                            </button>
                            <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                                <span className="material-symbols-outlined text-sm">flag</span>
                                Flag
                            </button>
                        </>
                    )}
                    {status === "replied" && (
                        <>
                            <button className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-400 dark:bg-slate-800">
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Edit Reply
                            </button>
                            <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                                <span className="material-symbols-outlined text-sm">flag</span>
                                Flag
                            </button>
                        </>
                    )}
                    {status === "action_required" && (
                        <>
                            <button className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-[var(--color-bg-dark)] shadow-[var(--color-primary)]/20 transition-all hover:shadow-md">
                                <span className="material-symbols-outlined text-sm">reply</span>
                                Reply Now
                            </button>
                            <button className="flex items-center gap-2 rounded-lg border-2 border-red-500/50 px-4 py-2 text-xs font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white">
                                <span className="material-symbols-outlined text-sm">report_problem</span>
                                Flag for Management
                            </button>
                        </>
                    )}
                </div>

                {status === "unreplied" && (
                    <div className="flex items-center gap-2 text-xs italic text-slate-400">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Publicly visible
                    </div>
                )}
                {status === "replied" && (
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)]">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Replied
                    </div>
                )}
                {status === "action_required" && (
                    <div className="flex animate-pulse items-center gap-2 text-xs font-bold text-red-500">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        Action Required
                    </div>
                )}
            </div>
        </div>
    );
}
