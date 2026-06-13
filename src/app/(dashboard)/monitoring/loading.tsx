export default function MonitoringLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-[var(--bg-surface-muted)] rounded-xl" />
                    <div className="h-4 w-96 bg-[var(--bg-surface-muted)] rounded-lg opacity-60" />
                </div>
                <div className="h-10 w-36 bg-[var(--bg-surface-muted)] rounded-xl" />
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 bg-[var(--bg-surface-muted)] rounded-2xl" />
                ))}
            </div>
            {/* Content rows */}
            <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-16 bg-[var(--bg-surface-muted)] rounded-2xl" />
                ))}
            </div>
        </div>
    );
}
