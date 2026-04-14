import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveBranchContext } from "@/lib/branch-context";

const CATEGORY_COLORS = [
    "bg-[var(--color-primary)]",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-cyan-500",
];

export default async function AnalyticsTab() {
    const session = await auth();
    if (!session?.user) return null;

    const { authorizedBranchIds } = await getActiveBranchContext(session, {});

    if (authorizedBranchIds.length === 0) {
        return (
            <div className="py-20 text-center text-[var(--text-muted)] opacity-40 text-[10px] font-black uppercase tracking-widest">
                No branches configured for this account.
            </div>
        );
    }

    const [staffCount, categoriesWithCount, ratingAgg] = await Promise.all([
        prisma.employee.count({
            where: { branchId: { in: authorizedBranchIds }, status: "ACTIVE" }
        }),
        prisma.employeeCategory.findMany({
            where: { branchId: { in: authorizedBranchIds } },
            include: { _count: { select: { employees: true } } },
            orderBy: { employees: { _count: "desc" } },
        }),
        prisma.review.aggregate({
            where: { branchId: { in: authorizedBranchIds } },
            _avg: { rating: true },
            _count: { rating: true },
        }),
    ]);

    const avgRating = ratingAgg._avg.rating;
    const reviewCount = ratingAgg._count.rating;
    const categoryCount = categoriesWithCount.length;

    // Only include categories that have at least one employee for the chart
    const activeCategories = categoriesWithCount.filter(c => c._count.employees > 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
            {/* High Level Stats */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-10 rounded-[3rem] border border-[var(--border-muted)] space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Active Team Members</p>
                    <p className="text-5xl font-black">{staffCount}</p>
                    <div className="h-1.5 w-full bg-[var(--bg-surface-muted)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-primary)] w-full" />
                    </div>
                </div>
                <div className="glass-card p-10 rounded-[3rem] border border-[var(--border-muted)] space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Avg. Session Rating</p>
                    {avgRating != null ? (
                        <>
                            <p className="text-5xl font-black">{avgRating.toFixed(1)}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">
                                from {reviewCount.toLocaleString()} review{reviewCount !== 1 ? "s" : ""}
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-5xl font-black opacity-20">—</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">No reviews yet</p>
                        </>
                    )}
                </div>
                <div className="glass-card p-10 rounded-[3rem] border border-[var(--border-muted)] space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">Role Categories</p>
                    <p className="text-5xl font-black">{categoryCount}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">DEFINED ROLES</p>
                </div>
            </div>

            {/* Role Distribution Chart */}
            <div className="lg:col-span-7 glass-card p-12 rounded-[3.5rem] border border-[var(--border-muted)] space-y-12">
                <div className="space-y-2">
                    <h3 className="text-3xl font-serif font-black">Role <span className="text-[var(--color-primary)]">Density.</span></h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">Personnel weight across service categories</p>
                </div>

                {activeCategories.length === 0 ? (
                    <div className="py-12 text-center text-[var(--text-muted)] opacity-30 text-[10px] font-black uppercase tracking-widest">
                        No staff assigned to categories yet.
                    </div>
                ) : (
                    <>
                        <style>{activeCategories.map((cat) =>
                            `.role-bar-${cat.id}{width:${staffCount > 0 ? ((cat._count.employees / staffCount) * 100).toFixed(2) : 0}%}`
                        ).join("")}</style>
                        <div className="space-y-10">
                            {activeCategories.map((cat, i) => (
                                <div key={cat.id} className="space-y-4">
                                    <div className="flex justify-between items-end px-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-main)]">{cat.name}</span>
                                        <span className="text-xs font-black opacity-40">{cat._count.employees} Staff</span>
                                    </div>
                                    <div className="h-3 w-full bg-[var(--bg-surface-muted)]/50 rounded-full overflow-hidden border border-[var(--border-muted)] group">
                                        <div className={`role-bar-${cat.id} h-full ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} rounded-full transition-all duration-1000 group-hover:brightness-125`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Strategic Insights Card */}
            <div className="lg:col-span-5 glass-card p-12 rounded-[3.5rem] border border-[var(--border-muted)] bg-[var(--text-main)] text-[var(--bg-app)] flex flex-col justify-between">
                <div className="space-y-6">
                    <div className="size-16 rounded-[1.5rem] bg-[var(--color-primary)] flex items-center justify-center text-[var(--bg-app)]">
                         <span className="material-symbols-outlined text-4xl font-black">electric_bolt</span>
                    </div>
                    <h3 className="text-3xl font-serif font-black tracking-tighter">Strategic <br /> Workforce Plan.</h3>
                    <p className="text-sm font-bold opacity-60 leading-relaxed">
                        {staffCount === 0
                            ? "No active staff yet. Register your first team member to begin tracking workforce analytics."
                            : `You have ${staffCount} active team member${staffCount !== 1 ? "s" : ""} across ${categoryCount} role${categoryCount !== 1 ? "s" : ""}${avgRating != null ? ` with an average session rating of ${avgRating.toFixed(1)}/5` : ""}.`
                        }
                    </p>
                </div>

                <div className="h-16 w-full rounded-2xl bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 flex items-center justify-center text-[10px] font-black uppercase tracking-widest mt-12 text-[var(--color-primary)]">
                    HR Report — Coming Soon
                </div>
            </div>
        </div>
    );
}
