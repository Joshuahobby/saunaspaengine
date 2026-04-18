import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveBranchContext } from "@/lib/branch-context";
import ActiveAlerts from "@/components/safety/active-alerts";
import CompleteSessionButton from "@/components/operations/CompleteSessionButton";
import ProgressFill from "@/components/operations/ProgressFill";

const PAGE_SIZE = 8;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getInitials(name: string) {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function getMinutesRemaining(createdAt: Date, duration: number): number {
    const endTime = new Date(createdAt.getTime() + duration * 60000);
    return Math.round((endTime.getTime() - Date.now()) / 60000);
}

// ─── Pagination Dot ───────────────────────────────────────────────────────────
function PageDot({ page, current }: { page: number; current: number }) {
    const isActive = page === current;
    return (
        <Link
            href={`/operations?tab=map&page=${page}`}
            aria-label={`Go to page ${page}`}
            className={`size-7 rounded-xl flex items-center justify-center text-[9px] font-black uppercase tracking-widest transition-all ${
                isActive
                    ? "bg-[var(--text-main)] text-[var(--bg-app)] shadow-sm scale-105"
                    : "bg-[var(--bg-surface-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-muted)]"
            }`}
        >
            {page}
        </Link>
    );
}

// ─── Component ───────────────────────────────────────────────────────────────
interface FloorMapTabProps {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function FloorMapTab({ searchParams }: FloorMapTabProps) {
    const session = await auth();
    if (!session?.user) return null;

    const params = await searchParams;

    // Resolve effective branch — fall back to first authorized branch when
    // "All Branches" is selected (activeBranchId === null for OWNER/ADMIN).
    const branchCtx = await getActiveBranchContext(session, params);
    const effectiveBranchId = branchCtx.activeBranchId ?? branchCtx.authorizedBranchIds[0] ?? null;

    if (!effectiveBranchId) {
        return (
            <div className="glass-card rounded-[2.5rem] border border-dashed border-[var(--border-muted)] p-20 flex flex-col items-center gap-6 text-center">
                <span className="material-symbols-outlined text-6xl text-[var(--text-muted)] opacity-20">bedroom_parent</span>
                <div className="space-y-2">
                    <p className="text-lg font-display font-black text-[var(--text-main)]">No Branch Available</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-60">
                        No active branches found for this account
                    </p>
                </div>
            </div>
        );
    }

    const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

    // ── Fetch total count first to validate page range ──
    const totalLockers = await prisma.locker.count({
        where: { branchId: effectiveBranchId, isActive: true },
    });

    const totalPages = Math.max(1, Math.ceil(totalLockers / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const startIdx = (safePage - 1) * PAGE_SIZE;

    // ── Fetch this page of lockers + all active sessions in parallel ──
    const [pageLockers, activeRecords] = await Promise.all([
        prisma.locker.findMany({
            where: { branchId: effectiveBranchId, isActive: true },
            orderBy: { order: "asc" },
            skip: startIdx,
            take: PAGE_SIZE,
        }),
        prisma.serviceRecord.findMany({
            where: {
                branchId: effectiveBranchId,
                status: { in: ["CREATED", "IN_PROGRESS"] },
            },
            include: {
                client: { select: { fullName: true } },
                service: { select: { name: true, duration: true } },
                employee: { select: { fullName: true } },
            },
        }),
    ]);

    // Key: lockerNumber → active record
    const occupiedMap = new Map<number | null, typeof activeRecords[number]>(activeRecords.map(r => [r.lockerNumber, r]));
    const availableCount = totalLockers - occupiedMap.size;
    const inServiceCount = occupiedMap.size;

    // ── Empty state ──────────────────────────────────────────────────────────
    if (totalLockers === 0) {
        return (
            <div className="glass-card rounded-[2.5rem] border border-dashed border-[var(--border-muted)] p-20 flex flex-col items-center gap-6 text-center">
                <span className="material-symbols-outlined text-6xl text-[var(--text-muted)] opacity-20">bedroom_parent</span>
                <div className="space-y-2">
                    <p className="text-lg font-display font-black text-[var(--text-main)]">No Lockers Configured</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-60">
                        Add lockers to your branch to start tracking room occupancy
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in">
            <ActiveAlerts />

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1.5">
                    <h2 className="text-3xl font-display font-black text-[var(--text-main)] tracking-tight">
                        Floor <span className="text-[var(--color-primary)]">Status</span>
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-60">
                        Live Room Occupancy · {totalLockers} locker{totalLockers !== 1 ? "s" : ""} configured
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-3 glass-card px-5 py-2.5 rounded-2xl border border-[var(--border-muted)]">
                        <div className="size-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">{availableCount} Free</span>
                    </div>
                    <div className="flex items-center gap-3 glass-card px-5 py-2.5 rounded-2xl border border-[var(--border-muted)]">
                        <div className="size-2.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]/40" />
                        <span className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">{inServiceCount} Active</span>
                    </div>
                </div>
            </div>

            {/* ── Page range + top dots ── */}
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">
                    Showing {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, totalLockers)} of {totalLockers}
                </p>
                {totalPages > 1 && (
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <PageDot key={p} page={p} current={safePage} />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Room Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pageLockers.map((locker) => {
                    const record = occupiedMap.get(locker.lockerNumber);

                    if (record) {
                        const minsRemaining = getMinutesRemaining(record.createdAt, record.service?.duration || 0);
                        const duration = record.service?.duration || 0;
                        const progress = duration > 0 ? Math.max(0, Math.min(100,
                            ((duration - Math.max(0, minsRemaining)) / duration) * 100
                        )) : 0;
                        const isOvertime = minsRemaining <= 0;

                        return (
                            <div
                                key={locker.lockerNumber}
                                className={`glass-card rounded-[2.5rem] p-8 border transition-all duration-700 relative overflow-hidden group ${
                                    isOvertime
                                        ? "border-red-500/50 bg-red-500/[0.02]"
                                        : "border-[var(--border-muted)] shadow-sm hover:shadow-2xl hover:shadow-[var(--color-primary)]/10"
                                }`}
                            >
                                {isOvertime ? (
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500 animate-pulse" />
                                ) : (
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)] opacity-40" />
                                )}

                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="font-display font-black text-xl text-[var(--text-main)] leading-tight tracking-tight">{locker.name}</h4>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-primary)] mt-1">{record.service?.name || "Unknown Service"}</p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                        isOvertime
                                            ? "bg-red-500 text-white"
                                            : "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20"
                                    }`}>
                                        {isOvertime ? "Done" : "In Use"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-10">
                                    <div className={`flex items-center gap-2 ${isOvertime ? "text-red-500" : "text-[var(--text-main)]"}`}>
                                        <span className="material-symbols-outlined text-4xl font-black">
                                            {isOvertime ? "history" : "timer"}
                                        </span>
                                        <span className="text-4xl font-black tracking-tighter">
                                            {isOvertime ? `-${Math.abs(minsRemaining)}` : minsRemaining}
                                        </span>
                                        <span className="text-[10px] uppercase font-black tracking-tighter self-end mb-1">min</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {record.employee && (
                                            <div className="size-10 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-app)] flex items-center justify-center text-[9px] font-black uppercase shadow-sm">
                                                {getInitials(record.employee?.fullName || "??")}
                                            </div>
                                        )}
                                        <CompleteSessionButton recordId={record.id} boxName={locker.name} />
                                        <Link
                                            href={`/checkout/${record.id}`}
                                            className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors"
                                        >
                                            View Detail
                                        </Link>
                                    </div>
                                </div>

                                <div className="mt-8 w-full bg-[var(--bg-surface-muted)]/20 h-2 rounded-full overflow-hidden">
                                    <ProgressFill value={progress} isOvertime={isOvertime} />
                                </div>
                            </div>
                        );
                    }

                    // ── Available locker ──
                    return (
                        <Link
                            key={locker.lockerNumber}
                            href={`/check-in?lockerNumber=${locker.lockerNumber}&branchId=${effectiveBranchId}`}
                            className="glass-card rounded-[2.5rem] p-8 border border-[var(--border-muted)] border-dashed hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/[0.02] transition-all duration-700 cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-6 text-emerald-500">
                                <div>
                                    <h4 className="font-display font-black text-xl text-[var(--text-main)] leading-tight tracking-tight opacity-40">{locker.name}</h4>
                                    <p className="text-[9px] font-black uppercase tracking-widest mt-1">Ready · {locker.lockerNumber}</p>
                                </div>
                                <span className="material-symbols-outlined text-sm font-black">check_circle</span>
                            </div>
                            <div className="flex flex-col items-center justify-center py-8 gap-3">
                                <span className="material-symbols-outlined text-[var(--color-primary)] opacity-20 text-4xl group-hover:scale-125 transition-transform duration-700">add_circle</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-40 group-hover:opacity-100">Open Session</span>
                            </div>
                            {locker.type && (
                                <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-30 text-center">{locker.type}</p>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* ── Pagination Controls ── */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-[var(--border-muted)]">
                    {safePage > 1 ? (
                        <Link
                            href={`/operations?tab=map&page=${safePage - 1}`}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-main)] transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Previous
                        </Link>
                    ) : <div />}

                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <PageDot key={p} page={p} current={safePage} />
                        ))}
                    </div>

                    {safePage < totalPages ? (
                        <Link
                            href={`/operations?tab=map&page=${safePage + 1}`}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-main)] transition-all"
                        >
                            Next
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    ) : <div />}
                </div>
            )}
        </div>
    );
}
