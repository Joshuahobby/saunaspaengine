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
        <div className="flex flex-col gap-6 -m-4 lg:-m-6">
            {/* Live Alerts Ticker */}
            {activeRecords.some(r => {
                const mins = getMinutesRemaining(r.createdAt, r.service.duration);
                return mins <= 0;
            }) && (
                    <div className="bg-red-50 border-b border-red-200 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="flex items-center gap-2 text-red-500 animate-pulse">
                                <span className="material-symbols-outlined fill-1">warning</span>
                                <span className="text-sm font-black uppercase tracking-tighter">Live Alerts</span>
                            </div>
                            <div className="h-4 w-px bg-red-300 mx-2"></div>
                            <p className="text-sm font-medium text-red-500 truncate">
                                {activeRecords.filter(r => getMinutesRemaining(r.createdAt, r.service.duration) <= 0).map(r => `${r.boxNumber} timer ended`).join(" • ")}
                            </p>
                        </div>
                    </div>
                )}

            {/* Dashboard Content */}
            <div className="p-4 lg:p-6">
                <ActiveAlerts />

                <div className="flex items-center justify-between mb-8 mt-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Treatment Rooms Status</h2>
                        <p className="text-slate-500 text-sm">Real-time floor utilization and turnover status</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            <span className="text-xs font-medium">{availableCount} Available</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                            <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]"></div>
                            <span className="text-xs font-medium">{inServiceCount} In-Service</span>
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
                                <div key={room.boxNumber} className={`bg-white rounded-xl p-5 shadow-sm relative overflow-hidden ${isOvertime ? "border-2 border-red-500 bg-red-50/30 shadow-red-500/10 shadow-lg" : "border border-slate-200"}`}>
                                    {isOvertime ? (
                                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                                    ) : (
                                        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-primary)]"></div>
                                    )}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-lg">{room.name}</h4>
                                            <p className="text-xs text-slate-500">{record.service.name}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${isOvertime ? "bg-red-500 text-white" : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"}`}>
                                            {isOvertime ? "Time Up!" : "In-Service"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-6">
                                        <div className={`flex items-center gap-2 ${isOvertime ? "text-red-500" : ""}`}>
                                            <span className={`material-symbols-outlined text-lg ${isOvertime ? "animate-bounce text-red-500" : "text-slate-400"}`}>
                                                {isOvertime ? "alarm_on" : "timer"}
                                            </span>
                                            <span className="text-2xl font-black tracking-tighter">
                                                {isOvertime ? `-${String(Math.abs(minsRemaining)).padStart(2, "0")}:00` : `${String(Math.max(0, minsRemaining)).padStart(2, "0")}:00`}
                                            </span>
                                        </div>
                                        {record.employee && (
                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-[10px] font-bold">
                                                {getInitials(record.employee.fullName)}
                                            </div>
                                        )}
                                    </div>
                                    {isOvertime ? (
                                        <button className="w-full bg-red-500 text-white py-2 rounded-lg text-sm font-bold mt-4 hover:bg-red-600 transition-colors">
                                            Send Alert to Staff
                                        </button>
                                    ) : (
                                        <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            {/* eslint-disable-next-line react/forbid-dom-props */}
                                            <div
                                                className="bg-[var(--color-primary)] h-full rounded-full transition-all"
                                                style={{ "--progress-width": `${progress}%` } as React.CSSProperties}
                                            ></div>
                                        </div>
                                    )
                                    }
                                </div>
                            );
                        }

                        // Available room
                        return (
                            <div key={room.boxNumber} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden hover:border-green-500 transition-colors cursor-pointer">
                                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg">{room.name}</h4>
                                        <p className="text-xs text-slate-500">Ready for Guest</p>
                                    </div>
                                    <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded text-[10px] font-black uppercase">Available</span>
                                </div>
                                <div className="flex flex-col items-center justify-center py-4 gap-2 border-2 border-dashed border-slate-100 rounded-lg">
                                    <span className="material-symbols-outlined text-slate-300">add_circle</span>
                                    <span className="text-xs font-medium text-slate-400">Assign Booking</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Stats */}
            <div className="bg-white border-t border-slate-200 py-3 px-6 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs font-medium text-slate-500">Systems Operational</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-slate-400">group</span>
                        <span className="text-xs font-medium text-slate-500">{employees.length} Staff Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-slate-400">trending_up</span>
                        <span className="text-xs font-medium text-slate-500">{todayCount} Sessions Today</span>
                    </div>
                </div>
                <div className="text-xs text-slate-400">
                    Last Refreshed: <span className="font-bold">{new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                </div>
            </div>
        </div >
    );
}
