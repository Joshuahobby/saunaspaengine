import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import EditEmployeeForm from "@/components/employees/edit-form";

export default async function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user) redirect("/login");
    const role = session.user.role;
    
    // Authorization check
    if (role !== "ADMIN" && role !== "OWNER" && role !== "MANAGER") {
        redirect("/dashboard");
    }

    const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
            branch: true,
            category: true,
            user: {
                select: { email: true, username: true }
            },
        }
    });

    if (!employee) notFound();

    // Secondary security: Managers can only see staff in their branch
    if (role === "MANAGER" && employee.branchId !== session.user.branchId) {
        redirect("/employees");
    }

    const categories = await prisma.employeeCategory.findMany({
        orderBy: { name: 'asc' }
    });

    // Owners and Admins can see all branches to move staff
    const branches = (role === "OWNER" || role === "ADMIN")
        ? await prisma.branch.findMany({
            where: { businessId: session.user.businessId as string },
            orderBy: { name: 'asc' }
        })
        : [];

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 pb-20">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest opacity-60">
                    <Link href="/employees" className="hover:text-[var(--color-primary)] transition-all">Directory</Link>
                    <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                    <span>Staff Profile</span>
                </div>
                <h1 className="text-4xl font-display font-bold text-[var(--text-main)] tracking-tight">
                    Manage <span className="text-[var(--color-primary)]">Staff Member</span>
                </h1>
                <p className="text-sm text-[var(--text-muted)] font-medium">Update professional credentials or record maintenance for staff portfolio.</p>
            </div>

            <EditEmployeeForm 
                employee={{
                    ...employee,
                    phone: employee.phone || null,
                    commissionRate: employee.commissionRate,
                    user: employee.user || null,
                }} 
                categories={categories}
                branches={branches}
                isOwner={role === "OWNER" || role === "ADMIN"}
            />
        </div>
    );
}
