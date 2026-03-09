import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import StatsCard from "@/components/dashboard/StatsCard";
import { formatCurrency } from "@/lib/utils";

export default async function ExecutiveDashboard() {
    const session = await auth();

    if (!session || session.user.role !== "CORPORATE") {
        redirect("/dashboard");
    }

    const corporateId = session.user.corporateId;
    if (!corporateId) {
        return <div>No corporate association found.</div>;
    }

    const businesses = await prisma.business.findMany({
        where: { corporateId },
        include: {
            serviceRecords: {
                where: { status: "COMPLETED" },
                select: { amount: true }
            },
            clients: true,
            employees: true,
        }
    });

    const totalRevenue = businesses.reduce((acc, b) =>
        acc + b.serviceRecords.reduce((sum, r) => sum + (r.amount || 0), 0), 0
    );

    const totalClients = businesses.reduce((acc, b) => acc + b.clients.length, 0);
    const totalEmployees = businesses.reduce((acc, b) => acc + b.employees.length, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Executive Dashboard</h1>
                <p className="text-slate-500">Group-wide performance overview for {businesses.length} branches.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(totalRevenue)}
                    icon="payments"
                    description="Aggregated across all branches"
                    trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                    title="Total Clients"
                    value={totalClients.toString()}
                    icon="groups"
                    description="Total unique clients in database"
                />
                <StatsCard
                    title="Total Staff"
                    value={totalEmployees.toString()}
                    icon="badge"
                    description="Active employees group-wide"
                />
                <StatsCard
                    title="Total Branches"
                    value={businesses.length.toString()}
                    icon="corporate_fare"
                    description="Active spa locations"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Branch Performance Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <h2 className="font-semibold">Branch Performance</h2>
                        <button className="text-sm text-[var(--color-primary)] font-medium">View Analysis</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-4 py-3">Branch Name</th>
                                    <th className="px-4 py-3">Revenue</th>
                                    <th className="px-4 py-3">Efficiency</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {businesses.map((b) => {
                                    const revenue = b.serviceRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
                                    return (
                                        <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-4 py-3 font-medium">{b.name}</td>
                                            <td className="px-4 py-3">{formatCurrency(revenue)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[var(--color-primary)] transition-all duration-500 w-[75%]"
                                                        />
                                                    </div>
                                                    <span className="text-xs text-slate-500">75%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] font-bold uppercase">
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Growth Trends Placeholder */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                    <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-slate-400">insights</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Group Growth Insights</h3>
                        <p className="text-slate-500 max-w-xs mt-1">
                            Visualizing revenue trends across multiple periods is currently being optimized.
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-[var(--color-primary)] text-slate-900 font-bold rounded-lg text-sm shadow-lg shadow-[var(--color-primary)]/20">
                        Generate Group Report
                    </button>
                </div>
            </div>
        </div>
    );
}
