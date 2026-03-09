"use client";

import { useMemo } from "react";

export default function AdminBranchesClientPage() {
    return (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Executive Portfolio Dashboard</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">Global multi-branch strategic oversight & KPI monitoring</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                        Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 px-4 h-10 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold hover:opacity-90 transition-opacity">
                        <span className="material-symbols-outlined text-lg">file_download</span>
                        Export Data
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-[-10px] top-[-10px] text-[var(--color-primary)]/5 group-hover:text-[var(--color-primary)]/10 transition-colors pointer-events-none">
                        <span className="material-symbols-outlined text-8xl">payments</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Portfolio Revenue</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">$4,281,400</h3>
                        <span className="text-[var(--color-primary)] text-sm font-bold flex items-center">
                            <span className="material-symbols-outlined text-sm">trending_up</span> 8.2%
                        </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-4">Vs. $3.95M last quarter</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-[-10px] top-[-10px] text-[var(--color-primary)]/5 group-hover:text-[var(--color-primary)]/10 transition-colors pointer-events-none">
                        <span className="material-symbols-outlined text-8xl">event_seat</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Global Occupancy Rate</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">78.5%</h3>
                        <span className="text-[var(--color-primary)] text-sm font-bold flex items-center">
                            <span className="material-symbols-outlined text-sm">trending_up</span> 3.1%
                        </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-4">Across 12 worldwide locations</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-[-10px] top-[-10px] text-[var(--color-primary)]/5 group-hover:text-[var(--color-primary)]/10 transition-colors pointer-events-none">
                        <span className="material-symbols-outlined text-8xl">group_add</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Net Membership Growth</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">+12.4%</h3>
                        <span className="text-rose-500 text-sm font-bold flex items-center">
                            <span className="material-symbols-outlined text-sm">trending_down</span> 1.5%
                        </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-4">Previous growth: 13.9%</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Global Branch Network Map Area */}
                <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">Global Branch Network</h4>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-[10px] font-bold rounded uppercase">8 Active</span>
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold rounded uppercase">4 Pending</span>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[400px] relative bg-slate-50 dark:bg-slate-950/50 overflow-hidden">
                        {/* Map Visual / Markers */}
                        <div className="absolute inset-0 opacity-20 dark:opacity-10 grayscale pointer-events-none" style={{ backgroundImage: "url('https://placeholder.pics/svg/300')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>

                        <div className="absolute top-[30%] left-[20%] group cursor-pointer">
                            <div className="w-4 h-4 bg-[var(--color-primary)] rounded-full animate-ping absolute opacity-75"></div>
                            <div className="w-4 h-4 bg-[var(--color-primary)] rounded-full relative border-2 border-white dark:border-slate-900 shadow-lg"></div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">New York HQ</div>
                        </div>
                        <div className="absolute top-[45%] left-[48%] group cursor-pointer">
                            <div className="w-4 h-4 bg-[var(--color-primary)] rounded-full relative border-2 border-white dark:border-slate-900 shadow-lg"></div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">London Central</div>
                        </div>
                        <div className="absolute top-[60%] left-[75%] group cursor-pointer">
                            <div className="w-4 h-4 bg-[var(--color-primary)] rounded-full relative border-2 border-white dark:border-slate-900 shadow-lg"></div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">Tokyo Sanctuary</div>
                        </div>
                    </div>
                </div>

                {/* Branch Leaderboard */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">Performance Leaderboard</h4>
                    </div>
                    <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                        <LeaderboardItem rank={1} name="Bali Serenity" revenue="$840k" score="4.9" active />
                        <LeaderboardItem rank={2} name="London Central" revenue="$712k" score="4.7" />
                        <LeaderboardItem rank={3} name="Tokyo Retreat" revenue="$655k" score="4.8" />
                        <LeaderboardItem rank={4} name="Swiss Alpine" revenue="$590k" score="4.5" />
                    </div>
                    <div className="mt-auto p-4 border-t border-slate-100 dark:border-slate-800">
                        <button className="w-full py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[var(--color-primary)] transition-colors uppercase tracking-widest">
                            View All Branch Rankings
                        </button>
                    </div>
                </div>
            </div>

            {/* Strategic Charts */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">Labor Costs vs. Total Revenue</h4>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full"></div>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Revenue</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-slate-900 dark:bg-slate-100 rounded-full"></div>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Labor Costs</span>
                        </div>
                    </div>
                </div>
                <div className="p-6 h-[280px] w-full relative">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 250">
                        <defs>
                            <linearGradient id="primaryGradientChart" x1="0%" x2="0%" y1="0%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#13eca4', stopOpacity: 0.2 }}></stop>
                                <stop offset="100%" style={{ stopColor: '#13eca4', stopOpacity: 0 }}></stop>
                            </linearGradient>
                        </defs>
                        <path d="M0,200 L100,180 L200,190 L300,150 L400,140 L500,100 L600,110 L700,60 L800,80 L900,40 L1000,30 V250 H0 Z" fill="url(#primaryGradientChart)"></path>
                        <path d="M0,200 L100,180 L200,190 L300,150 L400,140 L500,100 L600,110 L700,60 L800,80 L900,40 L1000,30" fill="none" stroke="#13eca4" strokeLinejoin="round" strokeWidth="4"></path>
                        <path className="text-slate-400" d="M0,230 L100,225 L200,230 L300,210 L400,215 L500,200 L600,205 L700,180 L800,190 L900,170 L1000,165" fill="none" stroke="currentColor" strokeDasharray="8 4" strokeWidth="3"></path>
                    </svg>
                    <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map(month => (
                            <span key={month}>{month}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function LeaderboardItem({ rank, name, revenue, score, active = false }: { rank: number, name: string, revenue: string, score: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${active ? 'border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 shadow-sm shadow-[var(--color-primary)]/10' : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700'}`}>
            <div className={`size-10 font-bold rounded-xl flex items-center justify-center text-sm ${active ? 'bg-[var(--color-primary)] text-slate-900 shadow-md shadow-[var(--color-primary)]/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                {rank}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{name}</p>
                <p className="text-xs text-slate-500 font-medium">Revenue: <span className="text-slate-700 dark:text-slate-300">{revenue}</span></p>
            </div>
            <div className="text-right">
                <div className={`flex items-center gap-1 font-bold ${active ? 'text-[var(--color-primary)]' : 'text-slate-600 dark:text-slate-400'}`}>
                    <span className="material-symbols-outlined text-sm">star</span>
                    <span className="text-xs">{score}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">CSAT Score</p>
            </div>
        </div>
    );
}
