"use client";

import React, { useState, useEffect, useRef } from "react";

interface Broadcast {
    id: string;
    subject: string;
    content: string;
    level: string;
    target: string;
    createdAt: string;
}

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasNew, setHasNew] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchBroadcasts() {
            setLoading(true);
            try {
                const res = await fetch("/api/broadcasts");
                if (res.ok) {
                    const data = await res.json();
                    setBroadcasts(data);
                    setHasNew(data.length > 0);
                }
            } catch {
                // Silently fail
            } finally {
                setLoading(false);
            }
        }
        fetchBroadcasts();
    }, []);

    // Close panel on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => { setOpen(!open); setHasNew(false); }}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors relative focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:outline-none rounded-lg"
                aria-label="Notifications"
            >
                <span className="material-symbols-outlined">notifications</span>
                {hasNew && (
                    <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-[380px] max-h-[480px] bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-[var(--border-muted)] flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-widest">Notifications</h3>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">{broadcasts.length} items</span>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto max-h-[380px] divide-y divide-[var(--border-muted)]">
                        {loading && (
                            <div className="p-8 text-center">
                                <span className="material-symbols-outlined text-2xl text-[var(--text-muted)] animate-spin">progress_activity</span>
                            </div>
                        )}

                        {!loading && broadcasts.length === 0 && (
                            <div className="py-12 text-center">
                                <span className="material-symbols-outlined text-4xl text-[var(--text-muted)] opacity-20 mb-2">notifications_off</span>
                                <p className="text-sm text-[var(--text-muted)] italic">All quiet. No broadcasts yet.</p>
                            </div>
                        )}

                        {!loading && broadcasts.map((b) => (
                            <div key={b.id} className="px-6 py-4 hover:bg-[var(--bg-surface-muted)]/50 transition-colors cursor-default">
                                <div className="flex items-start gap-3">
                                    <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${b.level === "EMERGENCY" ? "bg-red-500/10 text-red-500" : "bg-[var(--color-primary-muted)] text-[var(--color-primary)]"}`}>
                                        <span className="material-symbols-outlined text-[18px]">
                                            {b.level === "EMERGENCY" ? "warning" : "campaign"}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[var(--text-main)] leading-tight truncate">{b.subject}</p>
                                        <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{b.content}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">{b.target}</span>
                                            <span className="text-[10px] text-[var(--text-muted)] opacity-50">{timeAgo(b.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
