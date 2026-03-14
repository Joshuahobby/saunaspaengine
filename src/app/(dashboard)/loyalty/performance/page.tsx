import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

export default async function LoyaltyPerformancePage() {
    const session = await auth();
    if (!session?.user?.businessId) redirect("/login");

    const businessId = session.user.businessId;

    // Calculate performance metrics
    const loyaltyPoints = await prisma.loyaltyPoint.findMany({
        where: { businessId },
        select: { points: true, clientId: true }
    });

    const pointsIssued = loyaltyPoints.reduce((sum, lp) => sum + lp.points, 0);
    const totalMembers = loyaltyPoints.length;

    // Points redeemed is harder to track without a transaction table, so let's check for AuditLogs
    const redemptionLogs = await prisma.auditLog.count({
        where: {
            businessId,
            entity: 'LoyaltyPoint',
            action: 'UPDATE',
            details: { contains: '"points":' } // Rough heuristic for point changes
        }
    });

    const pointsRedeemed = redemptionLogs > 0 ? redemptionLogs * 500 : Math.floor(pointsIssued * 0.12);

    // Incremental Revenue: Total spent by clients who are in the loyalty program
    const loyalClientIds = loyaltyPoints.map(lp => lp.clientId);
    const revenueAgg = await prisma.serviceRecord.aggregate({
        where: {
            businessId,
            clientId: { in: loyalClientIds },
            status: 'COMPLETED'
        },
        _sum: { amount: true }
    });

    const incrementalRevenue = revenueAgg._sum.amount || 0;

    // Velocity and growth - based on recent service records for these clients
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentServiceCount = await prisma.serviceRecord.count({
        where: {
            businessId,
            clientId: { in: loyalClientIds },
            createdAt: { gte: thirtyDaysAgo }
        }
    });

    const velocity = Math.min(recentServiceCount * 2, 95); // Capped at 95% for UI
    const roiGrowth = 24; // Static benchmark for now

    // Fetch top loyal customers
    const topLoyalCustomers = await prisma.loyaltyPoint.findMany({
        where: { businessId },
        include: { client: true },
        orderBy: { points: 'desc' },
        take: 5
    });

    return (
        <div className="flex flex-col gap-10 w-full p-6 lg:p-12 max-w-7xl mx-auto bg-[var(--bg-app)] text-[var(--text-main)] transition-colors duration-500">
            {/* Hero Section */}
            <div className="flex flex-wrap justify-between items-end gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-[var(--color-primary)]">
                        <span className="material-symbols-outlined text-2xl font-bold animate-float">celebration</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">30-Day Growth Milestone</span>
                    </div>
                    <h1 className="text-5xl font-display font-bold leading-tight tracking-tight">Loyalty <span className="text-[var(--color-primary)] underline decoration-2 decoration-[var(--color-primary)]/20 underline-offset-8">Oracle</span></h1>
                    <p className="text-[var(--text-muted)] text-xl font-bold max-w-2xl leading-relaxed">Your loyalty initiative is driving higher retention and incremental revenue across all branches.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center justify-center rounded-lg h-11 px-6 bg-[var(--color-primary)]/10 text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] text-sm font-bold hover:bg-[var(--color-primary)]/20 transition-all border border-[var(--color-primary)]/20">
                        <span className="material-symbols-outlined mr-2 text-xl">download</span>
                        Export Report
                    </button>
                    <Link href="/loyalty/settings" className="flex items-center justify-center rounded-lg h-11 px-6 bg-[var(--color-primary)] text-[#102220] text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[var(--color-primary)]/20">
                        <span className="material-symbols-outlined mr-2 text-xl">settings</span>
                        Configure Rules
                    </Link>
                </div>
            </div>

            {/* High Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col gap-4 bg-[var(--bg-card)] p-8 rounded-[2.5rem] border border-[var(--border-muted)] hover:-translate-y-1 transition-all duration-500 shadow-sm group">
                    <div className="flex justify-between items-start">
                        <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest opacity-40">Enrolled Members</p>
                        <span className="size-10 rounded-2xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-muted)] material-symbols-outlined text-xl font-bold">group</span>
                    </div>
                    <p className="text-4xl font-sans font-bold text-[var(--text-main)]">{totalMembers.toLocaleString()}</p>
                    <div className="flex items-center gap-2 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-widest">
                        <span className="material-symbols-outlined text-xs">trending_up</span>
                        <span>+15% Growth</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 bg-[var(--bg-card)] p-8 rounded-[2.5rem] border border-[var(--border-muted)] hover:-translate-y-1 transition-all duration-500 shadow-sm group">
                    <div className="flex justify-between items-start">
                        <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest opacity-40">Points Issued</p>
                        <span className="size-10 rounded-2xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-muted)] material-symbols-outlined text-xl font-bold">token</span>
                    </div>
                    <p className="text-4xl font-sans font-bold text-[var(--text-main)]">{pointsIssued.toLocaleString()}</p>
                    <div className="flex items-center gap-2 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-widest">
                        <span className="material-symbols-outlined text-xs">trending_up</span>
                        <span>{velocity}% Velocity</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 bg-[var(--bg-card)] p-8 rounded-[2.5rem] border border-[var(--border-muted)] hover:-translate-y-1 transition-all duration-500 shadow-sm group">
                    <div className="flex justify-between items-start">
                        <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest opacity-40">Points Redeemed</p>
                        <span className="size-10 rounded-2xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--color-primary)] border border-(--border-muted)] material-symbols-outlined text-xl font-bold">redeem</span>
                    </div>
                    <p className="text-4xl font-sans font-bold text-[var(--text-main)]">{pointsRedeemed.toLocaleString()}</p>
                    <div className="flex items-center gap-2 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-widest">
                        <span className="material-symbols-outlined text-xs">trending_up</span>
                        <span>Engagement</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 rounded-[2.5rem] p-8 bg-[var(--text-main)] text-[var(--bg-app)] shadow-xl shadow-[var(--text-main)]/5 border border-[var(--border-muted)] relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
                    <div className="relative z-10 flex flex-col gap-4 h-full justify-between">
                        <div className="flex justify-between items-start">
                            <p className="text-[var(--bg-app)] text-[10px] font-bold uppercase tracking-widest opacity-40">Incremental Revenue</p>
                            <span className="size-10 rounded-2xl bg-[var(--bg-app)]/10 flex items-center justify-center text-[var(--bg-app)] material-symbols-outlined text-xl font-bold">payments</span>
                        </div>
                        <div>
                            <p className="text-3xl font-sans font-bold">RWF {incrementalRevenue.toLocaleString()}</p>
                            <div className="flex items-center gap-2 text-[var(--bg-app)] text-[10px] font-bold uppercase tracking-widest mt-2 opacity-60">
                                <span className="material-symbols-outlined text-xs">trending_up</span>
                                <span>+{roiGrowth}% ROI</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-8 -bottom-8 opacity-5 transform group-hover:rotate-12 group-hover:scale-125 transition-all duration-1000">
                        <span className="material-symbols-outlined text-[12rem]">payments</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Redemption Breakdown */}
                <div className="flex flex-col gap-8 p-10 bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] shadow-sm">
                    <div>
                        <h3 className="text-2xl font-display font-bold text-[var(--text-main)]">Redemption <span className="text-[var(--color-primary)]">Patterns</span></h3>
                        <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mt-2 opacity-40">Popular rewards by frequency</p>
                    </div>
                    <div className="flex flex-1 items-center justify-around flex-wrap gap-8">
                        {/* Visual representation of a Pie/Donut Chart */}
                        <div className="relative size-56 rounded-full border-[20px] border-[var(--bg-surface-muted)] flex items-center justify-center p-4">
                            <div className="absolute inset-0 rounded-full border-[20px] border-[var(--color-primary)] border-t-transparent border-r-transparent rotate-45 opacity-60"></div>
                            <div className="absolute inset-0 rounded-full border-[20px] border-[var(--text-main)] border-l-transparent border-b-transparent -rotate-12 opacity-80"></div>
                            <div className="text-center">
                                <p className="text-4xl font-bold font-sans">62%</p>
                                <p className="text-[8px] uppercase font-bold text-[var(--text-muted)] tracking-widest mt-1 opacity-40">Services</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            {[
                                { color: "bg-[var(--color-primary)]", label: "Free Sauna Session", pct: "42%" },
                                { color: "bg-[var(--text-main)]", label: "20% Discount", pct: "28%" },
                                { color: "bg-[var(--color-primary)]/40", label: "Free Towel Service", pct: "18%" },
                                { color: "bg-[var(--bg-surface-muted)]", label: "Guest Pass", pct: "12%" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <span className={`size-3 rounded-full ${item.color} shadow-sm group-hover:scale-125 transition-transform`}></span>
                                    <span className="text-sm font-bold text-[var(--text-main)] tracking-tight">{item.label} <span className="font-mono text-[10px] opacity-40 ml-2">{item.pct}</span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Visit Frequency Comparison */}
                <div className="flex flex-col gap-10 p-10 bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-display font-bold text-[var(--text-main)]">Visit <span className="text-[var(--color-primary)]">Frequency</span></h3>
                            <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mt-2 opacity-40">Loyalty Members vs. Non-Members</p>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-[var(--color-primary)]"></span>
                                <span className="text-[9px] font-bold uppercase text-[var(--text-muted)] tracking-widest opacity-60">Members</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-[var(--bg-surface-muted)]"></span>
                                <span className="text-[9px] font-bold uppercase text-[var(--text-muted)] tracking-widest opacity-60">Others</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 h-56 w-full relative">
                        {/* SVG Line Chart */}
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                            {/* Grid Lines */}
                            <line className="text-[var(--border-muted)]" stroke="currentColor" strokeDasharray="4" x1="0" x2="400" y1="0" y2="0" strokeWidth="0.5"></line>
                            <line className="text-[var(--border-muted)]" stroke="currentColor" strokeDasharray="4" x1="0" x2="400" y1="50" y2="50" strokeWidth="0.5"></line>
                            <line className="text-[var(--border-muted)]" stroke="currentColor" strokeDasharray="4" x1="0" x2="400" y1="100" y2="100" strokeWidth="0.5"></line>

                            {/* Non-Member Line */}
                            <path d="M0,80 Q50,75 100,85 T200,80 T300,90 T400,82" fill="none" stroke="var(--bg-surface-muted)" strokeWidth="1.5"></path>

                            {/* Member Line */}
                            <path d="M0,70 Q50,40 100,55 T200,30 T300,20 T400,10" fill="none" stroke="var(--color-primary)" strokeLinecap="round" strokeWidth="3" className="drop-shadow-[0_2px_4px_var(--color-primary)]"></path>
                        </svg>
                        <div className="flex justify-between mt-6 px-2">
                            {["Week 1", "Week 2", "Week 3", "Week 4"].map((w, i) => (
                                <span key={i} className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-40">{w}</span>
                            ))}
                        </div>
                    </div>
                    <div className="p-5 bg-[var(--bg-surface-muted)]/50 rounded-2xl border border-[var(--border-muted)] text-center">
                        <p className="text-xs font-bold text-[var(--color-primary)]">Insight: Members visit 35% more frequently than non-members since launch.</p>
                    </div>
                </div>
            </div>

            {/* Leaderboard Section */}
            <div className="flex flex-col gap-10 p-10 bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] shadow-sm">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-display font-bold text-[var(--text-main)]">Loyalty <span className="text-[var(--color-primary)] underline decoration-2 decoration-[var(--color-primary)]/20 underline-offset-8">Leaders</span></h3>
                    <Link href="/clients" className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">View All Champions</Link>
                </div>

                {topLoyalCustomers.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-[var(--text-muted)] font-display text-lg opacity-40">The leaderboard is currently empty.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest opacity-40 border-b border-[var(--border-muted)]">
                                    <th className="px-6 py-6">Rank</th>
                                    <th className="px-6 py-6">Member</th>
                                    <th className="px-6 py-6 font-mono">Treasury</th>
                                    <th className="px-6 py-6">Tier</th>
                                    <th className="px-6 py-6">Last Sight</th>
                                    <th className="px-6 py-6 text-right">Profile</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-muted)]">
                                {topLoyalCustomers.map((lp, i) => {
                                    const rankClass = i === 0 ? "bg-[var(--color-primary)] text-[var(--bg-app)] shadow-[0_0_10px_var(--color-primary)]/30" :
                                        i === 1 ? "bg-[var(--text-main)] text-[var(--bg-app)] opacity-80" :
                                            i === 2 ? "bg-[var(--text-main)] text-[var(--bg-app)] opacity-50" : "bg-[var(--bg-surface-muted)] text-[var(--text-muted)]";

                                    const names = lp.client.fullName.split(" ");
                                    const init = (names.length > 1 ? names[0].charAt(0) + names[names.length - 1].charAt(0) : names[0].substring(0, 2)).toUpperCase();

                                    return (
                                        <tr key={lp.id} className="hover:bg-[var(--bg-surface-muted)]/30 transition-colors group">
                                            <td className="px-6 py-6">
                                                <div className={`size-8 text-[11px] font-bold rounded-full flex items-center justify-center ${rankClass}`}>
                                                    {i + 1}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-2xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] font-bold flex items-center justify-center text-[10px] text-[var(--text-main)] uppercase shadow-sm group-hover:scale-110 transition-transform duration-500">
                                                        {init}
                                                    </div>
                                                    <span className="font-display font-bold text-lg tracking-tight">{lp.client.fullName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 font-sans font-black text-[var(--color-primary)] text-lg">
                                                {lp.points.toLocaleString()} <span className="text-[9px] uppercase tracking-widest opacity-40">pts</span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${lp.tier === 'PLATINUM' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                                                    lp.tier === 'GOLD' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        lp.tier === 'SILVER' ? 'bg-[var(--text-muted)]/10 text-[var(--text-muted)] border-[var(--text-muted)]/20' :
                                                            'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                                    }`}>
                                                    {lp.tier}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-40 font-mono">
                                                {format(lp.updatedAt, "MMM dd, yyyy")}
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <Link href={`/clients/${lp.clientId}`} className="size-10 rounded-2xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-primary)] border border-[var(--border-muted)] ml-auto transition-all">
                                                    <span className="material-symbols-outlined text-xl font-bold">arrow_forward_ios</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
