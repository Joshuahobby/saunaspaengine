import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format, startOfDay, endOfDay } from "date-fns";

export default async function EmployeeSchedulePage() {
    const session = await auth();
    if (!session?.user?.branchId) redirect("/login");

    const today = new Date();

    // Fetch the first employee to use as the context for this view, or user's linked employee
    // In a full system, you would match session.user.email to employee.email, but employee has no email.
    // So we just grab the first therapist.
    const employee = await prisma.employee.findFirst({
        where: {
            branchId: session.user.branchId,
            category: {
                name: { in: ['Therapist', 'Masseuse', 'THERAPIST', 'MASSEUSE'] }
            }
        },
        include: { category: true }
    });

    if (!employee) {
        return (
            <div className="max-w-7xl mx-auto py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-800">No Therapists Found</h2>
                <p className="text-slate-500 mt-2">Create an employee with the role THERAPIST or MASSEUSE first.</p>
            </div>
        );
    }

    // Fetch service records for this employee today
    const appointments = await prisma.serviceRecord.findMany({
        where: {
            branchId: session.user.branchId,
            employeeId: employee.id,
            createdAt: {
                gte: startOfDay(today),
                lte: endOfDay(today)
            }
        },
        include: {
            client: true,
            service: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Schedule & Attendance</h1>
                    <p className="mt-2 text-slate-600 max-w-2xl">
                        Viewing schedule for {employee.fullName} ({employee.category.name})
                    </p>
                </div>
            </div>

            {/* Attendance Tracking Banner */}
            <div className="flex flex-wrap items-center justify-between gap-6 p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="flex size-14 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        <span className="material-symbols-outlined text-3xl">timer</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Shift Management</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="size-2 rounded-full bg-amber-500"></span>
                            <p className="text-slate-500 text-sm font-medium">Status: Ready for shift</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:block text-right mr-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled Today</p>
                        <p className="text-sm font-bold">09:00 - 17:00 (8h)</p>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-8 py-3 bg-[var(--color-primary)] hover:brightness-110 text-[var(--color-bg-dark)] rounded-lg font-bold transition-all shadow-lg shadow-[var(--color-primary)]/20">
                        <span className="material-symbols-outlined">login</span>
                        Clock In
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Sidebar: Quick Links */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="p-5 rounded-xl border border-slate-200 bg-white">
                        <h3 className="text-sm font-bold mb-4">Quick Links</h3>
                        <div className="flex flex-col gap-2">
                            <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm transition-colors text-slate-700 w-full text-left">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">history</span>
                                <span>Attendance History</span>
                            </button>
                            <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm transition-colors text-slate-700 w-full text-left">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">event_busy</span>
                                <span>Request Time Off</span>
                            </button>
                            <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm transition-colors text-slate-700 w-full text-left">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">swap_horiz</span>
                                <span>Shift Swap</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Schedule View */}
                <div className="lg:col-span-9 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold">Today's Schedule</h2>
                            <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold rounded-full">{format(today, 'MMM dd')}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="group">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 text-center">
                                    <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-tighter">{format(today, 'EEE')}</p>
                                    <p className="text-xl font-extrabold text-[var(--color-primary)]">{format(today, 'dd')}</p>
                                </div>
                                <div className="h-px flex-1 bg-[var(--color-primary)]/30"></div>
                                <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full">Today</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-16">
                                {appointments.map((apt, index) => {
                                    // Assign mock times for display purposes based on creation time or just staggered
                                    const mockStartHour = 9 + (index * 2);
                                    const mockEndHour = mockStartHour + 1;
                                    const timeStr = `${mockStartHour.toString().padStart(2, '0')}:00 - ${mockEndHour.toString().padStart(2, '0')}:00`;

                                    const isCompleted = apt.status === 'COMPLETED';
                                    const inProgress = apt.status === 'IN_PROGRESS';

                                    let borderColor = 'border-l-[var(--color-primary)]';
                                    if (isCompleted) borderColor = 'border-l-green-500';
                                    if (inProgress) borderColor = 'border-l-amber-500';

                                    return (
                                        <div key={apt.id} className={`p-4 rounded-xl border-l-4 ${borderColor} bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <p className={`text-xs font-bold ${isCompleted ? 'text-green-600' : inProgress ? 'text-amber-600' : 'text-[var(--color-primary)]'}`}>
                                                    {timeStr}
                                                </p>
                                                <span className="text-[10px] font-bold uppercase text-slate-400">{apt.status}</span>
                                            </div>
                                            <p className="text-base font-bold leading-tight mb-1">{apt.service.name}</p>
                                            <div className="flex flex-col gap-1 mt-2">
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <span className="material-symbols-outlined text-sm">person</span>
                                                    <span>{apt.client.fullName}</span>
                                                </div>
                                                {apt.boxNumber && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                                        <span className="material-symbols-outlined text-sm">meeting_room</span>
                                                        <span>Locker #{apt.boxNumber}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {appointments.length === 0 && (
                                    <div className="col-span-full p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <p className="text-slate-500 font-medium">No services scheduled for today.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
