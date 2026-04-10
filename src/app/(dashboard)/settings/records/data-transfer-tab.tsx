"use client";

import React from "react";

export default function DataTransferTab() {
    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Ingest Section */}
                <div className="glass-card rounded-[2.5rem] border border-[var(--border-muted)] p-12 bg-[var(--bg-card)] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-6 transition-transform duration-700">
                        <span className="material-symbols-outlined text-9xl">upload_file</span>
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                        <div className="size-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black">
                            <span className="material-symbols-outlined text-3xl">add_to_photos</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold font-serif leading-tight">Asset Ingestion</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1 opacity-60 italic">Import Wizard</p>
                        </div>
                        <p className="text-sm font-bold text-[var(--text-muted)] leading-relaxed italic pr-12">
                            Bulk upload clients, products, or service records using our master CSV templates.
                        </p>
                        <button className="w-full py-4 bg-[var(--text-main)] text-[var(--bg-app)] rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] transition-transform">
                            Initialize Ingestion
                        </button>
                    </div>
                </div>

                {/* Extract Section */}
                <div className="glass-card rounded-[2.5rem] border border-[var(--border-muted)] p-12 bg-[var(--bg-card)] shadow-xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-6 transition-transform duration-700">
                        <span className="material-symbols-outlined text-9xl">download_for_offline</span>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="size-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-black">
                            <span className="material-symbols-outlined text-3xl">ios_share</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold font-serif leading-tight">Data Extraction</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1 opacity-60 italic">Export System</p>
                        </div>
                        <p className="text-sm font-bold text-[var(--text-muted)] leading-relaxed italic pr-12">
                            Package your business records into beautiful PDF reports or raw CSV snapshots for backup.
                        </p>
                        <button className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-transform">
                            Create Snapshot
                        </button>
                    </div>
                </div>
            </div>

            {/* Template Support */}
            <div className="p-10 border-2 border-dashed border-[var(--border-muted)] rounded-[3rem] flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-8">
                    <div className="size-14 rounded-full bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-emerald-500 transition-colors">
                        <span className="material-symbols-outlined font-black">description</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg font-serif italic">Structural Blueprints</h4>
                        <p className="text-xs font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest mt-1">Download CSV Templates</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2.5 bg-transparent text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest border border-[var(--border-muted)] rounded-xl hover:text-emerald-500 hover:border-emerald-500 transition-all">Client Template</button>
                    <button className="px-6 py-2.5 bg-transparent text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest border border-[var(--border-muted)] rounded-xl hover:text-emerald-500 hover:border-emerald-500 transition-all">Product Catalog</button>
                </div>
            </div>
        </div>
    );
}
