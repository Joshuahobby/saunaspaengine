import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { resolveEffectiveBranchId } from "@/lib/branch-context";
import { format } from "date-fns";
import CheckoutButton from "@/components/operations/checkout-button";

export default async function TodaysActivityTab({
    searchParams,
    isActive
}: {
    searchParams: Promise<{ page?: string; search?: string; branchId?: string }>;
    isActive?: boolean;
}) {
    const params = await searchParams;
    const session = await auth();
    if (!session?.user) return null;

    const branchId = await resolveEffectiveBranchId(session, params);
    if (!branchId) return null;

    const page = parseInt(params.page || "1");
    const limit = 15;
    const skip = (page - 1) * limit;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [records, totalCount] = await Promise.all([
        prisma.serviceRecord.findMany({
            where: {
                branchId,
                createdAt: { gte: today }
            },
            include: {
                client: { select: { fullName: true, phone: true } },
                service: { select: { name: true } },
                employee: { select: { fullName: true } }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.serviceRecord.count({
            where: {
                branchId,
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60 mb-2">Today&apos;s Attendance</p>
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
                                        <td className="px-8 py-6 font-bold text-sm tracking-tight">{r.client?.fullName || "Unknown Client"}</td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/5 px-3 py-1 rounded-full border border-[var(--color-primary)]/10">
                                                {r.service?.name || "Unknown Service"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-xs font-bold text-[var(--text-muted)]">{r.employee?.fullName || "Unassigned"}</td>
                                        <td className="px-8 py-6 text-right font-black text-sm">RWF {(r.amount || 0).toLocaleString()}</td>

                                        <td className="px-8 py-6 text-right">
                                            <CheckoutButton 
                                                recordId={r.id}
                                                currentStatus={r.status}
                                                clientName={r.client?.fullName || "Unknown"}
                                                amount={r.amount || 0}
                                                phone={r.client?.phone || undefined}
                                            />
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
