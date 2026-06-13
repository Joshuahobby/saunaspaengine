import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { resolveEffectiveBranchId } from "@/lib/branch-context";
import ServicesClientPage from "../services/client-page";
import { getSubscriptionState } from "@/lib/subscription";

export default async function ServiceMenuTab({ isActive }: { isActive?: boolean }) {
    const session = await auth();
    if (!session?.user) return null;

    const subState = session.user.businessId ? await getSubscriptionState(session.user.businessId) : null;
    const effectiveBranchId = await resolveEffectiveBranchId(session);
    if (!effectiveBranchId) return null;

    const branchIds = session.user.role === 'OWNER'
        ? (await prisma.branch.findMany({ where: { businessId: session.user.businessId as string, status: 'ACTIVE' }, select: { id: true } })).map(b => b.id)
        : [effectiveBranchId];

    const services = await prisma.service.findMany({
        where: { branchId: { in: branchIds } },
        orderBy: { name: 'asc' }
    });

    const stats = {
        total: services.length,
        active: services.filter(s => s.status === 'ACTIVE').length,
        avgDuration: services.length > 0
            ? Math.round(services.reduce((acc, s) => acc + s.duration, 0) / services.length)
            : 0,
        mostPopular: "Calculated"
    };

    return <ServicesClientPage services={services} stats={stats} userRole={session.user.role || "EMPLOYEE"} subState={subState} />;
}
