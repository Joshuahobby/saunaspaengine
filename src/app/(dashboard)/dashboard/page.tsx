export const metadata = {
    title: "Dashboard | Sauna SPA Engine",
    description: "Your spa business overview and daily operations summary",
};

export default function DashboardPage() {
    return (
        <div>
            {/* Welcome Section */}
            <div className="mb-8">
                <h3 className="text-3xl font-black tracking-tight">
                    Welcome back! 👋
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
                    value="RWF 0"
                    trend="+0%"
                    trendUp={true}
                />
                <KPICard
                    icon="dry_cleaning"
                    label="Active Services"
                    value="0"
                    trend="+0"
                    trendUp={true}
                />
                <KPICard
                    icon="groups"
                    label="Total Members"
                    value="0"
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
                        <select className="bg-slate-100 border-none rounded-lg text-xs font-semibold py-1 focus:ring-[var(--color-primary)]">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-48 flex items-end justify-between gap-3 px-2">
                        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                            (day, i) => (
                                <div
                                    key={day}
                                    className="flex-1 flex flex-col items-center gap-2 group"
                                >
                                    <div className="w-full bg-[rgba(19,236,164,0.1)] rounded-t-lg relative flex items-end h-32 hover:bg-[rgba(19,236,164,0.2)] transition-all">
                                        <div
                                            className="w-full bg-[var(--color-primary)] rounded-t-lg transition-all duration-500"
                                            style={{
                                                height: `${[60, 40, 70, 90, 55, 95, 25][i]}%`,
                                            }}
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

                {/* Recent Transactions */}
                <div className="p-6 rounded-xl bg-white border border-[var(--color-border-light)]">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-bold">Recent Transactions</h4>
                        <a
                            className="text-[var(--color-primary)] text-xs font-bold hover:underline"
                            href="/operations"
                        >
                            View All
                        </a>
                    </div>
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2">
                            receipt_long
                        </span>
                        <p className="text-sm font-medium">No transactions yet</p>
                        <p className="text-xs">
                            Service records will appear here
                        </p>
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
                        <span className="text-xs font-bold">0 Rooms Occupied</span>
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
