"use client";

import React from 'react';

export default function AuditLogsPage() {
    return (
        <div className="p-4 lg:p-8 w-full max-w-7xl mx-auto">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Compliance & Audit Logs</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">Immutable record of system, administrative, and staff actions</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 h-10 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold hover:opacity-90 transition-opacity">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export CSV
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                    <input type="text" placeholder="Search logs, IDs, or users..." className="w-full h-10 pl-9 pr-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all" />
                </div>

                <div className="relative">
                    <select className="w-full h-10 px-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 appearance-none focus:outline-none focus:border-[var(--color-primary)]">
                        <option value="">All Action Types</option>
                        <option value="security">Security & Auth</option>
                        <option value="financial">Financial</option>
                        <option value="operations">Operations</option>
                        <option value="system">System Logic</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>

                <div className="relative">
                    <select className="w-full h-10 px-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 appearance-none focus:outline-none focus:border-[var(--color-primary)]">
                        <option value="">Any Staff Member</option>
                        <option value="user_1">Alice N. (Admin)</option>
                        <option value="user_2">Bob S. (Manager)</option>
                        <option value="user_system">System Automated</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>

                <div className="relative">
                    <select className="w-full h-10 px-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 appearance-none focus:outline-none focus:border-[var(--color-primary)]">
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="all">All Time</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Staff / Actor</th>
                                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Action Category</th>
                                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Subject Record</th>
                                <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Reason / Note</th>
                                <th className="px-6 py-4 text-right font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {/* Record 1 */}
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <p className="text-slate-900 dark:text-slate-100 font-medium">Oct 24, 2024</p>
                                    <p className="text-xs text-slate-500 mt-0.5">14:32:01 CAT</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-[#102220] flex items-center justify-center font-bold text-xs shrink-0">AN</div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-slate-100">Alice N.</p>
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
                                            <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Financial Override</p>
                                            <p className="text-[10px] text-slate-500">Refund Processed</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">#INV-98214</p>
                                    <p className="text-xs text-slate-500 uppercase">14,000 RWF</p>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title="Client complaint regarding cold sauna room B. Approved by manager on duty.">
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
                                    <p className="text-slate-900 dark:text-slate-100 font-medium">Oct 24, 2024</p>
                                    <p className="text-xs text-slate-500 mt-0.5">11:15:44 CAT</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">
                                            <span className="material-symbols-outlined text-sm">smart_toy</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-slate-100">System Core</p>
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
                                            <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Inventory Sync</p>
                                            <p className="text-[10px] text-slate-500">Auto Reorder</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">#PO-L-442</p>
                                    <p className="text-xs text-slate-500">Lavender Oil (1L)</p>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title="Stock fell below 10% threshold. Automated PO generated to local supplier.">
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
                                    <p className="text-slate-900 dark:text-slate-100 font-medium">Oct 24, 2024</p>
                                    <p className="text-xs text-slate-500 mt-0.5">09:02:11 CAT</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">JM</div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-slate-100">Jean M.</p>
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
                                            <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Security Event</p>
                                            <p className="text-[10px] text-slate-500">Access Denied</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">/admin/reports</p>
                                    <p className="text-xs text-slate-500">Financial Data</p>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title="Attempted to access restricted financial reports route. Role does not have View Revenue Reports permission.">
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
                                    <p className="text-slate-900 dark:text-slate-100 font-medium">Oct 23, 2024</p>
                                    <p className="text-xs text-slate-500 mt-0.5">18:45:00 CAT</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">MK</div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-slate-100">Mary K.</p>
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
                                            <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">Operations</p>
                                            <p className="text-[10px] text-slate-500">Status Update</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Sauna B</p>
                                    <p className="text-xs text-slate-500">Status: Cleaned</p>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title="Marked room as cleaned and ready for next client via internal mobile app.">
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
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm">
                    <p className="text-slate-500">Showing <span className="font-bold text-slate-900 dark:text-slate-100">1</span> to <span className="font-bold text-slate-900 dark:text-slate-100">4</span> of <span className="font-bold text-slate-900 dark:text-slate-100">1,284</span> entries</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">Previous</button>
                        <button className="px-3 py-1 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold hover:opacity-90 transition-opacity">Next</button>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-2 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-2xl">
                <span className="material-symbols-outlined text-slate-400">lock</span>
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Immutable Audit Trail</p>
                    <p className="text-xs text-slate-500 mt-1">Logs shown here are WORM (Write Once, Read Many) compliant and cannot be altered or deleted by any user, including Super Administrators.</p>
                </div>
            </div>
        </div>
    );
}
