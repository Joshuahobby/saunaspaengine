import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MembershipDetailsClientPage from "./client-page";
import { MembershipCategory, Membership, Client } from "@prisma/client";

type CategoryWithMemberships = MembershipCategory & {
    memberships: (Membership & {
        client: Client;
    })[];
};

export default async function MembershipCategoryEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.businessId) redirect("/login");

    const category = await prisma.membershipCategory.findUnique({
        where: { id, businessId: session.user.businessId },
        include: {
            memberships: {
                include: {
                    client: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    if (!category) {
        redirect("/memberships");
    }

    return <MembershipDetailsClientPage category={category as CategoryWithMemberships} />;
}
