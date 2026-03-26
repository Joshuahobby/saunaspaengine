"use client";

import { useState } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { useRouter } from "next/navigation";

interface Shift {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    status: string;
}

export default function ScheduleClient({
    employee,
    isManager,
    shifts,
    weekStart
}: {
    employee: { id: string; fullName: string; category: { name: string } };
    isManager: boolean;
    shifts: Shift[];
    weekStart: Date;
}) {
    const router = useRouter();
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shiftError, setShiftError] = useState<string | null>(null);

    // Form state
    const [shiftDate, setShiftDate] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");

    const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    const handleCreateShift = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setShiftError(null);

        try {
            const res = await fetch("/api/shifts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    employeeId: employee.id,
                    date: shiftDate,
                    startTime,
                    endTime
                })
            });

            if (res.ok) {
                setIsShiftModalOpen(false);
                setShiftDate("");
                router.refresh();
            } else {
                const data = await res.json().catch(() => ({}));
                setShiftError(data?.error || "Failed to create shift");
            }
        } catch {
            setShiftError("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-[var(--text-main)]">Weekly Shifts</h2>
                {isManager && (
                    <button
                        onClick={() => setIsShiftModalOpen(true)}
                        className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg shadow-[var(--color-primary)]/20 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        Assign Shift
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {days.map((day, idx) => {
                    const dayShifts = shifts.filter(s => isSameDay(new Date(s.date), day)).sort((a,b) => a.startTime.localeCompare(b.startTime));
                    const isToday = isSameDay(new Date(), day);
                    
                    return (
                        <div key={idx} className={`flex flex-col rounded-2xl border ${isToday ? 'border-[var(--color-primary)]/50 bg-[var(--color-primary)]/5' : 'border-[var(--border-muted)] bg-[var(--bg-card)]'}`}>
                            <div className="p-3 text-center border-b border-[var(--border-muted)]">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-[var(--color-primary)]' : 'text-[var(--text-muted)]'}`}>{format(day, 'EEE')}</p>
                                <p className={`text-xl font-display font-black mt-1 ${isToday ? 'text-[var(--color-primary)]' : 'text-[var(--text-main)]'}`}>{format(day, 'dd')}</p>
                            </div>
                            <div className="p-3 flex flex-col gap-2 min-h-[120px]">
                                {dayShifts.map(shift => (
                                    <div key={shift.id} className="bg-[var(--bg-surface-muted)] rounded-lg p-2 text-center border border-[var(--border-muted)] relative group">
                                        <p className="text-xs font-bold text-[var(--text-main)] italic tracking-tight">{shift.startTime} - {shift.endTime}</p>
                                        <span className={`text-[8px] font-black uppercase mt-1 block ${
                                            shift.status === 'SCHEDULED' ? 'text-[var(--color-primary)]' :
                                            shift.status === 'COMPLETED' ? 'text-green-500' : 'text-red-500'
                                        }`}>{shift.status}</span>
                                    </div>
                                ))}
                                {dayShifts.length === 0 && (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 my-4">
                                        <span className="material-symbols-outlined text-2xl text-[var(--text-muted)]">bedtime</span>
                                        <span className="text-[9px] font-bold uppercase tracking-widest mt-1 text-[var(--text-muted)]">Off</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Shift Modal */}
            {isShiftModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-[var(--border-muted)] flex justify-between items-center bg-[var(--color-primary)]/5">
                            <div>
                                <h3 className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest italic">Assign <span className="text-[var(--color-primary)]">Shift</span></h3>
                                <p className="text-[9px] text-[var(--text-muted)] font-bold mt-1 uppercase tracking-wider">Employee: {employee.fullName}</p>
                            </div>
                            <button onClick={() => setIsShiftModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreateShift} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="shiftDate" className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Date</label>
                                <input 
                                    id="shiftDate"
                                    type="date" 
                                    required 
                                    className="w-full bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl py-3 px-4 text-xs font-bold focus:border-[var(--color-primary)] outline-none" 
                                    value={shiftDate}
                                    onChange={e => setShiftDate(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="shiftStartTime" className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Start Time</label>
                                    <input 
                                        id="shiftStartTime"
                                        type="time" 
                                        required 
                                        className="w-full bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl py-3 px-4 text-xs font-bold focus:border-[var(--color-primary)] outline-none" 
                                        value={startTime}
                                        onChange={e => setStartTime(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="shiftEndTime" className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">End Time</label>
                                    <input 
                                        id="shiftEndTime"
                                        type="time" 
                                        required 
                                        className="w-full bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl py-3 px-4 text-xs font-bold focus:border-[var(--color-primary)] outline-none" 
                                        value={endTime}
                                        onChange={e => setEndTime(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            {shiftError && (
                                <p className="text-[10px] text-red-500 font-bold px-4 py-2 bg-red-500/10 rounded-lg">{shiftError}</p>
                            )}

                            <div className="pt-4 border-t border-[var(--border-muted)] flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsShiftModalOpen(false)}
                                    className="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase text-[var(--text-muted)] border border-[var(--border-muted)] hover:bg-[var(--bg-surface-muted)]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-2 py-3.5 rounded-xl text-[10px] font-black uppercase text-white bg-[var(--color-primary)] hover:opacity-90 flex items-center justify-center gap-2 px-8 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Saving..." : "Create Shift"}
                                    {!isSubmitting && <span className="material-symbols-outlined text-sm font-black">save</span>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
