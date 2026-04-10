import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import ActiveAlerts from "@/components/safety/active-alerts";

const ROOMS = [
    { boxNumber: "B-101", name: "Box 1", type: "Swedish Massage" },
    { boxNumber: "B-102", name: "Box 2", type: "Infrared Sauna" },
    { boxNumber: "B-103", name: "Box 3", type: "Aromatherapy" },
    { boxNumber: "B-104", name: "Box 4", type: "Deep Tissue" },
    { boxNumber: "B-105", name: "Box 5", type: "Steam Room" },
    { boxNumber: "B-106", name: "Box 6", type: "Hot Stone" },
    { boxNumber: "B-107", name: "Box 7", type: "Sauna Therapy" },
    { boxNumber: "B-108", name: "Box 8", type: "Relaxation Suite" },
];

function getInitials(name: string) {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function getMinutesRemaining(createdAt: Date, duration: number): number {
    const endTime = new Date(createdAt.getTime() + duration * 60000);
    return Math.round((endTime.getTime() - Date.now()) / 60000);
}

export default async function FloorMapTab() {
    const session = await auth();
    if (!session?.user?.branchId) return null;

    const [activeRecords, employees] = await Promise.all([
        prisma.serviceRecord.findMany({
            where: {
                branchId: session.user.branchId,
                status: { in: ["CREATED", "IN_PROGRESS"] },
            },
            include: {
                client: { select: { fullName: true } },
                service: { select: { name: true, duration: true } },
                employee: { select: { fullName: true } },
            },
        }),
        prisma.employee.findMany({
            where: { branchId: session.user.branchId, status: "ACTIVE" },
            select: { id: true, fullName: true },
        }),
    ]);

    const occupiedBoxes = new Map(activeRecords.map(r => [r.boxNumber, r]));
    const availableCount = ROOMS.filter(r => !occupiedBoxes.has(r.boxNumber)).length;
    const inServiceCount = occupiedBoxes.size;

    return (
        <div className="space-y-12 animate-fade-in">
            <ActiveAlerts />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-serif font-black italic text-[var(--text-main)] underline decoration-[var(--color-primary)]/20 underline-offset-8">
                        Floor <span className="text-[var(--color-primary)]">Status.</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60 italic">Live Room Occupancy</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-3 glass-card px-6 py-3 rounded-2xl border border-[var(--border-muted)]">
                        <div className="size-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                        <span className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">{availableCount} Free</span>
                    </div>
                    <div className="flex items-center gap-3 glass-card px-6 py-3 rounded-2xl border border-[var(--border-muted)]">
                        <div className="size-3 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]/30"></div>
                        <span className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">{inServiceCount} Active</span>
                    </div>
                </div>
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ROOMS.map((room) => {
                    const record = occupiedBoxes.get(room.boxNumber);
                    if (record) {
                        const minsRemaining = getMinutesRemaining(record.createdAt, record.service.duration);
                        const progress = Math.max(0, Math.min(100, ((record.service.duration - Math.max(0, minsRemaining)) / record.service.duration) * 100));
                        const isOvertime = minsRemaining <= 0;

                        return (
                            <div key={room.boxNumber} className={`glass-card rounded-[2.5rem] p-8 border transition-all duration-700 relative overflow-hidden group ${isOvertime ? "border-red-500/50 bg-red-500/[0.02]" : "border-[var(--border-muted)] shadow-sm hover:shadow-2xl hover:shadow-[var(--color-primary)]/10"}`}>
                                {isOvertime ? (
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500 animate-pulse"></div>
                                ) : (
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)] opacity-40"></div>
                                )}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="font-serif font-black italic text-xl text-[var(--text-main)] leading-tight">{room.name}</h4>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-primary)] mt-1">{record.service.name}</p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isOvertime ? "bg-red-500 text-white" : "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20"}`}>
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
                                    {record.employee && (
                                        <div className="size-12 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-app)] flex items-center justify-center text-[10px] font-black uppercase shadow-sm">
                                            {getInitials(record.employee.fullName)}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 w-full bg-[var(--bg-surface-muted)]/20 h-2 rounded-full overflow-hidden">
                                     <div className={`h-full rounded-full transition-all duration-1000 ${isOvertime ? "bg-red-500" : "bg-[var(--color-primary)]"}`} style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        );
                    }

                    // Available room
                    return (
                        <div key={room.boxNumber} className="glass-card rounded-[2.5rem] p-8 border border-[var(--border-muted)] border-dashed hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/[0.02] transition-all duration-700 cursor-pointer group">
                            <div className="flex justify-between items-start mb-6 text-emerald-500">
                                <div>
                                    <h4 className="font-serif font-black italic text-xl text-[var(--text-main)] leading-tight opacity-40">{room.name}</h4>
                                    <p className="text-[9px] font-black uppercase tracking-widest mt-1">Ready</p>
                                </div>
                                <span className="material-symbols-outlined text-sm font-black">check_circle</span>
                            </div>
                            <div className="flex flex-col items-center justify-center py-8 gap-3">
                                <span className="material-symbols-outlined text-[var(--color-primary)] opacity-20 text-4xl group-hover:scale-125 transition-transform duration-700">add_circle</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-40 group-hover:opacity-100">Open Session</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
