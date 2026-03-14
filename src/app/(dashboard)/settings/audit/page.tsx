"use client";

import React from 'react';

export default function AuditLogsPage() {
    return (
        <div className="p-4 lg:p-8 w-full max-w-7xl mx-auto">
            {/* Header & Controls */}
            <div className="flex flex-wrap justify-between items-end gap-6 mb-10">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-[var(--color-primary)]">
                        <span className="material-symbols-outlined text-2xl font-bold animate-pulse">history_edu</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">System Integrity Vault</span>
                    </div>
                    <h1 className="text-5xl font-display font-bold leading-tight tracking-tight">Compliance & <span className="text-[var(--color-primary)] underline decoration-2 decoration-[var(--color-primary)]/20 underline-offset-8">Audit Logs</span></h1>
                    <p className="text-[var(--text-muted)] text-xl font-bold max-w-2xl leading-relaxed">Immutable record of system, administrative, and staff actions ensuring complete operational transparency.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center justify-center rounded-[2rem] h-14 px-8 bg-[var(--bg-surface-muted)] text-[var(--text-main)] text-sm font-bold hover:bg-[var(--bg-card)] transition-all border border-[var(--border-muted)] shadow-sm tracking-widest">
                        <span className="material-symbols-outlined mr-2 text-xl font-bold">download</span>
                        Export CSV
                    </button>
                    <button className="flex items-center justify-center size-14 rounded-[2rem] bg-[var(--text-main)] text-[var(--bg-app)] hover:opacity-90 transition-all shadow-lg shadow-[var(--text-main)]/10">
                        <span className="material-symbols-outlined text-2xl font-bold">filter_list</span>
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors">search</span>
                    <input type="text" placeholder="Search logs, IDs, or users..." className="w-full h-14 pl-12 pr-4 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all font-bold" />
                </div>

                <div className="relative group">
                    <select title="Filter by Time Range" className="w-full h-14 px-6 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl text-sm text-[var(--text-main)] appearance-none focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all font-bold">
                        <option value="">All Action Types</option>
                        <option value="security">Security & Auth</option>
                        <option value="financial">Financial</option>
                        <option value="operations">Operations</option>
                        <option value="system">System Logic</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none group-focus-within:text-[var(--color-primary)] transition-colors">expand_more</span>
                </div>

                <div className="relative group">
                    <select title="Filter by Staff Member" className="w-full h-14 px-6 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl text-sm text-[var(--text-main)] appearance-none focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all italic font-bold">
                        <option value="">Any Staff Member</option>
                        <option value="user_1">Alice N. (Admin)</option>
                        <option value="user_2">Bob S. (Manager)</option>
                        <option value="user_system">System Automated</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none group-focus-within:text-[var(--color-primary)] transition-colors">expand_more</span>
                </div>

                <div className="relative group">
                    <select title="Filter by Time Range" className="w-full h-14 px-6 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl text-sm text-[var(--text-main)] appearance-none focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all italic font-bold">
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="all">All Time</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none group-focus-within:text-[var(--color-primary)] transition-colors">expand_more</span>
                </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] shadow-sm overflow-hidden mb-12">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr className="bg-[var(--bg-surface-muted)]/30 border-b border-[var(--border-muted)]">
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Staff / Actor</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Action Category</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Subject Record</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Reason / Note</th>
                                <th className="px-8 py-5 text-right text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {/* Record 1 */}
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <p className="text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] font-medium">Oct 24, 2024</p>
                                    <p className="text-xs text-slate-500 mt-0.5">14:32:01 CAT</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-[#102220] flex items-center justify-center font-bold text-xs shrink-0">AN</div>
                                        <div>
                                            <p className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Alice N.</p>
                                            <p className="text-[10px] text-slate-500 font-medium tracking-wide">ADMINISTRATOR</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-[14px]">settings_backup_restore</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] text-xs">Financial Override</p>
                                            <p className="text-[10px] text-slate-500">Refund Processed</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">#INV-98214</p>
                                    <p className="text-xs text-slate-500 uppercase">14,000 RWF</p>
                                </td>
                                <td className="px-6 py-4 text-xs text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] max-w-[200px] truncate" title="Client complaint regarding cold sauna room B. Approved by manager on duty.">
                                    Client complaint regarding cold sauna...
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[rgba(19,236,164,0.1)] text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[12px]">check_circle</span> SUCCESS
                                    </span>
                                </td>
                            </tr>

                            {/* Record 2 */}
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <p className="text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] font-medium">Oct 24, 2024</p>
                                    <p className="text-xs text-slate-500 mt-0.5">11:15:44 CAT</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">
                                            <span className="material-symbols-outlined text-sm">smart_toy</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">System Core</p>
                                            <p className="text-[10px] text-slate-500 font-medium tracking-wide">AUTOMATED</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-[14px]">sync</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] text-xs">Inventory Sync</p>
                                            <p className="text-[10px] text-slate-500">Auto Reorder</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">#PO-L-442</p>
                                    <p className="text-xs text-slate-500">Lavender Oil (1L)</p>
                                </td>
                                <td className="px-6 py-4 text-xs text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] max-w-[200px] truncate" title="Stock fell below 10% threshold. Automated PO generated to local supplier.">
                                    Stock fell below 10% threshold. Auto...
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[rgba(19,236,164,0.1)] text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[12px]">check_circle</span> SUCCESS
                                    </span>
                                </td>
                            </tr>

                            {/* Record 3 */}
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group bg-red-50/50 dark:bg-red-900/10">
                                <td className="px-6 py-4">
                                    <p className="text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] font-medium">Oct 24, 2024</p>
                                    <p className="text-xs text-slate-500 mt-0.5">09:02:11 CAT</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] flex items-center justify-center font-bold text-xs shrink-0">JM</div>
                                        <div>
                                            <p className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Jean M.</p>
                                            <p className="text-[10px] text-slate-500 font-medium tracking-wide">RECEPTIONIST</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-[14px]">gpp_bad</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] text-xs">Security Event</p>
                                            <p className="text-[10px] text-slate-500">Access Denied</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">/admin/reports</p>
                                    <p className="text-xs text-slate-500">Financial Data</p>
                                </td>
                                <td className="px-6 py-4 text-xs text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] max-w-[200px] truncate" title="Attempted to access restricted financial reports route. Role does not have View Revenue Reports permission.">
                                    Attempted to access restricted finan...
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-600 text-[10px] font-bold uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[12px]">block</span> BLOCKED
                                    </span>
                                </td>
                            </tr>

                            {/* Record 4 */}
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <p className="text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] font-medium">Oct 23, 2024</p>
                                    <p className="text-xs text-slate-500 mt-0.5">18:45:00 CAT</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] flex items-center justify-center font-bold text-xs shrink-0">MK</div>
                                        <div>
                                            <p className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Mary K.</p>
                                            <p className="text-[10px] text-slate-500 font-medium tracking-wide">EMPLOYEE</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-[14px]">cleaning_services</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] text-xs">Operations</p>
                                            <p className="text-[10px] text-slate-500">Status Update</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Sauna B</p>
                                    <p className="text-xs text-slate-500">Status: Cleaned</p>
                                </td>
                                <td className="px-6 py-4 text-xs text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] max-w-[200px] truncate" title="Marked room as cleaned and ready for next client via internal mobile app.">
                                    Marked room as cleaned and ready fo...
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[rgba(19,236,164,0.1)] text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[12px]">check_circle</span> SUCCESS
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 border-t border-[var(--border-muted)] flex items-center justify-between text-sm">
                    <p className="text-[var(--text-muted)] font-bold">Showing <span className="font-bold text-[var(--text-main)]">1</span> to <span className="font-bold text-[var(--text-main)]">4</span> of <span className="font-bold text-[var(--text-main)]">1,284</span> log entries</p>
                    <div className="flex gap-4">
                        <button className="px-6 py-2 rounded-xl border border-[var(--border-muted)] text-[var(--text-muted)] cursor-not-allowed font-bold">Previous</button>
                        <button className="px-6 py-2 rounded-xl bg-[var(--text-main)] text-[var(--bg-app)] font-bold hover:opacity-90 transition-opacity">Next Batch</button>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-6 p-8 bg-[var(--bg-surface-muted)]/30 border border-[var(--border-muted)] rounded-[2rem] max-w-3xl">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl font-bold animate-pulse">lock</span>
                <div>
                    <p className="text-xl font-display font-bold text-[var(--text-main)]">Immutable Audit Trail</p>
                    <p className="text-sm text-[var(--text-muted)] mt-2 font-bold leading-relaxed">Logs shown here are WORM (Write Once, Read Many) compliant and cannot be altered or deleted by any user, ensuring a tamper-proof chain of custody.</p>
                </div>
            </div>
        </div>
    );
}
