import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MembershipsClientPage from "./client-page";

export default async function MembershipsHubPage() {
    const session = await auth();
    if (!session?.user?.businessId) redirect("/login");

    const categories = await prisma.membershipCategory.findMany({
        where: { businessId: session.user.businessId, status: "ACTIVE" },
        include: {
            _count: {
                select: { memberships: true }
            }
        },
        orderBy: { createdAt: 'asc' }
    });

    return <MembershipsClientPage categories={categories as any} />;
}
