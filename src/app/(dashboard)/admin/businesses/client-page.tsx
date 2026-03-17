"use client";

import { useState } from "react";
import Link from "next/link";
import { EditBusinessModal } from "./EditBusinessModal";
import { DeleteBusinessModal } from "./DeleteBusinessModal";
import { updateBusinessAction } from "./actions";
import { ActionDropdown } from "@/components/ui/action-dropdown";

interface Business {
    id: string;
    name: string;
    taxId?: string | null;
    headquarters?: string | null;
    status: string;
    activeBranches: number;
    totalBranches: number;
    approvalStatus?: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
}

interface PageProps {
    branches: Business[];
    stats: {
        totalBranches: number;
        activeBranches: number;
    };
}

export default function AdminBranchesClientPage({ branches, stats }: PageProps) {
    const [toggling, setToggling] = useState<string | null>(null);
    const [editingBranch, setEditingBranch] = useState<Business | null>(null);
    const [deletingBranch, setDeletingBranch] = useState<Business | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    async function toggleStatus(id: string, currentStatus: string) {
        setToggling(id);
        const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        await updateBusinessAction(id, { status: newStatus as "ACTIVE" | "INACTIVE" });
        setToggling(null);
    }

    const filteredBranches = branches.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.headquarters?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-[1440px] mx-auto w-full p-6 space-y-6 animate-in fade-in duration-700">
            {/* Top Unified Header */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[var(--border-muted)] pb-6">
                <div className="flex items-center gap-6 flex-1 md:max-w-2xl w-full">
                    <div className="relative w-full text-[var(--text-muted)] focus-within:text-[var(--color-primary)] transition-all group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40 group-focus-within:opacity-100 group-focus-within:scale-110 transition-all">search</span>
                        <input
                            className="w-full bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-xl pl-12 pr-6 py-3 text-sm font-sans font-bold text-[var(--text-main)] focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)]/40 transition-all placeholder:text-[var(--text-muted)] placeholder:opacity-30 outline-none"
                            placeholder="Search businesses, headquarters, or tax IDs..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    <button aria-label="System Notifications" className="p-3 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)]/5 hover:text-[var(--text-main)] relative bg-[var(--bg-card)] border border-[var(--border-muted)] shadow-sm transition-all group">
                        <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">notifications</span>
                        <span className="absolute top-3 right-3 w-2 h-2 bg-[var(--color-primary)] rounded-full border-2 border-[var(--bg-app)] shadow-[0_0_8px_var(--color-primary)]"></span>
                    </button>
                    <Link 
                        href="/businesses/new"
                        className="flex items-center gap-2 bg-[var(--text-main)] text-[var(--bg-app)] px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-[1.05] active:scale-[0.98] transition-all shadow-xl shadow-black/10 whitespace-nowrap"
                    >
                        <span className="material-symbols-outlined text-lg font-bold">add_business</span>
                        Register New Business
                    </Link>
                </div>
            </header>

            {/* Title Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-2">
                <div className="space-y-1">
                    <h1 className="text-3xl lg:text-4xl font-display font-bold text-[var(--text-main)] tracking-tight">Business <span className="text-[var(--color-primary)]">Ecosystem</span></h1>
                    <p className="text-[10px] text-[var(--text-muted)] font-medium opacity-50 uppercase tracking-[0.2em]">Platform-wide oversight of registered corporates and operational hubs.</p>
                </div>
                <Link href="/businesses/approvals" className="flex items-center gap-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-white transition-all shadow-sm">
                    <span className="material-symbols-outlined text-base">verified_user</span>
                    Compliance Queue
                </Link>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetricCard
                    title="Registered Businesses"
                    value={stats.totalBranches.toString()}
                    trend="+4%"
                    subtitle="Platform Scale"
                    icon="corporate_fare"
                    color="primary"
                />
                <MetricCard
                    title="Active Operations"
                    value={stats.activeBranches.toString()}
                    trend={`${Math.round((stats.activeBranches / stats.totalBranches) * 100)}%`}
                    subtitle="System Health"
                    icon="query_stats"
                    color="primary"
                />
            </div>

            {/* High Density Table Section */}
            <div className="rounded-[2rem] border border-[var(--border-muted)] bg-[var(--bg-card)] overflow-hidden shadow-2xl shadow-black/5 mt-8">
                <div className="px-8 py-6 border-b border-[var(--border-muted)] flex items-center justify-between bg-[var(--bg-surface-muted)]/5">
                    <h3 className="text-xl font-display font-bold text-[var(--text-main)]">Business Organizations</h3>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[var(--bg-surface-muted)]/20 border border-[var(--border-muted)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                            {filteredBranches.length} Corporates
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-[var(--bg-surface-muted)]/10 text-[var(--text-muted)] uppercase text-[9px] font-display font-black tracking-[0.2em] border-b border-[var(--border-muted)] opacity-50">
                            <tr>
                                <th className="px-8 py-5">Organization</th>
                                <th className="px-4 py-5 text-center">Compliance</th>
                                <th className="px-4 py-5 text-center">Capacity</th>
                                <th className="px-4 py-5 text-center">Headquarters</th>
                                <th className="px-4 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {filteredBranches.length > 0 ? filteredBranches.map((biz) => (
                                <BranchHubRow
                                    key={biz.id}
                                    biz={biz}
                                    onEdit={() => setEditingBranch(biz)}
                                    onDelete={() => setDeletingBranch(biz)}
                                    onToggleStatus={() => toggleStatus(biz.id, biz.status)}
                                    isToggling={toggling === biz.id}
                                />
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center text-[var(--text-muted)] opacity-50 font-bold text-sm font-sans">
                                        No organizations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-6 bg-[var(--bg-surface-muted)]/5 border-t border-[var(--border-muted)]">
                     <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] opacity-40">System records auto-reconcile every 24 hours.</p>
                </div>
            </div>

            {/* Modals */}
            {editingBranch && (
                <EditBusinessModal
                    isOpen={!!editingBranch}
                    onClose={() => setEditingBranch(null)}
                    business={editingBranch}
                />
            )}
            {deletingBranch && (
                <DeleteBusinessModal
                    isOpen={!!deletingBranch}
                    onClose={() => setDeletingBranch(null)}
                    business={deletingBranch}
                />
            )}
        </div>
    );
}

function MetricCard({ title, value, trend, subtitle, icon, color }: { title: string, value: string, trend: string, subtitle: string, icon: string, color: 'primary' | 'amber' }) {
    return (
        <div className="p-8 rounded-[2rem] bg-[var(--bg-card)] border border-[var(--border-muted)] shadow-sm hover:shadow-2xl hover:border-[var(--color-primary)]/30 transition-all duration-700 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-[0.02] rounded-full blur-2xl -mr-16 -mt-16 group-hover:opacity-[0.05] transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="space-y-1">
                    <h4 className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-50 group-hover:opacity-100 transition-opacity">{title}</h4>
                    <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-30">{subtitle}</p>
                </div>
                <div className={`p-4 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 flex items-center justify-center border ${
                    color === 'primary' 
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20' 
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                    <span className="material-symbols-outlined text-xl font-bold">{icon}</span>
                </div>
            </div>
            
            <div className="flex items-baseline gap-3 relative z-10">
                <span className="text-4xl font-display font-bold text-[var(--text-main)] tracking-tight">{value}</span>
                <span className={`text-[9px] font-bold flex items-center gap-1 uppercase tracking-widest ${trend.startsWith('+') || !trend.startsWith('-') ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <span className="material-symbols-outlined text-xs font-bold">trending_up</span>
                    {trend}
                </span>
            </div>
        </div>
    );
}

interface BranchHubRowProps {
    biz: Business;
    onEdit: () => void;
    onDelete: () => void;
    onToggleStatus: () => void;
    isToggling: boolean;
}

function BranchHubRow({ biz, onEdit, onDelete, onToggleStatus, isToggling }: BranchHubRowProps) {
    return (
        <tr className="hover:bg-[var(--bg-surface-muted)]/5 transition-all group">
            <td className="px-8 py-5">
                <Link href={`/businesses/${biz.id}`} className="flex items-center gap-4 group/item">
                    <div className="size-10 rounded-xl bg-[var(--bg-surface-muted)]/40 border border-[var(--border-muted)] flex items-center justify-center text-[var(--color-primary)] font-display font-black shadow-inner text-base group-hover/item:scale-110 transition-transform">
                        {biz.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-display font-bold text-[var(--text-main)] text-base group-hover/item:text-[var(--color-primary)] transition-colors">{biz.name}</p>
                        <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest opacity-40 font-sans">ID: {biz.id}</p>
                    </div>
                </Link>
            </td>
            <td className="px-4 py-5 text-center">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest border ${
                    biz.approvalStatus === 'APPROVED' ? 'text-emerald-500 border-emerald-500/10 bg-emerald-500/5' :
                    biz.approvalStatus === 'PENDING' ? 'text-amber-500 border-amber-500/10 bg-amber-500/5' :
                    'text-rose-500 border-rose-500/10 bg-rose-500/5'
                }`}>
                    <span className="material-symbols-outlined text-[10px]">{biz.approvalStatus === 'APPROVED' ? 'verified' : biz.approvalStatus === 'PENDING' ? 'pending' : 'cancel'}</span>
                    {biz.approvalStatus || 'PENDING'}
                </span>
            </td>
            <td className="px-4 py-5 text-center">
                <div className="inline-flex flex-col items-center">
                    <span className="font-sans font-black text-xs text-[var(--text-main)]">{biz.activeBranches} / {biz.totalBranches}</span>
                    <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-40">Deployed Branches</span>
                </div>
            </td>
            <td className="px-4 py-5 text-center">
                <span className="text-[10px] font-sans font-bold text-[var(--text-muted)] uppercase tracking-wide opacity-60">
                    {biz.headquarters || "Not Set"}
                </span>
            </td>
            <td className="px-4 py-5 text-center">
                <button 
                    onClick={onToggleStatus}
                    disabled={isToggling}
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-display font-bold text-[10px] border transition-all ${
                        biz.status === 'ACTIVE' 
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                        : 'bg-[var(--bg-surface-muted)] text-[var(--text-muted)] border-[var(--border-muted)]'
                    }`}
                >
                    <span className={`size-1.5 rounded-full ${biz.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    {isToggling ? "..." : biz.status.charAt(0).toUpperCase() + biz.status.slice(1).toLowerCase()}
                </button>
            </td>
            <td className="px-8 py-5 text-right">
                <ActionDropdown 
                    actions={[
                        { label: "View Details", icon: "open_in_new", href: `/businesses/${biz.id}` },
                        { label: "Edit Record", icon: "edit", onClick: onEdit },
                        { label: "Delete Corporate", icon: "delete", onClick: onDelete, variant: "danger" }
                    ]} 
                />
            </td>
        </tr>
    );
}
