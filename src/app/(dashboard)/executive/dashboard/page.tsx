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
        <div className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-6 space-y-8">
            <div className="flex flex-col gap-2 border-b border-[var(--border-muted)] pb-8">
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-[var(--text-main)] tracking-tight">
                    Corporate <span className="text-[var(--color-primary)] opacity-50">&</span> Business Overview
                </h1>
                <p className="text-base text-[var(--text-muted)] font-bold opacity-80">Monitoring the performance of {businesses.length} spa locations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(totalRevenue)}
                    icon="payments"
                    description="Combined revenue across all locations"
                    trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                    title="Total Customers"
                    value={totalClients.toString()}
                    icon="groups"
                    description="Total registered clients in your network"
                />
                <StatsCard
                    title="Total Staff"
                    value={totalEmployees.toString()}
                    icon="badge"
                    description="Total number of active employees"
                />
                <StatsCard
                    title="Total Locations"
                    value={businesses.length.toString()}
                    icon="corporate_fare"
                    description="Active spa centers currently operating"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Branch Performance Table */}
                <div className="bg-[var(--bg-card)] rounded-[1.5rem] border border-[var(--border-muted)] overflow-hidden shadow-sm group/table">
                    <div className="px-6 py-5 border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-display font-bold text-[var(--text-main)]">Business Performance</h2>
                            <p className="text-xs text-[var(--text-muted)] font-bold mt-1">Real-time metrics for each location.</p>
                        </div>
                        <button className="text-[10px] text-[var(--color-primary)] font-bold uppercase tracking-widest border border-[var(--color-primary)]/20 px-4 py-2 rounded-xl hover:bg-[var(--color-primary)]/5 transition-all">Detailed Analysis</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--bg-surface-muted)]/5 border-b border-[var(--border-muted)]">
                                <tr>
                                    <th className="px-6 py-4 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Business Location</th>
                                    <th className="px-6 py-4 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Total Revenue</th>
                                    <th className="px-6 py-4 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Performance</th>
                                    <th className="px-6 py-4 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-muted)]">
                                {businesses.map((b) => {
                                    const revenue = b.serviceRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
                                    return (
                                        <tr key={b.id} className="hover:bg-[var(--bg-surface-muted)]/5 transition-colors group/row">
                                            <td className="px-6 py-4 font-display font-bold text-lg text-[var(--text-main)] leading-tight group-hover/row:translate-x-1 transition-transform">{b.name}</td>
                                            <td className="px-6 py-4 font-sans font-bold text-base text-[var(--text-main)]">{formatCurrency(revenue)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1 h-1.5 bg-[var(--text-main)]/5 rounded-full overflow-hidden border border-[var(--text-main)]/10">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] opacity-70 transition-all duration-1000 w-[75%] rounded-full shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.3)]"
                                                        />
                                                    </div>
                                                    <span className="text-[9px] text-[var(--text-muted)] font-bold">75%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.1em] uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
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
                <div className="bg-[var(--bg-card)] p-8 rounded-[1.5rem] border border-[var(--border-muted)] shadow-sm flex flex-col items-center justify-center text-center space-y-6 group/insights hover:shadow-2xl transition-all duration-700">
                    <div className="size-16 bg-[var(--bg-surface-muted)]/50 border border-[var(--border-muted)] rounded-[1.25rem] flex items-center justify-center group-hover/insights:rotate-12 group-hover/insights:scale-110 transition-all duration-700">
                        <span className="material-symbols-outlined text-3xl text-[var(--color-primary)] opacity-60">insights</span>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-display font-bold text-xl text-[var(--text-main)]">Group Growth Forecast</h3>
                        <p className="text-xs text-[var(--text-muted)] max-w-[280px] mt-1 font-bold opacity-80 leading-relaxed">
                            Interpreting revenue trends across past performance periods is currently being calculated.
                        </p>
                    </div>
                    <button className="px-6 py-3 bg-[var(--text-main)] text-[var(--bg-app)] font-bold rounded-xl text-[10px] uppercase tracking-widest shadow-xl shadow-[var(--text-main)]/10 hover:scale-[1.05] transition-all">
                        View Detailed Insights
                    </button>
                </div>
            </div>
        </div>
    );
}
