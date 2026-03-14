"use client";

import React from "react";

export default function DataImportWizardPage() {
    return (
        <div className="flex flex-1 justify-center py-2 lg:py-8 w-full">
            <div className="flex flex-col w-full max-w-[1120px] px-2 md:px-6">

                {/* Page Title & Progress */}
                <div className="flex flex-wrap justify-between items-end gap-6 mb-10">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-display font-bold text-[var(--text-main)] tracking-tight">Data <span className="text-[var(--color-primary)] opacity-50">Import</span> Wizard</h1>
                        <p className="text-lg font-bold text-[var(--text-muted)]">Step <span className="text-[var(--color-primary)]">02</span> / 03: Field Mapping. <span className="opacity-60">Architect your data connections.</span></p>
                    </div>
                    <div className="flex items-center gap-4 bg-[var(--bg-card)] px-6 py-3 rounded-2xl border border-[var(--border-muted)] shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                        <span className="material-symbols-outlined text-[var(--color-primary)] group-hover:rotate-12 transition-transform font-bold">description</span>
                        <a className="text-[var(--text-main)] text-sm font-bold group-hover:text-[var(--color-primary)] transition-colors">Download Master Template</a>
                    </div>
                </div>

                {/* Stepper Breadcrumbs */}
                <div className="flex items-center gap-4 mb-10 text-xs flex-wrap">
                    <div className="text-[var(--text-muted)] font-bold flex items-center gap-2 opacity-50 cursor-not-allowed tracking-widest uppercase">
                        <span className="material-symbols-outlined text-xl text-[var(--color-primary)]">check_circle</span> Asset Upload
                    </div>
                    <span className="text-[var(--border-muted)] text-xl">/</span>
                    <div className="text-[var(--color-primary)] font-display font-bold flex items-center gap-2 tracking-widest uppercase bg-[var(--color-primary)]/5 px-4 py-2 rounded-full border border-[var(--color-primary)]/20 shadow-lg shadow-[var(--color-primary)]/5">
                        <span className="material-symbols-outlined text-xl font-bold">center_focus_strong</span> Mapping Architecture
                    </div>
                    <span className="text-[var(--border-muted)] text-xl">/</span>
                    <div className="text-[var(--text-muted)] font-bold flex items-center gap-2 opacity-40 tracking-widest uppercase">
                        <span className="material-symbols-outlined text-xl">rule</span> Final Review
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex flex-col gap-6 mb-12 bg-[var(--bg-card)] p-10 rounded-[2.5rem] border border-[var(--border-muted)] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 -mr-32 -mt-32 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                    <div className="flex gap-6 justify-between items-end relative z-10">
                        <p className="text-2xl font-display font-bold text-[var(--text-main)]">Structural Alignment Progress</p>
                        <p className="text-[var(--color-primary)] text-xl font-display font-bold animate-pulse">66% Complete</p>
                    </div>
                    <div className="rounded-full bg-[var(--bg-surface-muted)] h-4 w-full overflow-hidden border border-[var(--border-muted)] p-1 relative z-10">
                        <div className="h-full w-[66%] rounded-full bg-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20 transition-all duration-1000 ease-out"></div>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm font-bold relative z-10 leading-relaxed">8 out of 12 fields architecturally matched. <span className="font-bold text-[var(--text-main)]">4 critical links</span> require manual verification to ensure data integrity.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Mapping Form & Data Preview Table container */}
                    <div className="xl:col-span-2 space-y-8">

                        {/* Mapping Form */}
                        <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] shadow-sm overflow-hidden group/form">
                            <div className="px-10 py-8 border-b border-[var(--border-muted)] flex justify-between items-center bg-[var(--bg-surface-muted)]/10">
                                <h2 className="text-2xl font-display font-bold text-[var(--text-main)]">Logic Mapping Configuration</h2>
                                <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] px-4 py-1.5 rounded-full font-bold uppercase tracking-[0.2em] animate-pulse">Critical Link Required</span>
                            </div>

                            <div className="divide-y divide-[var(--border-muted)]">
                                {/* Field 1: Matched */}
                                <div className="p-10 flex flex-col md:flex-row md:items-center gap-8 group/field hover:bg-[var(--bg-surface-muted)]/10 transition-all border-l-4 border-transparent hover:border-[var(--color-primary)]">
                                    <div className="flex-1">
                                        <label className="block text-lg font-display font-bold text-[var(--text-main)]">System Field: <span className="text-[var(--color-primary)]">First Name</span></label>
                                        <p className="text-sm text-[var(--text-muted)] font-bold opacity-60 mt-1">Foundational identity of the client.</p>
                                    </div>
                                    <div className="flex-1 flex items-center gap-6">
                                        <span className="material-symbols-outlined text-[var(--color-primary)] opacity-40 font-bold">sync_alt</span>
                                        <select title="Map First Name Field" className="w-full h-14 px-6 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/50 text-sm font-bold text-[var(--text-main)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all">
                                            <option>First_Name</option>
                                            <option>FName</option>
                                            <option>Given Name</option>
                                        </select>
                                        <span className="material-symbols-outlined text-[var(--color-primary)] font-bold text-2xl">verified</span>
                                    </div>
                                </div>

                                {/* Field 2: Needs Mapping */}
                                <div className="p-10 flex flex-col md:flex-row md:items-center gap-8 group/field bg-red-500/[0.02] border-l-4 border-red-500/20">
                                    <div className="flex-1">
                                        <label className="block text-lg font-serif font-bold text-[var(--text-main)] italic">System Field: <span className="text-[var(--color-primary)]">Phone Number</span> <span className="text-red-500">*</span></label>
                                        <p className="text-sm text-[var(--text-muted)] italic font-medium opacity-60 mt-1">E.164 standard required (+254...).</p>
                                    </div>
                                    <div className="flex-1 flex items-center gap-6">
                                        <span className="material-symbols-outlined text-red-500 opacity-40 font-bold italic">sync_problem</span>
                                        <select title="Map Phone Number Field" defaultValue="" className="w-full h-14 px-6 rounded-2xl border-2 border-red-500/20 bg-red-500/[0.03] text-sm font-bold text-[var(--text-main)] italic focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all">
                                            <option disabled value="">Select Asset Column...</option>
                                            <option>Cust_Phone</option>
                                            <option>Mobile</option>
                                            <option>Contact_No</option>
                                        </select>
                                        <span className="material-symbols-outlined text-red-500 font-bold italic text-2xl animate-pulse">warning</span>
                                    </div>
                                </div>

                                {/* Field 3: Matched */}
                                <div className="p-10 flex flex-col md:flex-row md:items-center gap-8 group/field hover:bg-[var(--bg-surface-muted)]/10 transition-all border-l-4 border-transparent hover:border-[var(--color-primary)]">
                                    <div className="flex-1">
                                        <label className="block text-lg font-display font-bold text-[var(--text-main)]">System Field: <span className="text-[var(--color-primary)]">Email Address</span> <span className="text-red-500">*</span></label>
                                        <p className="text-sm text-[var(--text-muted)] font-bold opacity-60 mt-1">Digital signature for account access.</p>
                                    </div>
                                    <div className="flex-1 flex items-center gap-6">
                                        <span className="material-symbols-outlined text-[var(--color-primary)] opacity-40 font-bold">sync_alt</span>
                                        <select title="Map Email Field" defaultValue="Email" className="w-full h-14 px-6 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/50 text-sm font-bold text-[var(--text-main)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all">
                                            <option value="Email">Email</option>
                                            <option value="User_Email">User_Email</option>
                                            <option value="Electronic_Mail">Electronic_Mail</option>
                                        </select>
                                        <span className="material-symbols-outlined text-[var(--color-primary)] font-bold text-2xl">verified</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[var(--bg-surface-muted)]/20 p-8 border-t border-[var(--border-muted)] flex justify-between items-center gap-6">
                                <button className="px-10 py-4 rounded-2xl border border-[var(--border-muted)] text-[var(--text-muted)] font-bold text-sm hover:bg-[var(--bg-card)] hover:text-[var(--text-main)] transition-all italic">Revisit Upload</button>
                                <button className="flex items-center gap-3 px-12 py-4 rounded-2xl bg-[var(--text-main)] text-[var(--bg-app)] font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[var(--text-main)]/10 italic">
                                    Continue to Final Review
                                    <span className="material-symbols-outlined text-lg font-bold">arrow_forward</span>
                                </button>
                            </div>
                        </div>

                        {/* Data Preview Table */}
                        <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] shadow-sm overflow-hidden mb-10 xl:mb-0">
                            <div className="px-10 py-8 border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10">
                                <h2 className="text-2xl font-serif font-bold text-[var(--text-main)] italic text-center md:text-left">Architecture Preview <span className="text-lg opacity-40 not-italic font-sans font-medium">(First 5 Assets)</span></h2>
                                <p className="text-sm text-[var(--text-muted)] italic font-medium mt-1 text-center md:text-left">Immediate visualization of mapping logic.</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-max">
                                    <thead>
                                        <tr className="border-b border-[var(--border-muted)]">
                                            <th className="px-10 py-6 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] italic">Structural Name</th>
                                            <th className="px-10 py-6 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] italic">Contact Link</th>
                                            <th className="px-10 py-6 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] italic">Digital Identity</th>
                                            <th className="px-10 py-6 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] italic">Asset Origin</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-muted)]/50">
                                        {[
                                            { name: "Alice", phone: "Unmapped", email: "alice@techcorp.com", company: "TechCorp Solutions" },
                                            { name: "Bob", phone: "Unmapped", email: "bob.smith@gmail.com", company: "Freelance" },
                                            { name: "Charlie", phone: "Unmapped", email: "c.johnson@innovate.io", company: "Innovate Inc" },
                                            { name: "Diana", phone: "Unmapped", email: "diana.p@webflow.com", company: "Webflow" },
                                            { name: "Edward", phone: "Unmapped", email: "e.norton@fightclub.com", company: "Paper St. Soap Co." }
                                        ].map((row, i) => (
                                            <tr key={i} className="text-sm hover:bg-[var(--bg-surface-muted)]/20 transition-all font-medium italic group/row">
                                                <td className="px-10 py-5 text-[var(--text-main)] font-bold group-hover/row:text-[var(--color-primary)] transition-colors">{row.name}</td>
                                                <td className="px-10 py-5 text-red-500 opacity-60 font-bold tracking-widest uppercase text-[10px]">{row.phone}</td>
                                                <td className="px-10 py-5 text-[var(--text-main)]">{row.email}</td>
                                                <td className="px-10 py-5 text-[var(--text-muted)]">{row.company}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Help & Errors */}
                    <div className="xl:col-span-1 space-y-8">

                        {/* Errors Alert */}
                        <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] shadow-lg shadow-red-500/5 group/alert">
                            <h3 className="flex items-center gap-3 text-red-500 font-serif font-bold text-xl mb-4 italic">
                                <span className="material-symbols-outlined text-2xl font-bold animate-pulse">crisis_alert</span>
                                Health Audit Warnings
                            </h3>
                            <ul className="space-y-6">
                                <li className="text-sm text-[var(--text-main)] italic font-bold leading-relaxed border-l-2 border-red-500/30 pl-4">
                                    <strong>Phone Connectivity:</strong> <span className="opacity-70">&apos;Cust_Phone&apos; unmapped. Systems requires terminal identity.</span>
                                </li>
                                <li className="text-sm text-[var(--text-main)] italic font-bold leading-relaxed border-l-2 border-red-500/30 pl-4">
                                    <strong>Format Anomaly:</strong> <span className="opacity-70">Row 14 contains an invalid email signature.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Tips */}
                        <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all duration-500">
                            <h3 className="text-xl font-serif font-bold text-[var(--text-main)] mb-6 italic">Architecture Wisdom</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4 group/tip">
                                    <span className="material-symbols-outlined text-[var(--color-primary)] font-bold italic group-hover:scale-110 transition-transform">auto_awesome</span>
                                    <p className="text-sm text-[var(--text-muted)] leading-relaxed italic font-medium">Intuitive algorithms suggest matches based on header semantics.</p>
                                </div>
                                <div className="flex gap-4 group/tip">
                                    <span className="material-symbols-outlined text-[var(--color-primary)] font-bold italic group-hover:scale-110 transition-transform">visibility_off</span>
                                    <p className="text-sm text-[var(--text-muted)] leading-relaxed italic font-medium">Unlinked fields will remain in the void and not enter the system.</p>
                                </div>
                                <div className="flex gap-4 group/tip">
                                    <span className="material-symbols-outlined text-[var(--color-primary)] font-bold italic group-hover:scale-110 transition-transform">support_agent</span>
                                    <p className="text-sm text-[var(--text-muted)] leading-relaxed italic font-medium">Navigating a complex migration? <a className="text-[var(--color-primary)] underline cursor-pointer font-bold">Summon support.</a></p>
                                </div>
                            </div>
                        </div>

                        {/* Summary Widget */}
                        <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 p-8 rounded-[2rem] shadow-inner">
                            <h3 className="text-xl font-serif font-bold text-[var(--text-main)] mb-6 italic">Asset Distribution Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between py-2 text-sm italic font-bold">
                                    <span className="text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Total Assets:</span>
                                    <span className="text-[var(--text-main)]">1,248</span>
                                </div>
                                <div className="flex justify-between py-2 text-sm italic font-bold border-t border-[var(--color-primary)]/10">
                                    <span className="text-emerald-500/70 uppercase tracking-wider text-[10px]">Pristine Entries:</span>
                                    <span className="text-emerald-500">1,245</span>
                                </div>
                                <div className="flex justify-between py-2 text-sm italic font-bold border-t border-[var(--color-primary)]/10">
                                    <span className="text-red-500/70 uppercase tracking-wider text-[10px]">Critical Anomalies:</span>
                                    <span className="text-red-500">3</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
