import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MyEarningsClient from "./client-page";

export default async function MyEarningsPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    // Fetch the employee profile linked to this user
    const employee = await prisma.employee.findUnique({
        where: { userId: session.user.id },
        include: {
            branch: {
                select: { name: true }
            },
            category: {
                select: { name: true }
            }
        }
    }) as any;

    if (!employee) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="size-20 bg-[var(--bg-surface-muted)] rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl text-[var(--text-muted)] opacity-20 text-balance">person_off</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-[var(--text-main)] mb-2">Profile Not Linked</h2>
                <p className="text-[var(--text-muted)] max-w-md mx-auto">
                    Your user account has not been linked to a professional staff record yet. 
                    Please contact your Administrator or Business Owner to synchronize your account.
                </p>
            </div>
        );
    }

    // Fetch commission logs
    const earnings = await (prisma as any).commissionLog.findMany({
        where: { employeeId: employee.id },
        include: {
            serviceRecord: {
                include: {
                    service: { select: { name: true } }
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    return (
        <MyEarningsClient 
            employee={employee}
            initialEarnings={earnings}
        />
    );
}
