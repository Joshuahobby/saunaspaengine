"use client";

import React, { useState } from "react";
import { updateBranchHoursAction } from "@/lib/settings-actions";
import { toast } from "react-hot-toast";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DEFAULT_HOURS = DAYS.reduce((acc, day) => ({
    ...acc,
    [day]: { open: "08:00", close: "22:00", isClosed: false }
}), {});

interface BusinessHoursFormProps {
    branchId: string;
    initialHours: any;
}

export function BusinessHoursForm({ branchId, initialHours }: BusinessHoursFormProps) {
    const [loading, setLoading] = useState(false);
    const [hours, setHours] = useState(initialHours || DEFAULT_HOURS);

    const updateDay = (day: string, field: string, value: any) => {
        setHours((prev: any) => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    async function handleSave() {
        setLoading(true);
        try {
            const res = await updateBranchHoursAction(branchId, hours);
            if (res.success) {
                toast.success("Operational hours updated.");
            } else {
                toast.error(res.error || "Failed to save hours.");
            }
        } catch (err) {
            toast.error("Internal server error.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <section className="glass-card rounded-2xl border border-[var(--border-muted)] overflow-hidden shadow-xl shadow-[var(--color-primary)]/5">
                <div className="p-6 bg-[var(--bg-surface-muted)]/5 border-b border-[var(--border-muted)] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--color-primary)]">schedule</span>
                        <h2 className="text-xl font-bold">Standard Weekly Schedule</h2>
                    </div>
                </div>

                <div className="divide-y divide-[var(--border-muted)]">
                    {DAYS.map((day) => {
                        const dayData = hours[day] || { open: "08:00", close: "22:00", isClosed: false };
                        return (
                            <div key={day} className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${dayData.isClosed ? 'bg-[var(--bg-surface-muted)]/20 grayscale' : 'hover:bg-[var(--bg-surface-muted)]/5'}`}>
                                <div className="flex items-center gap-4 w-40">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-app)] border border-[var(--border-muted)] flex items-center justify-center font-bold text-xs uppercase text-[var(--text-muted)]">
                                        {day.substring(0, 3)}
                                    </div>
                                    <span className={`font-bold ${dayData.isClosed ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-main)]'}`}>
                                        {day}
                                    </span>
                                </div>

                                <div className="flex-1 flex flex-wrap items-center gap-3">
                                    {!dayData.isClosed ? (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="time" 
                                                    value={dayData.open} 
                                                    onChange={(e) => updateDay(day, 'open', e.target.value)}
                                                    className="rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] text-sm px-3 py-1.5 font-mono"
                                                />
                                                <span className="text-[var(--text-muted)] text-sm font-bold">to</span>
                                                <input 
                                                    type="time" 
                                                    value={dayData.close} 
                                                    onChange={(e) => updateDay(day, 'close', e.target.value)}
                                                    className="rounded-lg border-[var(--border-muted)] bg-[var(--bg-app)] focus:ring-[var(--color-primary)] text-sm px-3 py-1.5 font-mono"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-xs font-black uppercase tracking-widest border border-red-500/20">
                                            <span className="material-symbols-outlined text-sm">block</span>
                                            Closed for Operations
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-tight">Closed</label>
                                        <button 
                                            onClick={() => updateDay(day, 'isClosed', !dayData.isClosed)}
                                            className={`w-11 h-6 rounded-full relative transition-all duration-300 ${dayData.isClosed ? 'bg-red-500 shadow-inner' : 'bg-[var(--bg-surface-muted)]'}`}
                                        >
                                            <div className={`absolute top-1 size-4 bg-white rounded-full shadow-md transition-all duration-300 ${dayData.isClosed ? 'right-1' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <div className="flex items-center justify-end gap-4 pb-10">
                <button className="px-6 py-2.5 rounded-lg border border-[var(--border-muted)] font-bold hover:bg-[var(--bg-surface-muted)]/50 transition-colors">
                    Reset Schedule
                </button>
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="px-10 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-amber-400)] text-[var(--bg-app)] font-black uppercase tracking-widest hover:opacity-90 shadow-xl shadow-[var(--color-primary)]/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="animate-spin material-symbols-outlined text-lg">sync</span>
                            Updating...
                        </>
                    ) : (
                        "Save Weekly Schedule"
                    )}
                </button>
            </div>
        </div>
    );
}
