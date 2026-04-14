import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CheckInContainer } from "@/components/operations/CheckInContainer";
import { UserRole } from "@prisma/client";
import { resolveEffectiveBranchId } from "@/lib/branch-context";

export default async function CheckInPage() {
    const session = await auth();
    const allowedRoles: UserRole[] = ["ADMIN", "OWNER", "MANAGER", "RECEPTIONIST"];

    if (!session?.user || !allowedRoles.includes(session.user.role as UserRole)) {
        redirect("/dashboard");
    }

    const branchId = await resolveEffectiveBranchId(session);
    if (!branchId) redirect("/dashboard");

    const [services, employees, activeClients, siteStats, dailyStats] = await Promise.all([
        prisma.service.findMany({
            where: { branchId },
            orderBy: { category: "asc" },
        }),
        prisma.employee.findMany({
            where: { branchId, status: "ACTIVE" },
            orderBy: { fullName: "asc" },
        }),
        prisma.client.findMany({
            where: { branchId, status: "ACTIVE" },
            orderBy: { fullName: "asc" },
        }),
        prisma.serviceRecord.count({
            where: { branchId, status: { in: ["CREATED", "IN_PROGRESS"] } },
        }),
        prisma.serviceRecord.count({
            where: {
                branchId,
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
                    Verify client membership via QR code or manage check-ins manually.
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
