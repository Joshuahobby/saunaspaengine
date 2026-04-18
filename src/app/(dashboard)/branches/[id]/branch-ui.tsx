"use client";

import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { 
    MapPin, TrendingUp, Users, 
    Star, Target, Clock, Zap,
    ChevronRight, Map, Phone,
    Mail, Briefcase, Award,
    Activity, BarChart3, Settings,
    Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { updateBranchAction } from "../../admin/branches/actions";

interface BranchUIProps {
    branch: {
        id: string;
        name: string;
        status: string;
        email?: string | null;
        phone?: string | null;
        address?: string | null;
        business?: { name: string } | null;
        _count: { clients: number; employees: number; services: number };
        serviceRecords: Array<{
            id: string;
            service?: { name: string } | null;
            employee?: { fullName: string } | null;
            client?: { fullName: string } | null;
            amount: number;
            createdAt: Date | string;
            status: string;
            completedAt?: Date | string | null;
        }>;
    };
    intelligence: {
        totalYield: number;
        totalServices: number;
        avgRating: number;
        occupancyRate: number;
        velocityData: number[];
        leaderboard: Array<{ name: string; yield: number; count: number; avgRating: number }>;
        lastActive: Date | string;
    };
    isOwner: boolean;
}

// Revenue Sparkline Component
const BranchSparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data, 1);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 40},${15 - ((v - min) / range) * 15}`).join(" ");
    
    return (
        <svg className="w-16 h-8 opacity-40 overflow-visible" viewBox="0 0 40 15">
            <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={points} />
        </svg>
    );
};

export default function BranchUI({ branch, intelligence, isOwner }: BranchUIProps) {
    const [activeTab, setActiveTab] = useState<"performance" | "manage">("performance");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            address: formData.get("address") as string,
        };

        try {
            const res = await updateBranchAction(branch.id, data);
            if (res.success) {
                setSuccess(true);
            } else {
                setError(res.error || "Failed to update branch");
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-10 px-4 lg:px-8">
            {/* Executive Location Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-[var(--bg-card)] border border-[var(--border-main)] p-6 rounded-[32px] relative overflow-hidden shadow-sm backdrop-blur-md">
                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                    <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="size-20 rounded-[24px] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center shadow-inner"
                    >
                        <MapPin className="size-10 text-[var(--color-primary)]" />
                    </motion.div>
                    
                    <div className="space-y-2 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                            <h1 className="text-2xl lg:text-4xl font-serif font-black tracking-tight text-[var(--text-main)] italic">
                                {branch.name}
                            </h1>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-[var(--bg-surface-muted)] text-[var(--text-muted)] border-[var(--border-muted)]`}>
                                <div className={`size-1.5 rounded-full ${branch.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                                {branch.status}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                                <Award className="size-3" />
                                {branch.business?.name || "ENTERPRISE"}
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.1em]">
                            <span className="flex items-center gap-2">
                                <Map className="size-3.5 text-[var(--color-primary)] opacity-60" />
                                {branch.address || "LOCATION SPECIFIED"}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="size-3.5 text-[var(--color-primary)] opacity-60" />
                                LAST SYNC {formatDistanceToNow(new Date(intelligence.lastActive), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 w-full lg:w-auto relative z-10">
                    <button
                        type="button"
                        onClick={() => setActiveTab(activeTab === 'performance' ? 'manage' : 'performance')}
                        className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl transition-all text-xs font-black uppercase tracking-widest ${activeTab === 'manage' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'bg-[var(--text-main)] text-[var(--bg-card)] hover:opacity-90 shadow-sm'}`}
                    >
                        {activeTab === 'performance' ? <Settings className="size-4" /> : <BarChart3 className="size-4" />}
                        {activeTab === 'performance' ? 'Location Management' : 'Location Intelligence'}
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "performance" ? (
                    <motion.div 
                        key="performance"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Branch Analytics Core */}
                            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: "Branch Yield", value: formatCurrency(intelligence.totalYield), icon: TrendingUp, color: "text-emerald-400", sub: "12 MO VELOCITY", spark: true },
                                    { label: "Quality Index", value: intelligence.avgRating > 0 ? `${intelligence.avgRating.toFixed(1)}/5` : "N/A", icon: Star, color: "text-yellow-400", sub: "GUEST SATISFACTION" },
                                    { label: "Guest Volume", value: branch._count.clients.toLocaleString(), icon: Users, color: "text-blue-400", sub: "UNIQUE VISITORS" },
                                    { label: "Occupancy IQ", value: `${intelligence.occupancyRate.toFixed(1)}%`, icon: Target, color: "text-[var(--color-primary)]", sub: "CAPACITY UTILIZATION" },
                                ].map((kpi) => (
                                    <div key={kpi.label} className="bg-[var(--bg-card)] border border-[var(--border-main)] p-6 rounded-[28px] group hover:border-[var(--color-primary)]/30 transition-all shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <kpi.icon className="size-12" />
                                        </div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-30">{kpi.label}</span>
                                            {kpi.spark && <BranchSparkline data={intelligence.velocityData} />}
                                        </div>
                                        <h3 className="text-2xl font-serif font-black text-[var(--text-main)] italic tracking-tight">{kpi.value}</h3>
                                        <p className="text-[8px] font-black text-[var(--text-muted)] opacity-20 mt-1 tracking-widest uppercase">{kpi.sub}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Staff Velocity Leaderboard */}
                            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] p-6 rounded-[32px] shadow-sm flex flex-col gap-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-30 border-b border-[var(--border-muted)] pb-3">Staff Leaderboard</h2>
                                <div className="space-y-4">
                                    {intelligence.leaderboard.map((staff, idx) => (
                                        <div key={idx} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-[var(--bg-surface-muted)] flex items-center justify-center text-[9px] font-black text-[var(--text-muted)] opacity-40 border border-[var(--border-muted)] group-hover:border-[var(--color-primary)]/40 transition-all">
                                                    #{idx + 1}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-[var(--text-main)] opacity-80 uppercase tracking-tighter">{staff.name}</p>
                                                    <p className="text-[9px] font-bold text-[var(--text-muted)] opacity-20 italic">{staff.count} Services</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-[var(--color-primary)]">{formatCurrency(staff.yield)}</p>
                                                <div className="flex items-center justify-end gap-1">
                                                    <Star className="size-2 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-[8px] font-black text-[var(--text-muted)] opacity-20">{staff.avgRating.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {intelligence.leaderboard.length === 0 && (
                                        <div className="py-10 text-center text-[9px] font-black text-[var(--text-muted)] opacity-10 uppercase tracking-widest italic">No session data available</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Stream */}
                        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[32px] flex flex-col h-[500px] shadow-sm">
                            <div className="px-8 py-5 border-b border-[var(--border-muted)] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Activity className="size-4 text-[var(--color-primary)]" />
                                    <span className="text-[var(--text-main)] opacity-80 text-[10px] font-black uppercase tracking-[0.2em]">Operational Pulse</span>
                                </div>
                                <span className="text-[var(--text-muted)] opacity-10 text-[8px] font-black uppercase tracking-widest italic">Live Activity Stream</span>
                            </div>
                            <div className="p-8 flex-1 custom-scrollbar overflow-y-auto space-y-3">
                                {branch.serviceRecords?.length > 0 ? (
                                    branch.serviceRecords.map((record) => (
                                        <div key={record.id} className="group p-4 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl flex items-center justify-between hover:bg-[var(--bg-card)] hover:border-[var(--color-primary)]/20 transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className="size-12 rounded-xl bg-[var(--bg-card)] border border-[var(--border-muted)] flex items-center justify-center text-[var(--color-primary)] shadow-inner">
                                                    <Zap className="size-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-black text-[var(--text-main)] opacity-90 italic tracking-tight">{record.employee?.fullName || "General Team"}</p>
                                                        <span className="text-[var(--text-muted)] opacity-20 text-[10px]">→</span>
                                                        <p className="text-xs font-bold text-[var(--text-main)] opacity-60">{record.client?.fullName}</p>
                                                    </div>
                                                    <p className="text-[9px] font-black text-[var(--text-muted)] opacity-20 mt-1 uppercase tracking-wider italic">
                                                        {record.service?.name} • {format(new Date(record.createdAt), 'MMM d, h:mm a')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-emerald-500 italic tracking-tighter">{formatCurrency(record.amount)}</p>
                                                <div className="flex items-center justify-end gap-1.5 mt-1">
                                                    <div className={`size-1.5 rounded-full ${record.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-rose-500'} opacity-30`} />
                                                    <span className="text-[8px] font-black text-[var(--text-muted)] opacity-20 uppercase tracking-widest">{record.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex items-center justify-center text-[var(--text-muted)] opacity-10 text-[11px] font-black uppercase tracking-[0.3em] italic">No active records detected in pulse</div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="manage"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-[var(--bg-card)] border border-[var(--border-main)] p-10 rounded-[40px] shadow-sm"
                    >
                        <div className="max-w-2xl mx-auto space-y-10">
                            <div className="flex items-center gap-5 border-b border-[var(--border-muted)] pb-8">
                                <div className="size-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center shadow-inner">
                                    <MapPin className="size-8 text-[var(--color-primary)]" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-serif font-black text-[var(--text-main)] italic tracking-tight">Location Metadata</h2>
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] opacity-30 uppercase tracking-[0.2em]">Update global identifiers for this branch.</p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleUpdate} className="space-y-8">
                                {error && <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest">{error}</div>}
                                {success && <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">Configuration Updated Successfully</div>}
                                
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-[var(--text-muted)] opacity-30 uppercase tracking-[0.3em] ml-1">Branch Nomenclature</label>
                                        <input required name="name" defaultValue={branch.name} className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--text-main)] outline-none focus:border-[var(--color-primary)]/40 focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[var(--text-muted)] opacity-30 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                                <Phone className="size-3" /> Digital Comms
                                            </label>
                                            <input name="phone" defaultValue={branch.phone} placeholder="Phone Number" className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--text-main)] outline-none focus:border-[var(--color-primary)]/40 transition-all" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-[var(--text-muted)] opacity-30 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                                <Mail className="size-3" /> System Inbox
                                            </label>
                                            <input name="email" type="email" defaultValue={branch.email} placeholder="Email" className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--text-main)] outline-none focus:border-[var(--color-primary)]/40 transition-all" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-[var(--text-muted)] opacity-30 uppercase tracking-[0.3em] ml-1 flex items-center gap-2">
                                            <MapPin className="size-3" /> Physical Coordinates
                                        </label>
                                        <input name="address" defaultValue={branch.address} placeholder="Street, City, Building" className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--text-main)] outline-none focus:border-[var(--color-primary)]/40 transition-all" />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[var(--text-main)] text-[var(--bg-app)] px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50"
                                    >
                                        {loading ? <div className="size-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : "Commit Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--color-forest-200);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--color-forest-300);
                }
            `}</style>
        </div>
    );
}
