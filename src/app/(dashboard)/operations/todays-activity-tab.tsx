import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { format } from "date-fns";

export default async function TodaysActivityTab({
    searchParams
}: {
    searchParams: Promise<{ page?: string; search?: string }>
}) {
    const params = await searchParams;
    const session = await auth();
    if (!session?.user?.branchId) return null;

    const page = parseInt(params.page || "1");
    const limit = 15;
    const skip = (page - 1) * limit;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [records, totalCount] = await Promise.all([
        prisma.serviceRecord.findMany({
            where: {
                branchId: session.user.branchId,
                createdAt: { gte: today }
            },
            include: {
                client: { select: { fullName: true } },
                service: { select: { name: true } },
                employee: { select: { fullName: true } }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.serviceRecord.count({
            where: {
                branchId: session.user.branchId,
                createdAt: { gte: today }
            }
        })
    ]);

    const totalRevenue = records.reduce((sum, r) => sum + r.amount, 0);

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Day Summary */}
            <div className="flex flex-wrap gap-6">
                <div className="glass-card p-8 rounded-3xl border border-[var(--border-muted)] flex-1 min-w-[200px]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60 mb-2">Today's Attendance</p>
                    <p className="text-4xl font-black">{totalCount} Clients</p>
                </div>
                <div className="glass-card p-8 rounded-3xl border border-[var(--border-muted)] flex-1 min-w-[200px] bg-[var(--color-primary)]/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60 mb-2">Revenue Total</p>
                    <p className="text-4xl font-black text-[var(--color-primary)]">RWF {totalRevenue.toLocaleString()}</p>
                </div>
            </div>

            {/* Activity Table */}
            <section className="glass-card border border-[var(--border-muted)] rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[var(--bg-surface-muted)]/50 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-muted)]">
                                <th className="px-8 py-6">Time</th>
                                <th className="px-8 py-6">Client</th>
                                <th className="px-8 py-6">Service</th>
                                <th className="px-8 py-6">Specialist</th>
                                <th className="px-8 py-6 text-right">Amount</th>
                                <th className="px-8 py-6 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center italic text-[var(--text-muted)] opacity-40">
                                        No visits recorded for today.
                                    </td>
                                </tr>
                            ) : (
                                records.map((r) => (
                                    <tr key={r.id} className="hover:bg-[var(--bg-surface-muted)]/20 transition-all group">
                                        <td className="px-8 py-6 font-black text-xs opacity-40">{format(r.createdAt, "HH:mm")}</td>
                                        <td className="px-8 py-6 font-bold text-sm tracking-tight">{r.client.fullName}</td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/5 px-3 py-1 rounded-full border border-[var(--color-primary)]/10">
                                                {r.service.name}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-xs font-bold text-[var(--text-muted)]">{r.employee?.fullName || "Unassigned"}</td>
                                        <td className="px-8 py-6 text-right font-black text-sm">RWF {r.amount.toLocaleString()}</td>
                                        <td className="px-8 py-6 text-right">
                                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                                                r.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : 
                                                r.status === 'CANCELLED' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            }`}>
                                                {r.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
