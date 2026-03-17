"use client";

import React from "react";

export default function BookingSettingsPage() {
    return (
        <div className="flex flex-col lg:flex-row w-full gap-8">
            {/* Inner Sidebar Navigation */}
            <aside className="w-full lg:w-64 border-r border-[var(--color-border-light)] bg-[var(--color-surface-light)] p-2 space-y-2 hidden lg:block">
                <div className="mb-4 mt-2 px-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Branch Settings</h3>
                </div>
                <nav className="space-y-1">
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                        <span className="material-symbols-outlined">settings</span>
                        General
                    </button>
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                        <span className="material-symbols-outlined">calendar_today</span>
                        Booking Rules
                    </button>
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                        <span className="material-symbols-outlined">payments</span>
                        Payments
                    </button>
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold bg-[rgba(19,236,164,0.1)] text-[var(--color-primary)] border border-[var(--color-primary)]/20 text-left">
                        <span className="material-symbols-outlined">gavel</span>
                        Policies
                    </button>
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
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
                    <span className="text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] font-bold">No-Show & Cancellation Policy</span>
                </div>

                {/* Page Header */}
                <div className="flex flex-wrap justify-between items-end gap-6 mb-12">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-[var(--color-primary)]">
                            <span className="material-symbols-outlined text-2xl font-bold">security</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Revenue Safeguard</span>
                        </div>
                        <h1 className="text-5xl font-display font-bold leading-tight tracking-tight">Cancellation <span className="text-[var(--color-primary)] underline decoration-2 decoration-[var(--color-primary)]/20 underline-offset-8">Policy</span></h1>
                        <p className="text-[var(--text-muted)] text-xl font-bold max-w-2xl leading-relaxed">Manage how deposits and automated penalties protect your branch from no-shows and late cancellations.</p>
                    </div>
                    <button className="flex items-center justify-center rounded-[2rem] h-14 px-10 bg-[var(--text-main)] text-[var(--bg-app)] text-sm font-bold hover:opacity-90 transition-all shadow-xl shadow-[var(--text-main)]/10 tracking-widest">
                        <span className="material-symbols-outlined mr-2 text-xl font-bold">save</span>
                        Save Thresholds
                    </button>
                </div>

                <div className="space-y-8 pb-10">
                    {/* Policy Status Banner */}
                    <div className="rounded-[2rem] border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-8 flex items-center gap-8 shadow-inner">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-[var(--bg-app)] shadow-lg shadow-[var(--color-primary)]/20">
                            <span className="material-symbols-outlined text-3xl font-bold">verified</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xl font-display font-bold text-[var(--text-main)]">Automated protection is active</h4>
                            <p className="text-sm text-[var(--text-muted)] font-bold mt-1">Your current policies safeguarded <span className="text-[var(--color-primary)] font-bold">1,240,000 RWF</span> in potential lost revenue last month.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Section: Booking Deposits */}
                        <div className="rounded-[2.5rem] border border-[var(--border-muted)] bg-[var(--bg-card)] p-10 space-y-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 group">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl font-bold group-hover:animate-float">account_balance_wallet</span>
                                <h3 className="text-2xl font-display font-bold text-[var(--text-main)]">Booking Deposits</h3>
                            </div>
                            <p className="text-[var(--text-muted)] font-bold leading-relaxed">Require clients to pay upfront to secure their time slot and minimize revenue leakage.</p>

                            <div className="space-y-6 pt-2">
                                <label className="flex flex-col gap-3">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] italic opacity-60">Deposit Type</span>
                                    <select title="Select Deposit Type" className="h-14 px-6 rounded-2xl bg-[var(--bg-surface-muted)]/50 border border-[var(--border-muted)] text-[var(--text-main)] text-sm font-bold focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all italic">
                                        <option>Percentage of service total</option>
                                        <option>Flat amount per booking</option>
                                        <option>Full payment required</option>
                                    </select>
                                </label>

                                <label className="flex flex-col gap-3">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] italic opacity-60">Deposit Amount</span>
                                    <div className="relative">
                                        <input title="Enter Deposit Amount" className="w-full h-14 px-6 pr-14 rounded-2xl bg-[var(--bg-surface-muted)]/50 border border-[var(--border-muted)] text-[var(--text-main)] text-sm font-bold focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all italic" type="number" defaultValue="50" />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold italic tracking-widest">%</span>
                                    </div>
                                </label>

                                <div className="flex items-center justify-between rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/20 p-6 transition-all group-hover:bg-[var(--bg-surface-muted)]/30">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[var(--text-main)] italic">Apply to all services</span>
                                        <span className="text-xs text-[var(--text-muted)] font-medium opacity-60">Uncheck to set per-service deposits</span>
                                    </div>
                                    <input aria-label="Apply to all services" defaultChecked className="size-6 rounded-lg border-[var(--border-muted)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer" type="checkbox" />
                                </div>
                            </div>
                        </div>

                        {/* Section: Cancellation Window */}
                        <div className="rounded-[2.5rem] border border-[var(--border-muted)] bg-[var(--bg-card)] p-10 space-y-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 group">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl font-bold italic group-hover:animate-float">event_busy</span>
                                <h3 className="text-2xl font-serif font-bold text-[var(--text-main)] italic">Cancellation Window</h3>
                            </div>
                            <p className="text-[var(--text-muted)] font-medium leading-relaxed">Define the timeframe in which clients can cancel for free to protect staff schedules.</p>

                            <div className="space-y-6 pt-2">
                                <label className="flex flex-col gap-3">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] italic opacity-60">Free Cancellation Deadline</span>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input title="Enter Cancellation Deadline" className="h-14 px-6 rounded-2xl bg-[var(--bg-surface-muted)]/50 border border-[var(--border-muted)] text-[var(--text-main)] text-sm font-bold focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all italic" type="number" defaultValue="24" />
                                        <select title="Select Time Unit" className="h-14 px-6 rounded-2xl bg-[var(--bg-surface-muted)]/50 border border-[var(--border-muted)] text-[var(--text-main)] text-sm font-bold focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all italic">
                                            <option>Hours before</option>
                                            <option>Days before</option>
                                        </select>
                                    </div>
                                </label>

                                <div className="space-y-4">
                                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-60">Late Cancellation Penalty</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button className="flex items-center justify-center gap-2 rounded-2xl h-14 bg-[var(--color-primary)] text-[var(--bg-app)] text-sm font-bold shadow-lg shadow-[var(--color-primary)]/10">
                                            <span className="material-symbols-outlined font-bold">check_circle</span>
                                            Keep Deposit
                                        </button>
                                        <button className="flex items-center justify-center gap-2 rounded-2xl h-14 bg-[var(--bg-surface-muted)] text-[var(--text-main)] text-sm font-bold border border-[var(--border-muted)] hover:bg-[var(--bg-card)] transition-all">
                                            Charge Flat Fee
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: No-Show Fees */}
                        <div className="rounded-[2.5rem] border border-[var(--border-muted)] bg-[var(--bg-card)] p-10 space-y-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 group">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl font-bold group-hover:animate-float">no_accounts</span>
                                <h3 className="text-2xl font-display font-bold text-[var(--text-main)]">No-Show Fees</h3>
                            </div>
                            <p className="text-[var(--text-muted)] font-bold leading-relaxed">Automatically charge clients who fail to arrive for their appointment to cover operational costs.</p>

                            <div className="space-y-6 pt-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-[var(--text-main)] italic">Enable No-Show Charges</span>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input aria-label="Enable No-Show Charges" defaultChecked className="peer sr-only" type="checkbox" />
                                        <div className="peer h-8 w-14 rounded-full bg-[var(--bg-surface-muted)] after:absolute after:left-[4px] after:top-[4px] after:h-6 after:w-6 after:rounded-full after:bg-[var(--text-muted)] after:transition-all after:content-[''] peer-checked:bg-[var(--color-primary)] peer-checked:after:translate-x-full peer-checked:after:bg-[var(--bg-app)] peer-focus:outline-none transition-colors"></div>
                                    </label>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <label className="flex flex-col gap-3">
                                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] italic opacity-60">Charge Basis</span>
                                        <select title="Select Charge Basis" className="h-14 px-6 rounded-2xl bg-[var(--bg-surface-muted)]/50 border border-[var(--border-muted)] text-[var(--text-main)] text-sm font-bold focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all italic">
                                            <option>Percentage</option>
                                            <option>Flat Fee</option>
                                        </select>
                                    </label>

                                    <label className="flex flex-col gap-3">
                                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] italic opacity-60">Value</span>
                                        <div className="relative">
                                            <input title="Enter No-Show Fee Value" className="w-full h-14 px-6 pr-14 rounded-2xl bg-[var(--bg-surface-muted)]/50 border border-[var(--border-muted)] text-[var(--text-main)] text-sm font-bold focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all italic" type="number" defaultValue="100" />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold italic tracking-widest">%</span>
                                        </div>
                                    </label>
                                </div>

                                <p className="text-[11px] text-[var(--text-muted)] italic font-medium leading-relaxed opacity-60">Note: For 100% no-show fees, card details must be securely stored via our payment gateway at the time of booking.</p>
                            </div>
                        </div>

                        {/* Section: Automated Reminders */}
                        <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-light)] p-6 space-y-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">notifications_active</span>
                                <h3 className="text-lg font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Automated Reminders</h3>
                            </div>
                            <p className="text-sm text-slate-500">Reduce no-shows by reminding clients before the cancellation window closes.</p>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between rounded-lg border border-[var(--color-border-light)] bg-slate-50/50 dark:bg-slate-800/50 p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-400">sms</span>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">SMS Reminders</span>
                                            <span className="text-xs text-slate-500">Send 2 hours before deadline</span>
                                        </div>
                                    </div>
                                    <input aria-label="Enable SMS Reminders" defaultChecked className="h-5 w-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer" type="checkbox" />
                                </div>

                                <div className="flex items-center justify-between rounded-lg border border-[var(--color-border-light)] bg-slate-50/50 dark:bg-slate-800/50 p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-400">mail</span>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Email Reminders</span>
                                            <span className="text-xs text-slate-500">Send 24 hours before deadline</span>
                                        </div>
                                    </div>
                                    <input aria-label="Enable Email Reminders" defaultChecked className="h-5 w-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer" type="checkbox" />
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
                            <div className="glass-card p-6 shadow-sm">
                                <p className="text-sm italic text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] leading-relaxed text-center">
                                    &quot;To secure your appointment, a <span className="font-bold text-[var(--color-primary)]">50% non-refundable deposit</span> is required. Cancellations must be made at least <span className="font-bold text-[var(--color-primary)]">24 hours</span> prior to the scheduled time. Cancellations made within the 24-hour window or failure to attend (no-show) will result in <span className="font-bold text-[var(--color-primary)]">forfeiture of the deposit and a potential 100% service fee charge</span> to the card on file.&quot;
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
