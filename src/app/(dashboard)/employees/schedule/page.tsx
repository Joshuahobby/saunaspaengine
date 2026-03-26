import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format, startOfDay, endOfDay, startOfWeek, addDays } from "date-fns";
import Link from "next/link";
import ScheduleClient from "./client-page";

export default async function EmployeeSchedulePage() {
    const session = await auth();
    if (!session?.user) redirect("/login");
    
    const isEmployee = session.user.role === "EMPLOYEE";
    const isManager = session.user.role === "MANAGER";
    
    if (!session.user.branchId) redirect("/dashboard");

    // For EMPLOYEE role: find their linked employee profile
    // For MANAGER role: show all employees in their branch with a selector
    let employee = null;
    let branchEmployees: { id: string; fullName: string; category: { name: string } }[] = [];

    if (isEmployee) {
        employee = await prisma.employee.findUnique({
            where: { userId: session.user.id },
            include: { category: true }
        });
    } else if (isManager) {
        branchEmployees = await prisma.employee.findMany({
            where: { branchId: session.user.branchId as string, status: "ACTIVE" },
            include: { category: true },
            orderBy: { fullName: "asc" }
        });
        // Default to first employee for initial view
        employee = branchEmployees[0] || null;
    }

    if (!employee) {
        return (
            <div className="max-w-7xl mx-auto py-20 text-center space-y-4">
                <div className="size-20 bg-[var(--bg-surface-muted)] rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-4xl text-[var(--text-muted)] opacity-30">person_off</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-[var(--text-main)]">
                    {isEmployee ? "Profile Not Linked" : "No Active Staff"}
                </h2>
                <p className="text-[var(--text-muted)] max-w-md mx-auto">
                    {isEmployee 
                        ? "Your account hasn't been linked to a staff profile yet. Contact your administrator to synchronize your account."
                        : "No active employees found in your branch. Register staff from the employee directory."
                    }
                </p>
                <Link href="/employees" className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] font-bold hover:underline mt-4">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Go to Employee Directory
                </Link>
            </div>
        );
    }

    const today = new Date();

    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = addDays(weekStart, 6); // Sunday

    const [appointments, shifts] = await Promise.all([
        prisma.serviceRecord.findMany({
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
        }),
        prisma.shift.findMany({
            where: {
                employeeId: employee.id,
                date: {
                    gte: startOfDay(weekStart),
                    lte: endOfDay(weekEnd)
                }
            },
            orderBy: [
                { date: 'asc' },
                { startTime: 'asc' }
            ]
        })
    ]);

    const completedToday = appointments.filter(a => a.status === "COMPLETED").length;
    const inProgressToday = appointments.filter(a => a.status === "IN_PROGRESS").length;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-[var(--text-main)]">Schedule & Attendance</h1>
                    <p className="mt-2 text-[var(--text-muted)] max-w-2xl font-medium">
                        Viewing schedule for <span className="text-[var(--color-primary)] font-bold">{employee.fullName}</span> ({employee.category.name})
                    </p>
                </div>
            </div>

            {/* Shift Status Banner */}
            <div className="flex flex-wrap items-center justify-between gap-6 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        <span className="material-symbols-outlined text-3xl">timer</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-[var(--text-main)]">Today&apos;s Overview</h2>
                        <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-green-500"></span>
                                <span className="text-xs text-[var(--text-muted)] font-medium">{completedToday} Completed</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-amber-500 animate-pulse"></span>
                                <span className="text-xs text-[var(--text-muted)] font-medium">{inProgressToday} In Progress</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:block text-right mr-4">
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">Date</p>
                        <p className="text-sm font-bold text-[var(--text-main)]">{format(today, 'EEEE, MMM d, yyyy')}</p>
                    </div>
                    <div className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-xl text-sm font-bold">
                        {appointments.length} Sessions
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Sidebar: Quick Stats */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    {/* Manager: Employee Selector */}
                    {isManager && branchEmployees.length > 1 && (
                        <div className="glass-card p-5">
                            <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3 opacity-60">View Staff Schedule</h3>
                            <div className="space-y-2">
                                {branchEmployees.map(emp => (
                                    <Link 
                                        key={emp.id} 
                                        href={`/employees/schedule?empId=${emp.id}`}
                                        className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-colors w-full ${
                                            emp.id === employee?.id 
                                                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold' 
                                                : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)]'
                                        }`}
                                    >
                                        <div className="size-7 rounded-full bg-[var(--bg-surface-muted)] flex items-center justify-center text-[10px] font-bold border border-[var(--border-muted)]">
                                            {emp.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">{emp.fullName}</p>
                                            <p className="text-[9px] opacity-60">{emp.category.name}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="glass-card p-5">
                        <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3 opacity-60">Quick Links</h3>
                        <div className="flex flex-col gap-2">
                            <Link href="/employees" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-surface-muted)] text-sm transition-colors text-[var(--text-muted)] w-full">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">groups</span>
                                <span>Staff Directory</span>
                            </Link>
                            <Link href="/employees/my-earnings" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-surface-muted)] text-sm transition-colors text-[var(--text-muted)] w-full">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">payments</span>
                                <span>My Earnings</span>
                            </Link>
                            <Link href="/employees/gamification" className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-surface-muted)] text-sm transition-colors text-[var(--text-muted)] w-full">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">emoji_events</span>
                                <span>Leaderboard</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column: Schedule View */}
                <div className="lg:col-span-9 flex flex-col gap-6">
                    <ScheduleClient 
                        employee={employee as any}
                        isManager={isManager} 
                        shifts={shifts as any} 
                        weekStart={weekStart} 
                    />
                </div>
            </div>
        </div>
    );
}
