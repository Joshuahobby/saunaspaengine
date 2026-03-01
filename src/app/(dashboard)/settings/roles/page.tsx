"use client";

import React, { useState } from "react";

export default function RolesAndPermissionsPage() {
    return (
        <div className="p-4 lg:p-8 w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Role & Permission Matrix</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Configure access levels and administrative capabilities across your organization.</p>
                </div>
                <button className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 self-start md:self-auto">
                    <span className="material-symbols-outlined text-sm">save</span>
                    Save Changes
                </button>
            </div>

            {/* Quick Stats / Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[rgba(19,236,164,0.1)] flex items-center justify-center text-[var(--color-primary)]">
                            <span className="material-symbols-outlined">shield_person</span>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">4</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Roles</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined">rule_settings</span>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">32</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Permissions</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-[var(--color-primary)] shadow-[0_0_15px_rgba(19,236,164,0.1)]">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 text-[var(--color-primary)]">
                            <span className="material-symbols-outlined">info</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Security Best Practice</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Apply the principle of least privilege. Only grant users the permissions necessary to perform their assigned duties.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Matrix Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                                <th className="p-4 font-bold text-slate-500 dark:text-slate-400 w-1/3">Permission Detail</th>
                                {/* Role Headers */}
                                <th className="p-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm text-red-600">admin_panel_settings</span>
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-slate-100">Admin</span>
                                    </div>
                                </th>
                                <th className="p-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm text-blue-600">manage_accounts</span>
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-slate-100">Manager</span>
                                    </div>
                                </th>
                                <th className="p-4 text-center border-l-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-8 h-8 rounded-[12px] bg-amber-100 text-amber-600 flex items-center justify-center border-2 border-amber-600/30">
                                            <span className="material-symbols-outlined text-sm text-amber-600">front_hand</span>
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-slate-100">Receptionist</span>
                                    </div>
                                </th>
                                <th className="p-4 text-center bg-slate-100/50 dark:bg-slate-900/50">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm">engineering</span>
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-slate-100">Employee</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Section 1: Financial Management */}
                            <tr className="bg-slate-100 dark:bg-slate-800/80 border-y border-slate-200 dark:border-slate-800">
                                <td colSpan={5} className="p-3 font-black text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-4">Financial Management</td>
                            </tr>
                            <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="p-4">
                                    <p className="font-bold text-slate-900 dark:text-slate-100">Process Refunds</p>
                                    <p className="text-xs text-slate-500 mt-1">Issue financial refunds to client payment methods.</p>
                                </td>
                                <td className="p-4 text-center"><input type="checkbox" defaultChecked disabled className="w-5 h-5 accent-[var(--color-primary)] cursor-not-allowed opacity-50" /></td>
                                <td className="p-4 text-center"><input type="checkbox" defaultChecked className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                                <td className="p-4 text-center border-l-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                                <td className="p-4 text-center bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                            </tr>
                            <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="p-4">
                                    <p className="font-bold text-slate-900 dark:text-slate-100">View Revenue Reports</p>
                                    <p className="text-xs text-slate-500 mt-1">Access detailed financial analytics and gross revenue data.</p>
                                </td>
                                <td className="p-4 text-center"><input type="checkbox" defaultChecked disabled className="w-5 h-5 accent-[var(--color-primary)] cursor-not-allowed opacity-50" /></td>
                                <td className="p-4 text-center"><input type="checkbox" defaultChecked className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                                <td className="p-4 text-center border-l-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                                <td className="p-4 text-center bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                            </tr>
                            <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="p-4">
                                    <p className="font-bold text-slate-900 dark:text-slate-100">Override Pricing / Discounts</p>
                                    <p className="text-xs text-slate-500 mt-1">Manually adjust prices at checkout or apply unapproved discounts.</p>
                                </td>
                                <td className="p-4 text-center"><input type="checkbox" defaultChecked disabled className="w-5 h-5 accent-[var(--color-primary)] cursor-not-allowed opacity-50" /></td>
                                <td className="p-4 text-center"><input type="checkbox" defaultChecked className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                                <td className="p-4 text-center border-l-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                                <td className="p-4 text-center bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" disabled className="w-5 h-5 accent-[var(--color-primary)] cursor-not-allowed opacity-30" title="System restricted for this role" /></td>
                            </tr>

                            {/* Section 2: Operations & Logistics */}
                            <tr className="bg-slate-100 dark:bg-slate-800/80 border-y border-slate-200 dark:border-slate-800">
                                <td colSpan={5} className="p-3 font-black text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-4">Operations & Logistics</td>
                            </tr>
                            <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="p-4">
                                    <p className="font-bold text-slate-900 dark:text-slate-100">Cancel / Reschedule Bookings</p>
                                    <p className="text-xs text-slate-500 mt-1">Modify existing client appointments.</p>
                                </td>
                                <td className="p-4 text-center"><input type="checkbox" defaultChecked disabled className="w-5 h-5 accent-[var(--color-primary)] cursor-not-allowed opacity-50" /></td>
                                <td className="p-4 text-center"><input type="checkbox" defaultChecked className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                                <td className="p-4 text-center border-l-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" defaultChecked className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                                <td className="p-4 text-center bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                            </tr>
                            <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="p-4">
                                    <p className="font-bold text-slate-900 dark:text-slate-100">Manage Inventory Thresholds</p>
                                    <p className="text-xs text-slate-500 mt-1">Set low-stock alerts and create purchase orders.</p>
                                </td>
                                <td className="p-4 text-center"><input type="checkbox" defaultChecked disabled className="w-5 h-5 accent-[var(--color-primary)] cursor-not-allowed opacity-50" /></td>
                                <td className="p-4 text-center"><input type="checkbox" defaultChecked className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                                <td className="p-4 text-center border-l-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                                <td className="p-4 text-center bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                            </tr>
                            <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="p-4">
                                    <p className="font-bold text-slate-900 dark:text-slate-100">Update Room/Equipment Status</p>
                                    <p className="text-xs text-slate-500 mt-1">Mark saunas as 'in maintenance' or 'cleaning required'.</p>
                                </td>
                                <td className="p-4 text-center"><input type="checkbox" defaultChecked disabled className="w-5 h-5 accent-[var(--color-primary)] cursor-not-allowed opacity-50" /></td>
                                <td className="p-4 text-center"><input type="checkbox" defaultChecked className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                                <td className="p-4 text-center border-l-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" defaultChecked className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                                <td className="p-4 text-center bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" defaultChecked className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                            </tr>

                            {/* Section 3: Staff & HR */}
                            <tr className="bg-slate-100 dark:bg-slate-800/80 border-y border-slate-200 dark:border-slate-800">
                                <td colSpan={5} className="p-3 font-black text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-4">Staff & HR</td>
                            </tr>
                            <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="p-4">
                                    <p className="font-bold text-slate-900 dark:text-slate-100">View Audit Logs</p>
                                    <p className="text-xs text-slate-500 mt-1">Access system logs of all employee actions and changes.</p>
                                </td>
                                <td className="p-4 text-center"><input type="checkbox" defaultChecked disabled className="w-5 h-5 accent-[var(--color-primary)] cursor-not-allowed opacity-50" /></td>
                                <td className="p-4 text-center"><input type="checkbox" className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                                <td className="p-4 text-center border-l-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" disabled className="w-5 h-5 accent-[var(--color-primary)] cursor-not-allowed opacity-30" title="System restricted for this role" /></td>
                                <td className="p-4 text-center bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" disabled className="w-5 h-5 accent-[var(--color-primary)] cursor-not-allowed opacity-30" title="System restricted for this role" /></td>
                            </tr>
                            <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="p-4">
                                    <p className="font-bold text-slate-900 dark:text-slate-100">Edit Staff Profiles / Schedules</p>
                                    <p className="text-xs text-slate-500 mt-1">Change employee work hours, roles, and personal details.</p>
                                </td>
                                <td className="p-4 text-center"><input type="checkbox" defaultChecked disabled className="w-5 h-5 accent-[var(--color-primary)] cursor-not-allowed opacity-50" /></td>
                                <td className="p-4 text-center"><input type="checkbox" defaultChecked className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer" /></td>
                                <td className="p-4 text-center border-l-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" disabled className="w-5 h-5 accent-[var(--color-primary)] cursor-not-allowed opacity-30" title="System restricted for this role" /></td>
                                <td className="p-4 text-center bg-slate-50/30 dark:bg-slate-900/30"><input type="checkbox" disabled className="w-5 h-5 accent-[var(--color-primary)] cursor-not-allowed opacity-30" title="System restricted for this role" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-4 text-center hidden md:block">
                <p className="text-xs text-slate-400">Settings automatically validate against ISO 27001 compliance criteria.</p>
            </div>
        </div>
    );
}
