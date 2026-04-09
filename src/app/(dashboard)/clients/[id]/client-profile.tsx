"use client";

import { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { 
    User, Phone, Calendar, Edit, 
    CreditCard, Award, Info, 
    Printer, History as LucideHistory, Mail, Droplets,
    Activity, TrendingUp, Sparkles, Fingerprint, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { formatCurrency } from "@/lib/utils";

const MembershipCardModal = dynamic(() => import("@/components/clients/MembershipCardModal"), { 
    ssr: false,
    loading: () => <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"><span className="text-white font-serif italic">Initializing Premium Interface...</span></div>
});

export default function ClientProfile({ client, activeMembership, loyaltyInfo, tierConfig, visitsThisMonth, intelligence }: any) {
    const [isCardModalOpen, setCardModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"history" | "pulse">("history");

    const qrCodePayload = `spa-client:${client.id}`;

    return (
        <div className="space-y-8 max-w-[1700px] mx-auto pb-20 px-4 lg:px-10">
            {/* Elegant Strategy Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative overflow-hidden bg-white/[0.02] border border-white/[0.05] p-10 rounded-[40px] backdrop-blur-3xl shadow-2xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-primary)] opacity-[0.03] blur-[100px] pointer-events-none" />
                
                <div className="flex items-center gap-8 relative z-10">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`size-24 rounded-3xl flex items-center justify-center text-4xl font-serif font-black italic shadow-2xl border-2 ${tierConfig.bg} ${tierConfig.color} ${tierConfig.border}`}
                    >
                        {client.fullName.charAt(0).toUpperCase()}
                    </motion.div>
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-4">
                            <h1 className="text-4xl lg:text-5xl font-serif font-black italic tracking-tighter text-white">
                                {client.fullName}
                            </h1>
                            {activeMembership && (
                                <span className={`px-4 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${tierConfig.bg} ${tierConfig.color} ${tierConfig.border}`}>
                                    {tierConfig.icon} {loyaltyInfo?.tier || "BRONZE"} ELITE
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-[var(--text-muted)] text-[10px] uppercase font-black tracking-widest opacity-40 italic">
                            <span className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] rounded-full border border-white/[0.05]">
                                <Fingerprint className="size-3" />
                                {client.id}
                            </span>
                            <span className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] rounded-full border border-white/[0.05]">
                                <Calendar className="size-3" />
                                Joined {format(new Date(client.createdAt), 'MMM yyyy')}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 relative z-10">
                    <button 
                        onClick={() => setCardModalOpen(true)}
                        className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-[11px] font-black uppercase tracking-widest shadow-2xl"
                    >
                        <Printer className="size-4" />
                        Print Access Card
                    </button>
                    <Link 
                        href={`/clients/${client.id}/edit`}
                        className="flex items-center justify-center size-14 bg-white/[0.03] text-white border border-white/[0.08] rounded-2xl hover:bg-white/[0.08] transition-all hover:rotate-12"
                    >
                        <Edit className="size-5" />
                    </Link>
                </div>
            </div>

            {/* Intelligence Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Lifetime Yield", value: formatCurrency(intelligence.ltv), icon: "payments", color: "text-emerald-500", sub: "Gross Portfolio Contribution" },
                    { label: "Loyalty Quotient", value: (loyaltyInfo?.points || 0).toString(), icon: "loyalty", color: "text-[var(--color-primary)]", sub: "Redeemable Capital" },
                    { label: "Market Reach", value: intelligence.totalVisits.toString(), icon: "hub", color: "text-blue-400", sub: "Total Network Engagements" },
                    { label: "Avg Ticket", value: formatCurrency(intelligence.avgTicket), icon: "monitoring", color: "text-amber-400", sub: "Strategy Conversion Rate" },
                ].map((kpi, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={kpi.label}
                        className="group relative bg-white/[0.02] border border-white/[0.05] p-8 rounded-[40px] overflow-hidden hover:border-[var(--color-primary)]/20 transition-all duration-500"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-30 italic">{kpi.label}</span>
                            <div className={`size-10 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center ${kpi.color}`}>
                                <span className="material-symbols-outlined text-xl">{kpi.icon}</span>
                            </div>
                        </div>
                        <h3 className={`text-4xl font-serif font-black italic tracking-tighter mb-2 ${kpi.color}`}>{kpi.value}</h3>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] opacity-20 uppercase tracking-widest italic">{kpi.sub}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Profile Brief (Personal Info + Membership) */}
                <div className="space-y-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/[0.02] border border-white/[0.05] rounded-[40px] p-10 backdrop-blur-3xl shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/[0.05] pb-8 mb-8">
                            <h2 className="text-xl font-serif font-black italic tracking-tight text-white/90">Personal Intelligence</h2>
                            <User className="size-5 text-[var(--color-primary)]" />
                        </div>
                        <div className="space-y-8">
                            {[
                                { label: "Contact Channel", val: client.phone, icon: Phone },
                                { label: "Digital Address", val: client.email || "NOT_DECLARED", icon: Mail },
                                { label: "Favorite Service", val: intelligence.favoriteService, icon: Sparkles, highlight: true },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 group">
                                    <div className="size-10 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--color-primary)] transition-colors">
                                        <item.icon className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-30 italic mb-1">{item.label}</p>
                                        <p className={`text-sm font-bold tracking-tight ${item.highlight ? 'text-[var(--color-primary)]' : 'text-white/80'}`}>{item.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Active Membership Status */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className={`rounded-[40px] border p-10 relative overflow-hidden shadow-2xl ${activeMembership ? `${tierConfig.bg} ${tierConfig.border}` : 'bg-white/[0.01] border-white/[0.05] border-dashed'}`}>
                        {activeMembership ? (
                            <>
                                <div className="absolute top-0 right-0 p-10 opacity-5">
                                    <Award className="size-40" />
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className={`size-6 ${tierConfig.color}`} />
                                        <h2 className={`text-xl font-serif font-black italic ${tierConfig.color}`}>Active Privileges</h2>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-1 italic">Entitlement Plan</p>
                                            <p className="text-lg font-serif font-black italic text-white tracking-tight">{activeMembership.category?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-1 italic">Validation Expiry</p>
                                            <p className="text-lg font-serif font-black italic text-white tracking-tight">
                                                {activeMembership.endDate ? format(new Date(activeMembership.endDate), 'MMM d, yyyy') : 'PERPETUAL'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 italic">Access Verified</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-30 italic">No Active Entitlements</p>
                                <button className="text-[9px] font-black uppercase tracking-widest text-[var(--color-primary)] hover:underline border border-[var(--color-primary)]/20 px-4 py-2 rounded-full bg-[var(--color-primary)]/5">Purchase Membership</button>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Main Activity Center (Timeline vs History) */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[40px] overflow-hidden flex flex-col shadow-2xl min-h-[600px]">
                        <div className="px-10 py-8 border-b border-white/[0.05] flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest italic cursor-pointer transition-all ${activeTab === 'history' ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/[0.05]'}`} onClick={() => setActiveTab('history')}>
                                    Service Logs
                                </div>
                                <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest italic cursor-pointer transition-all ${activeTab === 'pulse' ? 'bg-[var(--color-primary)] text-white' : 'text-white/40 hover:text-white hover:bg-white/[0.05]'}`} onClick={() => setActiveTab('pulse')}>
                                    The Pulse (Audit)
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-[var(--text-muted)] opacity-30 text-[9px] uppercase font-black tracking-widest">
                                <Activity className="size-3" />
                                Real-time Engagement Feed
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {activeTab === "history" ? (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="history" className="space-y-4">
                                        {client.serviceRecords?.length > 0 ? (
                                            client.serviceRecords.map((record: any, idx: number) => (
                                                <motion.div 
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    key={record.id} 
                                                    className="group flex justify-between items-center p-6 bg-white/[0.02] border border-white/[0.05] rounded-3xl hover:bg-white/[0.05] transition-all hover:translate-x-2"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="size-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-[var(--color-primary)]">
                                                            <Droplets className="size-6" />
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-serif font-black italic text-white/90 tracking-tight">{record.service?.name}</p>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40 italic mt-1">Specialist: {record.employee?.fullName || 'SYSTEM'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-serif font-black italic text-[var(--color-primary)] tracking-tight">{formatCurrency(record.amount)}</p>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-30 italic mt-1">{format(new Date(record.createdAt), 'MMM d · h:mm a')}</p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="h-[400px] flex items-center justify-center text-[var(--text-muted)] text-[10px] uppercase font-black tracking-[0.3em] opacity-20 italic">No Service Manifest Detected</div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="pulse" className="space-y-6">
                                        {intelligence.auditLogs?.length > 0 ? (
                                            intelligence.auditLogs.map((log: any, idx: number) => (
                                                <motion.div 
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    key={log.id} 
                                                    className="flex gap-6 relative"
                                                >
                                                    {/* Timeline marker */}
                                                    <div className="flex flex-col items-center">
                                                        <div className={`size-4 rounded-full border-2 ${log.action.includes('DELETE') ? 'border-rose-500 bg-rose-500/20' : 'border-[var(--color-primary)] bg-[var(--color-primary)]/20'} z-10`} />
                                                        <div className="w-0.5 h-full bg-white/5 absolute top-4" />
                                                    </div>
                                                    <div className="pb-8">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-40 italic">{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
                                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${log.action.includes('UPDATE') ? 'bg-blue-500/10 text-blue-500' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'}`}>{log.action.replace('CLIENT_', '')}</span>
                                                        </div>
                                                        <p className="text-sm font-serif font-black italic text-white/80 tracking-tight leading-relaxed">{log.details || `Structural interaction performed by ${log.user.fullName}`}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Clock className="size-3 text-[var(--text-muted)] opacity-30" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-30 italic">{log.user.fullName}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="h-[400px] flex items-center justify-center text-[var(--text-muted)] text-[10px] uppercase font-black tracking-[0.3em] opacity-20 italic">No Historical Audit Trace</div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Membership Card Printer Modal */}
            <MembershipCardModal
                isOpen={isCardModalOpen}
                onClose={() => setCardModalOpen(false)}
                clientName={client.fullName}
                clientId={client.id}
                qrCodeString={qrCodePayload}
                tier={loyaltyInfo?.tier || "BRONZE"}
            />
        </div>
    );
}

const customScrollbarStyle = `
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.1);
}
`;
