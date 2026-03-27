import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ArrowLeft, User, Phone, Calendar, Edit, Send, Download, CreditCard, Award, History, Info, ShieldAlert } from "lucide-react";

const TIER_CONFIG: Record<string, { color: string; bg: string; border: string; icon: string }> = {
    BRONZE: { color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30", border: "border-amber-200 dark:border-amber-800/40", icon: "⭐" },
    SILVER: { color: "text-slate-600 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-700/30", border: "border-slate-200 dark:border-slate-600/40", icon: "🥈" },
    GOLD: { color: "text-yellow-700 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30", border: "border-yellow-200 dark:border-yellow-800/40", icon: "🥇" },
    PLATINUM: { color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-900/30", border: "border-violet-200 dark:border-violet-800/40", icon: "💎" },
};

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    const userRole = session?.user?.role as string;
    const isSystemRole = userRole === "ADMIN" || userRole === "OWNER";
    
    if (!session?.user) redirect("/login");

    const queryWhere: any = { id };
    if (!isSystemRole && session.user.branchId) {
        queryWhere.branchId = session.user.branchId;
    }

    const client = await prisma.client.findUnique({
        where: queryWhere,
        include: {
            memberships: {
                where: { status: "ACTIVE" },
                include: { category: true },
                orderBy: { createdAt: 'desc' },
                take: 1
            },
            loyaltyPoints: true,
            serviceRecords: {
                include: {
                    service: true,
                    employee: true
                },
                orderBy: { createdAt: 'desc' },
                take: 10
            }
        }
    });

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
                <div className="size-20 bg-[var(--bg-surface-muted)] rounded-full flex items-center justify-center text-[var(--text-muted)] mb-4">
                    <ShieldAlert className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-[var(--text-main)]">Client Not Found</h2>
                <p className="text-[var(--text-muted)] mb-6">The client you are looking for does not exist or has been removed.</p>
                <Link href="/clients" className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-all">
                    Back to Records
                </Link>
            </div>
        );
    }

    const activeMembership = client.memberships[0];
    const loyaltyInfo = client.loyaltyPoints[0];
    const tier = loyaltyInfo?.tier || "BRONZE";
    const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.BRONZE;

    // Calculate visits this month
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());

    const visitsThisMonth = await prisma.serviceRecord.count({
        where: {
            clientId: client.id,
            completedAt: {
                gte: currentMonthStart,
                lte: currentMonthEnd
            },
            status: "COMPLETED"
        }
    });

    return (
        <div className="max-w-[1200px] mx-auto space-y-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] italic opacity-70">
                <Link href="/clients" className="hover:text-[var(--color-primary)] transition-colors">Clients</Link>
                <span className="opacity-30">/</span>
                <span className="text-[var(--text-main)]">Profile</span>
            </div>

            {/* Header Profile Section */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1 flex flex-col md:flex-row gap-6 glass-card p-6 border-[var(--border-main)] shadow-sm">
                    <div className="size-32 bg-[var(--bg-app)] flex items-center justify-center rounded-2xl shrink-0 shadow-inner border border-[var(--border-muted)]">
                        <User className="w-12 h-12 text-[var(--text-muted)]" />
                    </div>
                    <div className="flex flex-col justify-between w-full">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-[var(--text-main)] text-3xl font-black italic tracking-tighter">
                                    {client.fullName.split(' ')[0]} <span className="text-[var(--color-primary)] not-italic">{client.fullName.split(' ').slice(1).join(' ')}</span>
                                </h1>
                                <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-[var(--color-primary)]/20 shadow-sm">
                                    {client.clientType}
                                </span>
                            </div>
                            {client.phone && (
                                <p className="text-[var(--text-muted)] text-lg flex items-center gap-2 font-medium opacity-80">
                                    <Phone className="w-4 h-4" /> {client.phone}
                                </p>
                            )}
                            <p className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest mt-2 opacity-50">
                                REF: {client.id.slice(-8).toUpperCase()} • Joined {format(new Date(client.createdAt), 'MMM yyyy')}
                            </p>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <button className="h-10 px-6 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 text-xs uppercase tracking-widest">
                                <Edit className="w-3.5 h-3.5" />
                                Edit Account
                            </button>
                            <button className="h-10 px-6 bg-[var(--bg-surface-muted)] text-[var(--text-main)] font-bold rounded-xl border border-[var(--border-muted)] hover:bg-[var(--bg-app)] transition-colors flex items-center gap-2 text-xs uppercase tracking-widest">
                                <Send className="w-3.5 h-3.5" />
                                Message
                            </button>
                        </div>
                    </div>
                </div>

                {/* QR Access Card */}
                <div className="w-full md:w-64 glass-card p-6 border-[var(--border-main)] flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)]/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-[var(--color-primary)]/10 transition-colors"></div>
                    <p className="text-[var(--text-main)] font-bold mb-4 text-[11px] uppercase tracking-widest italic opacity-80">Guest Access Key</p>
                    <div className="bg-white p-3 rounded-2xl border-4 border-[var(--border-muted)] shadow-xl group-hover:border-[var(--color-primary)]/30 transition-colors">
                        <div className="size-32 bg-slate-50 flex flex-col items-center justify-center rounded-xl border border-slate-200 text-slate-300">
                            <div className="size-24 border-2 border-slate-200 rounded flex items-center justify-center opacity-40">
                                <span className="material-symbols-outlined text-4xl">qr_code_2</span>
                            </div>
                            <span className="text-[8px] font-mono mt-2 text-slate-400 font-bold">{client.qrCode || 'NO-QR-KEY'}</span>
                        </div>
                    </div>
                    <button className="mt-5 text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:underline italic">
                        <Download className="w-3 h-3" />
                        Download Pass
                    </button>
                </div>
            </div>

            {/* Loyalty & Health Alerts (if any) */}
            {(client.healthNotes || client.preferences) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {client.healthNotes && (
                        <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-[2rem] flex gap-4 items-start">
                            <div className="size-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-rose-500 font-black text-xs uppercase tracking-widest mb-1">Health Alert</h4>
                                <p className="text-[var(--text-main)] text-sm font-medium leading-relaxed">{client.healthNotes}</p>
                            </div>
                        </div>
                    )}
                    {client.preferences && (
                        <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-[2rem] flex gap-4 items-start">
                            <div className="size-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                <Info className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-amber-500 font-black text-xs uppercase tracking-widest mb-1">Guest Preference</h4>
                                <p className="text-[var(--text-main)] text-sm font-medium leading-relaxed">{client.preferences}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Membership & Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 border-[var(--border-main)] shadow-sm hover:border-[var(--color-primary)]/20 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[var(--text-muted)] font-black text-[10px] uppercase tracking-widest opacity-60">Corporate Membership</p>
                        <CreditCard className="w-4 h-4 text-[var(--color-primary)]" />
                    </div>
                    {activeMembership ? (
                        <>
                            <p className="text-2xl font-black text-[var(--text-main)] italic">{activeMembership.category.name}</p>
                            <div className="mt-3 flex items-center gap-2">
                                <span className="bg-[var(--bg-surface-muted)] text-[var(--text-main)] text-[10px] font-black border border-[var(--border-muted)] px-3 py-1 rounded-full uppercase tracking-widest">
                                    {activeMembership.balance !== null ? `${activeMembership.balance} Sessions Left` : "Unlimited Plan"}
                                </span>
                            </div>
                            {activeMembership.endDate && (
                                <p className="text-[10px] text-[var(--text-muted)] font-bold mt-3 uppercase tracking-tighter opacity-50 group-hover:opacity-100 transition-opacity">
                                    Expires {format(new Date(activeMembership.endDate), 'MMM dd, yyyy')}
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-xl font-black text-[var(--text-muted)] opacity-30 italic">No Active Plan</p>
                            <p className="text-[10px] text-[var(--text-muted)] mt-3 font-bold uppercase tracking-widest opacity-40 italic">Client set as standard walk-in</p>
                        </>
                    )}
                </div>

                <div className={`glass-card p-6 border ${tierConfig.border} shadow-sm group relative overflow-hidden`}>
                    <div className="absolute -right-4 -bottom-4 size-24 text-[var(--text-main)] opacity-5 rotate-12 group-hover:scale-110 group-hover:opacity-10 transition-all">
                        <Award className="size-full" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[var(--text-muted)] font-black text-[10px] uppercase tracking-widest opacity-60">Loyalty Status</p>
                        <Award className="w-4 h-4 text-[var(--color-primary)]" />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl filter drop-shadow-sm">{tierConfig.icon}</span>
                        <div>
                            <p className={`text-2xl font-black ${tierConfig.color} italic tracking-tighter`}>{tier}</p>
                            <p className="text-[11px] font-black text-[var(--color-primary)] mt-0.5 tracking-widest">
                                {loyaltyInfo?.points?.toLocaleString() || 0} POINTS
                            </p>
                        </div>
                    </div>
                    <p className="text-[9px] text-[var(--text-muted)] font-bold mt-4 flex items-center gap-1.5 opacity-50">
                        <Info className="w-3 h-3" />
                        Next Reward at 5,000 pts
                    </p>
                </div>

                <div className="glass-card p-6 border-[var(--border-main)] shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[var(--text-muted)] font-black text-[10px] uppercase tracking-widest opacity-60">Monthly Engagement</p>
                            <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                        </div>
                        <p className="text-3xl font-black text-[var(--text-main)] italic tracking-tighter">
                            {visitsThisMonth} <span className="text-sm not-italic opacity-40 font-bold uppercase tracking-widest ml-1">Session{visitsThisMonth !== 1 ? 's' : ''}</span>
                        </p>
                    </div>
                    <Link href={`/operations?clientId=${client.id}`} className="mt-4 h-10 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] border-2 border-[var(--color-primary)]/20 rounded-xl hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all italic">
                        Book New Session
                    </Link>
                </div>
            </div>

            {/* Past Visits Section */}
            <div className="glass-card border-[var(--border-main)] shadow-sm overflow-hidden rounded-[2rem]">
                <div className="px-8 py-6 border-b border-[var(--border-muted)] flex items-center justify-between bg-[var(--bg-surface-muted)]">
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center text-[var(--color-primary)]">
                            <History className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-black text-[var(--text-main)] italic tracking-tight">Recent <span className="text-[var(--color-primary)] not-italic">Activity</span></h3>
                    </div>
                    <Link href={`/operations?clientId=${client.id}`} className="text-[10px] text-[var(--color-primary)] font-black uppercase tracking-widest flex items-center gap-2 hover:underline transition-all italic">
                        Full Ledger <ArrowLeft className="w-3 h-3 rotate-180" />
                    </Link>
                </div>

                {client.serviceRecords.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--bg-app)]/50">
                                    <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">Timestamp</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">Service Item</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">Attendant</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60 text-center">Duration</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60 text-right">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-muted)]">
                                {client.serviceRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-[var(--bg-surface-muted)] transition-colors group">
                                        <td className="px-8 py-5 text-[var(--text-main)] font-black italic whitespace-nowrap text-sm">
                                            {format(new Date(record.createdAt), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-[var(--text-main)] font-bold text-sm tracking-tight">{record.service.name}</span>
                                                {record.boxNumber && <span className="text-[9px] font-bold text-[var(--color-primary)] uppercase tracking-widest mt-0.5">Assigned Box: {record.boxNumber}</span>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="size-6 bg-[var(--bg-app)] rounded-full flex items-center justify-center border border-[var(--border-muted)]">
                                                    <User className="size-3 text-[var(--text-muted)]" />
                                                </div>
                                                <span className="text-[var(--text-muted)] font-bold text-xs">{record.employee ? record.employee.fullName : 'Self-Entry'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-[var(--text-muted)] font-black text-xs text-center tabular-nums">
                                            {record.service.duration}m
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                                                record.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                record.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                record.status === 'CREATED' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-[var(--text-main)] font-black text-right tracking-tighter group-hover:text-[var(--color-primary)] transition-colors">
                                            {record.amount.toLocaleString()} <span className="text-[10px] not-italic opacity-40 ml-0.5">RWF</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-16 text-center bg-[var(--bg-app)]/30">
                        <History className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-20" />
                        <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest italic opacity-40">No historical data available</p>
                    </div>
                )}
            </div>
        </div>
    );
}
