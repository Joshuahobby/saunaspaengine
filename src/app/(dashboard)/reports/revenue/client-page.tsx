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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--color-border-light)] pb-8">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight italic">Revenue Intelligence</h1>
                    <p className="text-slate-500 mt-2 font-medium">Real-time financial performance and transaction analysis.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-lg text-slate-400">calendar_today</span>
                        This Month
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all shadow-lg shadow-orange-200">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-[var(--color-border-light)] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[var(--color-primary)]">
                                <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[var(--color-border-light)] shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Trend</h3>
                            <p className="text-sm text-slate-500">Daily revenue breakdown for current period</p>
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
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => [`RWF ${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Payment Breakdown */}
                <div className="bg-white p-8 rounded-3xl border border-[var(--color-border-light)] shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Payment Modes</h3>
                    <p className="text-sm text-slate-500 mb-8">Revenue distribution by method</p>
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
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 space-y-3">
                        {paymentModeData.map((mode, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    {/* eslint-disable-next-line react/forbid-dom-props */}
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[i % COLORS.length] } as React.CSSProperties}
                                    ></div>
                                    <span className="text-sm font-bold text-slate-700 capitalize">{mode.name.toLowerCase()}</span>
                                </div>

                                <span className="text-sm font-black text-slate-900">RWF {mode.value.toLocaleString()}</span>
                            </div>
                        ))}
                        {paymentModeData.length === 0 && (
                            <p className="text-center text-slate-400 text-sm italic py-4">No transactions recorded yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Services Table */}
            <div className="bg-white rounded-3xl border border-[var(--color-border-light)] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-[var(--color-border-light)]">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Highest Yield Services</h3>
                    <p className="text-sm text-slate-500 mt-1">Top performing offers based on gross revenue</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-[var(--color-border-light)]">
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service Name</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Bookings</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Yield (RWF)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border-light)]">
                            {metrics.topServices.map((service, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-slate-900">{service.name}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-orange-50 text-[var(--color-primary)] rounded-lg text-xs font-bold">
                                            {service.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <p className="text-sm font-medium text-slate-600">{service.bookings}</p>
                                    </td>
                                    <td className="px-8 py-5 text-right text-[var(--color-primary)]">
                                        <p className="font-black text-lg">RWF {service.revenue.toLocaleString()}</p>
                                    </td>
                                </tr>
                            ))}
                            {metrics.topServices.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic font-medium">
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
