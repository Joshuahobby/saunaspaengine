import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import MembershipsClientPage from "../memberships/client-page";

export default async function PassesTab() {
    const session = await auth();
    if (!session?.user) return null;

    let branches: { id: string, name: string }[] = [];
    if (session.user.role === 'OWNER' && session.user.businessId) {
        branches = await prisma.branch.findMany({
            where: { businessId: session.user.businessId, status: 'ACTIVE' },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });
    }

    const branchIds = session.user.role === 'OWNER'
        ? (await prisma.branch.findMany({ where: { businessId: session.user.businessId as string }, select: { id: true } })).map(b => b.id)
        : [session.user.branchId as string];

    const categories = await prisma.membershipCategory.findMany({
        where: { branchId: { in: branchIds }, status: "ACTIVE" },
        include: {
            _count: {
                select: { memberships: true }
            }
        },
        orderBy: { createdAt: 'asc' }
    });

    return <MembershipsClientPage categories={categories as Parameters<typeof MembershipsClientPage>[0]["categories"]} branches={branches} userRole={session.user.role} />;
}
