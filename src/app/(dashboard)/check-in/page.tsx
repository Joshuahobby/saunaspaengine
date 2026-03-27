import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CheckInContainer } from "@/components/operations/CheckInContainer";
import { UserRole } from "@prisma/client";

export default async function CheckInPage() {
    const session = await auth();
    const allowedRoles: UserRole[] = ["ADMIN", "OWNER", "MANAGER", "RECEPTIONIST"];
    
    if (!session?.user || !allowedRoles.includes(session.user.role as UserRole)) {
        redirect("/dashboard");
    }

    const branchId = session.user.branchId;

    if (!branchId) {
        // For ADMIN or OWNER, they might not have a branchId selected.
        // We could redirect them to a branch selection page or show a message.
        return (
            <div className="p-8 text-center glass-card border-none">
                <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">No Branch Selected</h2>
                <p className="text-[var(--text-muted)] mb-6">As a system-level user, please select a branch from the management dashboard to perform check-ins.</p>
                <a href="/dashboard" className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:opacity-90 transition-all inline-block">Go to Dashboard</a>
            </div>
        );
    }

    const [services, employees, activeClients, siteStats, dailyStats] = await Promise.all([
        prisma.service.findMany({
            where: { branchId: session.user.branchId },
            orderBy: { category: "asc" },
        }),
        prisma.employee.findMany({
            where: { branchId: session.user.branchId, status: "ACTIVE" },
            orderBy: { fullName: "asc" },
        }),
        prisma.client.findMany({
            where: { branchId: session.user.branchId, status: "ACTIVE" },
            orderBy: { fullName: "asc" },
        }),
        prisma.serviceRecord.count({
            where: { branchId: session.user.branchId, status: { in: ["CREATED", "IN_PROGRESS"] } },
        }),
        prisma.serviceRecord.count({
            where: {
                branchId: session.user.branchId,
                createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            },
        }),
    ]);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="max-w-2xl">
                <h1 className="text-3xl font-display font-black tracking-tight text-[var(--text-main)]">
                    Front-Desk <span className="text-[var(--color-primary)]">Reception</span>
                </h1>
                <p className="text-[var(--text-muted)] mt-2 font-medium text-base leading-relaxed">
                    Verify guest membership via QR code or manage new entries manually.
                </p>
            </div>

            <CheckInContainer 
                services={services}
                employees={employees}
                clients={activeClients}
                stats={[siteStats, dailyStats]}
            />
        </div>
    );
}
