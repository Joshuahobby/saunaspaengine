import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { StatusToggle } from "@/components/employees/status-toggle";
import Link from "next/link";

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
                    <h2 className="text-3xl font-display font-bold tracking-tight text-[var(--text-main)]">Employee Directory</h2>
                    <p className="mt-2 text-[var(--text-muted)] max-w-2xl font-medium">
                        View and manage your professional staff members, their roles, and operational status.
                    </p>
                </div>
                <Link href="/employees/new" className="bg-[var(--color-primary)] text-[var(--color-bg-dark)] px-5 py-3 rounded-lg text-sm font-bold flex items-center gap-2 hover:brightness-110 shadow-lg shadow-[var(--color-primary)]/20 transition-all">
                    <span className="material-symbols-outlined text-lg">person_add</span>
                    Add Employee
                </Link>
            </div>

            {/* Statistics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-5">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest mb-1">Total Staff</p>
                    <p className="text-3xl font-display font-bold text-[var(--text-main)]">{employees.length}</p>
                </div>
                <div className="glass-card p-5">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest mb-1">Active</p>
                    <p className="text-3xl font-display font-bold text-[var(--color-primary)]">{activeNow}</p>
                </div>
                <div className="glass-card p-5">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest mb-1">Therapists</p>
                    <p className="text-3xl font-display font-bold text-[var(--text-main)]">{therapists}</p>
                </div>
                <div className="glass-card p-5">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest mb-1">Inactive</p>
                    <p className="text-3xl font-display font-bold text-[var(--text-muted)] opacity-40">{onLeave}</p>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] overflow-hidden shadow-sm">
                <div className="p-4 border-b border-[var(--border-muted)] flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-6 self-start md:self-center">
                        <button className="flex items-center gap-2 border-b-2 border-[var(--color-primary)] text-[var(--text-main)] pb-2 font-bold text-sm">
                            All Staff
                            <span className="bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-[10px] px-2 py-0.5 rounded-full not-italic">{employees.length}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg opacity-50">search</span>
                            <input
                                type="text"
                                placeholder="Search by name or phone..."
                                className="w-full pl-10 pr-4 py-2 bg-[var(--bg-surface-muted)] border-[var(--border-muted)] rounded-xl text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] placeholder:opacity-40"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-surface-muted)]">
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest">Employee Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest text-center">Services Handled</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {employees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-[var(--bg-surface-muted)]/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-[var(--bg-surface-muted)] flex items-center justify-center font-bold text-[var(--text-muted)] border border-[var(--border-muted)]">
                                                {employee.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-display font-bold text-[var(--text-main)]">{employee.fullName}</p>
                                                <p className="text-[10px] text-[var(--text-muted)] opacity-60 font-medium uppercase tracking-tighter">Joined {format(new Date(employee.createdAt), 'MMM yyyy')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                            {employee.category.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-sans font-bold text-[var(--text-main)]">{employee._count.serviceRecords}</span>
                                            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase opacity-40">Lifetime</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusToggle employeeId={employee.id} initialStatus={employee.status} />
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Link href={`/employees/${employee.id}`} className="text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-all p-2 hover:bg-[var(--bg-surface-muted)] rounded-xl inline-flex">
                                            <span className="material-symbols-outlined">edit</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-muted)] font-bold opacity-60">
                                        No employees found in the directory.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {employees.length > 0 && (
                    <div className="p-4 bg-[var(--bg-surface-muted)] flex items-center justify-between border-t border-[var(--border-muted)]">
                        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest opacity-40">Showing all {employees.length} employees</p>
                    </div>
                )}
            </div>
        </div>
    );
}
