"use client";

import { useState, useMemo } from "react";
import type { LeaderboardEntry } from "@/lib/leaderboard";

export default function LeaderboardTable({ rankings }: { rankings: LeaderboardEntry[] }) {
    const [query, setQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const categories = useMemo(() => {
        const cats = Array.from(new Set(rankings.map(e => e.category))).sort();
        return ["All", ...cats];
    }, [rankings]);

    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        return rankings.filter(e => {
            const matchesQuery = !q || e.fullName.toLowerCase().includes(q) || e.branchName.toLowerCase().includes(q);
            const matchesCategory = categoryFilter === "All" || e.category === categoryFilter;
            return matchesQuery && matchesCategory;
        });
    }, [rankings, query, categoryFilter]);

    return (
        <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1 max-w-sm">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-[18px] opacity-40">search</span>
                    <input
                        type="text"
                        placeholder="Search by name or branch…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-app)] text-sm font-medium text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)]/50 transition-colors"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                                categoryFilter === cat
                                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/15"
                                    : "border-[var(--border-muted)] text-[var(--text-muted)] hover:border-[var(--color-primary)]/30"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                {(query || categoryFilter !== "All") && (
                    <button
                        type="button"
                        onClick={() => { setQuery(""); setCategoryFilter("All"); }}
                        className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="glass-card rounded-[2.5rem] border border-[var(--border-muted)] overflow-hidden shadow-2xl shadow-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[var(--bg-surface-muted)]/50 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-muted)]">
                                <th className="px-8 py-6 text-center w-24">Rank</th>
                                <th className="px-8 py-6">Team Member</th>
                                <th className="px-8 py-6">Branch</th>
                                <th className="px-8 py-6 text-center">Volume</th>
                                <th className="px-8 py-6 text-center">Score</th>
                                <th className="px-8 py-6 text-right">Commission</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-[var(--text-muted)] opacity-30 text-[10px] font-black uppercase tracking-widest">
                                        {rankings.length === 0 ? "No active staff to rank yet." : "No results match your search."}
                                    </td>
                                </tr>
                            )}
                            {filtered.map((entry, index) => (
                                <tr key={entry.id} className="hover:bg-[var(--bg-surface-muted)]/20 transition-all group">
                                    <td className="px-8 py-6 text-center">
                                        <div className={`size-10 rounded-2xl mx-auto flex items-center justify-center text-[10px] font-black border ${
                                            index === 0 ? "bg-yellow-500 text-white border-yellow-400 shadow-xl shadow-yellow-500/20" :
                                            index === 1 ? "bg-slate-300 text-slate-700 border-slate-200" :
                                            index === 2 ? "bg-orange-400 text-white border-orange-300" :
                                            "bg-[var(--bg-app)] text-[var(--text-muted)] border-[var(--border-muted)]"
                                        }`}>
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-[var(--bg-surface-muted)] flex items-center justify-center font-black text-[var(--text-muted)] border border-[var(--border-muted)]">
                                                {entry.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors">{entry.fullName}</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">{entry.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold text-[var(--text-muted)]">{entry.branchName}</td>
                                    <td className="px-8 py-6 text-center">
                                        <p className="text-sm font-black text-[var(--text-main)]">{entry.serviceCount}</p>
                                        <p className="text-[8px] font-black uppercase tracking-tighter text-[var(--text-muted)] opacity-40">Sessions</p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-sm font-black text-[var(--color-primary)]">{entry.score}</span>
                                        <span className="text-[9px] text-[var(--text-muted)] opacity-40">/100</span>
                                    </td>
                                    <td className="px-8 py-6 text-right font-black text-sm tracking-tighter">
                                        RWF {entry.totalEarned.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filtered.length > 0 && filtered.length < rankings.length && (
                <p className="text-center text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">
                    Showing {filtered.length} of {rankings.length} staff
                </p>
            )}
        </div>
    );
}
