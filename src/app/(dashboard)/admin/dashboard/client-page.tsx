"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { BusinessStatusToggle } from "@/components/admin/business-status-toggle";

interface BusinessData {
    id: string;
    name: string;
    ownerName: string;
    ownerEmail: string;
    branchCount: number;
    status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
    createdAt: string;
    packageName: string;
    subscriptionRenewal: string | null;
}

interface DashboardStats {
    totalBusinesses: number;
    totalBranches: number;
    totalRevenue: number;
    activeUsers: number;
    systemHealth: number;
}

interface AdminDashboardClientProps {
    stats: DashboardStats;
    businesses: BusinessData[];
}

export default function AdminDashboardClient({ stats, businesses }: AdminDashboardClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "ARCHIVED">("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
    }, []);

    const itemsPerPage = 8; // made table more compact

    // Filter
    const filteredBusinesses = businesses.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesStatus = filterStatus === "ALL" || b.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage) || 1;
    const paginatedBusinesses = filteredBusinesses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getColors = (idx: number) => {
        const colors = [
            'bg-rose-500/10 text-rose-600',
            'bg-blue-500/10 text-blue-600',
            'bg-emerald-500/10 text-emerald-600',
            'bg-purple-500/10 text-purple-600',
        ];
        return colors[idx % colors.length];
    };

    return (
        <main className="flex flex-1 flex-col px-4 lg:px-6 py-6 gap-6 max-w-[1440px] mx-auto w-full relative overflow-hidden">
            {/* Atmospheric Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)] opacity-[0.03] blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-[var(--color-primary)] opacity-[0.02] blur-[100px] rounded-full animate-float pointer-events-none"></div>
            


            {/* Hero Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-[var(--border-muted)] pb-5">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl lg:text-3xl font-display font-bold text-[var(--text-main)] tracking-tight">
                            Platform <span className="text-[var(--color-primary)] opacity-50">&</span> Governance
                        </h1>
                        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <span className="size-1 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Integrity: High</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-[var(--text-muted)] font-medium opacity-60">Collective branch oversight and financial monitoring.</p>
                        <div className="hidden lg:flex items-center gap-1.5 text-[9px] font-bold text-[var(--text-muted)] opacity-30 uppercase tracking-[0.2em]">
                            <span className="material-symbols-outlined text-xs">sync</span>
                            {mounted ? <span>{format(new Date(), 'HH:mm')}</span> : null}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link 
                        href="/settings/roles"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-lg active:scale-95"
                    >
                        <span className="material-symbols-outlined text-base">security</span>
                        Permissions Matrix
                    </Link>
                    <Link 
                        href="/businesses/new"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-lg active:scale-95">
                        <span className="material-symbols-outlined text-base">add_box</span>
                        Register New Business
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AdminStatCard 
                    icon="domain" 
                    label="Active Businesses" 
                    value={stats.totalBusinesses.toLocaleString()} 
                    trend="+1" 
                    trendUp={true}
                />
                <AdminStatCard 
                    icon="account_balance_wallet" 
                    label="Total Revenue" 
                    value={`$${stats.totalRevenue.toLocaleString()}`} 
                    trend="Stable" 
                    trendUp={true}
                    showSparkline={true}
                />
                <AdminStatCard 
                    icon="auto_awesome" 
                    label="Platform Members" 
                    value={stats.activeUsers.toLocaleString()} 
                    trend="+4" 
                    trendUp={true}
                    showSparkline={true}
                />
                <AdminStatCard 
                    icon="vital_signs" 
                    label="System Health" 
                    value={`${stats.systemHealth}%`} 
                    trend="Optimal" 
                    trendUp={true}
                />
            </div>

            {/* Table Section */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-muted)] overflow-hidden shadow-sm flex flex-col">
                <div className="px-5 py-3.5 border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-display font-bold text-[var(--text-main)]">Business Portfolio</h2>
                            <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-white text-black tracking-[0.2em] uppercase">{filteredBusinesses.length} Businesses</span>
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] font-medium opacity-50 italic">Live feed of active platform businesses.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative group/search">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]/40 group-focus-within/search:text-[var(--color-primary)] transition-colors text-sm">search</span>
                            <input 
                                type="text" 
                                placeholder="Filter the network..." 
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-64 pl-9 pr-4 py-2 bg-[var(--bg-app)]/30 border border-[var(--border-muted)] rounded-xl text-[9px] font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-[var(--text-muted)]/20"
                            />
                        </div>
                        <div className="relative">
                            <select 
                                aria-label="Filter status"
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value as "ALL" | "ACTIVE" | "INACTIVE" | "ARCHIVED");
                                    setCurrentPage(1);
                                }}
                                className="appearance-none pl-4 pr-10 py-2 bg-[var(--bg-app)]/30 border border-[var(--border-muted)] rounded-xl text-[9px] font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/20 transition-all cursor-pointer"
                            >
                                <option value="ALL">Collective</option>
                                <option value="ACTIVE">Vitality</option>
                                <option value="INACTIVE">Hibernation</option>
                                <option value="ARCHIVED">Archived</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]/40 pointer-events-none text-sm">filter_list</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-[var(--border-muted)]">
                                <th className="px-5 py-3 text-[8px] font-display font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">Business Unit</th>
                                <th className="px-5 py-3 text-[8px] font-display font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">Proprietor</th>
                                <th className="px-5 py-3 text-[8px] font-display font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-center opacity-40">Package</th>
                                <th className="px-5 py-3 text-[8px] font-display font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-center opacity-40">Branches</th>
                                <th className="px-5 py-3 text-[8px] font-display font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">Pulse</th>
                                <th className="px-5 py-3 text-[8px] font-display font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-right opacity-40">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {paginatedBusinesses.map((b, idx) => (
                                <tr key={b.id} className="group/row hover:bg-white/[0.02] transition-colors cursor-pointer border-l-2 border-transparent hover:border-[var(--color-primary)]/40">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-9 rounded-xl flex items-center justify-center font-display font-bold text-xs border border-white/5 shadow-lg group-hover/row:scale-105 transition-all duration-300 ${getColors(idx)} relative overflow-hidden`}>
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                                                <div className="relative z-10">{getInitials(b.name)}</div>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="font-display font-bold text-sm text-[var(--text-main)] leading-tight tracking-tight group-hover/row:text-[var(--color-primary)] transition-colors">{b.name}</p>
                                                <div className="flex items-center gap-2 opacity-30">
                                                    <span className="text-[8px] font-black uppercase tracking-widest italic">{b.id.substring(b.id.length - 6).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-display font-bold text-[var(--text-main)] leading-tight">{b.ownerName}</p>
                                            <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider opacity-30 italic">
                                                {b.ownerEmail}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <div className="inline-flex items-center justify-center bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 px-2.5 py-1 rounded-lg">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">{b.packageName}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <div className="inline-flex items-center justify-center bg-[var(--bg-app)]/30 border border-[var(--border-muted)] px-2.5 py-1 rounded-lg">
                                            <span className="text-xs font-display font-bold text-white leading-none">{b.branchCount}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className={`size-1.5 rounded-full ${
                                                b.status === "ACTIVE" ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : b.status === "ARCHIVED" ? 'bg-gray-500 shadow-[0_0_8px_rgba(156,163,175,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                                            }`}></div>
                                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${
                                                b.status === "ACTIVE" ? 'text-emerald-500' : b.status === "ARCHIVED" ? 'text-gray-500' : 'text-rose-500'
                                            }`}>
                                                {b.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="h-7 border-r border-[var(--border-muted)] opacity-20 mr-2"></div>
                                            <div className="scale-[0.8] origin-right opacity-60 hover:opacity-100 transition-opacity">
                                                <BusinessStatusToggle businessId={b.id} initialStatus={b.status} />
                                            </div>
                                            <Link 
                                                href={`/businesses/${b.id}`}
                                                className="size-8 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--color-primary)] transition-all flex items-center justify-center border border-transparent hover:border-[var(--color-primary)]/20 shadow-sm"
                                            >
                                                <span className="material-symbols-outlined text-lg tracking-widest">open_in_new</span>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedBusinesses.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-muted)]">
                                        No businesses found matching the current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/5 flex items-center justify-between gap-4">
                    <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">
                        Showing {filteredBusinesses.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredBusinesses.length)} of {filteredBusinesses.length} Businesses
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="size-8 rounded-xl border border-[var(--border-muted)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)]/20 transition-all active:scale-[0.95] disabled:opacity-50 disabled:pointer-events-none group/pag">
                            <span className="material-symbols-outlined text-lg font-bold italic group-hover/pag:-translate-x-1 transition-transform">chevron_left</span>
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button 
                                    key={i + 1} 
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`size-8 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-[var(--text-main)] text-[var(--bg-app)] shadow-lg shadow-black/10' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="size-8 rounded-xl border border-[var(--border-muted)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)]/20 transition-all active:scale-[0.95] disabled:opacity-50 disabled:pointer-events-none group/pag">
                            <span className="material-symbols-outlined text-lg font-bold group-hover/pag:translate-x-1 transition-transform">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

function AdminStatCard({ 
    icon, 
    label, 
    value, 
    trend, 
    trendUp = true,
    showSparkline = false 
}: { 
    icon: string; 
    label: string; 
    value: string; 
    trend: string;
    trendUp?: boolean;
    showSparkline?: boolean;
}) {
    return (
        <div className="relative group/card bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-muted)] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-primary)] opacity-[0.02] blur-[2rem] group-hover/card:opacity-[0.05] transition-all duration-700"></div>
            
            <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/card:bg-[var(--color-primary)] group-hover/card:text-white transition-all duration-300 border border-white/5">
                        <span className="material-symbols-outlined text-lg">{icon}</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                        trendUp ? 'text-emerald-500 border border-emerald-500/10 bg-emerald-500/5' : 'text-rose-500 border border-rose-500/10 bg-rose-500/5'
                    }`}>
                        <span className="material-symbols-outlined text-[10px]">
                            {trendUp ? 'trending_up' : 'trending_down'}
                        </span>
                        {trend}
                    </div>
                </div>
                
                <div className="flex items-end justify-between gap-4">
                    <div className="space-y-0.5">
                        <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-30 m-0 leading-none">{label}</p>
                        <h3 className="text-xl font-display font-bold text-white tracking-tight group-hover/card:text-[var(--color-primary)] transition-colors leading-none">{value}</h3>
                    </div>
                    
                    {showSparkline && (
                        <div className="w-12 h-6 opacity-20 group-hover/card:opacity-40 transition-opacity">
                            <svg className="w-full h-full" viewBox="0 0 100 40">
                                <path 
                                    d="M0 30 Q 20 10, 40 25 T 80 5 T 100 20" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="4" 
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
