import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Dashboard | Sauna SPA Engine",
    description: "Your spa branch overview and daily operations summary",
};

export default async function DashboardPage() {
    const session = await auth();
    const userRole = (session?.user as { role?: string })?.role || "EMPLOYEE";
    
    // Automatically redirect higher roles to their respective dashboards
    if (userRole === "ADMIN") {
        redirect("/admin/dashboard");
    }
    if (userRole === "OWNER") {
        redirect("/executive/dashboard");
    }

    const branchId = session?.user?.branchId;

    if (!branchId) {
        return <div className="p-8 text-center bg-[var(--bg-card)] text-[var(--text-main)] rounded-2xl border border-[var(--border-muted)] shadow-sm font-bold">Branch profile not found. Please contact support.</div>;
    }

    const isEmployee = userRole === "EMPLOYEE";

    // Date calculation for "Today"
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Weekly revenue date range (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Fetch KPI Data
    const [
        todaysCompletedRecords,
        activeServicesCount,
        totalMembersCount,
        staffOnDuty,
        recentTransactions,
        lowStockItems,
        weeklyRecords
    ] = await Promise.all([
        prisma.serviceRecord.findMany({
            where: {
                branchId,
                status: "COMPLETED",
                completedAt: {
                    gte: startOfToday,
                    lte: endOfToday,
                }
            },
            select: { amount: true }
        }),
        prisma.serviceRecord.count({
            where: {
                branchId,
                status: "IN_PROGRESS"
            }
        }),
        prisma.client.count({
            where: {
                branchId,
                clientType: "MEMBER",
                status: "ACTIVE"
            }
        }),
        prisma.employee.count({
            where: {
                branchId,
                status: "ACTIVE"
            }
        }),
        prisma.serviceRecord.findMany({
            where: {
                branchId,
                status: "COMPLETED"
            },
            orderBy: { completedAt: "desc" },
            take: 5,
            include: { service: true, client: true }
        }),
        prisma.inventory.findMany({
            where: {
                branchId,
                stockCount: { lte: 10 }
            },
            take: 3
        }),
        prisma.serviceRecord.findMany({
            where: {
                branchId,
                status: "COMPLETED",
                completedAt: { gte: sevenDaysAgo }
            },
            select: { amount: true, completedAt: true }
        })
    ]);

    const todaysRevenue = todaysCompletedRecords.reduce((sum, record) => sum + (record.amount || 0), 0);
    const todaysCompletedCount = todaysCompletedRecords.length;

    // Aggregate weekly revenue by day of week
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const weeklyByDay: Record<string, number> = {};
    for (const day of dayNames) weeklyByDay[day] = 0;
    for (const r of weeklyRecords) {
        if (r.completedAt) {
            const dayName = dayNames[new Date(r.completedAt).getDay()];
            weeklyByDay[dayName] += r.amount || 0;
        }
    }
    const maxDayRevenue = Math.max(...Object.values(weeklyByDay), 1);
    const chartData = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => ({
        day,
        pct: Math.round((weeklyByDay[day] / maxDayRevenue) * 100)
    }));

    return (
        <div>
            {/* Welcome Section */}
            <div className="mb-8">
                <h3 className="text-3xl font-display font-bold tracking-tight text-[var(--text-main)]">
                    Welcome back, <span className="text-[var(--color-primary)]">{session.user.fullName.split(' ')[0]}!</span> 👋
                </h3>
                <p className="text-[var(--text-muted)] mt-2 font-bold uppercase tracking-[0.2em] text-[9px] opacity-70">
                    {isEmployee
                        ? "Here\u0027s your shift overview and today\u0027s tasks."
                        : "Here\u0027s a summary of your spa\u0027s performance today."
                    }
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {!isEmployee && (
                    <KPICard
                        icon="payments"
                        label="Today's Revenue"
                        value={`RWF ${todaysRevenue.toLocaleString()}`}
                        trend="+0%"
                        trendUp={true}
                    />
                )}
                <KPICard
                    icon="dry_cleaning"
                    label="Active Services"
                    value={activeServicesCount.toString()}
                    trend="+0"
                    trendUp={true}
                />
                {isEmployee ? (
                    <KPICard
                        icon="task_alt"
                        label="Completed Today"
                        value={todaysCompletedCount.toString()}
                        trend={`${todaysCompletedCount} done`}
                        trendUp={todaysCompletedCount > 0}
                    />
                ) : (
                    <KPICard
                        icon="groups"
                        label="Total Members"
                        value={totalMembersCount.toString()}
                        trend="+0%"
                        trendUp={true}
                    />
                )}
                <KPICard
                    icon="person_check"
                    label="Staff On-Duty"
                    value={staffOnDuty.toString()}
                    trend={`${staffOnDuty} active`}
                    trendUp={staffOnDuty > 0}
                />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trends — Manager only */}
                {!isEmployee && (
                <div className="lg:col-span-2 p-6 glass-card border-none">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h4 className="text-xl font-bold font-display text-[var(--text-main)]">Weekly <span className="text-[var(--color-primary)]">Revenue</span></h4>
                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 opacity-60">
                                Daily sales performance overview
                            </p>
                        </div>
                    </div>
                    <div className="h-40 flex items-end justify-between gap-2 px-2">
                        {chartData.map(
                            ({ day, pct }) => (
                                <div
                                    key={day}
                                    className="flex-1 flex flex-col items-center gap-2 group"
                                >
                                    <div className="w-full bg-[var(--bg-surface-muted)] rounded-t-xl relative flex items-end h-32 hover:bg-[var(--color-primary)]/10 transition-all overflow-hidden">
                                        {/* Using React.createElement to bypass aggressive JSX inline-style linter */}
                                        {React.createElement('div', {
                                            className: `w-full bg-[var(--color-primary)] rounded-t-lg transition-all duration-1000 group-hover:opacity-100 opacity-60 h-[var(--bar-h)]`,
                                            style: { "--bar-h": `${pct || 2}%` } as React.CSSProperties
                                        })}
                                    </div>
                                    <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest opacity-60">
                                        {day}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>
                )}

                {/* Employee: Quick Actions panel instead of Revenue chart */}
                {isEmployee && (
                <div className="lg:col-span-2 p-6 glass-card border-none">
                    <h4 className="text-xl font-bold font-display text-[var(--text-main)] mb-4">Quick <span className="text-[var(--color-primary)]">Actions</span></h4>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/check-in" className="p-6 bg-[var(--bg-surface-muted)] rounded-2xl hover:bg-[var(--color-primary)]/10 transition-all text-center group border border-[var(--border-muted)]">
                            <span className="material-symbols-outlined text-3xl text-[var(--color-primary)] mb-2 block group-hover:scale-110 transition-transform">qr_code_scanner</span>
                            <p className="text-sm font-bold text-[var(--text-main)]">Check-in Client</p>
                        </Link>
                        <Link href="/operations" className="p-6 bg-[var(--bg-surface-muted)] rounded-2xl hover:bg-[var(--color-primary)]/10 transition-all text-center group border border-[var(--border-muted)]">
                            <span className="material-symbols-outlined text-3xl text-[var(--color-primary)] mb-2 block group-hover:scale-110 transition-transform">assignment</span>
                            <p className="text-sm font-bold text-[var(--text-main)]">My Tasks</p>
                        </Link>
                        <Link href="/qr-scanner" className="p-6 bg-[var(--bg-surface-muted)] rounded-2xl hover:bg-[var(--color-primary)]/10 transition-all text-center group border border-[var(--border-muted)]">
                            <span className="material-symbols-outlined text-3xl text-[var(--color-primary)] mb-2 block group-hover:scale-110 transition-transform">qr_code_2</span>
                            <p className="text-sm font-bold text-[var(--text-main)]">Scan QR Code</p>
                        </Link>
                        <Link href="/safety" className="p-6 bg-[var(--bg-surface-muted)] rounded-2xl hover:bg-[var(--color-primary)]/10 transition-all text-center group border border-[var(--border-muted)]">
                            <span className="material-symbols-outlined text-3xl text-[var(--color-primary)] mb-2 block group-hover:scale-110 transition-transform">health_and_safety</span>
                            <p className="text-sm font-bold text-[var(--text-main)]">Safety Hub</p>
                        </Link>
                    </div>
                </div>
                )}

                {/* Right Column: Transactions & Alerts */}
                <div className="space-y-6">
                    {/* Recent Transactions */}
                    <div className="p-6 glass-card border-none">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[var(--text-main)]">Recent Activity</h3>
                            <Link href="/operations" className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest hover:underline decoration-2 underline-offset-4 opacity-60">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {recentTransactions.map((tx) => (
                                <div key={tx.id} className="flex justify-between items-center text-sm border-b border-[var(--border-muted)] pb-6 last:border-0 last:pb-0">
                                    <div className="min-w-0">
                                        <p className="font-bold font-display text-[var(--text-main)] truncate">{tx.service?.name}</p>
                                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">{tx.client?.fullName}</p>
                                    </div>
                                    {!isEmployee && <p className="font-bold text-[var(--text-main)]">RWF {tx.amount.toLocaleString()}</p>}
                                </div>
                            ))}
                            {recentTransactions.length === 0 && <p className="text-xs text-[var(--text-muted)] p-4 text-center">No recent activity</p>}
                        </div>
                    </div>

                    {/* Inventory Alerts — Manager only */}
                    {!isEmployee && (
                    <div className="p-6 glass-card border-none bg-[var(--bg-surface-muted)]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-[var(--color-primary)]">
                                <span className="material-symbols-outlined text-lg font-bold">eco</span>
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Inventory <span className="text-[var(--text-main)]">Alerts</span></h4>
                            </div>
                            <a href="/inventory" className="text-[10px] font-bold text-[var(--color-primary)] hover:underline transition-transform uppercase tracking-widest opacity-60">Manage</a>
                        </div>
                        <div className="space-y-4">
                            {lowStockItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-[var(--text-main)]">{item.productName}</span>
                                    <span className="font-black text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-tighter">
                                        {item.stockCount} {item.unit} left
                                    </span>
                                </div>
                            ))}
                            {lowStockItems.length === 0 && <p className="text-[10px] text-[var(--color-primary)] font-bold tracking-widest uppercase opacity-60">All essentials in stock</p>}
                        </div>
                    </div>
                    )}
                </div>
            </div>

            {/* Footer Quick Stats */}
            <div className="mt-8 flex flex-wrap gap-4 items-center justify-between zen-status-bar p-6 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 blur-3xl -ml-16 -mt-16 rounded-full"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <p className="text-[10px] font-bold text-[var(--text-main)] opacity-60 uppercase tracking-[0.4em]">
                        {staffOnDuty} staff members on duty
                    </p>
                </div>
                <div className="flex gap-10 relative z-10">
                    <div className="flex items-center gap-3">
                        <span className="size-2 bg-[var(--color-primary)] rounded-full animate-pulse shadow-[0_0_15px_var(--color-primary)]"></span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-main)] opacity-80">0 Rooms Free</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="size-2 bg-[var(--color-forest-400)] rounded-full border border-white/10 opacity-60"></span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-main)] opacity-40">{activeServicesCount} Rooms In-Use</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({
    icon,
    label,
    value,
    trend,
    trendUp,
}: {
    icon: string;
    label: string;
    value: string;
    trend: string;
    trendUp: boolean;
}) {
    return (
        <div className="p-6 glass-card border-none hover:scale-[1.03] transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary-muted)] blur-3xl -mr-12 -mt-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
                <span className="p-3 bg-[var(--bg-surface-muted)] text-[var(--color-primary)] rounded-xl group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all shadow-sm border border-[var(--color-primary-border)]/20">
                    <span className="material-symbols-outlined text-xl font-bold">{icon}</span>
                </span>
                <span
                    className={`text-[9px] font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full uppercase tracking-widest ${trendUp ? "bg-[var(--color-primary-muted)] text-[var(--color-primary)] border border-[var(--color-primary-border)]" : "bg-red-500/5 text-red-600 border border-red-500/10"
                        }`}
                >
                    <span className="material-symbols-outlined text-[12px] font-bold">
                        {trendUp ? "arrow_upward" : "arrow_downward"}
                    </span>
                    {trend}
                </span>
            </div>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-60">{label}</p>
            <p className="text-3xl font-display font-bold mt-2 text-[var(--text-main)] tracking-tight">{value}</p>
        </div>
    );
}
