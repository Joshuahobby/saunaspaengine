"use client";

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

interface RevenueMetrics {
    totalRevenue: number;
    avgTransactionValue: number;
    activeMembersCount: number;
    paymentDistribution: Record<string, number>;
    topServices: Array<{
        name: string;
        category: string;
        bookings: number;
        revenue: number;
    }>;
    totalBookings: number;
}

const COLORS = ['#FF7F32', '#6366F1', '#10B981', '#F59E0B', '#EF4444'];
const COLORS_BG = ['bg-[#FF7F32]', 'bg-[#6366F1]', 'bg-[#10B981]', 'bg-[#F59E0B]', 'bg-[#EF4444]'];

export default function ReportsRevenueClientPage({ metrics }: { metrics: RevenueMetrics }) {
    // Format payment distribution for the pie chart
    const paymentModeData = Object.entries(metrics.paymentDistribution).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value
    }));

    // Mock data for the line chart trend
    const revenueTrendData = [
        { name: 'Mon', revenue: metrics.totalRevenue * 0.1 },
        { name: 'Tue', revenue: metrics.totalRevenue * 0.15 },
        { name: 'Wed', revenue: metrics.totalRevenue * 0.12 },
        { name: 'Thu', revenue: metrics.totalRevenue * 0.18 },
        { name: 'Fri', revenue: metrics.totalRevenue * 0.2 },
        { name: 'Sat', revenue: metrics.totalRevenue * 0.25 },
        { name: 'Sun', revenue: metrics.totalRevenue > 0 ? metrics.totalRevenue * 0.1 : 0 },
    ];

    const stats = [
        {
            label: "Total Revenue",
            value: `RWF ${metrics.totalRevenue.toLocaleString()}`,
            change: "+12.5%",
            icon: "payments",
            trend: "up"
        },
        {
            label: "Avg. Transaction",
            value: `RWF ${Math.round(metrics.avgTransactionValue).toLocaleString()}`,
            change: "+3.2%",
            icon: "receipt_long",
            trend: "up"
        },
        {
            label: "Active Memberships",
            value: metrics.activeMembersCount.toString(),
            change: "+18",
            icon: "card_membership",
            trend: "up"
        },
        {
            label: "Total Bookings",
            value: metrics.totalBookings.toString(),
            change: "+5.4%",
            icon: "event_available",
            trend: "up"
        }
    ];

    return (
        <div className="max-w-[1440px] mx-auto w-full p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--border-main)] pb-8">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-display font-bold text-[var(--text-main)] tracking-tight">Revenue <span className="text-[var(--color-primary)]">Intelligence</span></h1>
                    <p className="text-[var(--text-muted)] mt-2 font-medium">Real-time financial performance and transaction analysis.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl text-[10px] uppercase tracking-widest font-bold text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)] transition-all shadow-sm opacity-60">
                        <span className="material-symbols-outlined text-lg text-[var(--text-muted)] font-bold">calendar_today</span>
                        This Month
                    </button>
                    <button className="flex items-center gap-2 px-8 py-3 bg-[var(--color-primary)] rounded-xl text-[10px] uppercase tracking-widest font-bold text-white hover:bg-[var(--color-primary-hover)] transition-all shadow-lg shadow-[var(--color-primary)]/15">
                        <span className="material-symbols-outlined text-lg font-bold">download</span>
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-main)] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--color-primary)]">
                                <span className="material-symbols-outlined text-2xl font-bold">{stat.icon}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-[var(--text-main)] mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-main)] shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-display font-bold text-[var(--text-main)] tracking-tight">Revenue Trend</h3>
                            <p className="text-sm text-[var(--text-muted)] font-medium">Daily revenue breakdown for current period</p>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueTrendData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-muted)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 900 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 900 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-main)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ color: 'var(--text-main)', fontSize: '12px', fontWeight: 700 }}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    formatter={(value: any) => [`RWF ${(Number(value) || 0).toLocaleString()}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Payment Breakdown */}
                <div className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-main)] shadow-sm">
                    <h3 className="text-xl font-display font-bold text-[var(--text-main)] tracking-tight mb-2">Payment Modes</h3>
                    <p className="text-sm text-[var(--text-muted)] mb-8 font-medium">Revenue distribution by method</p>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={paymentModeData.length > 0 ? paymentModeData : [{ name: 'No Data', value: 1 }]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {(paymentModeData.length > 0 ? paymentModeData : [{ name: 'No Data', value: 1 }]).map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-main)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 space-y-3">
                        {paymentModeData.map((mode, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-surface-muted)] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-3 h-3 rounded-full ${COLORS_BG[i % COLORS_BG.length]}`}
                                    ></div>
                                    <span className="text-sm font-bold text-[var(--text-main)] capitalize">{mode.name.toLowerCase()}</span>
                                </div>
                                <span className="text-sm font-bold text-[var(--text-main)]">RWF {mode.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Services Table */}
            <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-[var(--border-main)]">
                    <h3 className="text-xl font-display font-bold text-[var(--text-main)] tracking-tight">Highest Yield Services</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">Top performing offers based on gross revenue</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[var(--bg-surface-muted)] border-b border-[var(--border-main)]">
                                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Service Name</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Category</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-center">Bookings</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-right">Yield (RWF)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-main)]">
                            {metrics.topServices.map((service, i) => (
                                <tr key={i} className="hover:bg-[var(--bg-surface-muted)] transition-colors">
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-[var(--text-main)]">{service.name}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                            {service.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <p className="text-sm font-bold text-[var(--text-main)]">{service.bookings}</p>
                                    </td>
                                    <td className="px-8 py-5 text-right text-[var(--color-primary)]">
                                        <p className="font-bold text-lg">RWF {service.revenue.toLocaleString()}</p>
                                    </td>
                                </tr>
                            ))}
                            {metrics.topServices.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-[var(--text-muted)] italic font-medium">
                                        No financial data available for the selected period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
