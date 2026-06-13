"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuditLogsTab from "./audit-logs-tab";
import DataTransferTab from "./data-transfer-tab";

export default function RecordsHistoryPage() {
    const [activeTab, setActiveTab] = useState<'audit' | 'transfer'>('audit');

    return (
        <main className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
            <div className="max-w-6xl mx-auto space-y-16 pb-24">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <Link href="/settings" className="size-10 rounded-xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors border border-[var(--border-muted)]">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] opacity-60">Control Center / Settings</span>
                </div>

                <div className="space-y-1 border-b border-[var(--border-muted)] pb-10">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-[var(--text-main)] tracking-tight">
                        Audit <span className="text-[var(--color-primary)]">Logs</span>
                    </h1>
                    <p className="text-sm font-medium text-[var(--text-muted)] opacity-60">
                        Immutable chronological record of platform operations and administrative actions.
                    </p>
                </div>

                <div className="flex w-full overflow-x-auto no-scrollbar pb-1">
                    <div className="flex gap-2 p-1 bg-[var(--bg-surface-muted)]/30 rounded-2xl w-fit border border-[var(--border-muted)] whitespace-nowrap">
                        <button 
                            onClick={() => setActiveTab('audit')}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'audit' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
                        >
                            Legacy & Audit
                        </button>
                        <button 
                            onClick={() => setActiveTab('transfer')}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'transfer' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
                        >
                            Data Transfer
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {activeTab === 'audit' ? <AuditLogsTab /> : <DataTransferTab />}
                </div>
            </div>
        </main>
    );
}
