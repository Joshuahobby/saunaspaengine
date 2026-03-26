import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettlementsClient from "./client-page";

export const dynamic = "force-dynamic";

export default async function SettlementsPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    // Only OWNER can manage settlements
    if (session.user.role !== "OWNER") redirect("/dashboard");

    // Fetch all active employees in all branches owned by this business
    // Group their unpaid commissions
    const employees = await prisma.employee.findMany({
        where: {
            status: "ACTIVE",
            // Assuming BUSINESS scope for OWNER, or we just fetch by branchId if they only oversee one
            branchId: session.user.branchId as string
        },
        include: {
            category: true,
            commissionLogs: {
                where: { status: "UNPAID" }
            }
        },
        orderBy: { fullName: 'asc' }
    });

    const pendingSettlements = employees.map(emp => ({
        employeeId: emp.id,
        fullName: emp.fullName,
        category: emp.category.name,
        unpaidCount: emp.commissionLogs.length,
        unpaidTotal: emp.commissionLogs.reduce((sum, c) => sum + c.amount, 0),
        commissionIds: emp.commissionLogs.map(c => c.id)
    })).filter(emp => emp.unpaidCount > 0); // Only show employees with pending payouts

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-display font-black tracking-tight text-[var(--text-main)] italic">Commission <span className="text-[var(--color-primary)]">Settlements</span></h1>
                <p className="mt-2 text-[var(--text-muted)] max-w-2xl font-medium">
                    Review and generate payouts for therapist service commissions. Unpaid balances are highlighted below.
                </p>
            </div>

            <SettlementsClient pendingData={pendingSettlements} />
        </div>
    );
}
