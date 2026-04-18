export default function StaffLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
            {/* Tab bar skeleton */}
            <div className="flex gap-3 border-b border-[var(--border-main)] pb-0">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-10 w-28 bg-[var(--bg-surface-muted)] rounded-t-xl" />
                ))}
            </div>

            {/* Header skeleton */}
            <div className="flex justify-between items-end pb-8 border-b border-[var(--border-muted)]">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-[var(--bg-surface-muted)] rounded-xl" />
                    <div className="h-3 w-72 bg-[var(--bg-surface-muted)] rounded-lg opacity-60" />
                </div>
                <div className="h-9 w-32 bg-[var(--bg-surface-muted)] rounded-xl" />
            </div>

            {/* Table skeleton */}
            <div className="space-y-3">
                <div className="h-12 bg-[var(--bg-surface-muted)] rounded-2xl opacity-50" />
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-16 bg-[var(--bg-surface-muted)] rounded-2xl" />
                ))}
            </div>
        </div>
    );
}
