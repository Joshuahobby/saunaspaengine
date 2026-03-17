"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ActionDropdown } from "@/components/ui/action-dropdown";

interface Branch {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    status: string;
    employeeCount: number;
    serviceCount: number;
    clientCount: number;
    createdAt: string;
    businessName: string;
    businessId: string | null;
}

import { format } from "date-fns";
import { EditBranchModal } from "./EditBranchModal";
import { DeleteBranchModal } from "./DeleteBranchModal";

interface BranchesProps {
    branches: Branch[];
    stats: {
        totalRevenue: number;
        totalBranches: number;
        activeBranches: number;
    };
}

export default function AdminBranchesClientPage({ branches, stats }: BranchesProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [toggling, setToggling] = useState<string | null>(null);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);

    async function toggleStatus(id: string, currentStatus: string) {
        setToggling(id);
        try {
            await fetch(`/api/admin/businesses/branches/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE" }),
            });
            router.refresh();
        } catch (err) {
            console.error("Toggle error:", err);
        } finally {
            setToggling(null);
        }
    }

    const formatRevenue = (amount: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(amount);

    const filteredBranches = branches.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             b.businessName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <main className="flex flex-1 flex-col px-4 lg:px-6 py-8 gap-6 max-w-[1600px] mx-auto w-full overflow-y-auto">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[var(--bg-card)]/50 border border-[var(--border-muted)] p-4 rounded-2xl backdrop-blur-sm">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-serif font-bold text-[var(--text-main)] italic">
                        Operational Network
                    </h1>
                    <p className="text-xs text-[var(--text-muted)] italic font-medium opacity-60">Complete management and monitoring of all business branches.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-30">search</span>
                        <input 
                            type="text" 
                            placeholder="Find branch or business..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--bg-app)] border border-[var(--border-muted)] rounded-xl py-2 pl-9 pr-4 text-xs focus:border-[var(--color-primary)]/50 transition-all outline-none italic"
                        />
                    </div>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        title="Filter branches by status"
                        aria-label="Filter branches by status"
                        className="bg-[var(--bg-app)] border border-[var(--border-muted)] rounded-xl py-2 px-3 text-[10px] font-bold uppercase tracking-wider italic focus:border-[var(--color-primary)] outline-none cursor-pointer"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active Only</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>

                    <a 
                        href="/branches/new"
                        className="h-10 px-6 rounded-xl bg-[var(--text-main)] text-[var(--bg-app)] text-[10px] font-black tracking-widest uppercase flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/20"
                    >
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        Register Branch
                    </a>
                </div>
            </div>

            {/* High-Density KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard 
                    title="Platform Revenue"
                    value={formatRevenue(stats.totalRevenue)}
                    subtitle="Universal Yield"
                    icon="account_balance_wallet"
                />
                <MetricCard 
                    title="Active Branches"
                    value={stats.activeBranches.toString()}
                    subtitle={`OF ${stats.totalBranches} TOTAL`}
                    icon="storefront"
                />
                <MetricCard 
                    title="Total Guests"
                    value={branches.reduce((sum, b) => sum + b.clientCount, 0).toLocaleString()}
                    subtitle={`${branches.reduce((sum, b) => sum + b.employeeCount, 0)} STAFF`}
                    icon="hub"
                />
            </div>

            {/* High-Density Management Table */}
            <div className="flex-1 min-h-0 min-w-0 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-muted)] overflow-hidden flex flex-col shadow-sm">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10">
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic">Branch Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic">Owning Business</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic text-center">Operational Stats</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic text-right whitespace-nowrap">Registration Date</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]/30">
                            {filteredBranches.map((branch) => (
                                <tr key={branch.id} className="group hover:bg-[var(--color-primary)]/[0.02] transition-colors">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20 shrink-0">
                                                <span className="material-symbols-outlined text-sm text-[var(--color-primary)]">location_on</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-[var(--text-main)]">{branch.name}</span>
                                                <span className="text-[10px] text-[var(--text-muted)] italic opacity-60 truncate max-w-[150px]">{branch.address || "No address"}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="size-1.5 rounded-full bg-[var(--color-primary)]/40 shadow-sm shadow-[var(--color-primary)]/20"></span>
                                            <a 
                                                href={`/businesses/${branch.businessId}`}
                                                className="text-[11px] font-bold text-white/80 uppercase tracking-wide italic hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
                                                title={`View ${branch.businessName}`}
                                            >
                                                {branch.businessName}
                                                <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-black text-white">{branch.employeeCount}</span>
                                                <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] italic opacity-40 leading-none">Staff</span>
                                            </div>
                                            <div className="w-[1px] h-4 bg-[var(--border-muted)] opacity-20"></div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-black text-white">{branch.clientCount}</span>
                                                <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] italic opacity-40 leading-none">Guests</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => toggleStatus(branch.id, branch.status)}
                                                disabled={toggling === branch.id}
                                                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic border transition-all ${
                                                    branch.status === "ACTIVE" 
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                                    : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                                } ${toggling === branch.id ? "opacity-50 scale-95" : "hover:scale-105 active:scale-95 shadow-lg shadow-black/10"}`}
                                            >
                                                {toggling === branch.id ? "Syncing..." : branch.status}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <span className="text-[10px] font-mono text-[var(--text-muted)] opacity-50 uppercase tracking-tighter">
                                            {format(new Date(branch.createdAt), "MMM dd, yyyy")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <ActionDropdown 
                                            actions={[
                                                { label: "View Owning Business", icon: "corporate_fare", href: `/businesses/${branch.businessId}` },
                                                { label: "Modify Configuration", icon: "edit_square", onClick: () => setEditingBranch(branch) },
                                                { label: "Remove Branch", icon: "delete", onClick: () => setDeletingBranch(branch), variant: "danger" }
                                            ]} 
                                        />
                                    </td>
                                </tr>
                            ))}
                            {filteredBranches.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <span className="material-symbols-outlined text-5xl italic">database_off</span>
                                            <p className="text-sm font-serif italic text-[var(--text-muted)]">No branches found in the system archives.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {editingBranch && (
                <EditBranchModal
                    isOpen={!!editingBranch}
                    onClose={() => setEditingBranch(null)}
                    branch={editingBranch}
                />
            )}
            {deletingBranch && (
                <DeleteBranchModal
                    isOpen={!!deletingBranch}
                    onClose={() => setDeletingBranch(null)}
                    branch={deletingBranch}
                />
            )}
        </main>
    );
}

function MetricCard({ title, value, subtitle, icon }: { title: string, value: string, subtitle: string, icon: string }) {
    return (
        <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-card)]/40 p-5 shadow-sm hover:border-[var(--color-primary)]/30 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)] opacity-[0.02] rounded-full blur-2xl -mr-12 -mt-12 group-hover:opacity-[0.05] transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10 text-emerald-500">
                <div className="space-y-0.5">
                    <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic opacity-50 group-hover:opacity-100 transition-opacity">{title}</h4>
                    <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter opacity-30 italic leading-none">{subtitle}</p>
                </div>
                <div className="size-10 rounded-xl bg-[var(--color-primary)]/5 text-[var(--color-primary)] border border-[var(--border-muted)] flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                    <span className="material-symbols-outlined text-xl italic font-bold">{icon}</span>
                </div>
            </div>
            
            <div className="relative z-10">
                <span className="text-3xl font-serif font-black text-white italic tracking-tighter leading-none">{value}</span>
            </div>
        </div>
    );
}

