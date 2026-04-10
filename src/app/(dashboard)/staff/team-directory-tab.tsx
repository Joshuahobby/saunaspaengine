import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { format } from "date-fns";
import { StatusToggle } from "@/components/employees/status-toggle";
import { BranchFilter } from "@/components/employees/branch-filter";
import Link from "next/link";
import { getActiveBranchContext } from "@/lib/branch-context";

export default async function TeamDirectoryTab({ 
    searchParams 
}: { 
    searchParams: Promise<{ branchId?: string; q?: string; status?: string }> 
}) {
    const resolvedSearchParams = await searchParams;
    const session = await auth();
    if (!session?.user) return null;

    const { authorizedBranchIds, activeBranchId } = await getActiveBranchContext(session, resolvedSearchParams);

    const businessBranches = session.user.role === 'OWNER'
        ? await prisma.branch.findMany({ 
            where: { businessId: session.user.businessId as string, status: 'ACTIVE' }, 
            select: { id: true, name: true } 
          })
        : [];

    const searchTerm = resolvedSearchParams.q?.toLowerCase();
    const viewStatus = resolvedSearchParams.status || 'ACTIVE';

    const employees = await prisma.employee.findMany({
        where: { 
            branchId: { in: authorizedBranchIds },
            status: viewStatus as any,
            ...(searchTerm ? {
                OR: [
                    { fullName: { contains: searchTerm, mode: 'insensitive' } },
                    { phone: { contains: searchTerm, mode: 'insensitive' } },
                ]
            } : {})
        },
        include: {
            category: true,
            branch: { select: { name: true } },
            _count: { select: { serviceRecords: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    const isOwnerOrAdmin = session.user.role === 'OWNER' || session.user.role === 'ADMIN';

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Action Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                <div className="flex items-center p-2 bg-[var(--bg-surface-muted)]/50 backdrop-blur-md rounded-2xl border border-[var(--border-muted)] gap-1 self-start">
                    {["ACTIVE", "INACTIVE", "ARCHIVED"].map((status) => (
                        <Link
                            key={status}
                            href={`/staff?tab=directory&status=${status}`}
                            className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                viewStatus === status 
                                    ? "bg-[var(--text-main)] text-[var(--bg-app)] shadow-lg" 
                                    : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                            }`}
                        >
                            {status}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    {session.user.role === 'OWNER' && businessBranches.length > 0 && (
                        <BranchFilter 
                            branches={businessBranches.map(b => ({ id: b.id, name: b.name }))}
                            activeBranchId={activeBranchId ?? undefined}
                        />
                    )}
                    <div className="relative flex-1 lg:w-80">
                         <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg opacity-40">search</span>
                         <form action="/staff" method="GET">
                            <input type="hidden" name="tab" value="directory" />
                            {activeBranchId && <input type="hidden" name="branchId" value={activeBranchId} />}
                            <input
                                type="text"
                                name="q"
                                defaultValue={resolvedSearchParams.q || ""}
                                placeholder="Search Team..."
                                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-card)] border-[var(--border-muted)] border rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-main)]"
                            />
                         </form>
                    </div>
                </div>
            </div>

            {/* Directory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {employees.length === 0 ? (
                    <div className="col-span-full py-20 text-center glass-card rounded-[3rem] border border-[var(--border-muted)] border-dashed text-[var(--text-muted)] opacity-40">
                        No team members found in this category.
                    </div>
                 ) : (
                    employees.map((employee) => (
                        <div key={employee.id} className="glass-card p-10 rounded-[3rem] border border-[var(--border-muted)] hover:border-[var(--color-primary)]/40 transition-all group">
                             <div className="flex justify-between items-start mb-10">
                                <div className="size-16 rounded-3xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-2xl font-black text-[var(--text-main)] group-hover:scale-110 transition-transform">
                                    {employee.fullName.charAt(0)}
                                </div>
                                <StatusToggle employeeId={employee.id} initialStatus={employee.status} />
                             </div>
                             
                             <div className="space-y-2">
                                <h3 className="text-2xl font-serif font-black tracking-tight">{employee.fullName}</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">
                                    {employee.category.name}
                                </p>
                             </div>

                             <div className="mt-8 pt-8 border-t border-[var(--border-muted)] grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">Session Count</p>
                                    <p className="text-xl font-black">{employee._count.serviceRecords}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">Branch</p>
                                    <p className="text-xs font-black opacity-60 truncate">{employee.branch.name}</p>
                                </div>
                             </div>

                             <Link 
                                href={`/staff/${employee.id}/performance`}
                                className="w-full h-14 rounded-2xl border border-[var(--border-muted)] mt-10 flex items-center justify-center text-[9px] font-black uppercase tracking-[0.3em] hover:bg-[var(--text-main)] hover:text-[var(--bg-app)] transition-all"
                             >
                                View Profile
                             </Link>
                        </div>
                    ))
                 )}
            </div>
        </div>
    );
}
