"use client";

import React from "react";
import Link from "next/link";

export default function BookingSettingsPage() {
    return (
        <div className="flex flex-col lg:flex-row w-full gap-8">
            {/* Inner Sidebar Navigation */}
            <aside className="w-full lg:w-64 border-r border-[var(--color-border-light)] bg-[var(--color-surface-light)] p-2 space-y-2 hidden lg:block">
                <div className="mb-4 mt-2 px-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Business Settings</h3>
                </div>
                <nav className="space-y-1">
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                        <span className="material-symbols-outlined">settings</span>
                        General
                    </button>
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                        <span className="material-symbols-outlined">calendar_today</span>
                        Booking Rules
                    </button>
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                        <span className="material-symbols-outlined">payments</span>
                        Payments
                    </button>
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium bg-[rgba(19,236,164,0.1)] text-[var(--color-primary)] border border-[var(--color-primary)]/20 text-left">
                        <span className="material-symbols-outlined">gavel</span>
                        Policies
                    </button>
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                        <span className="material-symbols-outlined">link</span>
                        Integrations
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-5xl">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <span className="hover:text-[var(--color-primary)] transition-colors cursor-pointer">Settings</span>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-slate-900 dark:text-slate-100 font-medium">No-Show & Cancellation Policy</span>
                </div>

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">No-Show & Cancellation Policy</h1>
                        <p className="mt-1 text-slate-500 dark:text-slate-400 max-w-2xl">Manage how deposits and cancellations protect your business revenue from missed appointments.</p>
                    </div>
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold text-[#102220] shadow-[0_4px_14px_0_rgba(19,236,164,0.39)] hover:shadow-[0_6px_20px_rgba(19,236,164,0.23)] hover:brightness-110 transition-all">
                        <span className="material-symbols-outlined text-base">save</span>
                        Save Changes
                    </button>
                </div>

                <div className="space-y-8 pb-10">
                    {/* Policy Status Banner */}
                    <div className="rounded-xl border border-[var(--color-primary)]/30 bg-[rgba(19,236,164,0.05)] p-4 flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(19,236,164,0.2)] text-[var(--color-primary)]">
                            <span className="material-symbols-outlined">info</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Automated protection is active</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Your current policies saved 1,240,000 RWF in potential lost revenue last month.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Section: Booking Deposits */}
                        <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-light)] p-6 space-y-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">account_balance_wallet</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Booking Deposits</h3>
                            </div>
                            <p className="text-sm text-slate-500">Require clients to pay upfront to secure their time slot.</p>

                            <div className="space-y-4 pt-2">
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Deposit Type</span>
                                    <select className="rounded-lg border-[var(--color-border-light)] bg-white dark:bg-slate-800 text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] p-2 border">
                                        <option>Percentage of service total</option>
                                        <option>Flat amount per booking</option>
                                        <option>Full payment required</option>
                                    </select>
                                </label>

                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Deposit Amount</span>
                                    <div className="relative">
                                        <input className="w-full rounded-lg border-[var(--color-border-light)] bg-white dark:bg-slate-800 py-2.5 pl-4 pr-10 text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] border" type="number" defaultValue="50" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                                    </div>
                                </label>

                                <div className="flex items-center justify-between rounded-lg border border-[var(--color-border-light)] bg-slate-50/50 dark:bg-slate-800/50 p-3">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Apply to all services</span>
                                        <span className="text-xs text-slate-500">Uncheck to set per-service deposits</span>
                                    </div>
                                    <input defaultChecked className="h-5 w-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer" type="checkbox" />
                                </div>
                            </div>
                        </div>

                        {/* Section: Cancellation Window */}
                        <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-light)] p-6 space-y-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">event_busy</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Cancellation Window</h3>
                            </div>
                            <p className="text-sm text-slate-500">Define the timeframe in which clients can cancel for free.</p>

                            <div className="space-y-4 pt-2">
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Free Cancellation Deadline</span>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input className="rounded-lg border-[var(--color-border-light)] bg-white dark:bg-slate-800 py-2.5 px-4 text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] border" type="number" defaultValue="24" />
                                        <select className="rounded-lg border-[var(--color-border-light)] bg-white dark:bg-slate-800 text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] border p-2">
                                            <option>Hours before</option>
                                            <option>Days before</option>
                                        </select>
                                    </div>
                                </label>

                                <div className="space-y-3">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Late Cancellation Penalty</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button className="flex items-center justify-center gap-2 rounded-lg border border-[var(--color-primary)] bg-[rgba(19,236,164,0.05)] px-4 py-2.5 text-sm font-medium text-[var(--color-primary)]">
                                            <span className="material-symbols-outlined text-sm">check_circle</span>
                                            Keep Deposit
                                        </button>
                                        <button className="flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border-light)] bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                            Charge Flat Fee
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: No-Show Fees */}
                        <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-light)] p-6 space-y-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">no_accounts</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No-Show Fees</h3>
                            </div>
                            <p className="text-sm text-slate-500">Automatically charge clients who fail to arrive for their appointment.</p>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Enable No-Show Charges</span>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input defaultChecked className="peer sr-only" type="checkbox" />
                                        <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[var(--color-primary)] peer-checked:after:translate-x-full peer-checked:after:border-[#102220] peer-focus:outline-none dark:bg-slate-700"></div>
                                    </label>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-xs font-medium text-slate-500">Charge Basis</span>
                                        <select className="rounded-lg border-[var(--color-border-light)] bg-white dark:bg-slate-800 text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] border p-2">
                                            <option>Percentage</option>
                                            <option>Flat Fee</option>
                                        </select>
                                    </label>

                                    <label className="flex flex-col gap-2">
                                        <span className="text-xs font-medium text-slate-500">Value</span>
                                        <div className="relative">
                                            <input className="w-full rounded-lg border-[var(--color-border-light)] bg-white dark:bg-slate-800 py-2.5 px-4 text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] border" type="number" defaultValue="100" />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                                        </div>
                                    </label>
                                </div>

                                <p className="text-[11px] text-slate-500 italic">Note: For 100% no-show fees, card details must be securely stored via our payment gateway at the time of booking.</p>
                            </div>
                        </div>

                        {/* Section: Automated Reminders */}
                        <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-light)] p-6 space-y-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">notifications_active</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Automated Reminders</h3>
                            </div>
                            <p className="text-sm text-slate-500">Reduce no-shows by reminding clients before the cancellation window closes.</p>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between rounded-lg border border-[var(--color-border-light)] bg-slate-50/50 dark:bg-slate-800/50 p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-400">sms</span>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">SMS Reminders</span>
                                            <span className="text-xs text-slate-500">Send 2 hours before deadline</span>
                                        </div>
                                    </div>
                                    <input defaultChecked className="h-5 w-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer" type="checkbox" />
                                </div>

                                <div className="flex items-center justify-between rounded-lg border border-[var(--color-border-light)] bg-slate-50/50 dark:bg-slate-800/50 p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-400">mail</span>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Email Reminders</span>
                                            <span className="text-xs text-slate-500">Send 24 hours before deadline</span>
                                        </div>
                                    </div>
                                    <input defaultChecked className="h-5 w-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer" type="checkbox" />
                                </div>

                                <button className="w-full rounded-lg border border-[var(--color-border-light)] py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    Configure Reminder Templates
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Policy Disclosure Preview */}
                    <div className="rounded-xl border border-[var(--color-border-light)] bg-slate-100/50 dark:bg-slate-800/30 p-8 mt-10">
                        <div className="max-w-3xl mx-auto space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 text-center">Customer Disclosure Preview</h4>
                            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-[var(--color-border-light)] shadow-sm">
                                <p className="text-sm italic text-slate-700 dark:text-slate-300 leading-relaxed text-center">
                                    "To secure your appointment, a <span className="font-bold text-[var(--color-primary)]">50% non-refundable deposit</span> is required. Cancellations must be made at least <span className="font-bold text-[var(--color-primary)]">24 hours</span> prior to the scheduled time. Cancellations made within the 24-hour window or failure to attend (no-show) will result in <span className="font-bold text-[var(--color-primary)]">forfeiture of the deposit and a potential 100% service fee charge</span> to the card on file."
                                </p>
                            </div>
                            <p className="text-center text-xs text-slate-500">This text will be shown to customers during the final step of online booking.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
