"use client";

export default function ProgressFill({ value, isOvertime }: { value: number; isOvertime: boolean }) {
    return (
        // eslint-disable-next-line react/forbid-dom-props
        <div
            className={`h-full rounded-full transition-all duration-1000 ${isOvertime ? "bg-red-500" : "bg-[var(--color-primary)]"}`}
            style={{ width: `${value}%` }}
        />
    );
}
