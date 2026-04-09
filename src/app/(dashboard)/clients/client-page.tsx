"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { useDebounce } from "@/hooks/use-debounce";
import ClientActionsDropdown from "@/components/clients/ClientActionsDropdown";
import { RefreshCw } from "lucide-react";

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
    status: string;
}

interface Metrics {
    all: number;
    members: number;
    walkIns: number;
    archived: number;
}

interface ClientListClientProps {
    initialClients: ClientData[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    metrics: Metrics;
    initialSearch: string;
    initialFilter: string;
}

export default function ClientListClient({ 
    initialClients, 
    totalCount, 
    currentPage, 
    totalPages, 
    metrics,
    initialSearch,
    initialFilter
}: ClientListClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [search, setSearch] = useState(initialSearch);
    const debouncedSearch = useDebounce(search, 500);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            // Reset to page 1 on search or filter change
            if (name !== 'page') params.delete('page');
            return params.toString();
        },
        [searchParams]
    );

    // Sync search to URL
    useEffect(() => {
        if (debouncedSearch !== initialSearch) {
            router.push(`${pathname}?${createQueryString('search', debouncedSearch)}`);
        }
    }, [debouncedSearch, pathname, router, createQueryString, initialSearch]);

    const handleFilterChange = (filter: string) => {
        router.push(`${pathname}?${createQueryString('filter', filter)}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    function exportCSV() {
        const headers = ["Name", "Phone", "Type", "Last Visit", "Total Spent (RWF)"];
        const rows = initialClients.map(c => [
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
                    onClick={() => handleFilterChange("all")}
                    className={`flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 font-bold text-sm transition-all ${initialFilter === "all" ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)] shadow-lg shadow-[var(--color-primary)]/20" : "bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] hover:border-[var(--color-primary)]"}`}
                >
                    All Clients <span className={`px-2 py-0.5 rounded-full text-xs ${initialFilter === "all" ? "bg-[var(--color-bg-dark)]/10" : "text-[var(--color-primary)] font-bold"}`}>{metrics.all}</span>
                </button>
                <button
                    onClick={() => handleFilterChange("MEMBER")}
                    className={`flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 text-sm font-bold transition-all ${initialFilter === "MEMBER" ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)] shadow-lg shadow-[var(--color-primary)]/20" : "bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] hover:border-[var(--color-primary)]"}`}
                >
                    Active Members <span className={`text-xs font-bold ${initialFilter === "MEMBER" ? "" : "text-[var(--color-primary)]"}`}>{metrics.members}</span>
                </button>
                <button
                    onClick={() => handleFilterChange("WALK_IN")}
                    className={`flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 text-sm font-bold transition-all ${initialFilter === "WALK_IN" ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)] shadow-lg shadow-[var(--color-primary)]/20" : "bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] hover:border-[var(--color-primary)]"}`}
                >
                    Walk-ins <span className={`text-xs font-bold ${initialFilter === "WALK_IN" ? "" : "text-[var(--color-primary)]"}`}>{metrics.walkIns}</span>
                </button>
                <button
                    onClick={() => handleFilterChange("ARCHIVED")}
                    className={`flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 text-sm font-bold transition-all ${initialFilter === "ARCHIVED" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] hover:border-amber-500"}`}
                >
                    Archived <span className={`text-xs font-bold ${initialFilter === "ARCHIVED" ? "" : "text-amber-500"}`}>{metrics.archived}</span>
                </button>
            </div>

            {/* Table Results */}
            <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] shadow-sm overflow-visible">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/50">
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Client</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Type</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Status / Membership</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Total Spent</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]/30">
                            {initialClients.length > 0 ? (
                                initialClients.map((client) => {
                                    const isMember = client.clientType === "MEMBER";
                                    return (
                                        <tr key={client.id} className="group hover:bg-[var(--bg-surface-muted)]/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <Link 
                                                    href={`/clients/${client.id}`} 
                                                    prefetch={false} 
                                                    className="flex items-center gap-4 group/name"
                                                    onClick={() => {
                                                        console.log('[DEBUG] Navigating to Profile:', client.id);
                                                        console.log('[DEBUG] SW Status:', navigator.serviceWorker.controller ? 'Controlled' : 'Uncontrolled');
                                                    }}
                                                >
                                                    <div className={`size-10 rounded-full flex items-center justify-center font-bold shrink-0 transition-transform group-hover/name:scale-110 ${isMember ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-[var(--bg-surface-muted)] text-[var(--text-muted)] opacity-60'}`}>
                                                        {client.fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[var(--text-main)] italic group-hover/name:text-[var(--color-primary)] transition-colors">{client.fullName}</p>
                                                        <p className="text-[10px] font-bold text-[var(--text-muted)] opacity-50 uppercase tracking-widest">{client.phone || "No Phone"}</p>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`w-fit px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${isMember ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-[var(--bg-surface-muted)] text-[var(--text-muted)] opacity-60'}`}>
                                                        {client.clientType.replace("_", " ")}
                                                    </span>
                                                    {client.status === "ARCHIVED" && (
                                                        <span className="w-fit px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter bg-amber-500/10 text-amber-600 rounded">Archived</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {isMember && client.membershipName ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-[var(--text-main)]">{client.membershipName}</span>
                                                        <span className="text-[10px] font-bold text-[var(--color-primary)] opacity-60 uppercase tracking-tighter">Expires: {client.membershipExpiry || "Never"}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-[var(--text-main)]">{client.lastVisit}</span>
                                                        <span className="text-[10px] font-bold text-[var(--text-muted)] opacity-50 uppercase tracking-tighter">Last Visit</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-[var(--text-main)]">{client.totalSpent.toLocaleString()} <span className="text-[10px] opacity-40">RWF</span></p>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    {client.status === "ARCHIVED" && (
                                                        <button 
                                                            onClick={async () => {
                                                                const { updateClientStatus } = await import("@/app/(dashboard)/clients/actions");
                                                                const res = await updateClientStatus(client.id, "ACTIVE");
                                                                if (res.error) alert(res.error);
                                                            }}
                                                            title="Restore Client"
                                                            className="h-10 px-4 flex items-center gap-2 rounded-xl bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-tighter border border-green-500/20"
                                                        >
                                                            <RefreshCw className="w-3.5 h-3.5" />
                                                            Restore
                                                        </button>
                                                    )}
                                                    <ClientActionsDropdown 
                                                        clientId={client.id} 
                                                        clientName={client.fullName}
                                                        status={client.status}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12">
                                        <EmptyState
                                            icon="group"
                                            title={search ? "No Matching Clients" : "No Clients Found"}
                                            description={search ? `No clients match "${search}". Try a different search term.` : "Your client records are currently empty."}
                                            mini
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-6 py-5 border-t border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/20 flex items-center justify-between">
                    <p className="text-sm font-bold text-[var(--text-muted)] italic">
                        Viewing <span className="text-[var(--text-main)]">{initialClients.length}</span> of <span className="text-[var(--text-main)]">{totalCount}</span> clients
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="h-10 px-4 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-card)] text-sm font-bold hover:border-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Previous
                        </button>
                        <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl h-10 px-3">
                            <span className="text-sm font-black text-[var(--color-primary)]">{currentPage}</span>
                            <span className="text-[var(--text-muted)] opacity-30 text-xs">/</span>
                            <span className="text-sm font-bold text-[var(--text-muted)]">{totalPages || 1}</span>
                        </div>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="h-10 px-4 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-card)] text-sm font-bold hover:border-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

