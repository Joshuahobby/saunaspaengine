import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveBranchContext } from "@/lib/branch-context";
import { computeLeaderboard } from "@/lib/leaderboard";
import LeaderboardTable from "./leaderboard-table";

export default async function LeaderboardTab() {
    const session = await auth();
    if (!session?.user) return null;

    const { authorizedBranchIds } = await getActiveBranchContext(session, {});

    const employees = await prisma.employee.findMany({
        where: { branchId: { in: authorizedBranchIds }, status: "ACTIVE" },
        include: {
            branch: { select: { name: true } },
            category: { select: { name: true } },
            _count: { select: { serviceRecords: true } },
            reviews: { select: { rating: true } },
            commissionLogs: { select: { amount: true } },
        },
    });

    const rankings = computeLeaderboard(
        employees.map(emp => ({
            id: emp.id,
            fullName: emp.fullName,
            branchName: emp.branch.name,
            category: emp.category.name,
            serviceCount: emp._count.serviceRecords,
            totalEarned: emp.commissionLogs.reduce((sum, l) => sum + l.amount, 0),
            averageRating: emp.reviews.length > 0
                ? emp.reviews.reduce((sum, r) => sum + r.rating, 0) / emp.reviews.length
                : 0,
            reviewCount: emp.reviews.length,
        }))
    );

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

            <LeaderboardTable rankings={rankings} />
        </div>
    );
}
