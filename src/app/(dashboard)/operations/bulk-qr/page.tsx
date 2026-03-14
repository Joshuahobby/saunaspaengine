"use client";

import React, { useState } from "react";

const DEMO_CLIENTS = [
    { id: 1, initials: "AS", name: "Alexandru Smith", memberId: "#SPA-88219-PL", status: "Active", selected: true },
    { id: 2, initials: "BM", name: "Beatriz Martinez", memberId: "#SPA-11023-GD", status: "Active", selected: true },
    { id: 3, initials: "CR", name: "Catherine Reed", memberId: "#SPA-55291-SL", status: "Expiring", selected: true },
    { id: 4, initials: "DT", name: "David Thompson", memberId: "#SPA-99012-PL", status: "Inactive", selected: false },
];

export default function BulkQRPage() {
    const [clients, setClients] = useState(DEMO_CLIENTS);
    const [labelSize, setLabelSize] = useState<"sticker" | "a4">("sticker");
    const [includeLogo, setIncludeLogo] = useState(true);
    const [includeName, setIncludeName] = useState(true);
    const [showId, setShowId] = useState(true);

    const selectedCount = clients.filter(c => c.selected).length;

    const toggleClient = (id: number) => {
        setClients(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
    };
    const toggleAll = () => {
        const allSel = clients.every(c => c.selected);
        setClients(prev => prev.map(c => ({ ...c, selected: !allSel })));
    };

    return (
        <div className="flex flex-col min-h-0 flex-1">
            {/* Content Header */}
            <div className="p-6 lg:p-8 border-b border-[var(--border-muted)]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Bulk QR Code Printing</h1>
                        <p className="text-[var(--text-muted)] mt-1">Select clients and customize label layout for high-quality bulk printing.</p>
                    </div>
                    <button className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:opacity-90 text-[var(--bg-app)] px-6 py-3 rounded-xl font-bold transition-all shadow-xl shadow-[var(--color-primary)]/25">
                        <span className="material-symbols-outlined">picture_as_pdf</span>
                        Download PDF for Printing
                    </button>
                </div>
                {/* Filters */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 bg-[var(--color-primary)]/5 p-4 rounded-xl border border-[var(--color-primary)]/10">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Membership Category</label>
                        <select 
                            title="Membership Category"
                            aria-label="Filter by Membership Category"
                            className="rounded-lg border-[var(--color-primary)]/20 bg-[var(--bg-card)] text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-main)]"
                        >
                            <option>All Categories</option>
                            <option>Platinum Premium</option>
                            <option>Gold Member</option>
                            <option>Silver Access</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Status</label>
                        <select 
                            title="Filter by Status"
                            aria-label="Filter clients by status"
                            className="rounded-lg border-[var(--color-primary)]/20 bg-[var(--bg-card)] text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-main)]"
                        >
                            <option>Active Only</option>
                            <option>All Clients</option>
                            <option>Expiring Soon</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button className="w-full bg-[var(--bg-surface-muted)]/50 hover:bg-[var(--bg-surface-muted)] text-[var(--text-main)] py-2 rounded-lg font-semibold text-sm transition-colors">Apply Filters</button>
                    </div>
                </div>
            </div>

            {/* Two-Column Workspace */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-6 lg:p-8 gap-8">
                {/* Left: Client Selector */}
                <div className="flex-1 flex flex-col glass-card border border-[var(--border-muted)] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10 flex justify-between items-center">
                        <h3 className="font-bold text-[var(--text-main)]">Client Selection ({selectedCount} selected)</h3>
                        <div className="flex gap-2">
                            <button onClick={toggleAll} className="text-xs text-[var(--color-primary)] font-bold hover:underline">Select All</button>
                            <span className="text-[var(--border-muted)]">|</span>
                            <button onClick={() => setClients(prev => prev.map(c => ({ ...c, selected: false })))} className="text-xs text-[var(--text-muted)] font-bold hover:underline">Clear</button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-muted)]">
                        <div className="grid grid-cols-[48px_1fr_1fr_120px] px-6 py-3 bg-[var(--bg-surface-muted)]/10 text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">
                            <div><input id="select-all-clients" title="Select All Clients" aria-label="Toggle selection for all filtered clients" checked={clients.every(c => c.selected)} onChange={toggleAll} className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] h-4 w-4" type="checkbox" /></div>
                            <div>Client Name</div>
                            <div>Membership ID</div>
                            <div className="text-right">Status</div>
                        </div>
                        {clients.map(c => (
                            <div key={c.id} className="grid grid-cols-[48px_1fr_1fr_120px] px-6 py-4 hover:bg-[var(--color-primary)]/5 transition-colors items-center">
                                <input id={`client-${c.id}`} title={`Select ${c.name}`} aria-label={`Toggle selection for ${c.name}`} checked={c.selected} onChange={() => toggleClient(c.id)} className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] h-4 w-4" type="checkbox" />
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[var(--bg-surface-muted)]/30 flex items-center justify-center text-xs font-bold text-[var(--text-main)]">{c.initials}</div>
                                    <span className="text-sm font-semibold text-[var(--text-main)]">{c.name}</span>
                                </div>
                                <div className="text-sm text-[var(--text-muted)] font-mono">{c.memberId}</div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${c.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : c.status === "Expiring" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>{c.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Controls & Preview */}
                <div className="w-full lg:w-[400px] flex flex-col gap-6">
                    {/* Customization Settings */}
                    <div className="glass-card border border-[var(--border-muted)] p-6 shadow-sm">
                        <h3 className="font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[var(--color-primary)]">edit_attributes</span>
                            Customize Labels
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: "Include Spa Logo", value: includeLogo, setter: setIncludeLogo },
                                { label: "Include Client Name", value: includeName, setter: setIncludeName },
                                { label: "Show Membership ID", value: showId, setter: setShowId },
                            ].map((toggle) => (
                                <div key={toggle.label} className="flex items-center justify-between">
                                    <span className="text-sm text-[var(--text-muted)]">{toggle.label}</span>
                                    <button title={`Toggle ${toggle.label}`} aria-label={`Toggle ${toggle.label}`} onClick={() => toggle.setter(!toggle.value)} className={`w-9 h-5 rounded-full relative transition-colors ${toggle.value ? "bg-[var(--color-primary)]" : "bg-[var(--bg-surface-muted)]/50"}`}>
                                        <div className={`absolute top-0.5 size-4 bg-white rounded-full transition-transform shadow-sm ${toggle.value ? "translate-x-4" : "translate-x-0.5"}`}></div>
                                    </button>
                                </div>
                            ))}
                            <div className="pt-2">
                                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Label Size</label>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <button onClick={() => setLabelSize("sticker")} className={`px-3 py-2 text-xs font-bold border-2 rounded-lg transition-colors ${labelSize === "sticker" ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "border-transparent bg-[var(--bg-surface-muted)]/50 text-[var(--text-muted)]"}`}>2&quot; x 2&quot; Stickers</button>
                                    <button onClick={() => setLabelSize("a4")} className={`px-3 py-2 text-xs font-bold border-2 rounded-lg transition-colors ${labelSize === "a4" ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "border-transparent bg-[var(--bg-surface-muted)]/50 text-[var(--text-muted)]"}`}>A4 Sheet (8x3)</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live Preview */}
                    <div className="flex-1 glass-card border border-[var(--border-muted)] overflow-hidden shadow-lg flex flex-col">
                        <div className="px-4 py-3 bg-[var(--bg-surface-muted)]/10 flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Live Print Preview</span>
                            <div className="flex gap-1">
                                <button title="Zoom In" aria-label="Zoom in preview" className="p-1 hover:bg-[var(--bg-surface-muted)]/50 rounded text-[var(--text-muted)]"><span className="material-symbols-outlined text-lg">zoom_in</span></button>
                                <button title="Zoom Out" aria-label="Zoom out preview" className="p-1 hover:bg-[var(--bg-surface-muted)]/50 rounded text-[var(--text-muted)]"><span className="material-symbols-outlined text-lg">zoom_out</span></button>
                            </div>
                        </div>
                        <div className="flex-1 p-6 bg-[var(--bg-surface-muted)]/10 overflow-y-auto flex justify-center">
                            <div className="w-full max-w-[280px] aspect-[8.5/11] bg-white shadow-2xl p-4 grid grid-cols-2 gap-4 content-start">
                                {clients.filter(c => c.selected).map((c) => (
                                    <div key={c.id} className="border border-slate-200 p-2 flex flex-col items-center justify-center bg-white rounded shadow-sm">
                                        {includeLogo && (
                                            <div className="w-full flex justify-end mb-1">
                                                <span className="material-symbols-outlined text-xs text-[var(--color-primary)]">spa</span>
                                            </div>
                                        )}
                                        <div className="w-16 h-16 bg-slate-100 flex items-center justify-center border border-slate-200 mb-2">
                                            <span className="material-symbols-outlined text-slate-800 text-4xl">qr_code_2</span>
                                        </div>
                                        {includeName && <div className="text-[8px] font-bold text-slate-800 truncate w-full text-center">{c.name}</div>}
                                        {showId && <div className="text-[6px] font-mono text-slate-500">{c.memberId}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
