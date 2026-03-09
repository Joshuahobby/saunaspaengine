import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { StatusToggle } from "@/components/employees/status-toggle";

export default async function EmployeesPage() {
    const session = await auth();
    if (!session?.user?.businessId) redirect("/login");

    const employees = await prisma.employee.findMany({
        where: { businessId: session.user.businessId },
        include: {
            category: true,
            _count: {
                select: { serviceRecords: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const activeNow = employees.filter(e => e.status === 'ACTIVE').length;
    const onLeave = employees.filter(e => e.status === 'INACTIVE').length;
    const therapists = employees.filter(e => e.category.name.toLowerCase() === 'therapist' || e.category.name.toLowerCase() === 'masseuse').length;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Employee Directory</h1>
                    <p className="mt-2 text-slate-600 max-w-2xl">
                        View and manage your professional staff members, their roles, and operational status.
                    </p>
                </div>
                <button className="bg-[var(--color-primary)] text-[var(--color-bg-dark)] px-5 py-3 rounded-lg text-sm font-bold flex items-center gap-2 hover:brightness-110 shadow-lg shadow-[var(--color-primary)]/20 transition-all">
                    <span className="material-symbols-outlined text-lg">person_add</span>
                    Add Employee
                </button>
            </div>

            {/* Statistics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Staff</p>
                    <p className="text-3xl font-black text-slate-900">{employees.length}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active</p>
                    <p className="text-3xl font-black text-[var(--color-primary)]">{activeNow}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Therapists</p>
                    <p className="text-3xl font-black text-slate-900">{therapists}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Inactive</p>
                    <p className="text-3xl font-black text-slate-400">{onLeave}</p>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-6 self-start md:self-center">
                        <button className="flex items-center gap-2 border-b-2 border-[var(--color-primary)] text-slate-900 pb-2 font-bold text-sm">
                            All Staff
                            <span className="bg-[var(--color-primary)]/20 text-[var(--color-bg-dark)] text-[10px] px-2 py-0.5 rounded-full">{employees.length}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            <input
                                type="text"
                                placeholder="Search by name or phone..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Services Handled</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {employees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 border border-slate-300">
                                                {employee.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{employee.fullName}</p>
                                                <p className="text-xs text-slate-400">Joined {format(new Date(employee.createdAt), 'MMM yyyy')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                            {employee.category.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-black text-slate-900">{employee._count.serviceRecords}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Lifetime</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusToggle employeeId={employee.id} initialStatus={employee.status} />
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button className="text-slate-400 hover:text-[var(--color-primary)] transition-colors p-2 hover:bg-slate-100 rounded-lg">
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 italic font-medium">
                                        No employees found in the directory.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {employees.length > 0 && (
                    <div className="p-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">Showing all {employees.length} employees</p>
                    </div>
                )}
            </div>
        </div>
    );
}
