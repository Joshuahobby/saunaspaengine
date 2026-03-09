"use client";

import React from "react";

export default function DataImportWizardPage() {
    return (
        <div className="flex flex-1 justify-center py-2 lg:py-8 w-full">
            <div className="flex flex-col w-full max-w-[1120px] px-2 md:px-6">

                {/* Page Title & Progress */}
                <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-[-0.033em]">Data Import Wizard</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Step 2 of 3: Field Mapping. Match your CSV columns to our system fields.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--color-primary)]">help_outline</span>
                        <a className="text-[var(--color-primary)] text-sm font-medium hover:underline cursor-pointer">Download Sample Template</a>
                    </div>
                </div>

                {/* Stepper Breadcrumbs */}
                <div className="flex items-center gap-2 mb-8 text-sm flex-wrap">
                    <div className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 cursor-not-allowed">
                        <span className="material-symbols-outlined text-lg">check_circle</span> Upload File
                    </div>
                    <span className="text-slate-300">/</span>
                    <div className="text-[var(--color-primary)] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">radio_button_checked</span> Field Mapping
                    </div>
                    <span className="text-slate-300">/</span>
                    <div className="text-slate-400 dark:text-slate-500 font-medium">Review & Import</div>
                </div>

                {/* Progress Bar */}
                <div className="flex flex-col gap-2 mb-10 bg-[var(--color-surface-light)] p-6 rounded-xl border border-[var(--color-border-light)] shadow-sm">
                    <div className="flex gap-6 justify-between items-center">
                        <p className="text-slate-900 dark:text-slate-100 text-base font-semibold">Mapping Progress</p>
                        <p className="text-[var(--color-primary)] text-sm font-bold">66% Complete</p>
                    </div>
                    <div className="rounded-full bg-slate-100 dark:bg-slate-800 h-3 w-full overflow-hidden">
                        <div className="h-full w-[66%] rounded-full bg-[var(--color-primary)] transition-all duration-500"></div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm italic">8 out of 12 fields matched. Please map the remaining required fields.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Mapping Form & Data Preview Table container */}
                    <div className="xl:col-span-2 space-y-8">

                        {/* Mapping Form */}
                        <div className="bg-[var(--color-surface-light)] rounded-xl border border-[var(--color-border-light)] shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[var(--color-border-light)] flex justify-between items-center">
                                <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold">Map Your Columns</h2>
                                <span className="bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-400 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">Required Fields Missing</span>
                            </div>

                            <div className="divide-y divide-[var(--color-border-light)]">
                                {/* Field 1: Matched */}
                                <div className="p-6 flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">System Field: <span className="text-[var(--color-primary)]">First Name</span></label>
                                        <p className="text-xs text-slate-500">The primary given name of the customer.</p>
                                    </div>
                                    <div className="flex-1 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">compare_arrows</span>
                                        <select className="w-full rounded-lg border-[var(--color-border-light)] dark:bg-slate-800 text-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] p-2">
                                            <option>First_Name</option>
                                            <option>FName</option>
                                            <option>Given Name</option>
                                        </select>
                                        <span className="material-symbols-outlined text-[var(--color-primary)]">check_circle</span>
                                    </div>
                                </div>

                                {/* Field 2: Needs Mapping */}
                                <div className="p-6 flex flex-col md:flex-row md:items-center gap-4 bg-amber-50/50 dark:bg-amber-900/10">
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">System Field: <span className="text-[var(--color-primary)]">Phone Number</span> <span className="text-red-500">*</span></label>
                                        <p className="text-xs text-slate-500">Must be in E.164 format (+250...).</p>
                                    </div>
                                    <div className="flex-1 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">compare_arrows</span>
                                        <select defaultValue="" className="w-full rounded-lg border-red-300 dark:border-red-900/50 bg-white dark:bg-slate-800 text-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] p-2">
                                            <option disabled value="">Select CSV Column...</option>
                                            <option>Cust_Phone</option>
                                            <option>Mobile</option>
                                            <option>Contact_No</option>
                                        </select>
                                        <span className="material-symbols-outlined text-red-500">warning</span>
                                    </div>
                                </div>

                                {/* Field 3: Matched */}
                                <div className="p-6 flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">System Field: <span className="text-[var(--color-primary)]">Email Address</span> <span className="text-red-500">*</span></label>
                                        <p className="text-xs text-slate-500">Unique identifier for the user account.</p>
                                    </div>
                                    <div className="flex-1 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">compare_arrows</span>
                                        <select defaultValue="Email" className="w-full rounded-lg border-[var(--color-border-light)] dark:bg-slate-800 text-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] p-2">
                                            <option value="Email">Email</option>
                                            <option value="User_Email">User_Email</option>
                                            <option value="Electronic_Mail">Electronic_Mail</option>
                                        </select>
                                        <span className="material-symbols-outlined text-[var(--color-primary)]">check_circle</span>
                                    </div>
                                </div>

                                {/* Field 4: Matched */}
                                <div className="p-6 flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">System Field: <span className="text-[var(--color-primary)]">Company Name</span></label>
                                        <p className="text-xs text-slate-500">The business name associated with the lead.</p>
                                    </div>
                                    <div className="flex-1 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">compare_arrows</span>
                                        <select defaultValue="Org_Name" className="w-full rounded-lg border-[var(--color-border-light)] dark:bg-slate-800 text-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] p-2">
                                            <option value="Org_Name">Org_Name</option>
                                            <option value="Business">Business</option>
                                            <option value="Entity">Entity</option>
                                        </select>
                                        <span className="material-symbols-outlined text-[var(--color-primary)]">check_circle</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-[var(--color-border-light)] flex justify-between items-center">
                                <button className="px-6 py-2 rounded-lg border border-[var(--color-border-light)] text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-white dark:hover:bg-slate-700 transition-colors">Back to Upload</button>
                                <button className="px-8 py-2 rounded-lg bg-[var(--color-primary)] text-[#102220] font-bold text-sm hover:brightness-110 transition-all shadow-md">Continue to Review</button>
                            </div>
                        </div>

                        {/* Data Preview Table */}
                        <div className="bg-[var(--color-surface-light)] rounded-xl border border-[var(--color-border-light)] shadow-sm overflow-hidden mb-10 xl:mb-0">
                            <div className="px-6 py-4 border-b border-[var(--color-border-light)] bg-slate-50 dark:bg-slate-800/20">
                                <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold">Preview (First 5 Rows)</h2>
                                <p className="text-xs text-slate-500 mt-1">How your data looks with current mapping</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-max">
                                    <thead className="bg-[#102220]/5 dark:bg-[#102220]">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">First Name</th>
                                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Phone Number</th>
                                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Email Address</th>
                                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Company Name</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--color-border-light)]">
                                        <tr className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">Alice</td>
                                            <td className="px-6 py-4 text-red-500 italic">Unmapped</td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">alice@techcorp.com</td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">TechCorp Solutions</td>
                                        </tr>
                                        <tr className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">Bob</td>
                                            <td className="px-6 py-4 text-red-500 italic">Unmapped</td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">bob.smith@gmail.com</td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">Freelance</td>
                                        </tr>
                                        <tr className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">Charlie</td>
                                            <td className="px-6 py-4 text-red-500 italic">Unmapped</td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">c.johnson@innovate.io</td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">Innovate Inc</td>
                                        </tr>
                                        <tr className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">Diana</td>
                                            <td className="px-6 py-4 text-red-500 italic">Unmapped</td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">diana.p@webflow.com</td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">Webflow</td>
                                        </tr>
                                        <tr className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">Edward</td>
                                            <td className="px-6 py-4 text-red-500 italic">Unmapped</td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">e.norton@fightclub.com</td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">Paper St. Soap Co.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Help & Errors */}
                    <div className="xl:col-span-1 space-y-6">

                        {/* Errors Alert */}
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-6 rounded-xl">
                            <h3 className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold mb-3">
                                <span className="material-symbols-outlined">error</span>
                                Data Health Warnings
                            </h3>
                            <ul className="space-y-3">
                                <li className="text-sm text-red-600 dark:text-red-400/80 leading-relaxed">
                                    <strong>Phone Number:</strong> Column &apos;Cust_Phone&apos; not yet mapped. This field is required to create contacts.
                                </li>
                                <li className="text-sm text-red-600 dark:text-red-400/80 leading-relaxed">
                                    <strong>Invalid Format:</strong> Row 14 contains an invalid email address (missing &apos;@&apos;).
                                </li>
                            </ul>
                        </div>

                        {/* Tips */}
                        <div className="bg-[var(--color-surface-light)] border border-[var(--color-border-light)] p-6 rounded-xl shadow-sm">
                            <h3 className="text-slate-900 dark:text-slate-100 font-bold mb-4">Tips for Field Mapping</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-[var(--color-primary)]">lightbulb</span>
                                    <p className="text-sm text-slate-500 leading-relaxed">We automatically suggest matches based on header names.</p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-[var(--color-primary)]">info</span>
                                    <p className="text-sm text-slate-500 leading-relaxed">If you don&apos;t map a field, it will not be imported into our system.</p>
                                </div>
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-[var(--color-primary)]">contact_support</span>
                                    <p className="text-sm text-slate-500 leading-relaxed">Need help with complex migrations? <a className="text-[var(--color-primary)] underline cursor-pointer">Contact our support.</a></p>
                                </div>
                            </div>
                        </div>

                        {/* Summary Widget */}
                        <div className="bg-[rgba(19,236,164,0.05)] border border-[rgba(19,236,164,0.2)] p-6 rounded-xl">
                            <h3 className="text-slate-900 dark:text-slate-100 font-bold mb-4">Import Summary</h3>
                            <div className="flex justify-between py-2 text-sm">
                                <span className="text-slate-500">Total Rows Detected:</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300">1,248</span>
                            </div>
                            <div className="flex justify-between py-2 text-sm border-t border-[rgba(19,236,164,0.1)]">
                                <span className="text-slate-500">Valid Entries:</span>
                                <span className="text-emerald-500 font-bold">1,245</span>
                            </div>
                            <div className="flex justify-between py-2 text-sm border-t border-[rgba(19,236,164,0.1)]">
                                <span className="text-slate-500">Critical Errors:</span>
                                <span className="text-red-500 font-bold">3</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
