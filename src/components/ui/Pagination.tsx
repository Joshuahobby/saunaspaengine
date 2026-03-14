"use client";

import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
    }

    return (
        <div className="flex items-center justify-center gap-2 pt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="size-10 rounded-xl border border-[var(--border-muted)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {pages.map((page, idx) =>
                typeof page === "string" ? (
                    <span key={`ellipsis-${idx}`} className="text-[var(--text-muted)] text-sm px-1 opacity-50">…</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`size-10 rounded-xl text-sm font-bold transition-all ${
                            page === currentPage
                                ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/15"
                                : "border border-[var(--border-muted)] text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)]"
                        }`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="size-10 rounded-xl border border-[var(--border-muted)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
        </div>
    );
}
