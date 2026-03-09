import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const metadata = {
    title: "Dashboard | Sauna SPA Engine",
    description: "Your spa business overview and daily operations summary",
};

export default async function DashboardPage() {
    const session = await auth();
    const businessId = session?.user?.businessId;

    if (!businessId) {
        return <div className="p-8 text-center bg-white rounded-xl">Business profile not found. Please contact support.</div>;
    }

    // Date calculation for "Today"
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Fetch KPI Data
    const [
        todaysCompletedRecords,
        activeServicesCount,
        totalMembersCount,
        recentTransactions,
        lowStockItems
    ] = await Promise.all([
        prisma.serviceRecord.findMany({
            where: {
                businessId,
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
                businessId,
                status: "IN_PROGRESS"
            }
        }),
        prisma.client.count({
            where: {
                businessId,
                clientType: "MEMBER",
                status: "ACTIVE"
            }
        }),
        prisma.serviceRecord.findMany({
            where: {
                businessId,
                status: "COMPLETED"
            },
            orderBy: { completedAt: "desc" },
            take: 5,
            include: { service: true, client: true }
        }),
        prisma.inventory.findMany({
            where: {
                businessId,
                stockCount: { lte: 10 } // Placeholder for low stock logic until fields.minThreshold is fixed
            },
            take: 3
        })
    ]);

    const todaysRevenue = todaysCompletedRecords.reduce((sum, record) => sum + (record.amount || 0), 0);

    return (
        <div>
            {/* Welcome Section */}
            <div className="mb-8">
                <h3 className="text-3xl font-black tracking-tight">
                    Welcome back, {session.user.fullName.split(' ')[0]}! 👋
                </h3>
                <p className="text-slate-500 mt-1">
                    Here&apos;s a summary of your spa&apos;s performance today.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                <KPICard
                    icon="payments"
                    label="Today's Revenue"
                    value={`RWF ${todaysRevenue.toLocaleString()}`}
                    trend="+0%"
                    trendUp={true}
                />
                <KPICard
                    icon="dry_cleaning"
                    label="Active Services"
                    value={activeServicesCount.toString()}
                    trend="+0"
                    trendUp={true}
                />
                <KPICard
                    icon="groups"
                    label="Total Members"
                    value={totalMembersCount.toString()}
                    trend="+0%"
                    trendUp={true}
                />
                <KPICard
                    icon="person_check"
                    label="Staff On-Duty"
                    value="0"
                    trend="—"
                    trendUp={true}
                />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Revenue Trends */}
                <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-[var(--color-border-light)]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h4 className="text-lg font-bold">Weekly Revenue Trends</h4>
                            <p className="text-xs text-slate-500">
                                Daily sales performance overview
                            </p>
                        </div>
                    </div>
                    <div className="h-48 flex items-end justify-between gap-3 px-2">
                        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                            (day, i) => (
                                <div
                                    key={day}
                                    className="flex-1 flex flex-col items-center gap-2 group"
                                >
                                    <div className="w-full bg-[rgba(19,236,164,0.1)] rounded-t-lg relative flex items-end h-32 hover:bg-[rgba(19,236,164,0.2)] transition-all">
                                        {/* eslint-disable-next-line react/forbid-dom-props */}
                                        <div
                                            className="w-full bg-[var(--color-primary)] rounded-t-lg transition-all duration-500"
                                            style={{ "--chart-height": `${[60, 40, 70, 90, 55, 95, 25][i]}%` } as React.CSSProperties}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500">
                                        {day}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Right Column: Transactions & Alerts */}
                <div className="space-y-6">
                    {/* Recent Transactions */}
                    <div className="p-6 rounded-xl bg-white border border-[var(--color-border-light)]">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Recent Transactions</h4>
                            <a href="/operations" className="text-xs font-bold text-[var(--color-primary)] hover:underline">All</a>
                        </div>
                        <div className="space-y-4">
                            {recentTransactions.map((tx) => (
                                <div key={tx.id} className="flex justify-between items-center text-sm">
                                    <div className="min-w-0">
                                        <p className="font-bold truncate">{tx.service?.name}</p>
                                        <p className="text-xs text-slate-500">{tx.client?.fullName}</p>
                                    </div>
                                    <p className="font-black">RWF {tx.amount.toLocaleString()}</p>
                                </div>
                            ))}
                            {recentTransactions.length === 0 && <p className="text-xs text-slate-500">No recent activity</p>}
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="p-6 rounded-xl bg-amber-50 border border-amber-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-amber-600">
                                <span className="material-symbols-outlined text-lg">warning</span>
                                <h4 className="text-sm font-bold uppercase tracking-wider">Inventory Alerts</h4>
                            </div>
                            <a href="/inventory" className="text-xs font-bold text-amber-700 hover:underline">Manage</a>
                        </div>
                        <div className="space-y-3">
                            {lowStockItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-xs">
                                    <span className="font-medium text-slate-700">{item.productName}</span>
                                    <span className="font-black text-rose-600">{item.stockCount} {item.unit} left</span>
                                </div>
                            ))}
                            {lowStockItems.length === 0 && <p className="text-xs text-amber-600 font-medium italic">All essentials in stock</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Quick Stats */}
            <div className="mt-8 flex flex-wrap gap-4 items-center justify-between bg-[rgba(19,236,164,0.05)] rounded-xl p-4 border border-[rgba(19,236,164,0.2)]">
                <div className="flex items-center gap-4">
                    <p className="text-sm font-medium">
                        0 staff members currently on duty
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="size-2 bg-emerald-500 rounded-full"></span>
                        <span className="text-xs font-bold">0 Rooms Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="size-2 bg-amber-500 rounded-full"></span>
                        <span className="text-xs font-bold">{activeServicesCount} Rooms Occupied</span>
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
        <div className="p-5 rounded-xl bg-white border border-[var(--color-border-light)] hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <span className="p-2 bg-[rgba(19,236,164,0.15)] text-[var(--color-primary)] rounded-lg">
                    <span className="material-symbols-outlined">{icon}</span>
                </span>
                <span
                    className={`text-xs font-bold flex items-center gap-1 ${trendUp ? "text-emerald-500" : "text-red-500"
                        }`}
                >
                    <span className="material-symbols-outlined text-sm">
                        {trendUp ? "trending_up" : "trending_down"}
                    </span>
                    {trend}
                </span>
            </div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-black mt-1">{value}</p>
        </div>
    );
}
