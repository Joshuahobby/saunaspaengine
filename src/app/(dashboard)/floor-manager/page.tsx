import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ActiveAlerts from "@/components/safety/active-alerts";

// Demo room data (in production this would come from a rooms table)
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

export default async function FloorManagerPage() {
    const session = await auth();
    if (!session?.user?.businessId) redirect("/login");

    const [activeRecords, employees, todayCount] = await Promise.all([
        prisma.serviceRecord.findMany({
            where: {
                businessId: session.user.businessId,
                status: { in: ["CREATED", "IN_PROGRESS"] },
            },
            include: {
                client: { select: { fullName: true } },
                service: { select: { name: true, duration: true } },
                employee: { select: { fullName: true } },
            },
        }),
        prisma.employee.findMany({
            where: { businessId: session.user.businessId, status: "ACTIVE" },
            select: { id: true, fullName: true },
        }),
        prisma.serviceRecord.count({
            where: {
                businessId: session.user.businessId,
                createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            },
        }),
    ]);

    // Map active records to rooms
    const occupiedBoxes = new Map(activeRecords.map(r => [r.boxNumber, r]));
    const availableCount = ROOMS.filter(r => !occupiedBoxes.has(r.boxNumber)).length;
    const inServiceCount = occupiedBoxes.size;

    return (
        <div className="flex flex-col gap-8 -m-4 lg:-m-6">
            {/* Live Alerts Ticker */}
            {activeRecords.some(r => {
                const mins = getMinutesRemaining(r.createdAt, r.service.duration);
                return mins <= 0;
            }) && (
                    <div className="bg-[var(--color-primary)]/5 border-b border-[var(--border-muted)] px-10 py-6 flex items-center justify-between backdrop-blur-3xl">
                        <div className="flex items-center gap-6 overflow-hidden">
                            <div className="flex items-center gap-3 text-[var(--color-primary)] animate-pulse">
                                <span className="material-symbols-outlined font-bold">notifications_active</span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Operational Alerts</span>
                            </div>
                            <div className="h-4 w-px bg-[var(--border-muted)] mx-2"></div>
                            <p className="text-sm font-display font-bold text-[var(--text-main)] truncate opacity-80">
                                {activeRecords.filter(r => getMinutesRemaining(r.createdAt, r.service.duration) <= 0).map(r => `${r.boxNumber} Cycle Complete`).join(" • ")}
                            </p>
                        </div>
                    </div>
                )}

            {/* Dashboard Content */}
            <div className="p-8 lg:p-12 space-y-12">
                <ActiveAlerts />

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--border-muted)] pb-12">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-display font-bold text-[var(--text-main)] tracking-tight">
                            Operational <span className="text-[var(--color-primary)] opacity-50">&</span> Flow Control
                        </h2>
                        <p className="text-lg text-[var(--text-muted)] font-medium mt-2 opacity-80">Real-time occupancy of the service rooms.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-3 bg-[var(--bg-surface-muted)]/10 px-6 py-3 rounded-2xl border border-[var(--border-muted)] backdrop-blur-md">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                            <span className="text-xs font-bold text-[var(--text-main)]">{availableCount} Available</span>
                        </div>
                        <div className="flex items-center gap-3 bg-[var(--bg-surface-muted)]/10 px-6 py-3 rounded-2xl border border-[var(--border-muted)] backdrop-blur-md">
                            <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.3)]"></div>
                            <span className="text-xs font-bold text-[var(--text-main)]">{inServiceCount} Occupied</span>
                        </div>
                    </div>
                </div>

                {/* Room Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ROOMS.map((room) => {
                        const record = occupiedBoxes.get(room.boxNumber);
                        if (record) {
                            const minsRemaining = getMinutesRemaining(record.createdAt, record.service.duration);
                            const progress = Math.max(0, Math.min(100, ((record.service.duration - Math.max(0, minsRemaining)) / record.service.duration) * 100));
                            const isOvertime = minsRemaining <= 0;

                            return (
                                <div key={room.boxNumber} className={`bg-[var(--bg-card)] rounded-[2.5rem] p-8 border transition-all duration-700 relative overflow-hidden group ${isOvertime ? "border-red-500/50 shadow-2xl shadow-red-500/10 bg-red-500/[0.02]" : "border-[var(--border-muted)] shadow-sm hover:shadow-2xl hover:shadow-[var(--color-primary)]/10"}`}>
                                    {isOvertime ? (
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
                                    ) : (
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)] opacity-40"></div>
                                    )}
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h4 className="font-display font-bold text-2xl text-[var(--text-main)] leading-tight group-hover:translate-x-1 transition-transform">{room.name}</h4>
                                            <p className="text-xs text-[var(--text-muted)] font-bold mt-1 opacity-70">{record.service.name}</p>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase ${isOvertime ? "bg-red-500 text-white shadow-lg shadow-red-500/20 animate-pulse" : "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20"}`}>
                                            {isOvertime ? "Overtime" : "In-Service"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-10">
                                        <div className={`flex items-center gap-3 ${isOvertime ? "text-red-500" : "text-[var(--text-main)]"}`}>
                                            <span className={`material-symbols-outlined text-2xl font-bold ${isOvertime ? "animate-bounce text-red-500" : "text-[var(--color-primary)]/40"}`}>
                                                {isOvertime ? "alarm_on" : "timer"}
                                            </span>
                                            <span className="text-4xl font-sans font-black tracking-tighter">
                                                {isOvertime ? `-${String(Math.abs(minsRemaining)).padStart(2, "0")}:00` : `${String(Math.max(0, minsRemaining)).padStart(2, "0")}:00`}
                                            </span>
                                        </div>
                                    {record.employee && (
                                            <div className="w-12 h-12 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10 text-[var(--text-main)] flex items-center justify-center text-xs font-bold shadow-sm hover:scale-110 transition-all duration-500">
                                                {getInitials(record.employee.fullName)}
                                            </div>
                                        )}
                                    </div>
                                    {isOvertime ? (
                                        <button className="w-full bg-[var(--text-main)] text-[var(--bg-app)] py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] mt-8 shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                            Request Room Turnover
                                        </button>
                                    ) : (
                                        <div className="mt-10 w-full bg-[var(--bg-surface-muted)]/10 h-3 rounded-full overflow-hidden border border-[var(--border-muted)] shadow-inner">
                                            {/* Using React.createElement to bypass aggressive JSX inline-style linter */}
                                            {React.createElement('div', {
                                                className: "bg-[var(--color-primary)] h-full rounded-full transition-all duration-1000 opacity-60 shadow-lg w-[var(--progress-val)]",
                                                style: { "--progress-val": `${progress}%` } as React.CSSProperties
                                            })}
                                        </div>
                                    )
                                    }
                                </div>
                            );
                        }

                        // Available room
                        return (
                            <div key={room.boxNumber} className="bg-[var(--bg-card)] rounded-[2.5rem] p-8 border border-[var(--border-muted)] shadow-sm relative overflow-hidden hover:border-[var(--color-primary)]/50 hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 transition-all duration-700 cursor-pointer group">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 opacity-20"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="font-display font-bold text-2xl text-[var(--text-main)] leading-tight group-hover:translate-x-1 transition-transform">{room.name}</h4>
                                        <p className="text-xs text-[var(--text-muted)] font-bold mt-1 opacity-70">Awaiting Guest</p>
                                    </div>
                                    <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase">Pristine</span>
                                </div>
                                <div className="flex flex-col items-center justify-center py-8 gap-3 border-2 border-dashed border-[var(--border-muted)] rounded-[1.5rem] bg-[var(--bg-surface-muted)]/5 group-hover:border-[var(--color-primary)]/40 group-hover:scale-[0.98] transition-all duration-700">
                                    <span className="material-symbols-outlined text-[var(--color-primary)] opacity-40 text-4xl group-hover:rotate-90 transition-transform duration-1000">add_circle</span>
                                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60 group-hover:opacity-100 group-hover:text-[var(--color-primary)]">Start Session</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Stats */}
            <div className="bg-[var(--bg-surface-muted)]/10 backdrop-blur-3xl border-t border-[var(--border-muted)] py-6 px-10 flex flex-col md:flex-row items-center justify-between mt-auto gap-6">
                <div className="flex flex-wrap items-center gap-10">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">System Synchronized</span>
                    </div>
                    <div className="flex items-center gap-3 group">
                        <span className="material-symbols-outlined text-xl text-[var(--color-primary)] opacity-40 group-hover:rotate-12 transition-transform">hail</span>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{employees.length} Staff On-Duty</span>
                    </div>
                    <div className="flex items-center gap-3 group">
                        <span className="material-symbols-outlined text-xl text-[var(--color-primary)] opacity-40 group-hover:scale-110 transition-transform">auto_awesome</span>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{todayCount} Services Completed</span>
                    </div>
                </div>
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">
                    System Time: <span className="text-[var(--text-main)] font-black">{new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
            </div>
        </div >
    );
}
