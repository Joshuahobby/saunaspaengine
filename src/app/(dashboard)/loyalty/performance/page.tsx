"use client";

import React from "react";
import Link from "next/link";

export default function LoyaltyPerformancePage() {
    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Hero Section */}
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[var(--color-primary)]">
                        <span className="material-symbols-outlined">celebration</span>
                        <span className="text-sm font-bold uppercase tracking-widest">30-Day Milestone</span>
                    </div>
                    <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-slate-100">Loyalty Program Success Dashboard</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">Your loyalty initiative is driving higher retention and incremental revenue.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center justify-center rounded-lg h-11 px-6 bg-[var(--color-primary)]/10 text-slate-900 dark:text-slate-100 text-sm font-bold hover:bg-[var(--color-primary)]/20 transition-all border border-[var(--color-primary)]/20">
                        <span className="material-symbols-outlined mr-2 text-xl">download</span>
                        Export Report
                    </button>
                    <button className="flex items-center justify-center rounded-lg h-11 px-6 bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[var(--color-primary)]/20">
                        <span className="material-symbols-outlined mr-2 text-xl">share</span>
                        Share Insights
                    </button>
                </div>
            </div>

            {/* High Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-[var(--color-primary)]/10 shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Enrolled Members</p>
                        <span className="p-1.5 bg-[var(--color-primary)]/10 rounded text-[var(--color-primary)] material-symbols-outlined text-lg">group</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-slate-100">1,284</p>
                    <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span>+15% from last month</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-[var(--color-primary)]/10 shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Points Issued</p>
                        <span className="p-1.5 bg-[var(--color-primary)]/10 rounded text-[var(--color-primary)] material-symbols-outlined text-lg">token</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-slate-100">45,200</p>
                    <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span>+22% velocity</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-[var(--color-primary)]/10 shadow-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Points Redeemed</p>
                        <span className="p-1.5 bg-[var(--color-primary)]/10 rounded text-[var(--color-primary)] material-symbols-outlined text-lg">redeem</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-slate-100">12,850</p>
                    <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span>+10% engagement</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 rounded-xl p-6 bg-gradient-to-br from-[#102220] to-[#0a1514] text-white shadow-xl shadow-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <p className="text-[var(--color-primary)]/80 text-sm font-bold uppercase tracking-tight">Incremental Revenue</p>
                            <span className="p-1.5 bg-white/10 rounded text-[var(--color-primary)] material-symbols-outlined text-lg">payments</span>
                        </div>
                        <p className="text-3xl font-black mt-2">RWF 8,420,000</p>
                        <div className="flex items-center gap-1 text-[var(--color-primary)]/80 text-sm font-bold mt-2">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            <span>+18% ROI growth</span>
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 opacity-10 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                        <span className="material-symbols-outlined text-8xl text-white">payments</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Redemption Breakdown */}
                <div className="flex flex-col gap-6 p-6 rounded-xl bg-white dark:bg-slate-900 border border-[var(--color-primary)]/10 shadow-sm">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Redemption Breakdown</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Most popular rewards by frequency</p>
                    </div>
                    <div className="flex flex-1 items-center justify-around flex-wrap gap-6">
                        {/* Visual representation of a Pie/Donut Chart */}
                        <div className="relative size-48 rounded-full border-[16px] border-[var(--color-primary)]/10 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[16px] border-[var(--color-primary)] border-t-transparent border-r-transparent rotate-45"></div>
                            <div className="absolute inset-0 rounded-full border-[16px] border-emerald-400 border-l-transparent border-b-transparent -rotate-12"></div>
                            <div className="text-center">
                                <p className="text-2xl font-black">62%</p>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Services</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <span className="size-4 rounded-full bg-[var(--color-primary)]"></span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Free Sauna Session (42%)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="size-4 rounded-full bg-emerald-400"></span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">20% Discount (28%)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="size-4 rounded-full bg-[var(--color-primary)]/40"></span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Free Towel Service (18%)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="size-4 rounded-full bg-slate-300"></span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Guest Pass (12%)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visit Frequency Comparison */}
                <div className="flex flex-col gap-6 p-6 rounded-xl bg-white dark:bg-slate-900 border border-[var(--color-primary)]/10 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Visit Frequency</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Loyalty Members vs. Regulars</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1">
                                <span className="size-2 rounded-full bg-[var(--color-primary)]"></span>
                                <span className="text-[10px] font-bold uppercase text-slate-500">Members</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="size-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                <span className="text-[10px] font-bold uppercase text-slate-500">Non-Members</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 h-48 w-full relative pt-4">
                        {/* SVG Line Chart */}
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                            {/* Grid Lines */}
                            <line className="text-slate-100 dark:text-slate-800" stroke="currentColor" strokeDasharray="4" x1="0" x2="400" y1="0" y2="0"></line>
                            <line className="text-slate-100 dark:text-slate-800" stroke="currentColor" strokeDasharray="4" x1="0" x2="400" y1="50" y2="50"></line>
                            <line className="text-slate-100 dark:text-slate-800" stroke="currentColor" strokeDasharray="4" x1="0" x2="400" y1="100" y2="100"></line>

                            {/* Non-Member Line */}
                            <path d="M0,80 Q50,75 100,85 T200,80 T300,90 T400,82" fill="none" stroke="#cbd5e1" strokeWidth="2"></path>

                            {/* Member Line */}
                            <path d="M0,70 Q50,40 100,55 T200,30 T300,20 T400,10" fill="none" stroke="#11d4c4" strokeLinecap="round" strokeWidth="3"></path>
                        </svg>
                        <div className="flex justify-between mt-4">
                            <span className="text-[10px] font-bold text-slate-400">WEEK 1</span>
                            <span className="text-[10px] font-bold text-slate-400">WEEK 2</span>
                            <span className="text-[10px] font-bold text-slate-400">WEEK 3</span>
                            <span className="text-[10px] font-bold text-slate-400">WEEK 4</span>
                        </div>
                    </div>
                    <div className="p-3 bg-[var(--color-primary)]/5 rounded-lg border border-[var(--color-primary)]/10 text-center">
                        <p className="text-sm font-semibold text-[var(--color-primary)]">Insight: Members visit 35% more frequently than non-members since launch.</p>
                    </div>
                </div>
            </div>

            {/* Leaderboard Section */}
            <div className="flex flex-col gap-6 p-6 rounded-xl bg-white dark:bg-slate-900 border border-[var(--color-primary)]/10 shadow-sm">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Top Loyal Customers</h3>
                    <Link href="/clients" className="text-[var(--color-primary)] text-sm font-bold hover:underline">View All Customers</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-[var(--color-primary)]/10">
                                <th className="px-4 py-3">Rank</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Total Points</th>
                                <th className="px-4 py-3">Visits (30d)</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-primary)]/5">
                            <tr className="hover:bg-[var(--color-primary)]/5 transition-colors">
                                <td className="px-4 py-4">
                                    <div className="size-6 bg-yellow-400 text-[#102220] text-[10px] font-black rounded-full flex items-center justify-center">1</div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 font-bold flex items-center justify-center text-xs text-slate-500">SJ</div>
                                        <span className="font-bold">Sarah Johnson</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 font-mono font-bold text-[var(--color-primary)]">2,450</td>
                                <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">12 visits</td>
                                <td className="px-4 py-4">
                                    <span className="px-2 py-1 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-[10px] font-black uppercase">Platinum</span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <button className="text-slate-400 hover:text-[var(--color-primary)]"><span className="material-symbols-outlined">more_vert</span></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-[var(--color-primary)]/5 transition-colors">
                                <td className="px-4 py-4">
                                    <div className="size-6 bg-slate-300 text-[#102220] text-[10px] font-black rounded-full flex items-center justify-center">2</div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 font-bold flex items-center justify-center text-xs text-slate-500">MC</div>
                                        <span className="font-bold">Marcus Chen</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 font-mono font-bold text-[var(--color-primary)]">1,920</td>
                                <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">9 visits</td>
                                <td className="px-4 py-4">
                                    <span className="px-2 py-1 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-[10px] font-black uppercase">Gold</span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <button className="text-slate-400 hover:text-[var(--color-primary)]"><span className="material-symbols-outlined">more_vert</span></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-[var(--color-primary)]/5 transition-colors">
                                <td className="px-4 py-4">
                                    <div className="size-6 bg-amber-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">3</div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 font-bold flex items-center justify-center text-xs text-slate-500">ED</div>
                                        <span className="font-bold">Emily Davis</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 font-mono font-bold text-[var(--color-primary)]">1,780</td>
                                <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">8 visits</td>
                                <td className="px-4 py-4">
                                    <span className="px-2 py-1 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-[10px] font-black uppercase">Gold</span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <button className="text-slate-400 hover:text-[var(--color-primary)]"><span className="material-symbols-outlined">more_vert</span></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
