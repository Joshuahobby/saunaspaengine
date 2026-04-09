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
    isGlobal?: boolean;
    branchId?: string;
}) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    let targetBranchId = data.branchId || session.user.branchId;
    
    if (!targetBranchId && session.user.role === 'OWNER' && session.user.businessId) {
        const firstBranch = await prisma.branch.findFirst({
            where: { businessId: session.user.businessId },
            orderBy: { createdAt: 'asc' }
        });
        if (firstBranch) targetBranchId = firstBranch.id;
    }

    if (!targetBranchId) throw new Error("Branch ID required");

    try {
        await prisma.membershipCategory.create({
            data: {
                ...data,
                branchId: targetBranchId,
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
    isGlobal?: boolean;
    branchId?: string;
}) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    // Owners can update any category in their business, managers only their branch
    const where: any = { id };
    if (session.user.role !== 'OWNER') {
        if (!session.user.branchId) throw new Error("Unauthorized");
        where.branchId = session.user.branchId;
    } else {
        where.branch = { businessId: session.user.businessId };
    }

    try {
        await prisma.membershipCategory.update({
            where,
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
    if (!session?.user) throw new Error("Unauthorized");

    const where: any = { id };
    if (session.user.role !== 'OWNER') {
        if (!session.user.branchId) throw new Error("Unauthorized");
        where.branchId = session.user.branchId;
    } else {
        where.branch = { businessId: session.user.businessId };
    }

    try {
        await prisma.membershipCategory.update({
            where,
            data: { status: "INACTIVE" }
        });
        revalidatePath("/memberships");
        return { success: true };
    } catch (error) {
        console.error("Failed to archive membership category:", error);
        return { success: false, error: "Failed to archive category." };
    }
}
