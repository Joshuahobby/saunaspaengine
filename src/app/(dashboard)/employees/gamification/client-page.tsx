"use client";

import React, { useRef, useEffect } from "react";

function ProgressBar({ progress, className }: { progress: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.style.width = `${progress}%`;
        }
    }, [progress]);
    return <div ref={ref} className={className} />;
}

interface LeaderboardEntry {
    id: string;
    fullName: string;
    branchName: string;
    category: string;
    serviceCount: number;
    totalEarned: number;
    averageRating: number;
    reviewCount: number;
    score: number;
}

interface GamificationClientProps {
    leaderboard: LeaderboardEntry[];
    teamProgress: number;
    totalServices: number;
    teamGoal: number;
    scope: string;
}

export default function GamificationClient({ leaderboard, teamProgress, totalServices, teamGoal, scope }: GamificationClientProps) {
    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
    const podiumHeights = ['h-28', 'h-36', 'h-24'];
    const podiumLabels = ['2nd', '1st', '3rd'];
    const podiumColors = ['bg-gray-300 text-gray-800', 'bg-yellow-500 text-white', 'bg-orange-400 text-white'];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            <div>
                <h2 className="text-3xl font-display font-bold tracking-tight text-[var(--text-main)] italic">
                    Staff <span className="text-[var(--color-primary)] not-italic">Leaderboard</span>
                </h2>
                <p className="mt-2 text-[var(--text-muted)] max-w-2xl font-medium">
                    {scope}-wide performance rankings based on service volume and earnings.
                </p>
            </div>

            {/* Team Goal Progress */}
            <div className="glass-card p-8 border-l-4 border-l-[var(--color-primary)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60 mb-1">Team Service Goal</p>
                        <p className="text-2xl font-display font-black text-[var(--text-main)]">{totalServices} <span className="text-sm font-sans text-[var(--text-muted)] opacity-40">/ {teamGoal} sessions</span></p>
                    </div>
                    <div className="w-full md:w-64">
                        <div className="flex justify-between text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">
                            <span>Progress</span>
                            <span className="text-[var(--color-primary)]">{teamProgress}%</span>
                        </div>
                        <div className="h-3 bg-[var(--bg-surface-muted)] rounded-full overflow-hidden">
                            <ProgressBar 
                                progress={teamProgress}
                                className="h-full bg-gradient-to-r from-[var(--color-primary)] to-blue-500 rounded-full transition-all duration-1000"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Winner Podium */}
            {top3.length >= 3 && (
                <div className="flex items-end justify-center gap-4 md:gap-8 py-8">
                    {podiumOrder.map((entry, i) => (
                        <div key={entry.id} className="flex flex-col items-center gap-3 w-32 md:w-40">
                            <div className="relative">
                                <div className={`size-16 md:size-20 rounded-2xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-2xl font-display font-black text-[var(--text-main)] border-2 ${i === 1 ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' : 'border-[var(--border-muted)]'}`}>
                                    {entry.fullName.charAt(0)}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 size-6 rounded-full ${podiumColors[i]} flex items-center justify-center text-[8px] font-black`}>
                                    {podiumLabels[i]}
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-display font-bold text-[var(--text-main)] leading-tight">{entry.fullName}</p>
                                <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider opacity-60">{entry.category}</p>
                            </div>
                            <div className={`w-full ${podiumHeights[i]} rounded-t-2xl bg-gradient-to-t from-[var(--color-primary)]/20 to-[var(--color-primary)]/5 border border-[var(--border-muted)] flex flex-col items-center justify-end pb-3`}>
                                <p className="text-lg font-display font-black text-[var(--color-primary)]">{entry.score}%</p>
                                <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60 flex items-center gap-1">
                                    {entry.serviceCount} sess.
                                    {entry.reviewCount > 0 && (
                                        <span className="text-yellow-500 flex items-center">
                                            • {entry.averageRating.toFixed(1)} <span className="material-symbols-outlined text-[8px] ml-0.5">star</span>
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Full Rankings Table */}
            {rest.length > 0 && (
                <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-main)] overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/30">
                        <h3 className="text-sm font-display font-bold text-[var(--text-main)] uppercase tracking-widest">Full Rankings</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--bg-surface-muted)]/50">
                                    <th className="px-6 py-3 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em] text-center w-16">Rank</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em]">Staff Member</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em] text-center">Rating</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em]">Branch</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em] text-center">Sessions</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em] text-center">Score</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-[var(--text-muted)] opacity-50 uppercase tracking-[0.2em] text-right">Earnings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-muted)]">
                                {rest.map((entry, index) => (
                                    <tr key={entry.id} className="hover:bg-[var(--bg-surface-muted)]/50 transition-all">
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex size-7 items-center justify-center rounded-full text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-surface-muted)]">{index + 4}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-[var(--bg-surface-muted)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)] border border-[var(--border-muted)]">
                                                    {entry.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[var(--text-main)]">{entry.fullName}</p>
                                                    <p className="text-[9px] text-[var(--color-primary)] font-bold uppercase tracking-widest opacity-60">{entry.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {entry.reviewCount > 0 ? (
                                                <div className="flex items-center justify-center gap-1 text-sm font-bold text-yellow-500">
                                                    {entry.averageRating.toFixed(1)}
                                                    <span className="material-symbols-outlined text-sm">star</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-[var(--text-muted)] italic opacity-60">None</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-[var(--text-muted)] italic">{entry.branchName}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-display font-bold text-[var(--text-main)]">{entry.serviceCount}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-xs font-bold text-[var(--color-primary)]">{entry.score}%</span>
                                                <div className="w-16 h-1 bg-[var(--border-muted)] rounded-full overflow-hidden">
                                                    <ProgressBar 
                                                        progress={entry.score}
                                                        className="h-full bg-[var(--color-primary)] rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-bold text-[var(--text-main)]">
                                            {entry.totalEarned.toLocaleString()} <span className="text-[9px] opacity-40 italic">RWF</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {leaderboard.length === 0 && (
                <div className="text-center py-20">
                    <span className="material-symbols-outlined text-6xl text-[var(--text-muted)] opacity-20">emoji_events</span>
                    <h3 className="text-xl font-display font-bold text-[var(--text-main)] mt-4">No Rankings Yet</h3>
                    <p className="text-[var(--text-muted)] mt-2">Staff performance data will appear once service records are completed.</p>
                </div>
            )}
        </div>
    );
}
