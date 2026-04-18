"use client";

export default function LocalAuditLogClientPage() {
    return (
        <main className="flex flex-1 justify-center py-8">
            <div className="flex flex-col max-w-[1200px] flex-1 px-4">
                {/* Page Header */}
                <div className="flex flex-wrap justify-between items-end gap-4 pb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] text-4xl font-black leading-tight tracking-[-0.033em]">Branch Operations Audit Log</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Monitor high-impact changes, administrative overrides, and staff modifications across your spa operations.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center justify-center rounded-lg h-11 px-5 bg-white dark:bg-slate-800 border border-[var(--color-primary)]/20 text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] text-sm font-bold hover:shadow-sm transition-all">
                            <span className="material-symbols-outlined mr-2 text-[var(--color-primary)]">download</span>
                            Export CSV
                        </button>
                        <button className="flex items-center justify-center rounded-lg h-11 px-5 bg-[var(--color-primary)] text-slate-900 font-bold shadow-md hover:brightness-105 transition-all">
                            <span className="material-symbols-outlined mr-2">filter_alt</span>
                            Detailed View
                        </button>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="flex gap-4 p-4 mb-6 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 flex-wrap items-center">
                    <div className="flex flex-col gap-1.5 min-w-[180px]">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Action Type</label>
                        <button className="flex h-10 w-full items-center justify-between rounded-lg bg-white dark:bg-slate-800 border border-[var(--color-primary)]/20 px-4">
                            <span className="text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] text-sm font-medium">All Sensitive Actions</span>
                            <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">keyboard_arrow_down</span>
                        </button>
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-[180px]">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</label>
                        <button className="flex h-10 w-full items-center justify-between rounded-lg bg-white dark:bg-slate-800 border border-[var(--color-primary)]/20 px-4">
                            <span className="text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] text-sm font-medium">All Personnel</span>
                            <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">keyboard_arrow_down</span>
                        </button>
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-[180px]">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date Range</label>
                        <button className="flex h-10 w-full items-center justify-between rounded-lg bg-white dark:bg-slate-800 border border-[var(--color-primary)]/20 px-4">
                            <span className="text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] text-sm font-medium">Last 30 Days</span>
                            <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">calendar_today</span>
                        </button>
                    </div>
                    <div className="flex-1 flex justify-end items-end h-full mt-5">
                        <button className="text-[var(--color-primary)] text-sm font-bold hover:underline">Clear Filters</button>
                    </div>
                </div>

                {/* Audit Log Table */}
                <div className="overflow-x-auto">
                    <div className="overflow-hidden rounded-xl border border-[var(--color-primary)]/10 glass-card min-w-[800px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--color-primary)]/10 border-b border-[var(--color-primary)]/10">
                                    <th className="px-6 py-4 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-4 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider">Staff Member</th>
                                    <th className="px-6 py-4 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider">Action Category</th>
                                    <th className="px-6 py-4 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider">Subject Record</th>
                                    <th className="px-6 py-4 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider">Reason / Note</th>
                                    <th className="px-6 py-4 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-primary)]/5">
                                {/* Row 1: Admin Override */}
                                <tr className="hover:bg-[var(--color-primary)]/5 transition-colors">
                                    <td className="px-6 py-5 text-slate-500 dark:text-slate-400 text-sm">Oct 24, 2023 · 14:22</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold text-xs">AJ</div>
                                            <span className="text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] text-sm font-semibold">Alex Johnson</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                                            <span className="material-symbols-outlined text-sm mr-1">priority_high</span>
                                            Admin Override
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] text-sm font-medium">Premium Sauna Suite #04</td>
                                    <td className="px-6 py-5 text-slate-500 dark:text-slate-400 text-sm italic">&quot;Customer loyalty discount applied manually; system auto-calc overrode due to expired coupon.&quot;</td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border border-[var(--color-primary)] text-[var(--color-primary)]">VERIFIED</span>
                                    </td>
                                </tr>

                                {/* Row 2: Price Change */}
                                <tr className="hover:bg-[var(--color-primary)]/5 transition-colors">
                                    <td className="px-6 py-5 text-slate-500 dark:text-slate-400 text-sm">Oct 24, 2023 · 12:05</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold text-xs">SM</div>
                                            <span className="text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] text-sm font-semibold">Sarah Miller</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                                            <span className="material-symbols-outlined text-sm mr-1">monetization_on</span>
                                            Price Change
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] text-sm font-medium">Swedish Massage (60m)</td>
                                    <td className="px-6 py-5 text-slate-500 dark:text-slate-400 text-sm italic">&quot;Seasonal rate adjustment - increased base rate by $15 for Q4 peak.&quot;</td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border border-blue-500 text-blue-500">APPROVED</span>
                                    </td>
                                </tr>

                                {/* Row 3: Employee Edit */}
                                <tr className="hover:bg-[var(--color-primary)]/5 transition-colors">
                                    <td className="px-6 py-5 text-slate-500 dark:text-slate-400 text-sm">Oct 23, 2023 · 09:15</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold text-xs">AJ</div>
                                            <span className="text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] text-sm font-semibold">Alex Johnson</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)]">
                                            <span className="material-symbols-outlined text-sm mr-1">person_edit</span>
                                            Employee Edit
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] text-sm font-medium">Maria Garcia</td>
                                    <td className="px-6 py-5 text-slate-500 dark:text-slate-400 text-sm italic">&quot;Updated professional certification expiry date to 2025.&quot;</td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border border-slate-400 text-slate-400 uppercase">Logged</span>
                                    </td>
                                </tr>

                                {/* Row 4: Locked Record Override */}
                                <tr className="hover:bg-[var(--color-primary)]/5 transition-colors">
                                    <td className="px-6 py-5 text-slate-500 dark:text-slate-400 text-sm">Oct 22, 2023 · 16:40</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold text-xs">KL</div>
                                            <span className="text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] text-sm font-semibold">Kevin Lee</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                                            <span className="material-symbols-outlined text-sm mr-1">lock_open</span>
                                            Admin Override
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] text-sm font-medium">Deep Tissue Session ID: #882</td>
                                    <td className="px-6 py-5 text-slate-500 dark:text-slate-400 text-sm italic">&quot;Overrode locked service record to resolve double-booking scheduling error.&quot;</td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border border-[var(--color-primary)] text-[var(--color-primary)]">VERIFIED</span>
                                    </td>
                                </tr>

                                {/* Row 5: Service Configuration */}
                                <tr className="hover:bg-[var(--color-primary)]/5 transition-colors">
                                    <td className="px-6 py-5 text-slate-500 dark:text-slate-400 text-sm">Oct 22, 2023 · 11:30</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold text-xs">SM</div>
                                            <span className="text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] text-sm font-semibold">Sarah Miller</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)]">
                                            <span className="material-symbols-outlined text-sm mr-1">settings_suggest</span>
                                            Service Edit
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] text-sm font-medium">Aromatherapy Add-on</td>
                                    <td className="px-6 py-5 text-slate-500 dark:text-slate-400 text-sm italic">&quot;Updated session duration standard from 45 to 60 minutes.&quot;</td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border border-slate-400 text-slate-400 uppercase">Logged</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center flex-wrap gap-4 justify-between p-6 glass-card mt-4 rounded-xl border border-[var(--color-primary)]/10">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Showing <span className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">1</span> to <span className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">5</span> of <span className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">142</span> results</p>
                    <div className="flex items-center gap-1">
                        <button className="flex size-10 items-center justify-center rounded-lg border border-[var(--color-primary)]/20 text-slate-400 hover:text-[var(--color-primary)] transition-colors">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button className="flex size-10 items-center justify-center rounded-lg bg-[var(--color-primary)] text-slate-900 font-bold text-sm shadow-sm">1</button>
                        <button className="flex size-10 items-center justify-center rounded-lg border border-[var(--color-primary)]/10 text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] hover:bg-[var(--color-primary)]/10 transition-colors text-sm font-medium">2</button>
                        <button className="flex size-10 items-center justify-center rounded-lg border border-[var(--color-primary)]/10 text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] hover:bg-[var(--color-primary)]/10 transition-colors text-sm font-medium">3</button>
                        <span className="mx-2 text-slate-400">...</span>
                        <button className="flex size-10 items-center justify-center rounded-lg border border-[var(--color-primary)]/10 text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] hover:bg-[var(--color-primary)]/10 transition-colors text-sm font-medium">28</button>
                        <button className="flex size-10 items-center justify-center rounded-lg border border-[var(--color-primary)]/20 text-slate-400 hover:text-[var(--color-primary)] transition-colors">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
