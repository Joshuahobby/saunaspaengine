"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { 
    User, Phone, Calendar, Edit, 
    CreditCard, Award, Info, 
    Printer, History as LucideHistory, Mail, Droplets,
    Activity, TrendingUp, Sparkles, Fingerprint, Clock,
    ChevronRight, Zap, Heart, AlertCircle, MessageSquare, PlusCircle,
    Star, Target, ShieldCheck, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { formatCurrency } from "@/lib/utils";
import { updateClientNotes, generateClientQrAction } from "./actions";
import { toast } from "react-hot-toast";

const MembershipCardModal = dynamic(() => import("@/components/clients/MembershipCardModal"), { 
    ssr: false,
    loading: () => <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"><span className="text-white font-serif font-bold text-sm">Synchronizing...</span></div>
});

interface ClientProfileProps {
    client: {
        id: string;
        fullName: string;
        phone: string;
        email?: string | null;
        clientType: string;
        notes: string;
        qrCode?: string | null;
        membershipCardUrl?: string | null;
        createdAt: Date | string;
        branch?: { name: string; business?: { name: string } | null } | null;
        serviceRecords: Array<{
            id: string;
            serviceId?: string | null;
            service?: { name: string } | null;
            employee?: { fullName: string } | null;
            amount: number;
            createdAt: Date | string;
            status: string;
            completedAt?: Date | string | null;
        }>;
    };
    activeMembership?: {
        id: string;
        balance: number;
        status: string;
        category?: { name: string } | null;
    } | null;
    loyaltyInfo?: { tier: string; points: number } | null;
    tierConfig: { color: string; bg: string; border: string; icon: string };
    visitsThisMonth: number;
    intelligence: {
        ltv: number;
        avgTicket: number;
        favoriteService: string;
        totalVisits: number;
        auditLogs: Array<{ id: string; action: string; createdAt: Date | string; user?: { fullName: string } | null; details?: string | null }>;
        avgFrequency: number;
        daysSinceLastVisit: number;
        relationshipHealth: 'ACTIVE' | 'DRIFTING' | 'AT_RISK';
        lastSeen: Date | string | null;
        avgRating: number;
        recentReviews: Array<{ id: string; rating: number; comment?: string | null; createdAt: Date | string }>;
        velocityData: number[];
        suggestedService: string;
    };
}

// Simple Sparkline Component
const VelocitySparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data, 1);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 40},${15 - ((v - min) / range) * 15}`).join(" ");
    
    return (
        <svg className="w-10 h-4 ml-2 opacity-50 overflow-visible" viewBox="0 0 40 15">
            <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={points} />
        </svg>
    );
};

export default function ClientProfile({ client, activeMembership, loyaltyInfo, tierConfig, visitsThisMonth, intelligence }: ClientProfileProps) {
    const [isCardModalOpen, setCardModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"history" | "pulse">("history");
    const [notes, setNotes] = useState(client.notes || "");
    const [qrCode, setQrCode] = useState(client.qrCode);
    const [isSaving, setIsSaving] = useState(false);

    const qrCodePayload = qrCode || `spa-client:${client.id}`;

    // Handle Notes Save
    const handleSaveNotes = useCallback(async (val: string) => {
        setIsSaving(true);
        await updateClientNotes(client.id, val);
        setIsSaving(false);
    }, [client.id]);

    const handleGenerateQr = async () => {
        setIsSaving(true);
        const res = await generateClientQrAction(client.id);
        if (res.success) {
            setQrCode(res.qrCode);
            toast.success("System QR Code Generated!");
        } else {
            toast.error(res.error || "Failed to generate QR");
        }
        setIsSaving(false);
    };

    const healthConfig = {
        ACTIVE: { label: "ACTIVE", color: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/10", icon: Heart },
        DRIFTING: { label: "DRIFTING", color: "text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/10", icon: Activity },
        AT_RISK: { label: "AT RISK", color: "text-rose-400", bg: "bg-rose-500/5", border: "border-rose-500/10", icon: AlertCircle }
    }[intelligence.relationshipHealth as 'ACTIVE' | 'DRIFTING' | 'AT_RISK'];

    const getSentiment = (rating: number) => {
        if (rating >= 4.5) return "LOYALIST";
        if (rating >= 3.5) return "SATISFIED";
        if (rating > 0) return "CONCERN";
        return "NEUTRAL";
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-10 px-4 lg:px-8">
            {/* Compact Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-[var(--bg-card)] border border-[var(--border-main)] p-5 rounded-[24px] relative overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                    <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className={`size-20 rounded-[20px] flex items-center justify-center text-3xl font-serif font-bold border ${tierConfig.bg} ${tierConfig.color} ${tierConfig.border}`}
                    >
                        {client.fullName.charAt(0).toUpperCase()}
                    </motion.div>
                    
                    <div className="space-y-2 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                            <h1 className="text-2xl lg:text-3xl font-serif font-bold tracking-tight text-[var(--text-main)]">
                                {client.fullName}
                            </h1>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${tierConfig.bg} ${tierConfig.color} ${tierConfig.border}`}>
                                {tierConfig.icon} {loyaltyInfo?.tier || "BRONZE"}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/10 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-lg">
                                <Target className="size-3" />
                                SUGGESTED: {intelligence.suggestedService}
                            </div>
                            {!qrCode && (
                                <button 
                                    onClick={handleGenerateQr}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/10 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-lg animate-pulse hover:animate-none transition-all"
                                >
                                    <Fingerprint className="size-3" />
                                    Generate System QR
                                </button>
                            )}
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[var(--text-muted)] text-[9px] font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-2 px-2 py-1 bg-[var(--bg-surface-muted)] rounded-md border border-[var(--border-muted)]">
                                <Fingerprint className="size-3 opacity-40 text-[var(--color-primary)]" />
                                {client.id.slice(0, 8)}
                            </span>
                            <span className="flex items-center gap-2 px-2 py-1 bg-[var(--bg-surface-muted)] rounded-md border border-[var(--border-muted)]">
                                <Calendar className="size-3 opacity-40 text-[var(--color-primary)]" />
                                JOINED {format(new Date(client.createdAt), 'MMM yyyy')}
                            </span>
                            <div className={`flex items-center gap-2 px-2 py-1 ${healthConfig.bg} ${healthConfig.color} border border-[var(--border-muted)] rounded-md`}>
                                <healthConfig.icon className="size-3" />
                                {healthConfig.label}
                            </div>
                            {intelligence.avgRating > 0 && (
                                <div className="flex items-center gap-2 px-2 py-1 bg-yellow-500/5 text-yellow-600 dark:text-yellow-500/80 border border-yellow-500/10 rounded-md">
                                    <Star className="size-3 fill-yellow-500/40" />
                                    {getSentiment(intelligence.avgRating)} ({intelligence.avgRating.toFixed(1)})
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 relative z-10">
                    {client.membershipCardUrl && (
                        <div className="relative group cursor-pointer" onClick={() => setCardModalOpen(true)}>
                            <div className="w-24 h-14 rounded-lg overflow-hidden border border-[var(--border-main)] shadow-sm group-hover:border-[var(--color-primary)]/50 transition-all">
                                <img 
                                    src={client.membershipCardUrl} 
                                    alt="Membership Card" 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <Eye className="size-4 text-white" />
                                </div>
                            </div>
                            <div className="absolute -top-1 -right-1 size-3 bg-emerald-500 rounded-full border-2 border-[var(--bg-card)] shadow-sm" />
                        </div>
                    )}
                    <button 
                        onClick={() => setCardModalOpen(true)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[var(--text-main)] text-[var(--bg-card)] rounded-xl hover:opacity-90 transition-all text-[10px] font-bold uppercase tracking-wider shadow-lg"
                    >
                        <Printer className="size-4" />
                        {client.membershipCardUrl ? 'Manage Card' : 'Membership Card'}
                    </button>
                    <Link 
                        href={`/clients/${client.id}/edit`}
                        className="flex items-center justify-center size-11 bg-[var(--bg-surface-muted)] text-[var(--text-main)] border border-[var(--border-main)] rounded-xl hover:bg-[var(--color-primary-muted)] transition-all"
                    >
                        <Edit className="size-4" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Denser Stats Block */}
                <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Net Value", value: formatCurrency(intelligence.ltv), icon: TrendingUp, color: "text-emerald-400", extra: <VelocitySparkline data={intelligence.velocityData} /> },
                        { label: "Loyalty Points", value: (loyaltyInfo?.points || 0).toString(), icon: Award, color: "text-[var(--color-primary)]" },
                        { label: "Visit Rate", value: intelligence.avgFrequency > 0 ? `${intelligence.avgFrequency}d` : "SINGLE", icon: Activity, color: "text-blue-400" },
                        { label: "Favorite", value: intelligence.favoriteService, icon: Sparkles, color: "text-orange-400" },
                    ].map((kpi, idx) => (
                        <div
                            key={kpi.label}
                            className="bg-[var(--bg-card)] border border-[var(--border-main)] p-5 rounded-[20px] group hover:border-[var(--color-primary)]/20 transition-all shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{kpi.label}</span>
                                <div className="flex items-center">
                                    {kpi.extra}
                                    <kpi.icon className={`size-4 ${kpi.color} ml-2`} />
                                </div>
                            </div>
                            <h3 className={`font-serif font-bold text-[var(--text-main)] leading-tight ${kpi.label === 'Favorite' ? 'text-lg' : 'text-xl'}`}>
                                {kpi.value}
                            </h3>
                        </div>
                    ))}
                </div>

                {/* Compact Mini Dock */}
                <div className="bg-[var(--bg-surface-muted)] border border-[var(--border-main)] p-4 rounded-[20px] flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-[var(--color-primary)]/20 transition-all group">
                        <PlusCircle className="size-3 group-hover:rotate-90 transition-transform" />
                        Book
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-main)] rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-[var(--bg-surface-muted)] transition-all">
                        <Zap className="size-3" />
                        Reward
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Attributes & Notes Sidebar */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-main)] p-6 rounded-[24px shadow-sm">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-6 border-b border-[var(--border-muted)] pb-3">Client Profile</h2>
                        <div className="space-y-6">
                            {[
                                { label: "Direct Phone", value: client.phone, icon: Phone },
                                { label: "Verified Email", value: client.email || "N/A", icon: Mail },
                                { label: "Client Category", value: client.clientType, icon: User },
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

                        {/* Protocol Handover Terminal */}
                        <div className="mt-10 pt-6 border-t border-[var(--border-muted)] space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                                    <ShieldCheck className="size-3" />
                                    Service Protocol
                                </h3>
                                {isSaving && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="size-2 rounded-full border border-[var(--color-primary)] border-t-transparent" />}
                            </div>
                            <textarea 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                onBlur={(e) => handleSaveNotes(e.target.value)}
                                placeholder="Add service preferences, allergies, or protocol notes here..."
                                className="w-full h-32 bg-[var(--bg-app)] border border-[var(--border-main)] rounded-xl p-3 text-[11px] text-[var(--text-main)] placeholder:text-[var(--text-muted)] opacity-80 focus:outline-none focus:border-[var(--color-primary)]/50 transition-all resize-none font-medium leading-relaxed"
                            />
                            <p className="text-[9px] text-[var(--text-muted)] opacity-40 uppercase tracking-tighter">Auto-saves on blur</p>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-card)] border border-[var(--color-primary)]/10 p-5 rounded-[20px] text-[10px] font-medium text-[var(--text-muted)] leading-relaxed shadow-lg">
                        <div className="flex items-center gap-2 text-[var(--color-primary)] mb-2 uppercase font-bold tracking-widest">
                            <Info className="size-3" />
                            Service Intelligence
                        </div>
                        Enthusiast of {intelligence.favoriteService}. 
                        Recommended next: <span className="text-[var(--text-main)]">{intelligence.suggestedService}</span>.
                    </div>
                </div>

                {/* Right: Activity Control Center */}
                <div className="lg:col-span-9 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[24px] flex flex-col h-[650px] shadow-sm">
                    <div className="px-6 py-4 border-b border-[var(--border-muted)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setActiveTab('history')}
                                className={`px-5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${activeTab === 'history' ? 'bg-[var(--text-main)] text-[var(--bg-card)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)]'}`}
                            >
                                Service History
                            </button>
                            <button 
                                onClick={() => setActiveTab('pulse')}
                                className={`px-5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${activeTab === 'pulse' ? 'bg-[var(--text-main)] text-[var(--bg-card)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)]'}`}
                            >
                                Activity Log
                            </button>
                        </div>
                        <div className="text-[var(--text-muted)] opacity-30 text-[8px] font-bold uppercase tracking-[0.2em] lg:flex items-center gap-2 hidden group cursor-default">
                            <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 2 }} className="size-1.5 rounded-full bg-emerald-500" />
                            Live Activity Feed
                        </div>
                    </div>

                    <div className="p-6 flex-1 custom-scrollbar overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {activeTab === "history" ? (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="history" className="space-y-2">
                                    {client.serviceRecords?.length > 0 ? (
                                        client.serviceRecords.map((record) => (
                                            <div key={record.id} className="group p-4 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl flex items-center justify-between hover:bg-[var(--border-main)] transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-muted)] flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                                                        <Droplets className="size-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[var(--text-main)] opacity-90">{record.service?.name}</p>
                                                        <p className="text-[10px] font-medium text-[var(--text-muted)] mt-1 uppercase tracking-tight">
                                                            Staff: {record.employee?.fullName || 'SYSTEM'} • {format(new Date(record.createdAt), 'MMM d, p')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-[var(--color-primary)]">{formatCurrency(record.amount)}</p>
                                                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                                        <span className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-tighter">SUCCESS</span>
                                                        <div className="size-1 rounded-full bg-emerald-500/40" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-[200px] flex items-center justify-center text-white/10 text-[9px] font-bold uppercase tracking-widest">No visit history found</div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="pulse" className="space-y-6 pl-2">
                                    {intelligence.auditLogs?.length > 0 ? (
                                        intelligence.auditLogs.map((log, idx) => (
                                            <div key={log.id} className="flex gap-6 relative">
                                                <div className="flex flex-col items-center">
                                                    <div className={`size-3 rounded-full border ${log.action.includes('DELETE') ? 'border-rose-500 bg-rose-500/20' : 'border-[var(--color-primary)] bg-[var(--color-primary)]/20'} z-10`} />
                                                    {idx !== intelligence.auditLogs.length - 1 && <div className="w-px h-full bg-[var(--border-muted)] absolute top-3" />}
                                                </div>
                                                <div className="pb-6">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
                                                        <span className="text-[9px] font-bold text-[var(--color-primary)]/80 uppercase tracking-tighter">{log.action}</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-[var(--text-main)] opacity-70 leading-tight">
                                                        {log.details || `Administrative entry recorded`}
                                                    </p>
                                                    <p className="text-[9px] text-[var(--text-muted)] opacity-30 mt-2 font-bold uppercase">SECURED_BY_{log.user.fullName.replace(' ', '_')}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-[200px] flex items-center justify-center text-[var(--text-muted)] opacity-10 text-[9px] font-bold uppercase tracking-widest">No activity found</div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <MembershipCardModal
                isOpen={isCardModalOpen}
                onClose={() => setCardModalOpen(false)}
                clientName={client.fullName}
                clientId={client.id}
                qrCodeString={qrCodePayload}
                tier={loyaltyInfo?.tier || "BRONZE"}
                businessName={client.branch?.business?.name || "KIZERE"}
                branchName={client.branch?.name || "SAUNA SPA"}
            />

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
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
            `}</style>
        </div>
    );
}
