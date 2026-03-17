import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import RegistrationForm from "@/components/employees/registration-form";

export default async function NewEmployeePage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const isOwner = session.user.role === "OWNER";
    const isAdmin = session.user.role === "ADMIN";
    const isManager = session.user.role === "MANAGER";

    if (!isOwner && !isAdmin && !isManager) {
        redirect("/employees");
    }

    // Fetch categories for the role select
    const categories = await prisma.employeeCategory.findMany({
        orderBy: { name: "asc" }
    });

    // Fetch branches if Owner, otherwise use session branch
    const branches = isOwner 
        ? await prisma.branch.findMany({
            where: { businessId: session.user.businessId as string },
            select: { id: true, name: true }
          })
        : [];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
                <nav className="flex gap-2 text-sm text-[var(--text-muted)] mb-4 items-center font-bold uppercase tracking-widest opacity-60">
                    <Link href="/employees" className="hover:text-[var(--color-primary)] transition-colors">Staff Directory</Link>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-[var(--text-main)]">New Registration</span>
                </nav>
                <h2 className="text-4xl font-display font-bold tracking-tight text-[var(--text-main)]">Register New Staff</h2>
                <p className="text-[var(--text-muted)] mt-2 font-medium">Add a new specialist to the professional staff network.</p>
            </div>

            <RegistrationForm 
                categories={categories.map(c => ({ id: c.id, name: c.name }))}
                branches={branches}
                defaultBranchId={session.user.branchId as string || ""}
                isOwner={isOwner}
            />
            
            <div className="bg-[var(--bg-surface-muted)] rounded-2xl p-6 border border-[var(--border-muted)]">
                <h4 className="font-bold flex items-center gap-2 mb-4 text-[var(--text-main)] text-sm uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">verified_user</span>
                    Policy & Security
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    By registering this staff member, they will be granted access to professional operational tools relative to their category. 
                    Ensure all identification details match their legal documents. Staff status can be suspended at any time from the directory.
                </p>
            </div>
        </div>
    );
}
