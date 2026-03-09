"use client";

import { useState } from "react";

export default function LegalTemplatesClientPage() {
    const [activeTab, setActiveTab] = useState("Terms");

    const templates = [
        { id: 1, name: "General Terms of Service", region: "Global", version: "v2.1", updated: "2 months ago", status: "Published" },
        { id: 2, name: "Privacy Policy (GDPR)", region: "EU/UK", version: "v4.0", updated: "1 month ago", status: "Published" },
        { id: 3, name: "Liability Waiver - Sauna", region: "All", version: "v1.5", updated: "5 days ago", status: "Draft" },
        { id: 4, name: "Staff Employment Contract", region: "Rwanda", version: "v1.2", updated: "3 months ago", status: "Published" },
        { id: 5, name: "Client Consent - Massage & Vitality", region: "All", version: "v3.0", updated: "2 weeks ago", status: "Published" },
    ];

    return (
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Legal Templates & Compliance</h1>
                    <p className="text-slate-500 max-w-2xl text-lg">Manage legally-binding documents, privacy policies, and client waivers across all business regions.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-slate-900 rounded-xl text-sm font-bold hover:brightness-105 transition-all shadow-lg shadow-[var(--color-primary)]/20">
                    <span className="material-symbols-outlined text-lg">add</span>
                    New Template
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto">
                {["Templates", "Global Clauses", "Versioning", "Signatures"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab
                                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Document Name</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Region</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Version</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Last Updated</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {templates.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-[var(--color-primary)]/10 transition-colors">
                                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[var(--color-primary)]">description</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{doc.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400 font-medium">{doc.region}</td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-bold">{doc.version}</span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400 italic">{doc.updated}</td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${doc.status === "Published"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                }`}>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="text-slate-400 hover:text-[var(--color-primary)] p-2 rounded-lg hover:bg-[var(--color-primary)]/5 transition-all">
                                                <span className="material-symbols-outlined">edit_note</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-2xl text-white space-y-4">
                        <div className="size-12 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-slate-900">
                            <span className="material-symbols-outlined">verified</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Standardized Compliance</h3>
                            <p className="text-slate-400 text-sm mt-1 leading-relaxed">Ensure every branch operates under the same legal protection. Updates made here can be pushed to all regions instantly.</p>
                        </div>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                            Deploy Global Update
                            <span className="material-symbols-outlined text-lg">rocket_launch</span>
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold">Legal Signature Stats</h3>
                            <div className="flex items-end gap-3">
                                <span className="text-4xl font-black">94.8%</span>
                                <span className="text-green-500 text-xs font-bold mb-2 flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                    +2.4%
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">Document signing rate across all client check-ins this month.</p>
                        </div>
                        <div className="pt-4 flex gap-2 overflow-x-auto no-scrollbar">
                            <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--color-primary)] w-[94.8%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
