"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Updates operational settings for a specific branch (Tax, Timezone, Hours, etc.)
 */
export async function updateBranchSettingsAction(branchId: string, data: {
    taxId?: string | null;
    taxLabel?: string | null;
    primaryColor?: string | null;
    currency?: string | null;
    timezone?: string | null;
    businessHours?: any;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    logo?: string | null;
}) {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    try {
        const updated = await prisma.branch.update({
            where: { id: branchId },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });

        // Audit Logging
        await prisma.auditLog.create({
            data: {
                userId: session.user.id!,
                action: "UPDATE_BRANCH_SETTINGS",
                entity: "Branch",
                entityId: branchId,
                details: `Updated operational settings: ${Object.keys(data).join(", ")}`,
            }
        });

        revalidatePath("/settings");
        revalidatePath("/(dashboard)/settings", "layout");
        
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Failed to update branch settings:", error);
        return { error: error.message };
    }
}

/**
 * Updates global corporate branding for the entire Business.
 */
export async function updateBusinessBrandingAction(businessId: string, data: {
    name?: string;
    logo?: string | null;
    primaryColor?: string | null;
    currency?: string;
    timezone?: string;
    taxId?: string | null;
    taxLabel?: string | null;
}) {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    try {
        const updated = await prisma.business.update({
            where: { id: businessId },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });

        // Audit Logging
        await prisma.auditLog.create({
            data: {
                userId: session.user.id!,
                action: "UPDATE_BUSINESS_BRANDING",
                entity: "Business",
                entityId: businessId,
                details: `Updated global branding: ${Object.keys(data).join(", ")}`,
            }
        });

        revalidatePath("/settings");
        revalidatePath("/(dashboard)/settings", "layout");

        return { success: true, data: updated };
    } catch (error: any) {
        console.error("Failed to update business branding:", error);
        return { error: error.message };
    }
}

/**
 * Specifically updates the "Business Hours" JSON object for a branch.
 */
export async function updateBranchHoursAction(branchId: string, businessHours: any) {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    try {
        await prisma.branch.update({
            where: { id: branchId },
            data: { businessHours },
        });

        await prisma.auditLog.create({
            data: {
                userId: session.user.id!,
                action: "UPDATE_BRANCH_HOURS",
                entity: "Branch",
                entityId: branchId,
                details: "Modified operational hours schedule.",
            }
        });

        revalidatePath("/settings");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
