"use client";

import React, { useState } from "react";

interface RankingEntry {
    id: string;
    fullName: string;
    branchName: string;
    category: string;
    serviceCount: number;
    totalEarned: number;
    score: number;
}

interface PerformanceIndexClientProps {
    stats: {
        totalStaff: number;
        totalServices: number;
        totalCommissions: number;
    };
    rankings: RankingEntry[];
}

export default function PerformanceIndexClient({ stats, rankings }: PerformanceIndexClientProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRankings = rankings.filter(entry => 
        entry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.branchName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Executive Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight text-[var(--text-main)] italic">
                        Human Capital <span className="text-[var(--color-primary)] not-italic">Optimization</span>
                    </h2>
                    <p className="mt-2 text-[var(--text-muted)] max-w-2xl font-medium">
                        Analyze and rank professional performance across your entire business network.
                    </p>
                </div>
                
                <div className="relative w-full md:w-80">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg opacity-40">search</span>
                    <input
                        type="text"
                        placeholder="Search by staff name or branch..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[var(--bg-card)] border-[var(--border-main)] border rounded-2xl text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-main)] shadow-sm"
                    />
                </div>
            </div>

            {/* Strategic Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <div className="glass-card p-8 border-l-4 border-l-[var(--color-primary)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                        <span className="material-symbols-outlined text-6xl">groups</span>
                    </div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-4">Total Network Staff</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-display font-black text-[var(--text-main)] tracking-tighter">{stats.totalStaff}</p>
                        <span className="text-xs font-bold text-[var(--color-primary)] opacity-60 uppercase">Professionals</span>
                    </div>
                </div>

                <div className="glass-card p-8 border-l-4 border-l-blue-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                        <span className="material-symbols-outlined text-6xl">analytics</span>
                    </div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-4">Service Velocity</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-display font-black text-[var(--text-main)] tracking-tighter">{stats.totalServices}</p>
                        <span className="text-xs font-bold text-blue-500 opacity-60 uppercase">Sessions</span>
                    </div>
                </div>

                <div className="glass-card p-8 border-l-4 border-l-green-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                        <span className="material-symbols-outlined text-6xl">payouts</span>
                    </div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-4">Shared Commissions</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-display font-black text-[var(--text-main)] tracking-tighter">{stats.totalCommissions.toLocaleString()}</p>
                        <span className="text-xs font-bold text-green-500 opacity-60 uppercase">RWF</span>
                    </div>
                </div>
            </div>

            {/* Performance Leaderboard */}
            <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-main)] overflow-hidden shadow-xl">
                <div className="p-8 border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/30">
                    <h3 className="text-xl font-display font-bold text-[var(--text-main)]">Performance Index <span className="text-[var(--color-primary)] tracking-widest uppercase text-[10px] ml-4 font-black">Beta ranking algorithm</span></h3>
                </div>

                <div className="overflow-x-auto text-balance">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-surface-muted)]/50">
                                <th className="px-8 py-4 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em] text-center w-20">Rank</th>
                                <th className="px-8 py-4 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em]">Staff Member</th>
                                <th className="px-8 py-4 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em]">Branch Location</th>
                                <th className="px-8 py-4 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em] text-center">Volume</th>
                                <th className="px-8 py-4 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em]">Efficiency</th>
                                <th className="px-8 py-4 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em] text-right">Earning ROI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {filteredRankings.map((entry, index) => (
                                <tr key={entry.id} className="hover:bg-[var(--bg-surface-muted)]/50 transition-all group">
                                    <td className="px-8 py-6 text-center">
                                        <span className={`inline-flex size-8 items-center justify-center rounded-full text-xs font-black ${index === 0 
                                            ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/20" 
                                            : index === 1 
                                                ? "bg-gray-300 text-gray-800" 
                                                : index === 2 
                                                    ? "bg-orange-400 text-white" 
                                                    : "text-[var(--text-muted)] bg-[var(--bg-surface-muted)]"}`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-[var(--bg-surface-muted)] flex items-center justify-center font-bold text-[var(--text-muted)] border border-[var(--border-muted)] group-hover:border-[var(--color-primary)] transition-colors overflow-hidden">
                                                {entry.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-display font-bold text-[var(--text-main)]">{entry.fullName}</p>
                                                <p className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-widest opacity-60">{entry.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-[var(--text-muted)] opacity-30">storefront</span>
                                            <span className="text-xs font-semibold text-[var(--text-main)] opacity-70 italic">{entry.branchName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-display font-black text-[var(--text-main)]">{entry.serviceCount}</span>
                                            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-tighter opacity-40">Sessions</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="w-32 flex flex-col gap-2">
                                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                                                <span className="text-[var(--text-muted)] opacity-60">Score</span>
                                                <span className="text-[var(--color-primary)]">{Math.round(entry.score)}%</span>
                                            </div>
                                            <div className="h-1 bg-[var(--border-muted)] rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-blue-500 transition-all duration-1000" 
                                                    style={{ width: `${entry.score}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-sm font-display font-black text-[var(--text-main)] tracking-tight">
                                            {entry.totalEarned.toLocaleString()} <span className="text-[10px] font-sans opacity-40 italic">RWF</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
