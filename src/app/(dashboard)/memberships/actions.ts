"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { MembershipType, EntityStatus } from "@prisma/client";

export async function createMembershipCategoryAction(data: {
    name: string;
    type: MembershipType;
    description?: string;
    price: number;
    durationDays?: number;
    usageLimit?: number;
}) {
    const session = await auth();
    if (!session?.user?.branchId) throw new Error("Unauthorized");

    try {
        await prisma.membershipCategory.create({
            data: {
                ...data,
                branchId: session.user.branchId,
                status: "ACTIVE"
            }
        });
        revalidatePath("/memberships");
        return { success: true };
    } catch (error) {
        console.error("Failed to create membership category:", error);
        return { success: false, error: "Failed to create category." };
    }
}

export async function updateMembershipCategoryAction(id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    durationDays?: number;
    usageLimit?: number;
    status?: EntityStatus;
}) {
    const session = await auth();
    if (!session?.user?.branchId) throw new Error("Unauthorized");

    try {
        await prisma.membershipCategory.update({
            where: { id, branchId: session.user.branchId },
            data
        });
        revalidatePath("/memberships");
        revalidatePath(`/memberships/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update membership category:", error);
        return { success: false, error: "Failed to update category." };
    }
}

export async function deleteMembershipCategoryAction(id: string) {
    const session = await auth();
    if (!session?.user?.branchId) throw new Error("Unauthorized");

    try {
        // We might want to check if there are active memberships before deleting, 
        // or just set to INACTIVE.
        await prisma.membershipCategory.update({
            where: { id, branchId: session.user.branchId },
            data: { status: "INACTIVE" }
        });
        revalidatePath("/memberships");
        return { success: true };
    } catch (error) {
        console.error("Failed to archive membership category:", error);
        return { success: false, error: "Failed to archive category." };
    }
}
