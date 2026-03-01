"use client";

import React from "react";

export default function BranchesPerformancePage() {
    return (
        <div className="p-4 lg:p-8 w-full">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Executive Portfolio Dashboard</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">Global multi-branch strategic oversight & KPI monitoring</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-[-10px] top-[-10px] text-[var(--color-primary)]/5 dark:text-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)]/10 dark:group-hover:text-[var(--color-primary)]/20 transition-colors pointer-events-none">
                        <span className="material-symbols-outlined text-8xl">payments</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Portfolio Revenue</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">4,281,400 RWF</h3>
                        <span className="text-[var(--color-primary)] text-sm font-bold flex items-center">
                            <span className="material-symbols-outlined text-sm">trending_up</span> 8.2%
                        </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-4">Vs. 3,950,000 RWF last quarter</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-[-10px] top-[-10px] text-[var(--color-primary)]/5 dark:text-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)]/10 dark:group-hover:text-[var(--color-primary)]/20 transition-colors pointer-events-none">
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
                    <div className="absolute right-[-10px] top-[-10px] text-[var(--color-primary)]/5 dark:text-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)]/10 dark:group-hover:text-[var(--color-primary)]/20 transition-colors pointer-events-none">
                        <span className="material-symbols-outlined text-8xl">group_add</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Net Membership Growth</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">+12.4%</h3>
                        <span className="text-red-500 text-sm font-bold flex items-center">
                            <span className="material-symbols-outlined text-sm">trending_down</span> 1.5%
                        </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-4">Previous growth: 13.9%</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Global Branch Map */}
                <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">Global Branch Network</h4>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-[rgba(19,236,164,0.1)] text-[var(--color-primary)] text-[10px] font-bold rounded uppercase">8 Active</span>
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold rounded uppercase">4 Pending</span>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[400px] relative bg-slate-100 dark:bg-slate-950/50 rounded-b-xl overflow-hidden">
                        {/* Placeholder for Map Visual */}
                        <div className="absolute inset-0 opacity-20 dark:opacity-10 grayscale pointer-events-none" style={{ backgroundImage: "url('https://placeholder.pics/svg/300')", backgroundSize: "cover", backgroundPosition: "center" }}></div>

                        {/* Branch Markers */}
                        <div className="absolute top-[30%] left-[20%] group cursor-pointer z-10">
                            <div className="w-4 h-4 bg-[var(--color-primary)] rounded-full animate-ping absolute opacity-75"></div>
                            <div className="w-4 h-4 bg-[var(--color-primary)] rounded-full relative border-2 border-white dark:border-slate-900 shadow-lg"></div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">New York HQ</div>
                        </div>

                        <div className="absolute top-[45%] left-[48%] group cursor-pointer z-10">
                            <div className="w-4 h-4 bg-[var(--color-primary)] rounded-full relative border-2 border-white dark:border-slate-900 shadow-lg"></div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">London Central</div>
                        </div>

                        <div className="absolute top-[60%] left-[75%] group cursor-pointer z-10">
                            <div className="w-4 h-4 bg-[var(--color-primary)] rounded-full relative border-2 border-white dark:border-slate-900 shadow-lg"></div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">Tokyo Sanctuary</div>
                        </div>
                    </div>
                </div>

                {/* Branch Leaderboard */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-800">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">Performance Leaderboard</h4>
                    </div>
                    <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[400px]">
                        {/* Entry 1 */}
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-[var(--color-primary)]/20 bg-[rgba(19,236,164,0.05)]">
                            <div className="h-10 w-10 shrink-0 bg-[var(--color-primary)] text-[#102220] font-bold rounded-lg flex items-center justify-center">1</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">Bali Serenity</p>
                                <p className="text-xs text-slate-500">Revenue: 840M RWF</p>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="flex items-center text-[var(--color-primary)] gap-1 justify-end">
                                    <span className="material-symbols-outlined text-sm">star</span>
                                    <span className="text-xs font-bold">4.9</span>
                                </div>
                                <p className="text-[10px] text-slate-400">CSAT Score</p>
                            </div>
                        </div>

                        {/* Entry 2 */}
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="h-10 w-10 shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-lg flex items-center justify-center">2</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">London Central</p>
                                <p className="text-xs text-slate-500">Revenue: 712M RWF</p>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="flex items-center text-slate-600 dark:text-slate-400 gap-1 justify-end">
                                    <span className="material-symbols-outlined text-sm">star</span>
                                    <span className="text-xs font-bold">4.7</span>
                                </div>
                                <p className="text-[10px] text-slate-400">CSAT Score</p>
                            </div>
                        </div>

                        {/* Entry 3 */}
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="h-10 w-10 shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-lg flex items-center justify-center">3</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">Tokyo Retreat</p>
                                <p className="text-xs text-slate-500">Revenue: 655M RWF</p>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="flex items-center text-slate-600 dark:text-slate-400 gap-1 justify-end">
                                    <span className="material-symbols-outlined text-sm">star</span>
                                    <span className="text-xs font-bold">4.8</span>
                                </div>
                                <p className="text-[10px] text-slate-400">CSAT Score</p>
                            </div>
                        </div>

                        {/* Entry 4 */}
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="h-10 w-10 shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-lg flex items-center justify-center">4</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">Swiss Alpine</p>
                                <p className="text-xs text-slate-500">Revenue: 590M RWF</p>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="flex items-center text-slate-600 dark:text-slate-400 gap-1 justify-end">
                                    <span className="material-symbols-outlined text-sm">star</span>
                                    <span className="text-xs font-bold">4.5</span>
                                </div>
                                <p className="text-[10px] text-slate-400">CSAT Score</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800">
                        <button className="w-full py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[var(--color-primary)] transition-colors">View All Branch Rankings</button>
                    </div>
                </div>
            </div>

            {/* Strategic Charts */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sm:flex-row flex-col gap-4 sm:gap-0">
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
                    {/* Chart Placeholder (SVG) */}
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 250">
                        <defs>
                            <linearGradient id="primaryGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                <stop offset="0%" style={{ stopColor: "rgba(19, 236, 164, 0.2)" }}></stop>
                                <stop offset="100%" style={{ stopColor: "rgba(19, 236, 164, 0)" }}></stop>
                            </linearGradient>
                        </defs>
                        {/* Revenue Line Area */}
                        <path d="M0,200 L100,180 L200,190 L300,150 L400,140 L500,100 L600,110 L700,60 L800,80 L900,40 L1000,30 V250 H0 Z" fill="url(#primaryGradient)"></path>
                        {/* Revenue Line */}
                        <path d="M0,200 L100,180 L200,190 L300,150 L400,140 L500,100 L600,110 L700,60 L800,80 L900,40 L1000,30" fill="none" stroke="var(--color-primary)" strokeLinejoin="round" strokeWidth="4"></path>
                        {/* Labor Cost Line */}
                        <path className="text-slate-400 dark:text-slate-500" d="M0,230 L100,225 L200,230 L300,210 L400,215 L500,200 L600,205 L700,180 L800,190 L900,170 L1000,165" fill="none" stroke="currentColor" strokeDasharray="8 4" strokeWidth="3"></path>
                    </svg>
                    {/* Chart Axis Labels */}
                    <div className="flex justify-between mt-4 text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                        <span>JAN</span>
                        <span>FEB</span>
                        <span>MAR</span>
                        <span>APR</span>
                        <span>MAY</span>
                        <span>JUN</span>
                        <span>JUL</span>
                        <span>AUG</span>
                        <span>SEP</span>
                        <span>OCT</span>
                        <span>NOV</span>
                        <span>DEC</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
