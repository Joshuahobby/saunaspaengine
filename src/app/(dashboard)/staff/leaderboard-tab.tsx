import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function LeaderboardTab() {
    const session = await auth();
    if (!session?.user) return null;

    const branchIds = session.user.role === 'OWNER'
        ? (await prisma.branch.findMany({ where: { businessId: session.user.businessId as string }, select: { id: true } })).map(b => b.id)
        : [session.user.branchId as string];

    const employees = await prisma.employee.findMany({
        where: { branchId: { in: branchIds } },
        include: {
            branch: { select: { name: true } },
            category: { select: { name: true } },
            serviceRecords: {
                where: { status: "COMPLETED" },
                select: { amount: true }
            }
        }
    });

    const rankings = employees.map(emp => {
        const serviceCount = emp.serviceRecords.length;
        const totalEarned = emp.serviceRecords.reduce((sum, r) => sum + r.amount, 0);
        // Simple score algorithm: volume + (earnings / 1000)
        const score = serviceCount + (totalEarned / 10000);

        return {
            id: emp.id,
            fullName: emp.fullName,
            branchName: emp.branch.name,
            category: emp.category.name,
            serviceCount,
            totalEarned,
            score
        };
    }).sort((a, b) => b.score - a.score);

    return (
        <div className="space-y-12 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-8 border-b border-[var(--border-muted)]">
                <div className="space-y-2">
                    <h2 className="text-3xl font-serif font-black text-[var(--text-main)] underline decoration-[var(--color-primary)]/20 underline-offset-8">
                        Top <span className="text-[var(--color-primary)]">Talent.</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">Recognizing our most dedicated people</p>
                </div>
            </div>

            <div className="glass-card rounded-[2.5rem] border border-[var(--border-muted)] overflow-hidden shadow-2xl shadow-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[var(--bg-surface-muted)]/50 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-muted)]">
                                <th className="px-8 py-6 text-center w-24">Rank</th>
                                <th className="px-8 py-6">Team Member</th>
                                <th className="px-8 py-6">Branch</th>
                                <th className="px-8 py-6 text-center">Volume</th>
                                <th className="px-8 py-6 text-right">Total Sales</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {rankings.map((entry, index) => (
                                <tr key={entry.id} className="hover:bg-[var(--bg-surface-muted)]/20 transition-all group">
                                    <td className="px-8 py-6 text-center">
                                        <div className={`size-10 rounded-2xl mx-auto flex items-center justify-center text-[10px] font-black border ${
                                            index === 0 ? "bg-yellow-500 text-white border-yellow-400 shadow-xl shadow-yellow-500/20" :
                                            index === 1 ? "bg-slate-300 text-slate-700 border-slate-200" :
                                            index === 2 ? "bg-orange-400 text-white border-orange-300" :
                                            "bg-[var(--bg-app)] text-[var(--text-muted)] border-[var(--border-muted)]"
                                        }`}>
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-[var(--bg-surface-muted)] flex items-center justify-center font-black text-[var(--text-muted)] border border-[var(--border-muted)]">
                                                {entry.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors">{entry.fullName}</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">{entry.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold text-[var(--text-muted)]">{entry.branchName}</td>
                                    <td className="px-8 py-6 text-center">
                                        <p className="text-sm font-black text-[var(--text-main)]">{entry.serviceCount}</p>
                                        <p className="text-[8px] font-black uppercase tracking-tighter text-[var(--text-muted)] opacity-40">Sessions</p>
                                    </td>
                                    <td className="px-8 py-6 text-right font-black text-sm tracking-tighter">
                                        RWF {entry.totalEarned.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
