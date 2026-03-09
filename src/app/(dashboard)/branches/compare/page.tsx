import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

export default async function BranchComparisonPage() {
    const session = await auth();

    if (!session || (session.user.role !== "CORPORATE" && session.user.role !== "ADMIN")) {
        redirect("/dashboard");
    }

    const corporateId = session.user.corporateId;
    const businesses = await prisma.business.findMany({
        where: corporateId ? { corporateId } : {},
        include: {
            serviceRecords: {
                where: { status: "COMPLETED" },
                select: { amount: true }
            },
            clients: true,
            employees: true,
            inventory: true,
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">Branch Comparison</h1>
                    <p className="text-slate-500">Side-by-side performance audit for all managed locations.</p>
                </div>
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    Last 30 Days
                </button>
            </div>

            <div className="grid grid-cols-1 overflow-x-auto">
                <div className="min-w-[800px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left">Metric</th>
                                {businesses.map(b => (
                                    <th key={b.id} className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-slate-900 dark:text-white">{b.name}</span>
                                            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">ID: {b.id.slice(-4)}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {/* Revenue Section */}
                            <tr className="bg-slate-50/30 dark:bg-slate-800/20 font-semibold text-slate-900 dark:text-slate-100">
                                <td className="px-6 py-3">Completed Revenue</td>
                                {businesses.map(b => {
                                    const revenue = b.serviceRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
                                    return (
                                        <td key={b.id} className="px-6 py-3 text-center text-[var(--color-primary)]">
                                            {formatCurrency(revenue)}
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* Operational Stats */}
                            <tr>
                                <td className="px-6 py-4 text-slate-500">Active Clients</td>
                                {businesses.map(b => (
                                    <td key={b.id} className="px-6 py-4 text-center font-medium">{b.clients.length}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="px-6 py-4 text-slate-500">Staff Count</td>
                                {businesses.map(b => (
                                    <td key={b.id} className="px-6 py-4 text-center font-medium">{b.employees.length}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="px-6 py-4 text-slate-500">Inventory Items</td>
                                {businesses.map(b => (
                                    <td key={b.id} className="px-6 py-4 text-center font-medium">{b.inventory.length}</td>
                                ))}
                            </tr>

                            {/* Efficiency Mock-up (Percentage bars) */}
                            <tr>
                                <td className="px-6 py-4 text-slate-500">Utilization %</td>
                                {businesses.map(b => (
                                    <td key={b.id} className="px-6 py-4">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 transition-all duration-500"
                                                    style={{ "--utilization-width": b.name.includes("Kigali") ? '85%' : '62%' } as React.CSSProperties}
                                                />
                                            </div>
                                            <span className="text-xs font-bold">{b.name.includes("Kigali") ? '85%' : '62%'}</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Strategic Notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 bg-slate-900 rounded-xl p-6 text-white space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--color-primary)]">lightbulb</span>
                        Executive Insights
                    </h3>
                    <div className="space-y-3 text-sm text-slate-300">
                        <p>• **Kigali Oasis Spa** is outperforming the group in client acquisition by 23% this month.</p>
                        <p>• **Rubavu Lakeside Spa** has lower operational costs but requires inventory optimization to meet peak demand.</p>
                        <p>• Recommended action: Implement cross-branch staff training from Kigali to Rubavu to improve service efficiency.</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold">Export Comparison</h3>
                        <p className="text-xs text-slate-500 mt-1">Download a full PDF comparison for the board meeting.</p>
                    </div>
                    <button className="w-full mt-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
