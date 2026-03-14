"use client";

import React from "react";

interface BranchPerformance {
    id: string;
    name: string;
    revenue: number;
    csatScore: number;
}

interface BranchesPerformanceClientProps {
    stats: {
        totalRevenue: number;
        occupancyRate: number;
        membershipGrowth: number;
        activeBranches: number;
        pendingBranches: number;
    };
    leaderboard: BranchPerformance[];
}

export default function BranchesPerformanceClient({ stats, leaderboard }: BranchesPerformanceClientProps) {
    return (
        <div className="flex flex-col gap-10 w-full p-6 lg:p-12 max-w-7xl mx-auto bg-[var(--bg-app)] text-[var(--text-main)] transition-colors duration-500">
            {/* Header Actions */}
            <div className="flex flex-wrap justify-between items-end gap-6 mb-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-[var(--color-primary)]">
                        <span className="material-symbols-outlined text-2xl font-bold animate-pulse">language</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Global Strategy Hub</span>
                    </div>
                    <h1 className="text-5xl font-display font-bold leading-tight tracking-tight">Executive <span className="text-[var(--color-primary)] underline decoration-2 decoration-[var(--color-primary)]/20 underline-offset-8">Portfolio</span></h1>
                    <p className="text-[var(--text-muted)] text-xl font-medium max-w-2xl leading-relaxed">Multi-branch strategic oversight and real-time performance monitoring across your entire network.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center justify-center rounded-[2rem] h-14 px-8 bg-[var(--bg-surface-muted)] text-[var(--text-main)] text-sm font-bold hover:bg-[var(--bg-card)] transition-all border border-[var(--border-muted)] shadow-sm tracking-widest">
                        <span className="material-symbols-outlined mr-2 text-xl font-bold">calendar_today</span>
                        Last 30 Days
                    </button>
                    <button className="flex items-center justify-center rounded-[2rem] h-14 px-8 bg-[var(--text-main)] text-[var(--bg-app)] text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-[var(--text-main)]/10 tracking-widest">
                        <span className="material-symbols-outlined mr-2 text-xl font-bold">file_download</span>
                        Export Data
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col gap-4 bg-[var(--bg-card)] p-8 rounded-[2.5rem] border border-[var(--border-muted)] hover:-translate-y-1 transition-all duration-500 shadow-sm group relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                        <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest opacity-40">Total Portfolio Revenue</p>
                        <span className="size-10 rounded-2xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-muted)] material-symbols-outlined text-xl font-bold">payments</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-4xl font-sans font-black text-[var(--text-main)]">{stats.totalRevenue.toLocaleString()} <span className="text-sm uppercase tracking-widest opacity-40 font-bold">RWF</span></p>
                        <div className="flex items-center gap-2 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-widest mt-2">
                            <span className="material-symbols-outlined text-xs">trending_up</span>
                            <span>8.2% Growth</span>
                        </div>
                    </div>
                    <div className="absolute -right-8 -bottom-8 opacity-5 transform group-hover:rotate-12 group-hover:scale-125 transition-all duration-1000">
                        <span className="material-symbols-outlined text-[10rem]">payments</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 bg-[var(--bg-card)] p-8 rounded-[2.5rem] border border-[var(--border-muted)] hover:-translate-y-1 transition-all duration-500 shadow-sm group relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                        <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest opacity-40">Global Occupancy Rate</p>
                        <span className="size-10 rounded-2xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-muted)] material-symbols-outlined text-xl font-bold">event_seat</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-4xl font-sans font-black text-[var(--text-main)]">{stats.occupancyRate}%</p>
                        <div className="flex items-center gap-2 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-widest mt-2">
                            <span className="material-symbols-outlined text-xs">trending_up</span>
                            <span>3.1% Increase</span>
                        </div>
                    </div>
                    <div className="absolute -right-8 -bottom-8 opacity-5 transform group-hover:rotate-12 group-hover:scale-125 transition-all duration-1000">
                        <span className="material-symbols-outlined text-[10rem]">event_seat</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 rounded-[2.5rem] p-8 bg-[var(--text-main)] text-[var(--bg-app)] shadow-xl shadow-[var(--text-main)]/5 border border-[var(--border-muted)] relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
                    <div className="relative z-10 flex flex-col gap-4 h-full justify-between">
                        <div className="flex justify-between items-start">
                            <p className="text-[var(--bg-app)] text-[10px] font-bold uppercase tracking-widest opacity-40">Net Membership Growth</p>
                            <span className="size-10 rounded-2xl bg-[var(--bg-app)]/10 flex items-center justify-center text-[var(--bg-app)] material-symbols-outlined text-xl font-bold">group_add</span>
                        </div>
                        <div>
                            <p className="text-4xl font-sans font-black">+{stats.membershipGrowth}%</p>
                            <div className="flex items-center gap-2 text-[var(--bg-app)] text-[10px] font-bold uppercase tracking-widest mt-2 opacity-60">
                                <span className="material-symbols-outlined text-xs">trending_down</span>
                                <span>1.5% Slowdown</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-8 -bottom-8 opacity-5 transform group-hover:rotate-12 group-hover:scale-125 transition-all duration-1000">
                        <span className="material-symbols-outlined text-[10rem]">group_add</span>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Global Branch Map */}
                <div className="xl:col-span-2 bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] shadow-sm flex flex-col overflow-hidden">
                    <div className="p-8 border-b border-[var(--border-muted)] flex justify-between items-center">
                        <h4 className="text-2xl font-display font-bold text-[var(--text-main)]">Network <span className="text-[var(--color-primary)]">Topology</span></h4>
                        <div className="flex gap-4">
                            <span className="px-4 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[9px] font-bold rounded-full uppercase tracking-widest">{stats.activeBranches} Nodes Active</span>
                            <span className="px-4 py-1.5 bg-[var(--bg-surface-muted)] text-[var(--text-muted)] text-[9px] font-bold rounded-full uppercase tracking-widest">{stats.pendingBranches} Pending</span>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[400px] relative bg-[var(--bg-surface-muted)]/30 overflow-hidden">
                        {/* Placeholder for Map Visual */}
                        <div className="absolute inset-0 opacity-10 grayscale pointer-events-none bg-[url('https://placeholder.pics/svg/300')] bg-cover bg-center"></div>

                        {/* Branch Markers */}
                        <div className="absolute top-[30%] left-[20%] group cursor-pointer z-10 transition-transform duration-500 hover:scale-125">
                            <div className="w-6 h-6 bg-[var(--color-primary)] rounded-full animate-ping absolute opacity-30"></div>
                            <div className="w-6 h-6 bg-[var(--color-primary)] rounded-full relative border-[3px] border-[var(--bg-card)] shadow-xl"></div>
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[var(--text-main)] text-[var(--bg-app)] text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-20 italic">New York HQ</div>
                        </div>

                        <div className="absolute top-[45%] left-[48%] group cursor-pointer z-10 transition-transform duration-500 hover:scale-125">
                            <div className="w-6 h-6 bg-[var(--color-primary)] rounded-full relative border-[3px] border-[var(--bg-card)] shadow-xl"></div>
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[var(--text-main)] text-[var(--bg-app)] text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-20 italic">London Central</div>
                        </div>

                        <div className="absolute top-[60%] left-[75%] group cursor-pointer z-10 transition-transform duration-500 hover:scale-125">
                            <div className="w-6 h-6 bg-[var(--color-primary)] rounded-full relative border-[3px] border-[var(--bg-card)] shadow-xl"></div>
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[var(--text-main)] text-[var(--bg-app)] text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-20 italic">Tokyo Sanctuary</div>
                        </div>
                    </div>
                </div>

                {/* Branch Leaderboard */}
                <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] shadow-sm flex flex-col overflow-hidden">
                    <div className="p-8 border-b border-[var(--border-muted)]">
                        <h4 className="text-2xl font-display font-bold text-[var(--text-main)]">Efficiency <span className="text-[var(--color-primary)]">Index</span></h4>
                    </div>
                    <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[450px] scrollbar-hide">
                        {leaderboard.length === 0 ? (
                            <div className="text-center text-[var(--text-muted)] py-12 italic opacity-40">No units deployed</div>
                        ) : (
                            leaderboard.map((branch, idx) => (
                                <div key={branch.id} className={`flex items-center gap-6 p-5 rounded-[1.5rem] border transition-all duration-500 ${idx === 0 ? "border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 shadow-inner" : "border-[var(--border-muted)] hover:bg-[var(--bg-surface-muted)]"}`}>
                                    <div className={`h-12 w-12 shrink-0 font-display font-bold rounded-2xl flex items-center justify-center text-lg ${idx === 0 ? "bg-[var(--color-primary)] text-[var(--bg-app)] shadow-lg shadow-[var(--color-primary)]/20" : "bg-[var(--bg-surface-muted)] text-[var(--text-main)]"}`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lg font-display font-bold text-[var(--text-main)] truncate group-hover:text-[var(--color-primary)] transition-colors">{branch.name}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-60">Revenue: {branch.revenue > 1000000 ? `${(branch.revenue / 1000000).toFixed(1)}M` : branch.revenue.toLocaleString()} RWF</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className={`flex items-center gap-1 justify-end font-sans font-black text-lg ${idx === 0 ? "text-[var(--color-primary)]" : "text-[var(--text-main)]"}`}>
                                            <span className="material-symbols-outlined text-sm font-bold opacity-60">star</span>
                                            <span>{branch.csatScore.toFixed(1)}</span>
                                        </div>
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-40">CSAT</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-auto p-6 border-t border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/30">
                        <button className="w-full py-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest hover:text-[var(--color-primary)] transition-all italic">Full Global Rankings</button>
                    </div>
                </div>
            </div>

            {/* Strategic Charts */}
            <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] shadow-sm overflow-hidden mb-12">
                <div className="p-8 border-b border-[var(--border-muted)] flex justify-between items-center sm:flex-row flex-col gap-6">
                    <div>
                        <h4 className="text-2xl font-display font-bold text-[var(--text-main)]">Operating <span className="text-[var(--color-primary)]">Leverage</span></h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1 opacity-40">Labor Efficiency vs. Gross Yield</p>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[var(--color-primary)]"></span>
                            <span className="text-[9px] font-bold uppercase text-[var(--text-muted)] tracking-widest opacity-60">Total Revenue</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[var(--text-main)]"></span>
                            <span className="text-[9px] font-bold uppercase text-[var(--text-muted)] tracking-widest opacity-60">Operating Costs</span>
                        </div>
                    </div>
                </div>
                <div className="p-10 h-[320px] w-full relative">
                    {/* Chart Placeholder (SVG) */}
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 250">
                        <defs>
                            <linearGradient id="primaryGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2"></stop>
                                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0"></stop>
                            </linearGradient>
                        </defs>
                        {/* Grid Lines */}
                        <line x1="0" x2="1000" y1="0" y2="0" stroke="var(--border-muted)" strokeWidth="0.5" strokeDasharray="4"></line>
                        <line x1="0" x2="1000" y1="125" y2="125" stroke="var(--border-muted)" strokeWidth="0.5" strokeDasharray="4"></line>
                        <line x1="0" x2="1000" y1="250" y2="250" stroke="var(--border-muted)" strokeWidth="0.5" strokeDasharray="4"></line>

                        {/* Revenue Line Area */}
                        <path d="M0,200 L100,180 L200,190 L300,150 L400,140 L500,100 L600,110 L700,60 L800,80 L900,40 L1000,30 V250 H0 Z" fill="url(#primaryGradient)"></path>
                        {/* Revenue Line */}
                        <path d="M0,200 L100,180 L200,190 L300,150 L400,140 L500,100 L600,110 L700,60 L800,80 L900,40 L1000,30" fill="none" stroke="var(--color-primary)" strokeLinejoin="round" strokeWidth="4" className="drop-shadow-[0_4px_6px_var(--color-primary)]"></path>
                        {/* Labor Cost Line */}
                        <path d="M0,230 L100,225 L200,230 L300,210 L400,215 L500,200 L600,205 L700,180 L800,190 L900,170 L1000,165" fill="none" stroke="var(--text-main)" strokeDasharray="8 4" strokeWidth="2" opacity="0.3"></path>
                    </svg>
                    {/* Chart Axis Labels */}
                    <div className="flex justify-between mt-8 text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest opacity-40">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => <span key={m}>{m}</span>)}
                    </div>
                </div>
            </div>
        </div>
    );
}
