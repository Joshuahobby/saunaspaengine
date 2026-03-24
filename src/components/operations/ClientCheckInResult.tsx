"use client";

import { CheckCircle, Thermometer, Droplets, AlertTriangle, Printer, Share2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface Membership {
    id: string;
    category: {
        name: string;
        isGlobal: boolean;
    };
    status: string;
    endDate?: string | null;
}

interface ClientCheckInResultProps {
    client: {
        id: string;
        fullName: string;
        phone?: string | null;
        memberships: Membership[];
        loyaltyPoints?: unknown[];
        isExternal?: boolean;
    };
    onBack: () => void;
    onComplete: (serviceId: string) => void;
    services: Array<{ id: string; name: string; price: number }>;
}

export function ClientCheckInResult({ client, onBack, onComplete, services }: ClientCheckInResultProps) {
    const activeMembership = client.memberships.find(m => m.status === "ACTIVE");
    const isVIP = client.loyaltyPoints && client.loyaltyPoints.length > 0; // Mock VIP logic
    const isBirthday = false; // In a real app, compare with client.birthDate

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Breadcrumb / Back button */}
            <button 
                onClick={onBack}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors italic opacity-70"
            >
                <ArrowLeft className="w-3 h-3" />
                Reset Scanner
            </button>

            {/* Success Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 glass-card p-5 border-[var(--border-main)] shadow-sm">
                <div className="flex gap-4 items-center">
                    <div className="size-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[var(--text-main)] text-sm font-bold italic">Identity <span className="text-[var(--color-primary)] not-italic">Verified</span></h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[var(--text-main)] font-black text-sm">{client.fullName}</span>
                            <span className="h-1 w-1 bg-[var(--border-muted)] rounded-full"></span>
                            <span className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-tighter">REF: {client.id.slice(-6).toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                {activeMembership && (
                    <div className="flex flex-col items-end">
                        <span className="bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-[var(--color-primary)]/30">
                            {activeMembership.category.name}
                        </span>
                        {activeMembership.endDate && (
                            <span className="text-[var(--text-muted)] text-xs mt-2 uppercase font-bold tracking-tighter">
                                Valid until {format(new Date(activeMembership.endDate), "MMM dd, yyyy")}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Personalized Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Main Insight Card */}
                <div className="md:col-span-2 relative overflow-hidden glass-card p-6 border border-[var(--color-primary)]/30 shadow-lg bg-gradient-to-br from-[var(--bg-card)] to-[var(--color-primary-muted)]">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Guest Insight
                            </span>
                            {isVIP && (
                                <span className="bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Loyal Guest
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">✨</div>
                            <div className="flex-1">
                                <p className="text-[var(--text-main)] text-xl font-black leading-tight mb-1">
                                    {isBirthday ? `It's ${client.fullName.split(' ')[0]}'s Birthday!` : `Welcome back, ${client.fullName.split(' ')[0]}!`}
                                </p>
                                <p className="text-[var(--text-muted)] text-sm">
                                    {isBirthday 
                                        ? "Celebrate with a complimentary herbal infusion and a warm birthday wish."
                                        : "Great to see them again. Their last visit was a week ago."}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-[var(--border-main)]">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider mb-0.5">Receptionist Prompt</span>
                                <p className="italic text-[var(--text-main)] italic text-sm">
                                    &quot;Good to see you again! Shall we set the usual eucalyptus scent for you?&quot;
                                </p>
                            </div>
                            <button className="flex h-9 px-5 bg-[var(--color-primary)] text-white text-[11px] font-bold rounded-xl hover:opacity-90 transition-opacity">
                                Acknowledge
                            </button>
                        </div>
                    </div>
                </div>

                {/* Side Preferences */}
                <div className="space-y-4">
                    <div className="glass-card p-4 border-[var(--border-main)]">
                        <div className="flex items-center gap-3 mb-2">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            <span className="font-bold text-[var(--text-main)] text-sm">Temperature</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[var(--text-muted)] text-xs">Prefers:</span>
                            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2.5 py-0.5 rounded-lg font-bold text-[10px] uppercase tracking-wider">
                                High Heat (85°C)
                            </span>
                        </div>
                    </div>

                    <div className="glass-card p-4 border-[var(--border-main)]">
                        <div className="flex items-center gap-3 mb-2">
                            <Droplets className="w-4 h-4 text-[var(--color-primary)]" />
                            <span className="font-bold text-[var(--text-main)] text-sm">Essential Oils</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded text-[10px] font-bold border border-[var(--color-primary)]/20">Peppermint</span>
                            <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded text-[10px] font-bold border border-[var(--color-primary)]/20">Eucalyptus</span>
                        </div>
                    </div>

                    <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                        <div className="flex items-center gap-3 mb-2 text-rose-600 dark:text-rose-400">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-bold text-sm">Health Notes</span>
                        </div>
                        <p className="text-[11px] font-medium text-rose-800 dark:text-rose-300">
                            Sensitivity to abrasive towels noted in past visit. Use soft robes.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Check-in Section */}
            <div className="glass-card p-6 border-[var(--border-main)] shadow-sm">
                <h3 className="text-[var(--text-main)] font-bold mb-4 flex items-center gap-2 text-[11px] uppercase tracking-widest italic opacity-80">
                    <CheckCircle className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    Visit Registration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Select Service</label>
                            <select 
                                title="Service for this visit"
                                className="w-full h-11 bg-[var(--bg-app)] border-[var(--border-main)] rounded-xl px-4 text-[var(--text-main)] focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                                onChange={(e) => {
                                    if (e.target.value) onComplete(e.target.value);
                                }}
                                defaultValue=""
                            >
                            <option value="" disabled>Choose the service for this visit...</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>{s.name} - {s.price} RWF</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[var(--text-main)] font-bold hover:bg-slate-200 transition-colors text-[11px] uppercase tracking-widest">
                            <Printer className="w-4 h-4" />
                            Print Slip
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[var(--text-main)] font-bold hover:bg-slate-200 transition-colors text-[11px] uppercase tracking-widest">
                            <Share2 className="w-4 h-4" />
                            Voucher
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
