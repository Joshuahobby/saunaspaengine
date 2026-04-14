"use client";

import { CheckCircle, Thermometer, Droplets, AlertTriangle, Printer, Share2, ArrowLeft, Award } from "lucide-react";
import { format } from "date-fns";

interface Membership {
    id: string;
    category: {
        name: string;
        isGlobal: boolean;
    };
    status: string;
    endDate?: string | null;
    balance?: number | null;
}

interface LoyaltyPoint {
    id: string;
    points: number;
    tier: string;
}

interface ClientCheckInResultProps {
    client: {
        id: string;
        fullName: string;
        phone?: string | null;
        memberships: Membership[];
        loyaltyPoints?: LoyaltyPoint[];
        healthNotes?: string | null;
        preferences?: string | null;
        isExternal?: boolean;
    };
    onBack: () => void;
    onComplete: (serviceId: string, lockerNumber?: string) => void;
    services: Array<{ id: string; name: string; price: number }>;
    lockerNumber?: string;
    onLockerChange?: (value: string) => void;
}

const TIER_CONFIG: Record<string, { color: string; bg: string; border: string; icon: string }> = {
    BRONZE: { color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30", border: "border-amber-200 dark:border-amber-800/40", icon: "⭐" },
    SILVER: { color: "text-slate-600 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-700/30", border: "border-slate-200 dark:border-slate-600/40", icon: "🥈" },
    GOLD: { color: "text-yellow-700 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30", border: "border-yellow-200 dark:border-yellow-800/40", icon: "🥇" },
    PLATINUM: { color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-900/30", border: "border-violet-200 dark:border-violet-800/40", icon: "💎" },
};

export function ClientCheckInResult({ client, onBack, onComplete, services, lockerNumber = "", onLockerChange }: ClientCheckInResultProps) {
    const activeMembership = client.memberships.find(m => m.status === "ACTIVE");
    const loyaltyInfo = client.loyaltyPoints?.[0];
    const tier = loyaltyInfo?.tier || "BRONZE";
    const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.BRONZE;
    const isBirthday = false;

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Back button */}
            <button 
                onClick={onBack}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors opacity-70"
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
                        <h1 className="text-[var(--text-main)] text-sm font-bold">Identity <span className="text-[var(--color-primary)]">Verified</span></h1>
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

            {/* Membership & Loyalty Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Membership Balance */}
                <div className="glass-card p-5 border-[var(--border-main)]">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-base text-[var(--color-primary)]">card_membership</span>
                        <span className="font-bold text-[var(--text-main)] text-xs">Membership</span>
                    </div>
                    {activeMembership ? (
                        <div>
                            <p className="text-lg font-black text-[var(--text-main)]">
                                {activeMembership.balance !== null && activeMembership.balance !== undefined 
                                    ? `${activeMembership.balance} Visits Left`
                                    : "Unlimited"
                                }
                            </p>
                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 opacity-60">
                                {activeMembership.category.name} • {activeMembership.category.isGlobal ? "All Branches" : "This Branch"}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-lg font-black text-[var(--text-muted)] opacity-40">Walk-in</p>
                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 opacity-40">No active membership</p>
                        </div>
                    )}
                </div>

                {/* Loyalty Tier */}
                <div className={`glass-card p-5 border ${tierConfig.border}`}>
                    <div className="flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4 text-[var(--color-primary)]" />
                        <span className="font-bold text-[var(--text-main)] text-xs">Loyalty Tier</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{tierConfig.icon}</span>
                        <div>
                            <p className={`text-lg font-black ${tierConfig.color}`}>{tier}</p>
                            <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest mt-0.5">
                                {loyaltyInfo?.points?.toLocaleString() || 0} Points
                            </p>
                        </div>
                    </div>
                </div>

                {/* Guest Insight */}
                <div className="glass-card p-5 border-[var(--border-main)]">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">✨</span>
                        <span className="font-bold text-[var(--text-main)] text-xs">Insight</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--text-main)] leading-snug">
                        {isBirthday 
                            ? `It's ${client.fullName.split(' ')[0]}'s Birthday! 🎂`
                            : `Welcome back, ${client.fullName.split(' ')[0]}!`
                        }
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 opacity-60">
                        {isBirthday 
                            ? "Offer a complimentary herbal infusion"
                            : "Great to see them again"
                        }
                    </p>
                </div>
            </div>

            {/* Preferences & Health Notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="glass-card p-4 border-[var(--border-main)]">
                    <div className="flex items-center gap-3 mb-2">
                        <Thermometer className="w-4 h-4 text-orange-500" />
                        <span className="font-bold text-[var(--text-main)] text-sm">Temperature</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[var(--text-muted)] text-xs">Prefers:</span>
                        <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2.5 py-0.5 rounded-lg font-bold text-[10px] uppercase tracking-wider">
                            {client.preferences || "Standard (75°C)"}
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

                {client.healthNotes && (
                    <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                        <div className="flex items-center gap-3 mb-2 text-rose-600 dark:text-rose-400">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-bold text-sm">Health Notes</span>
                        </div>
                        <p className="text-[11px] font-medium text-rose-800 dark:text-rose-300">
                            {client.healthNotes}
                        </p>
                    </div>
                )}
                {!client.healthNotes && (
                    <div className="glass-card p-4 border-[var(--border-main)] flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-[11px] font-medium text-[var(--text-muted)]">No health alerts on file</span>
                    </div>
                )}
            </div>

            {/* Quick Check-in Section */}
            <div className="glass-card p-6 border-[var(--border-main)] shadow-sm space-y-5">
                <h3 className="text-[var(--text-main)] font-bold flex items-center gap-2 text-[11px] uppercase tracking-widest opacity-80">
                    <CheckCircle className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    Visit Registration
                </h3>

                {/* Locker Assignment */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[var(--color-primary)] text-sm">lock</span>
                        Locker
                        {lockerNumber && (
                            <span className="ml-auto text-[var(--color-primary)] font-black bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full text-[8px] tracking-widest">
                                Pre-assigned
                            </span>
                        )}
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. B-101"
                        value={lockerNumber}
                        onChange={e => onLockerChange?.(e.target.value)}
                        className={`w-full h-10 rounded-xl px-4 text-sm font-bold outline-none border transition-all focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--text-main)] bg-[var(--bg-app)] ${
                            lockerNumber
                                ? "border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5"
                                : "border-[var(--border-main)]"
                        }`}
                    />
                </div>

                {/* Service + Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-3">
                        <label htmlFor="service-select" className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Select Service</label>
                            <select 
                                id="service-select"
                                title="Service for this visit"
                                className="w-full h-11 bg-[var(--bg-app)] border-[var(--border-main)] rounded-xl px-4 text-[var(--text-main)] focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
                                onChange={(e) => {
                                    if (e.target.value) onComplete(e.target.value, lockerNumber || undefined);
                                }}
                                defaultValue=""
                            >
                            <option value="" disabled>Choose the service for this visit...</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>{s.name} - {s.price.toLocaleString()} RWF</option>
                            ))}
                        </select>
                        {activeMembership && (
                            <p className="text-[10px] font-bold text-[var(--color-primary)]">
                                ✓ Payment will deduct from {activeMembership.category.name} membership
                                {activeMembership.balance !== null && activeMembership.balance !== undefined && ` (${activeMembership.balance} remaining)`}
                            </p>
                        )}
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
