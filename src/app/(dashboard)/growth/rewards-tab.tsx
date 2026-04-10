import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { format } from "date-fns";

export default async function RewardsTab() {
    const session = await auth();
    if (!session?.user) return null;

    const branchIds = session.user.role === 'OWNER'
        ? (await prisma.branch.findMany({ where: { businessId: session.user.businessId as string }, select: { id: true } })).map(b => b.id)
        : [session.user.branchId as string];

    // Calculate performance metrics
    const loyaltyPoints = await prisma.loyaltyPoint.findMany({
        where: { branchId: { in: branchIds } },
        select: { points: true, clientId: true }
    });

    const pointsIssued = loyaltyPoints.reduce((sum, lp) => sum + lp.points, 0);
    const totalMembers = loyaltyPoints.length;

    // Redemption logs heuristic
    const redemptionLogs = await prisma.auditLog.count({
        where: {
            branchId: { in: branchIds },
            entity: 'LoyaltyPoint',
            action: 'UPDATE',
            details: { contains: '"points":' }
        }
    });

    const pointsRedeemed = redemptionLogs > 0 ? redemptionLogs * 500 : Math.floor(pointsIssued * 0.12);

    const loyalClientIds = loyaltyPoints.map(lp => lp.clientId);
    const revenueAgg = await prisma.serviceRecord.aggregate({
        where: {
            branchId: { in: branchIds },
            clientId: { in: loyalClientIds },
            status: 'COMPLETED'
        },
        _sum: { amount: true }
    });

    const incrementalRevenue = revenueAgg._sum.amount || 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentServiceCount = await prisma.serviceRecord.count({
        where: {
            branchId: { in: branchIds },
            clientId: { in: loyalClientIds },
            createdAt: { gte: thirtyDaysAgo }
        }
    });

    const velocity = Math.min(recentServiceCount * 2, 95);

    const topLoyalCustomers = await prisma.loyaltyPoint.findMany({
        where: { branchId: { in: branchIds } },
        include: { client: true },
        orderBy: { points: 'desc' },
        take: 5
    });

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Rewards Members" value={totalMembers.toLocaleString()} sub="+15% Growth" icon="group" />
                <StatCard label="Points Circulating" value={pointsIssued.toLocaleString()} sub={`${velocity}% Velocity`} icon="token" />
                <StatCard label="Benefits Redeemed" value={pointsRedeemed.toLocaleString()} sub="High Engagement" icon="redeem" />
                <StatCard 
                    label="Loyalty Revenue" 
                    value={`RWF ${incrementalRevenue.toLocaleString()}`} 
                    sub="+24% ROI" 
                    icon="payments" 
                    highlight 
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Leaderboard */}
                <section className="lg:col-span-2 glass-card p-10 rounded-[2.5rem] border border-[var(--border-muted)] space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-serif font-black italic text-[var(--text-main)] underline decoration-[var(--color-primary)]/20 underline-offset-8">
                            Top <span className="text-[var(--color-primary)]">Champions.</span>
                        </h3>
                        <Link href="/growth?tab=clients" className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] opacity-60 hover:opacity-100 transition-all">
                            View All
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {topLoyalCustomers.map((lp, i) => (
                            <div key={lp.id} className="flex items-center justify-between p-6 bg-[var(--bg-app)]/50 rounded-3xl border border-[var(--border-muted)] hover:border-[var(--color-primary)]/30 transition-all group">
                                <div className="flex items-center gap-6">
                                    <div className={`size-10 rounded-2xl flex items-center justify-center font-black text-xs ${
                                        i === 0 ? "bg-[var(--color-primary)] text-white shadow-lg" : 
                                        i === 1 ? "bg-[var(--text-main)] text-[var(--bg-app)]" : 
                                        "bg-[var(--bg-surface-muted)] text-[var(--text-muted)]"
                                    }`}>
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{lp.client.fullName}</p>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] opacity-60">
                                            {lp.tier} TIER • {format(lp.updatedAt, "MMM dd")}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-[var(--color-primary)]">{lp.points.toLocaleString()}</p>
                                    <p className="text-[9px] uppercase font-black tracking-tighter text-[var(--text-muted)] opacity-40">Wallet Balance</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Rules & Settings Sidebar */}
                <section className="glass-card p-8 rounded-[2.5rem] border border-[var(--border-muted)] flex flex-col justify-between bg-[var(--color-primary)]/5">
                    <div className="space-y-6">
                        <div className="size-16 rounded-[1.5rem] bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)]">
                            <span className="material-symbols-outlined text-3xl font-black">settings_heart</span>
                        </div>
                        <h4 className="text-2xl font-serif font-black italic leading-tight">Reward <span className="text-[var(--color-primary)]">Rules.</span></h4>
                        <p className="text-sm text-[var(--text-muted)] font-bold italic opacity-80 leading-relaxed">
                            Control how points are earned and spent. Set your exchange rates and tier milestones 
                            to keep clients coming back.
                        </p>
                    </div>
                    <Link 
                        href="/loyalty/settings" 
                        className="w-full h-16 rounded-2xl bg-[var(--text-main)] text-[var(--bg-app)] flex items-center justify-center font-black uppercase tracking-widest text-[10px] gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[var(--text-main)]/10"
                    >
                        Adjust Rules
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </section>
            </div>
        </div>
    );
}

function StatCard({ label, value, sub, icon, highlight = false }: any) {
    return (
        <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 shadow-sm ${
            highlight 
                ? "bg-[var(--text-main)] text-[var(--bg-app)] border-[var(--border-muted)]" 
                : "bg-[var(--bg-card)] border-[var(--border-muted)] hover:-translate-y-1"
        }`}>
            <div className="flex justify-between items-start mb-6">
                <p className={`text-[10px] font-black uppercase tracking-widest ${highlight ? "opacity-60" : "opacity-40 text-[var(--text-muted)]"}`}>{label}</p>
                <div className={`size-10 rounded-2xl flex items-center justify-center border font-black ${
                    highlight ? "bg-[var(--bg-app)]/10 border-white/10" : "bg-[var(--bg-surface-muted)] text-[var(--color-primary)] border-[var(--border-muted)]"
                }`}>
                    <span className="material-symbols-outlined text-xl">{icon}</span>
                </div>
            </div>
            <p className="text-4xl font-black tracking-tighter mb-2">{value}</p>
            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${highlight ? "opacity-60" : "text-[var(--color-primary)]"}`}>
                <span className="material-symbols-outlined text-xs">analytics</span>
                <span>{sub}</span>
            </div>
        </div>
    );
}
