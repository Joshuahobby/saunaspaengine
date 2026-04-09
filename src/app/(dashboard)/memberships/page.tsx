import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MembershipsClientPage from "./client-page";

export default async function MembershipsHubPage(props: { searchParams: Promise<{ branchId?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await auth();
    if (!session?.user) redirect("/login");
    if (!session.user.branchId && session.user.role !== 'OWNER') redirect("/login");

    let branches: { id: string, name: string }[] = [];
    if (session.user.role === 'OWNER' && session.user.businessId) {
        branches = await prisma.branch.findMany({
            where: { businessId: session.user.businessId, status: 'ACTIVE' },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });
    }

    const branchIds = searchParams.branchId 
        ? [searchParams.branchId]
        : (session.user.role === 'OWNER'
            ? (await prisma.branch.findMany({ where: { businessId: session.user.businessId as string }, select: { id: true } })).map(b => b.id)
            : [session.user.branchId as string]);

    const categories = await prisma.membershipCategory.findMany({
        where: { branchId: { in: branchIds }, status: "ACTIVE" },
        include: {
            _count: {
                select: { memberships: true }
            }
        },
        orderBy: { createdAt: 'asc' }
    });

    return <MembershipsClientPage categories={categories as any} branches={branches} userRole={session.user.role} />;
}
