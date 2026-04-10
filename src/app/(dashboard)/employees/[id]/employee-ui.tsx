"use client";

import { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { 
    User, Phone, Calendar, Edit, 
    Award, TrendingUp, Activity, 
    Clock, ChevronRight, Zap, Star, 
    Target, ShieldCheck, Mail, MapPin, 
    Trash2, Briefcase, BarChart3, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import EditEmployeeForm from "@/components/employees/edit-form";

// Simple Sparkline Component 
const RevenueSparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data, 1);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 40},${15 - ((v - min) / range) * 15}`).join(" ");
    
    return (
        <svg className="w-12 h-6 ml-2 opacity-50 overflow-visible" viewBox="0 0 40 15">
            <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={points} />
        </svg>
    );
};

export default function EmployeeUI({ employee, categories, branches, isOwner, intelligence }: any) {
    const [activeTab, setActiveTab] = useState<"performance" | "manage">("performance");

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-10 px-4 lg:px-8">
            {/* Executive Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-[var(--bg-card)] border border-[var(--border-main)] p-5 rounded-[24px] relative overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                    <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="size-20 rounded-[20px] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center text-3xl font-serif font-bold text-[var(--color-primary)]"
                    >
                        {employee.fullName.charAt(0).toUpperCase()}
                    </motion.div>
                    
                    <div className="space-y-2 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                            <h1 className="text-2xl lg:text-3xl font-serif font-bold tracking-tight text-[var(--text-main)]">
                                {employee.fullName}
                            </h1>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider bg-[var(--bg-surface-muted)] text-[var(--text-muted)] border-[var(--border-muted)] shadow-sm`}>
                                <div className={`size-1.5 rounded-full ${employee.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                {employee.status}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/10 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                                <Award className="size-3" />
                                {intelligence.performanceStatus} STATUS
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[var(--text-muted)] text-[9px] font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-2 px-2 py-1 bg-[var(--bg-surface-muted)] rounded-md border border-[var(--border-muted)]">
                                <Briefcase className="size-3 opacity-40 text-[var(--color-primary)]" />
                                {employee.category?.name || "STAFF"}
                            </span>
                            <span className="flex items-center gap-2 px-2 py-1 bg-[var(--bg-surface-muted)] rounded-md border border-[var(--border-muted)]">
                                <MapPin className="size-3 opacity-40 text-[var(--color-primary)]" />
                                {employee.branch?.name || "CENTRAL"}
                            </span>
                            <span className="flex items-center gap-2 px-2 py-1 bg-[var(--bg-surface-muted)] rounded-md border border-[var(--border-muted)]">
                                <Clock className="size-3 opacity-40 text-[var(--color-primary)]" />
                                LAST ACTIVE {formatDistanceToNow(new Date(intelligence.lastActive), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 relative z-10">
                    <button 
                        onClick={() => setActiveTab(activeTab === 'performance' ? 'manage' : 'performance')}
                        className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all text-[10px] font-bold uppercase tracking-wider shadow-lg ${activeTab === 'manage' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--text-main)] text-[var(--bg-card)] hover:opacity-90'}`}
                    >
                        {activeTab === 'performance' ? <Settings className="size-4" /> : <BarChart3 className="size-4" />}
                        {activeTab === 'performance' ? 'Management' : 'Performance'}
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
                            {/* Denser Analytics Block */}
                            <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: "Net Value (12mo)", value: formatCurrency(intelligence.totalYield), icon: TrendingUp, color: "text-emerald-400", extra: <RevenueSparkline data={intelligence.velocityData} /> },
                                    { label: "Retention Rate", value: `${intelligence.retentionRate.toFixed(1)}%`, icon: Target, color: "text-[var(--color-primary)]" },
                                    { label: "Quality Index", value: intelligence.avgRating > 0 ? intelligence.avgRating.toFixed(1) : "N/A", icon: Star, color: "text-yellow-400" },
                                    { label: "Service Volume", value: intelligence.totalServices.toString(), icon: Activity, color: "text-blue-400" },
                                ].map((kpi, idx) => (
                                    <div
                                        key={kpi.label}
                                        className="bg-white/[0.02] border border-white/5 p-5 rounded-[20px] group hover:border-[var(--color-primary)]/20 transition-all shadow-xl"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">{kpi.label}</span>
                                            <div className="flex items-center">
                                                {kpi.extra}
                                                <kpi.icon className={`size-4 ${kpi.color} ml-2`} />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-serif font-bold text-white leading-tight">
                                            {kpi.label === 'Quality Index' && intelligence.avgRating > 0 ? (
                                                <span className="flex items-center gap-1.5">
                                                    {kpi.value} <Star className="size-3 fill-yellow-400 text-yellow-400 invisible sm:visible" />
                                                </span>
                                            ) : kpi.value}
                                        </h3>
                                    </div>
                                ))}
                            </div>

                            {/* Performance DNA Sidebar */}
                            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] p-6 rounded-[24px] space-y-6 shadow-sm">
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2 border-b border-[var(--border-muted)] pb-3">Performance DNA</h2>
                                <div className="space-y-6">
                                    {[
                                        { label: "Unique Clients", value: intelligence.uniqueClients, icon: User },
                                        { label: "Commission", value: `${employee.commissionRate}%`, icon: Zap },
                                        { label: "Seniority", value: formatDistanceToNow(new Date(employee.createdAt), { addSuffix: false }), icon: Calendar },
                                    ].map((attr, i) => (
                                        <div key={i} className="group">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">{attr.label}</p>
                                            <p className="text-xs font-semibold text-[var(--text-main)] opacity-80 flex items-center gap-2">
                                                <attr.icon className="size-3 text-[var(--text-muted)] opacity-50" />
                                                {attr.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Service Ledger */}
                        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[24px] flex flex-col h-[600px] shadow-sm">
                            <div className="px-6 py-4 border-b border-[var(--border-muted)] flex items-center justify-between">
                                <div className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">
                                    Historical Service Manifest
                                </div>
                                <div className="text-[var(--text-muted)] opacity-20 text-[8px] font-bold uppercase tracking-[0.2em] lg:flex items-center gap-2 hidden">
                                    <Activity className="size-3" />
                                    Live Performance Stream
                                </div>
                            </div>
                            <div className="p-6 flex-1 custom-scrollbar overflow-y-auto space-y-2">
                                {employee.serviceRecords?.length > 0 ? (
                                    employee.serviceRecords.map((record: any) => (
                                        <div key={record.id} className="group p-4 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl flex items-center justify-between hover:bg-[var(--border-main)] transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-muted)] flex items-center justify-center text-[var(--color-primary)]">
                                                    <Zap className="size-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[var(--text-main)] opacity-90">{record.service?.name}</p>
                                                    <p className="text-[10px] font-medium text-[var(--text-muted)] mt-1 uppercase tracking-tight">
                                                        Client: {record.client?.fullName} • {format(new Date(record.createdAt), 'MMM d, p')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-[var(--color-primary)]">{formatCurrency(record.amount)}</p>
                                                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                                    {record.review && <Star className="size-2.5 fill-yellow-500 text-yellow-500" />}
                                                    <span className="text-[8px] font-bold text-[var(--text-muted)] opacity-20 uppercase tracking-tighter">
                                                        {record.review?.rating ? `${record.review.rating}/5` : 'UNRATED'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex items-center justify-center text-[var(--text-muted)] opacity-20 text-[10px] font-bold uppercase tracking-widest italic">
                                        No performance data recorded in this period
                                    </div>
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
                        className="bg-[var(--bg-card)] border border-[var(--border-main)] p-8 rounded-[32px] shadow-sm"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] flex items-center justify-center text-[var(--text-muted)]">
                                <Settings className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-serif font-bold text-[var(--text-main)] opacity-90">Staff Governance</h2>
                                <p className="text-xs text-[var(--text-muted)]">Update credentials, categories, or physical branch placement.</p>
                            </div>
                        </div>
                        <EditEmployeeForm 
                            employee={employee}
                            categories={categories}
                            branches={branches}
                            isOwner={isOwner}
                        />
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
