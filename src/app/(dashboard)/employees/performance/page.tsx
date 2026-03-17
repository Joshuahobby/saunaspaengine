import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, subWeeks } from "date-fns";

export default async function EmployeePerformancePage() {
    const session = await auth();
    if (!session?.user?.branchId) redirect("/login");

    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
    const startOfLastWeek = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
    const endOfLastWeek = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });

    // Fetch the first employee to use as the context for this view
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

    // Fetch services for today
    const servicesTodayCount = await prisma.serviceRecord.count({
        where: {
            branchId: session.user.branchId,
            employeeId: employee.id,
            status: 'COMPLETED',
            createdAt: {
                gte: startOfDay(today),
                lte: endOfDay(today)
            }
        }
    });

    const servicesYesterdayCount = await prisma.serviceRecord.count({
        where: {
            branchId: session.user.branchId,
            employeeId: employee.id,
            status: 'COMPLETED',
            createdAt: {
                gte: startOfDay(new Date(today.getTime() - 86400000)),
                lte: endOfDay(new Date(today.getTime() - 86400000))
            }
        }
    });

    // Calculate percentage change for services
    let servicesChange = 0;
    if (servicesYesterdayCount > 0) {
        servicesChange = Math.round(((servicesTodayCount - servicesYesterdayCount) / servicesYesterdayCount) * 100);
    } else if (servicesTodayCount > 0) {
        servicesChange = 100;
    }

    // Fetch this week's earnings (sum of service amounts for COMPLETED services)
    const thisWeekRecords = await prisma.serviceRecord.findMany({
        where: {
            branchId: session.user.branchId,
            employeeId: employee.id,
            status: 'COMPLETED',
            createdAt: {
                gte: startOfCurrentWeek,
                lte: endOfCurrentWeek
            }
        }
    });
    const thisWeekEarnings = thisWeekRecords.reduce((sum, record) => sum + record.amount, 0);

    const lastWeekRecords = await prisma.serviceRecord.findMany({
        where: {
            branchId: session.user.branchId,
            employeeId: employee.id,
            status: 'COMPLETED',
            createdAt: {
                gte: startOfLastWeek,
                lte: endOfLastWeek
            }
        }
    });
    const lastWeekEarnings = lastWeekRecords.reduce((sum, record) => sum + record.amount, 0);

    // Calculate percentage change for earnings
    let earningsChange = 0;
    if (lastWeekEarnings > 0) {
        earningsChange = Math.round(((thisWeekEarnings - lastWeekEarnings) / lastWeekEarnings) * 100);
    } else if (thisWeekEarnings > 0) {
        earningsChange = 100;
    }

    // Mock Rating (Schema doesn't have rating yet)
    const avgRating = 4.9;
    const ratingChange = 0.2;

    // Fetch recent services for table
    const recentServices = await prisma.serviceRecord.findMany({
        where: {
            branchId: session.user.branchId,
            employeeId: employee.id,
            status: 'COMPLETED'
        },
        include: {
            service: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 10
    });

    return (
        <div className="max-w-[1200px] mx-auto space-y-8">
            {/* Hero Header */}
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight">Personal Performance</h1>
                    <p className="text-slate-500 text-base font-normal">Track your daily milestones and financial growth. ({employee.fullName})</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 rounded-lg px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200 hover:bg-slate-200 transition-colors">
                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                        <span>This Week</span>
                    </button>
                    <button className="flex items-center gap-2 rounded-lg px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold shadow-lg shadow-[var(--color-primary)]/20 hover:brightness-110 transition-colors">
                        <span className="material-symbols-outlined text-lg">download</span>
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-4 rounded-xl p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl">check_circle</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <span className="material-symbols-outlined">assignment_turned_in</span>
                        </div>
                        <p className="text-slate-600 text-sm font-medium">Services Today</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-slate-900 text-3xl font-bold">{servicesTodayCount}</p>
                        {servicesChange !== 0 && (
                            <p className={`text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${servicesChange > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                                <span className="material-symbols-outlined text-[14px]">
                                    {servicesChange > 0 ? 'trending_up' : 'trending_down'}
                                </span>
                                {servicesChange > 0 ? '+' : ''}{servicesChange}%
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4 rounded-xl p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl">payments</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                        </div>
                        <p className="text-slate-600 text-sm font-medium">Weekly Earnings</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-slate-900 text-3xl font-bold">${thisWeekEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        {earningsChange !== 0 && (
                            <p className={`text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${earningsChange > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                                <span className="material-symbols-outlined text-[14px]">
                                    {earningsChange > 0 ? 'trending_up' : 'trending_down'}
                                </span>
                                {earningsChange > 0 ? '+' : ''}{earningsChange}%
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4 rounded-xl p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl">grade</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                            <span className="material-symbols-outlined">star</span>
                        </div>
                        <p className="text-slate-600 text-sm font-medium">Avg. Rating</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-slate-900 text-3xl font-bold">{avgRating}</p>
                        <p className="text-emerald-600 text-xs font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>+{ratingChange}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="text-slate-900 text-lg font-bold">Recent Services & Commissions</h2>
                    <div className="flex gap-2">
                        <button className="text-[var(--color-primary)] text-sm font-bold hover:underline">View All History</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">Service Details</th>
                                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider text-center">Performance</th>
                                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider text-right">Earnings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentServices.length > 0 ? recentServices.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 font-medium">{format(record.createdAt, 'MMM dd, yyyy')}</span>
                                            <span className="text-slate-400 text-xs">{format(record.createdAt, 'hh:mm a')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                                                <span className="material-symbols-outlined text-lg">hot_tub</span>
                                            </div>
                                            <span className="text-slate-900 font-semibold text-sm">{record.service.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-500 text-sm">{record.service.duration} min</td>
                                    <td className="px-6 py-5 text-center">
                                        {/* Mock performance indicator */}
                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-100">
                                            Excellent
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right font-bold text-slate-900">
                                        ${record.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No recent services found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">Showing {recentServices.length} recent services</p>
                    <div className="flex gap-1">
                        <button className="size-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-50" disabled>
                            <span className="material-symbols-outlined text-base">chevron_left</span>
                        </button>
                        <button className="size-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-50" disabled>
                            <span className="material-symbols-outlined text-base">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Motivation Section */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-[var(--color-primary)]/20">
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold">You're $160.00 away from your weekly bonus!</h3>
                    <p className="text-white/80 text-sm">Maintain your 4.9 average rating to qualify for the 'Therapist of the Month' reward.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col items-center min-w-[140px] border border-white/20">
                    <span className="text-3xl font-black">92%</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/70">Bonus Progress</span>
                </div>
            </div>
        </div>
    );
}
