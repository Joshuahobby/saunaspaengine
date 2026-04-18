"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { EntityStatus } from "@prisma/client";

export async function createBusinessAction(data: { name: string, taxId?: string, headquarters?: string }) {
    try {
        await prisma.business.create({
            data: {
                name: data.name,
                taxId: data.taxId || null,
                headquarters: data.headquarters || null,
            }
        });
        revalidatePath("/branches");
        return { success: true };
    } catch (error) {
        console.error("Failed to create business entity:", error);
        return { success: false, error: "Failed to create business entity." };
    }
}

export async function updateBusinessAction(id: string, data: {
    name?: string;
    taxId?: string;
    headquarters?: string;
    status?: EntityStatus;
    subscriptionPlanId?: string;
    subscriptionCycle?: string;
    subscriptionStatus?: string;
}) {
    try {
        await prisma.business.update({
            where: { id },
            data
        });
        revalidatePath("/businesses");
        revalidatePath(`/businesses/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update business entity:", error);
        return { success: false, error: "Failed to update business entity." };
    }
}


export async function deleteBusinessAction(id: string) {
    try {
        await prisma.business.delete({
            where: { id }
        });
        revalidatePath("/branches");
        revalidatePath(`/branches/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to delete business entity:", error);
        return { success: false, error: "Failed to delete business entity. Check for operational constraints." };
    }
}

export async function updateBusinessApprovalAction(id: string, data: {
    approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
    kycNotes?: string;
}) {
    try {
        await prisma.business.update({
            where: { id },
            data: {
                approvalStatus: data.approvalStatus,
                kycNotes: data.kycNotes || undefined,
                kycVerifiedAt: data.approvalStatus === "APPROVED" ? new Date() : undefined,
                // Automatically set status to ACTIVE if approved
                status: data.approvalStatus === "APPROVED" ? "ACTIVE" : "INACTIVE"
            }
        });
        revalidatePath("/businesses");
        revalidatePath("/analytics");
        return { success: true };
    } catch (error) {
        console.error("Failed to update business approval status:", error);
        return { success: false, error: "Failed to update compliance status." };
    }
}
