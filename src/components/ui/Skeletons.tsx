"use client";

import React from "react";

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
    return (
        <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] overflow-hidden shadow-sm animate-pulse">
            {/* Header skeleton */}
            <div className="bg-[var(--bg-surface-muted)]/5 border-b border-[var(--border-muted)] px-8 py-5 flex gap-8">
                {Array.from({ length: cols }).map((_, i) => (
                    <div key={i} className="h-3 bg-[var(--border-muted)] rounded-full flex-1 max-w-[120px]" />
                ))}
            </div>
            {/* Row skeletons */}
            {Array.from({ length: rows }).map((_, r) => (
                <div key={r} className="px-8 py-5 flex gap-8 border-b border-[var(--border-muted)] last:border-0">
                    {Array.from({ length: cols }).map((_, c) => (
                        <div key={c} className={`h-4 bg-[var(--bg-surface-muted)] rounded-lg opacity-40 ${c === 0 ? 'max-w-[180px]' : 'max-w-[100px]'} flex-1`} />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] p-10 shadow-sm animate-pulse">
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-[var(--border-muted)]">
                <div className="space-y-3">
                    <div className="h-6 w-48 bg-[var(--bg-surface-muted)] rounded-lg opacity-40" />
                    <div className="h-3 w-24 bg-[var(--bg-surface-muted)] rounded-full opacity-30" />
                </div>
                <div className="h-8 w-32 bg-[var(--bg-surface-muted)] rounded-lg opacity-40" />
            </div>
            <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-3">
                        <div className="size-12 rounded-2xl bg-[var(--bg-surface-muted)] opacity-30" />
                        <div className="h-5 w-12 bg-[var(--bg-surface-muted)] rounded-lg opacity-40" />
                        <div className="h-2 w-16 bg-[var(--bg-surface-muted)] rounded-full opacity-20" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function StatSkeleton() {
    return (
        <div className="bg-[var(--bg-card)] rounded-[2rem] border border-[var(--border-muted)] p-8 animate-pulse">
            <div className="h-3 w-20 bg-[var(--bg-surface-muted)] rounded-full opacity-30 mb-4" />
            <div className="h-8 w-28 bg-[var(--bg-surface-muted)] rounded-lg opacity-40 mb-2" />
            <div className="h-2 w-16 bg-[var(--bg-surface-muted)] rounded-full opacity-20" />
        </div>
    );
}
