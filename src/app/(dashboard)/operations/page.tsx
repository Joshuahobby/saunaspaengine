import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const STATUS_STYLES: Record<string, { dot: string; text: string; label: string }> = {
    CREATED: { dot: "bg-[var(--color-primary)]", text: "text-[var(--color-primary)]", label: "Created" },
    IN_PROGRESS: { dot: "bg-amber-500 animate-pulse", text: "text-amber-500", label: "In Progress" },
    COMPLETED: { dot: "bg-slate-400", text: "text-slate-400", label: "Completed" },
    CANCELLED: { dot: "bg-red-400", text: "text-red-400", label: "Cancelled" },
};

function getInitials(name: string) {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatRWF(amount: number) {
    return `RWF ${amount.toLocaleString()}`;
}

export default async function OperationsPage() {
    const session = await auth();
    if (!session?.user?.businessId) redirect("/login");

    const [records, todayRevenue, activeCount, completedCount] = await Promise.all([
        prisma.serviceRecord.findMany({
            where: { businessId: session.user.businessId },
            include: {
                client: { select: { fullName: true } },
                service: { select: { name: true, category: true, price: true } },
                employee: { select: { fullName: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 15,
        }),
        prisma.serviceRecord.aggregate({
            where: {
                businessId: session.user.businessId,
                status: "COMPLETED",
                createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            },
            _sum: { amount: true },
        }),
        prisma.serviceRecord.count({
            where: { businessId: session.user.businessId, status: { in: ["CREATED", "IN_PROGRESS"] } },
        }),
        prisma.serviceRecord.count({
            where: { businessId: session.user.businessId, status: "COMPLETED" },
        }),
    ]);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Service Transactions</h2>
                    <p className="text-slate-500 mt-1">Manage and monitor daily sauna and spa operations.</p>
                </div>
                <Link
                    href="/check-in"
                    className="bg-[var(--color-primary)] hover:opacity-90 text-[var(--color-bg-dark)] font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-[var(--color-primary)]/20 w-fit"
                >
                    <span className="material-symbols-outlined">add_circle</span>
                    New Service Record
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap gap-4 items-center p-4 bg-white rounded-2xl border border-[var(--color-primary)]/5 shadow-sm">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                    <span className="material-symbols-outlined text-slate-400">filter_alt</span>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Filters</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-sm font-bold">
                        All Statuses
                        <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-[var(--color-primary)]/10 transition-colors">
                        Today
                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-[var(--color-primary)]/10 transition-colors">
                        Service Type
                        <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                    </button>
                </div>
                <div className="ml-auto text-sm text-slate-400 font-medium">
                    Showing {records.length} records
                </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Record ID</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Client</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-center">Box</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Service Type</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Employee</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Payment</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="material-symbols-outlined text-4xl text-slate-300">receipt_long</span>
                                            <p className="text-slate-500 font-medium">No service records yet</p>
                                            <p className="text-slate-400 text-sm">Create your first service record by clicking &ldquo;New Service Record&rdquo; above.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                records.map((record) => {
                                    const statusStyle = STATUS_STYLES[record.status] || STATUS_STYLES.CREATED;
                                    const isCompleted = record.status === "COMPLETED";
                                    return (
                                        <tr key={record.id} className={`transition-colors ${isCompleted ? "bg-slate-50/50 opacity-60" : "hover:bg-[var(--color-primary)]/5"}`}>
                                            <td className="px-6 py-5 text-sm font-bold">
                                                #{record.id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isCompleted ? "bg-slate-200 text-slate-500" : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"}`}>
                                                        {getInitials(record.client.fullName)}
                                                    </div>
                                                    <span className={`text-sm font-medium ${isCompleted ? "text-slate-400" : ""}`}>{record.client.fullName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{record.boxNumber || "—"}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCompleted ? "bg-slate-100 text-slate-400" : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"}`}>
                                                    {record.service.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-slate-600">{record.employee?.fullName || "—"}</td>
                                            <td className="px-6 py-5">
                                                <span className={`flex items-center gap-1.5 text-xs font-bold ${statusStyle.text}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                                                    {statusStyle.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-slate-500">{record.paymentMode}</td>
                                            <td className="px-6 py-5 text-sm font-bold text-right">{formatRWF(record.amount)}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[var(--color-primary)]/10 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                        <span className="material-symbols-outlined">trending_up</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Daily Revenue</p>
                        <p className="text-2xl font-black">{formatRWF(todayRevenue._sum.amount || 0)}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-[var(--color-primary)]/10 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                        <span className="material-symbols-outlined">group</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Sessions</p>
                        <p className="text-2xl font-black">{activeCount}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-[var(--color-primary)]/10 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                        <span className="material-symbols-outlined">event_available</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed Services</p>
                        <p className="text-2xl font-black">{completedCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
