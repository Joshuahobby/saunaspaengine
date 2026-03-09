"use client";

interface AnalyticsStats {
    totalRevenue: number;
    activeBusinesses: number;
    totalUsers: number;
    totalServices: number;
    revenueGrowth: number;
}

interface Activity {
    id: string;
    action: string;
    entity: string;
    createdAt: Date;
    user: {
        fullName: string;
        role: string;
    };
}

interface AnalyticsClientPageProps {
    stats: AnalyticsStats;
    recentActivity: Activity[];
}

export default function PlatformAnalyticsClientPage({ stats, recentActivity }: AnalyticsClientPageProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <main className="flex flex-1 flex-col px-6 lg:px-10 py-8 gap-8 max-w-[1440px] mx-auto w-full">
            {/* Page Title & Actions */}
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-tight">Platform-Wide Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Real-time performance insights and system-wide data trends across all regions.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-bold tracking-tight hover:bg-slate-300 transition-colors">
                        <span className="material-symbols-outlined mr-2 text-lg">calendar_today</span>
                        <span>Last 30 Days</span>
                        <span className="material-symbols-outlined ml-2 text-lg">expand_more</span>
                    </button>
                    <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-[var(--color-primary)] text-slate-900 text-sm font-bold tracking-tight shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90 transition-opacity">
                        <span className="material-symbols-outlined mr-2 text-lg">file_download</span>
                        <span>Export Full Report</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Revenue</p>
                        <span className="material-symbols-outlined text-[var(--color-primary)] bg-[var(--color-primary)]/10 p-2 rounded-lg">payments</span>
                    </div>
                    <p className="text-slate-900 dark:text-slate-100 text-3xl font-extrabold">{formatCurrency(stats.totalRevenue)}</p>
                    <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span>+8.2%</span>
                        <span className="text-slate-400 font-normal ml-1">vs last month</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Growth Rate</p>
                        <span className="material-symbols-outlined text-[var(--color-primary)] bg-[var(--color-primary)]/10 p-2 rounded-lg">show_chart</span>
                    </div>
                    <p className="text-slate-900 dark:text-slate-100 text-3xl font-extrabold">+{stats.revenueGrowth}%</p>
                    <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span>+2.1%</span>
                        <span className="text-slate-400 font-normal ml-1">vs target</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Active Businesses</p>
                        <span className="material-symbols-outlined text-[var(--color-primary)] bg-[var(--color-primary)]/10 p-2 rounded-lg">business</span>
                    </div>
                    <p className="text-slate-900 dark:text-slate-100 text-3xl font-extrabold">{stats.activeBusinesses}</p>
                    <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
                        <span className="material-symbols-outlined text-sm">group_add</span>
                        <span>+4.5%</span>
                        <span className="text-slate-400 font-normal ml-1">new sign-ups</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Avg Rev / Business</p>
                        <span className="material-symbols-outlined text-[var(--color-primary)] bg-[var(--color-primary)]/10 p-2 rounded-lg">receipt_long</span>
                    </div>
                    <p className="text-slate-900 dark:text-slate-100 text-3xl font-extrabold">{formatCurrency(stats.activeBusinesses > 0 ? stats.totalRevenue / stats.activeBusinesses : 0)}</p>
                    <div className="flex items-center gap-1 text-rose-500 font-bold text-sm">
                        <span className="material-symbols-outlined text-sm">trending_down</span>
                        <span>-1.2%</span>
                        <span className="text-slate-400 font-normal ml-1">per user</span>
                    </div>
                </div>
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold">Monthly Revenue Growth</h3>
                            <p className="text-slate-500 text-sm">Performance tracking for current fiscal year</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <div className="size-3 rounded-full bg-[var(--color-primary)]"></div>
                                <span className="text-xs text-slate-500">2024</span>
                            </div>
                            <div className="flex items-center gap-1.5 ml-4">
                                <div className="size-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                <span className="text-xs text-slate-500">2023</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full flex flex-col justify-end">
                        <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 160C50 150 100 120 150 130C200 140 250 80 300 90C350 100 400 30 450 40C500 50 550 100 600 80C650 60 700 20 750 10C800 0 800 0 800 0V200H0V160Z" fill="url(#chartGradient)"></path>
                            <path d="M0 160C50 150 100 120 150 130C200 140 250 80 300 90C350 100 400 30 450 40C500 50 550 100 600 80C650 60 700 20 750 10" stroke="#13eca4" strokeLinecap="round" strokeWidth="4"></path>
                            <defs>
                                <linearGradient gradientUnits="userSpaceOnUse" id="chartGradient" x1="400" x2="400" y1="0" y2="200">
                                    <stop stopColor="#13eca4" stopOpacity="0.3"></stop>
                                    <stop offset="1" stopColor="#13eca4" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="flex justify-between mt-4 px-2">
                            <span className="text-[11px] font-bold text-slate-400">JAN</span>
                            <span className="text-[11px] font-bold text-slate-400">MAR</span>
                            <span className="text-[11px] font-bold text-slate-400">MAY</span>
                            <span className="text-[11px] font-bold text-slate-400">JUL</span>
                            <span className="text-[11px] font-bold text-slate-400">SEP</span>
                            <span className="text-[11px] font-bold text-slate-400">NOV</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-6 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold">Category Performance</h3>
                            <p className="text-slate-500 text-sm">Market share by spa type</p>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">Hotel & Resort Sauna</span>
                                <span className="font-bold">42%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                <div className="bg-[var(--color-primary)] h-2 rounded-full w-[42%]"></div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">Day Spas</span>
                                <span className="font-bold">28%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                <div className="bg-[var(--color-primary)] opacity-70 h-2 rounded-full w-[28%]"></div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">Medical Spas</span>
                                <span className="font-bold">18%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                <div className="bg-[var(--color-primary)] opacity-50 h-2 rounded-full w-[18%]"></div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">Wellness Centers</span>
                                <span className="font-bold">12%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                <div className="bg-[var(--color-primary)] opacity-30 h-2 rounded-full w-[12%]"></div>
                            </div>
                        </div>
                    </div>
                    <button className="text-[var(--color-primary)] text-sm font-bold border border-[var(--color-primary)]/30 dark:border-[var(--color-primary)]/20 py-2 rounded-lg hover:bg-[var(--color-primary)]/10 transition-colors">View All Categories</button>
                </div>
            </div>

            {/* Bottom Section: Top Businesses & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                {/* Top 5 Businesses */}
                <div className="flex flex-col rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold">Top 5 Performing Businesses</h3>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Revenue (MTD)</span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {/* Static top 5 for now as we don't have revenue history per business implemented deeply yet */}
                        {[
                            { name: "Nordic Sky Wellness", location: "Stockholm, SE", revenue: 42300 },
                            { name: "Alpine Retreat & Spa", location: "Zermatt, CH", revenue: 38900 },
                            { name: "Blue Lagoon Premium", location: "Reykjavík, IS", revenue: 35150 },
                            { name: "Thermal Sands Resort", location: "Dubai, UAE", revenue: 31800 },
                            { name: "Zen Garden Spa", location: "Kyoto, JP", revenue: 29400 }
                        ].map((business, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold">{idx + 1}</div>
                                    <div>
                                        <p className="font-bold text-sm">{business.name}</p>
                                        <p className="text-xs text-slate-500">{business.location}</p>
                                    </div>
                                </div>
                                <p className="font-extrabold text-[var(--color-primary)] border-b border-[var(--color-primary)]/30">{formatCurrency(business.revenue)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="flex flex-col rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold">Recent Platform Activities</h3>
                        <button className="text-xs font-bold text-[var(--color-primary)] underline underline-offset-4">View All</button>
                    </div>
                    <div className="p-6 space-y-6">
                        {recentActivity.length > 0 ? recentActivity.map((activity) => (
                            <div key={activity.id} className="flex gap-4">
                                <div className="flex-none">
                                    <div className="size-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)]">
                                        <span className="material-symbols-outlined">
                                            {activity.action === "CREATE" ? "add_circle" :
                                                activity.action === "UPDATE" ? "edit" :
                                                    activity.action === "DELETE" ? "delete" : "info"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{activity.user.fullName} ({activity.user.role})</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{activity.action} {activity.entity} action performed.</p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">{getTimeAgo(activity.createdAt)}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500 text-center py-10">No recent activity found.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
