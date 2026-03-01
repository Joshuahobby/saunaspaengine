"use client";

import React from "react";

export default function InventoryDashboardPage() {
    return (
        <div className="p-4 lg:p-8 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory & Supply Management</h2>
                    <p className="text-slate-500 dark:text-slate-400">Monitor your spa essentials and coordinate with replenishment partners.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-[var(--color-border-light)] rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-[#102220] rounded-lg text-sm font-bold hover:brightness-110 transition-all shadow-md">
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add New Item
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border-light)] mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <button className="px-6 py-3 text-sm font-semibold border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]">All Items</button>
                <button className="px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent transition-colors">Suppliers</button>
                <button className="px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent transition-colors">Stock Alerts</button>
                <button className="px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent transition-colors">Purchase Orders</button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Table Section */}
                <div className="xl:col-span-3">
                    <div className="bg-[var(--color-surface-light)] rounded-xl border border-[var(--color-border-light)] overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-max border-collapse">
                                <thead className="bg-[#102220]/5 dark:bg-[#102220] border-b border-[var(--color-border-light)]">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Item Name</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Stock</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--color-border-light)]">
                                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 rounded-lg bg-[rgba(19,236,164,0.1)] flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[var(--color-primary)]">oil_barrel</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Massage Oil (Lavender)</p>
                                                    <p className="text-xs text-slate-500">Premium Aromatherapy Grade</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">45</td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">Liters</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[rgba(19,236,164,0.1)] text-[var(--color-primary)] uppercase tracking-wider">
                                                In Stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-[var(--color-primary)] hover:underline text-sm font-semibold">Restock</button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-amber-500">dry_cleaning</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Cotton Towels (Large)</p>
                                                    <p className="text-xs text-slate-500">Egyptian Cotton - White</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-amber-600 dark:text-amber-400">12</td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">Units</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 uppercase tracking-wider">
                                                Low Stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="bg-amber-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-amber-600 shadow-sm transition-colors">Restock</button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-slate-500">fireplace</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Sauna Charcoal</p>
                                                    <p className="text-xs text-slate-500">Organic Birch Wood</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-amber-600 dark:text-amber-400">8</td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">kg</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 uppercase tracking-wider">
                                                Low Stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="bg-amber-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-amber-600 shadow-sm transition-colors">Restock</button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 rounded-lg bg-[rgba(19,236,164,0.1)] flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[var(--color-primary)]">eco</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Eucalyptus Essence</p>
                                                    <p className="text-xs text-slate-500">Pure Essential Extract</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">20</td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">Bottles</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[rgba(19,236,164,0.1)] text-[var(--color-primary)] uppercase tracking-wider">
                                                In Stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-[var(--color-primary)] hover:underline text-sm font-semibold">Restock</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Suppliers & Settings */}
                <div className="space-y-6">
                    {/* Suppliers Card */}
                    <div className="bg-[var(--color-surface-light)] rounded-xl border border-[var(--color-border-light)] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Top Suppliers</h3>
                            <button className="text-xs text-[var(--color-primary)] font-bold hover:underline cursor-pointer">See All</button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Nordic Wellness Ltd.</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                        <span className="material-symbols-outlined text-xs">call</span> +44 20 7123 4567
                                    </p>
                                </div>
                                <button className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-sm">mail</span>
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Eco Spa Supplies</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                        <span className="material-symbols-outlined text-xs">call</span> +44 20 7987 6543
                                    </p>
                                </div>
                                <button className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-sm">mail</span>
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Luxe Linens Co.</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                        <span className="material-symbols-outlined text-xs">call</span> +44 20 7555 0199
                                    </p>
                                </div>
                                <button className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-sm">mail</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Alert Settings */}
                    <div className="bg-[var(--color-surface-light)] rounded-xl border border-[var(--color-border-light)] p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Alert Thresholds</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-500 block mb-1">Standard Items</label>
                                <div className="flex items-center gap-3">
                                    <input className="flex-1 accent-[var(--color-primary)]" type="range" defaultValue={15} />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">15%</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 block mb-1">Critical Essentials</label>
                                <div className="flex items-center gap-3">
                                    <input className="flex-1 accent-[var(--color-primary)]" type="range" defaultValue={25} />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">25%</span>
                                </div>
                            </div>
                            <div className="pt-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input defaultChecked className="sr-only peer" type="checkbox" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--color-primary)]"></div>
                                    <span className="ml-3 text-xs font-medium text-slate-800 dark:text-slate-200">Auto-Notify Suppliers</span>
                                </label>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-2 border border-[var(--color-border-light)] rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-sm">
                            Update Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
