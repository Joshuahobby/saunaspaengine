"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

interface ClientData {
    id: string;
    fullName: string;
    phone: string | null;
    clientType: string;
    qrCode: string | null;
    lastVisit: string;
    totalSpent: number;
    membershipName?: string;
    membershipExpiry?: string;
}

export default function ClientListClient({ clients }: { clients: ClientData[] }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "MEMBER" | "WALK_IN">("all");

    const totalClients = clients.length;
    const activeMembers = clients.filter(c => c.clientType === "MEMBER").length;
    const walkIns = clients.filter(c => c.clientType === "WALK_IN").length;

    const filtered = useMemo(() => {
        let result = clients;
        if (filter !== "all") {
            result = result.filter(c => c.clientType === filter);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(c =>
                c.fullName.toLowerCase().includes(q) ||
                (c.phone && c.phone.includes(q))
            );
        }
        return result;
    }, [clients, filter, search]);

    function exportCSV() {
        const headers = ["Name", "Phone", "Type", "Last Visit", "Total Spent (RWF)"];
        const rows = filtered.map(c => [
            c.fullName,
            c.phone || "",
            c.clientType,
            c.lastVisit,
            c.totalSpent.toString()
        ]);
        const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `clients_export_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-display font-bold leading-tight tracking-tight text-[var(--text-main)]">Client &amp; Membership Records</h1>
                    <p className="text-[var(--text-muted)] text-base font-bold mt-1">Manage and search your spa&apos;s active members and walk-in clients.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={exportCSV}
                        className="flex items-center justify-center rounded-xl h-12 px-5 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] text-[var(--text-main)] text-sm font-bold hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-dark)] transition-all"
                    >
                        <span className="material-symbols-outlined mr-2 text-lg text-[var(--color-primary)]">file_download</span> Export CSV
                    </button>
                    <Link href="/clients/new" className="flex items-center justify-center rounded-xl h-12 px-6 bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[var(--color-primary)]/20">
                        <span className="material-symbols-outlined mr-2 text-lg">person_add</span> Register New Client
                    </Link>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8 select-none">
                <label className="flex flex-col w-full">
                    <div className="flex w-full items-stretch rounded-2xl h-16 glass-surface border-[var(--border-main)] focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary)]/5 transition-all overflow-hidden shadow-sm">
                        <div className="text-[var(--color-primary)] flex items-center justify-center pl-6">
                            <span className="material-symbols-outlined text-2xl">search</span>
                        </div>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex w-full border-none bg-transparent focus:ring-0 h-full placeholder:text-[var(--text-muted)] placeholder:opacity-40 px-5 text-lg font-bold outline-none text-[var(--text-main)]"
                            placeholder="Search clients by name or phone number..."
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="flex items-center px-4 text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        )}
                    </div>
                </label>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    onClick={() => setFilter("all")}
                    className={`flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 font-bold text-sm transition-all ${filter === "all" ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)] shadow-lg shadow-[var(--color-primary)]/20" : "bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] hover:border-[var(--color-primary)]"}`}
                >
                    All Clients <span className={`px-2 py-0.5 rounded-full text-xs ${filter === "all" ? "bg-[var(--color-bg-dark)]/10" : "text-[var(--color-primary)] font-bold"}`}>{totalClients}</span>
                </button>
                <button
                    onClick={() => setFilter("MEMBER")}
                    className={`flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 text-sm font-bold transition-all ${filter === "MEMBER" ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)] shadow-lg shadow-[var(--color-primary)]/20" : "bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] hover:border-[var(--color-primary)]"}`}
                >
                    Active Members <span className={`text-xs font-bold ${filter === "MEMBER" ? "" : "text-[var(--color-primary)]"}`}>{activeMembers}</span>
                </button>
                <button
                    onClick={() => setFilter("WALK_IN")}
                    className={`flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 text-sm font-bold transition-all ${filter === "WALK_IN" ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)] shadow-lg shadow-[var(--color-primary)]/20" : "bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] hover:border-[var(--color-primary)]"}`}
                >
                    Walk-ins <span className={`text-xs font-bold ${filter === "WALK_IN" ? "" : "text-[var(--color-primary)]"}`}>{walkIns}</span>
                </button>
            </div>

            {/* Results */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((client) => {
                        const isMember = client.clientType === "MEMBER";
                        return (
                            <div key={client.id} className="glass-card p-6 group hover:-translate-y-2 transition-all duration-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`size-14 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${isMember ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-sm' : 'bg-[var(--bg-surface-muted)] text-[var(--text-muted)] opacity-60'}`}>
                                            <span className="material-symbols-outlined text-2xl font-bold">person</span>
                                        </div>
                                        <div>
                                            <h3 className="text-[var(--text-main)] font-display font-bold text-xl group-hover:text-[var(--color-primary)] transition-colors truncate max-w-[150px]">{client.fullName}</h3>
                                            <p className="text-[var(--text-muted)] opacity-50 text-[10px] font-bold uppercase tracking-widest leading-none mt-1">{client.phone || "No Phone"}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors ${isMember ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-[var(--bg-surface-muted)] text-[var(--text-muted)] opacity-60'}`}>
                                        {client.clientType.replace("_", " ")}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 bg-[var(--bg-surface-muted)] p-4 rounded-3xl mb-4 h-[110px] border border-[var(--border-muted)] group-hover:border-[var(--color-primary)]/20 transition-all duration-500">
                                    {client.qrCode ? (
                                        <div className="size-20 bg-white dark:bg-white/5 p-2 rounded-2xl border border-[var(--border-muted)] shadow-sm flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                                            <div className="text-[10px] text-center font-mono text-[var(--text-muted)] opacity-30 break-all leading-tight">
                                                {client.qrCode.substring(0, 30)}...
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="size-20 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-muted)] shadow-sm flex items-center justify-center text-[var(--color-primary)] opacity-40 shrink-0 group-hover:scale-105 transition-transform duration-500">
                                            <span className="material-symbols-outlined text-3xl">qr_code_2</span>
                                        </div>
                                    )}
                                    <div className="flex flex-col overflow-hidden">
                                        {isMember && client.membershipName ? (
                                            <>
                                                <span className="text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-widest truncate mb-1 opacity-60">{client.membershipName}</span>
                                                <span className="text-xl font-display font-bold text-[var(--text-main)]">Active Member</span>
                                                <span className="text-[var(--text-muted)] opacity-50 text-[10px] font-bold uppercase tracking-tighter truncate mt-1">Expires: {client.membershipExpiry || "Never"}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-[var(--text-muted)] opacity-60 text-[10px] font-bold uppercase tracking-widest mb-1">Last Visit</span>
                                                <span className="text-lg font-display font-bold text-[var(--text-main)] truncate">{client.lastVisit}</span>
                                                <span className="text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-widest mt-1">Spent: {client.totalSpent.toLocaleString()} RWF</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link href={`/clients/${client.id}`} className="flex-1 bg-[var(--bg-surface-muted)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-dark)] py-4 rounded-xl text-sm font-bold transition-all text-center flex items-center justify-center text-[var(--text-main)] border border-[var(--border-muted)]">
                                        View Profile
                                    </Link>
                                    <button className="w-14 flex items-center justify-center bg-[var(--bg-surface-muted)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-dark)] rounded-xl transition-all text-[var(--text-main)] border border-[var(--border-muted)]">
                                        <span className="material-symbols-outlined text-xl">calendar_month</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <Link href="/clients/new" className="flex flex-col items-center justify-center bg-[var(--bg-surface-muted)]/50 border-2 border-dashed border-[var(--border-muted)] rounded-3xl p-8 min-h-[350px] hover:border-[var(--color-primary)] transition-all cursor-pointer group">
                        <div className="size-20 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-muted)] opacity-40 group-hover:text-[var(--color-primary)] group-hover:opacity-100 mb-6 transition-all shadow-sm ring-1 ring-[var(--color-primary)]/5 duration-500 group-hover:rotate-90">
                            <span className="material-symbols-outlined text-5xl">add</span>
                        </div>
                        <p className="font-display font-bold text-xl text-[var(--text-main)] tracking-tight">Add New Client</p>
                        <p className="text-[var(--text-muted)] text-sm text-center mt-2 font-medium">Quickly register a new member or guest</p>
                    </Link>
                </div>
            ) : (
                <div className="mt-8">
                    <EmptyState
                        icon="group"
                        title={search ? "No Matching Clients" : "No Clients Found"}
                        description={search ? `No clients match "${search}". Try a different search term.` : "Your client records are currently empty. Add your first member or walk-in guest."}
                        actionLabel="Register New Client"
                        actionHref="/clients/new"
                    />
                </div>
            )}
        </div>
    );
}
