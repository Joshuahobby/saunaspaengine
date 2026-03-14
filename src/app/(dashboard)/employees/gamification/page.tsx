"use client";

import React from "react";

const TOP3 = [
    { rank: 2, name: "Marcus Chen", role: "Senior Therapist", rating: 4.9, reviews: 124, size: "w-40 h-40 lg:w-48 lg:h-48", gradient: "from-slate-400 to-slate-200", badgeBg: "bg-slate-400 text-slate-900", order: "order-2 lg:order-1" },
    { rank: 1, name: "Elena Smith", role: "Lead Aesthetician", rating: 5.0, reviews: 156, size: "w-52 h-52 lg:w-64 lg:h-64", gradient: "from-yellow-600 via-[var(--color-primary)] to-yellow-200", badgeBg: "bg-[var(--color-primary)] text-white", order: "order-1 lg:order-2", crown: true },
    { rank: 3, name: "Sarah Jenkins", role: "Massage Specialist", rating: 4.8, reviews: 109, size: "w-40 h-40 lg:w-48 lg:h-48", gradient: "from-orange-800 to-orange-400", badgeBg: "bg-orange-700 text-white", order: "order-3" },
];

const TABLE_ROWS = [
    { rank: 4, name: "Linda Velez", role: "Beauty Therapist", rating: 4.7, sessions: 88, punctuality: "100%", punctColor: "bg-green-500/10 text-green-500", trend: "trending_up", trendColor: "text-green-500" },
    { rank: 5, name: "James Taylor", role: "Nail Technician", rating: 4.6, sessions: 92, punctuality: "94%", punctColor: "bg-yellow-500/10 text-yellow-500", trend: "horizontal_rule", trendColor: "text-[var(--text-muted)]" },
    { rank: 6, name: "Sophia Lane", role: "Esthetician", rating: 4.5, sessions: 76, punctuality: "98%", punctColor: "bg-green-500/10 text-green-500", trend: "trending_down", trendColor: "text-red-500" },
];

export default function GamificationPage() {
    return (
        <main className="flex-1 px-4 lg:px-8 py-10 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[var(--color-primary)]">
                        <span className="material-symbols-outlined">auto_awesome</span>
                        <span className="text-sm font-bold uppercase tracking-widest">Employee Spotlight</span>
                    </div>
                    <h1 className="text-[var(--text-main)] text-4xl lg:text-5xl font-black leading-tight tracking-tight">Staff Excellence Leaderboard</h1>
                    <p className="text-[var(--text-muted)] text-lg">Celebrating our top performers for <span className="text-[var(--color-primary)] font-bold">this month</span></p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-[var(--bg-app)] rounded-full font-bold hover:brightness-110 transition-all shadow-lg shadow-[var(--color-primary)]/20">
                    <span className="material-symbols-outlined text-xl">download</span>
                    Download Report
                </button>
            </div>

            {/* Podium */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end mb-16 px-4">
                {TOP3.map((p) => (
                    <div key={p.rank} className={`${p.order} flex flex-col items-center gap-6 group`}>
                        <div className={`relative ${p.size} rounded-full p-1 bg-gradient-to-tr ${p.gradient} shadow-xl group-hover:scale-105 transition-transform duration-300 ${p.rank === 1 ? "shadow-2xl shadow-[var(--color-primary)]/30 p-2" : ""}`}>
                            <div className={`w-full h-full rounded-full overflow-hidden bg-[var(--bg-surface-muted)]/30 flex items-center justify-center border-4 border-[var(--bg-app)]`}>
                                <span className="material-symbols-outlined text-6xl text-[var(--text-muted)]">person</span>
                            </div>
                            <div className={`absolute -bottom-2 right-1/2 translate-x-1/2 ${p.badgeBg} font-black text-xl ${p.rank === 1 ? "size-16 text-2xl -bottom-4" : "size-12"} rounded-full flex items-center justify-center border-4 border-[var(--bg-app)] shadow-lg`}>{p.rank}</div>
                            {p.crown && (
                                <div className="absolute -top-6 -right-6 animate-bounce">
                                    <span className="material-symbols-outlined text-6xl text-[var(--color-primary)]">workspace_premium</span>
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <h3 className={`${p.rank === 1 ? "text-3xl font-black" : "text-2xl font-bold"} text-[var(--text-main)]`}>{p.name}</h3>
                            <p className={`${p.rank === 1 ? "text-[var(--color-primary)] font-bold text-lg" : "text-[var(--text-muted)] font-medium"}`}>{p.role}</p>
                            <div className="flex items-center justify-center gap-1 mt-2 text-[var(--color-primary)]">
                                <span className="material-symbols-outlined text-sm">star</span>
                                <span className="font-bold">{p.rating}</span>
                                <span className="text-[var(--text-muted)] text-xs ml-1">({p.reviews} reviews)</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Collective Team Goal */}
            <div className="bg-[var(--color-primary)]/5 rounded-xl p-8 mb-12 border border-[var(--color-primary)]/20 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div>
                        <h4 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                            <span className="material-symbols-outlined text-[var(--color-primary)]">celebration</span>
                            Collective Team Goal: 500 5-Star Reviews
                        </h4>
                        <p className="text-[var(--text-muted)]">Team Reward: <span className="text-[var(--color-primary)] font-bold">Team Dinner at Ocean View Restaurant</span></p>
                    </div>
                    <div className="text-right">
                        <span className="text-4xl font-black text-[var(--color-primary)]">410</span>
                        <span className="text-xl text-[var(--text-muted)] font-bold"> / 500</span>
                    </div>
                </div>
                <div className="relative w-full h-6 bg-[var(--bg-surface-muted)]/30 rounded-full overflow-hidden p-1">
                    <div className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/60 rounded-full shadow-[0_0_20px_var(--color-primary)] w-[82%]"></div>
                </div>
                <p className="text-center mt-4 text-[var(--text-muted)] text-sm font-medium italic">&quot;Only 90 more reviews to unlock the celebration!&quot;</p>
            </div>

            {/* Full Rankings Table */}
            <div className="overflow-x-auto">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[var(--text-main)]">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">analytics</span>
                    Full Performance Rankings
                </h2>
                <table className="w-full border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-[var(--text-muted)] text-sm uppercase tracking-wider text-left">
                            <th className="px-6 py-2 font-bold">Rank</th>
                            <th className="px-6 py-2 font-bold">Employee</th>
                            <th className="px-6 py-2 font-bold text-center">Satisfaction</th>
                            <th className="px-6 py-2 font-bold text-center">Volume</th>
                            <th className="px-6 py-2 font-bold text-center">Punctuality</th>
                            <th className="px-6 py-2 font-bold text-right">Trend</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TABLE_ROWS.map((row) => (
                            <tr key={row.rank} className="bg-[var(--bg-card)] hover:bg-[var(--color-primary)]/5 transition-colors rounded-xl overflow-hidden group">
                                <td className="px-6 py-4 rounded-l-xl font-black text-lg text-[var(--text-muted)]">#{row.rank}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-[var(--bg-surface-muted)]/30 border-2 border-[var(--border-muted)] flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[var(--text-muted)]">person</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-[var(--text-main)]">{row.name}</p>
                                            <p className="text-xs text-[var(--text-muted)]">{row.role}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1 text-[var(--color-primary)]">
                                        <span className="material-symbols-outlined text-xs">star</span>
                                        <span className="font-bold">{row.rating}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-[var(--text-main)]">{row.sessions} sessions</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`${row.punctColor} text-xs font-bold px-2 py-1 rounded-full uppercase`}>{row.punctuality}</span>
                                </td>
                                <td className="px-6 py-4 text-right rounded-r-xl">
                                    <span className={`material-symbols-outlined ${row.trendColor}`}>{row.trend}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bottom Stats Cards */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: "groups", title: "Team Participation", desc: "98% of staff reached their minimum service volume this month. Great energy!" },
                    { icon: "reviews", title: "Review Impact", desc: "Customer satisfaction is up 12% compared to last month. Keep up the high standards!" },
                    { icon: "schedule", title: "Perfect Attendance", desc: "14 staff members maintained 100% punctuality streak this week. Reliability matters!" },
                ].map((card) => (
                    <div key={card.title} className="glass-card p-6 border border-[var(--border-muted)]">
                        <div className="size-12 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-[var(--color-primary)]">{card.icon}</span>
                        </div>
                        <h5 className="text-lg font-bold mb-2 text-[var(--text-main)]">{card.title}</h5>
                        <p className="text-[var(--text-muted)] text-sm">{card.desc}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
