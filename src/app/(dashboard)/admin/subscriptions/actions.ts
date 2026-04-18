"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPlatformPackageAction(data: {
    name: string;
    priceMonthly: number;
    priceYearly: number;
    isCustom?: boolean;
    description?: string;
    branchLimit?: number;
    features?: string[];
}) {
    try {
        await prisma.platformPackage.create({
            data: {
                ...data,
                features: data.features || [],
            }
        });
        revalidatePath("/subscriptions/platform");
        return { success: true };
    } catch (error) {
        console.error("Failed to create platform package:", error);
        return { success: false, error: "Failed to create platform package." };
    }
}

export async function updatePlatformPackageAction(id: string, data: {
    name?: string;
    priceMonthly?: number;
    priceYearly?: number;
    isCustom?: boolean;
    description?: string;
    branchLimit?: number;
    features?: string[];
}) {
    try {
        await prisma.platformPackage.update({
            where: { id },
            data: {
                ...data,
                features: data.features || undefined,
            }
        });
        revalidatePath("/subscriptions/platform");
        return { success: true };
    } catch (error) {
        console.error("Failed to update platform package:", error);
        return { success: false, error: "Failed to update platform package." };
    }
}

export async function deletePlatformPackageAction(id: string) {
    try {
        // Check if any business is using this package
        const count = await prisma.business.count({
            where: { subscriptionPlanId: id }
        });

        if (count > 0) {
            return { success: false, error: "Cannot delete package while it is assigned to branches." };
        }

        await prisma.platformPackage.delete({
            where: { id }
        });
        revalidatePath("/subscriptions/platform");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete platform package:", error);
        return { success: false, error: "Failed to delete platform package." };
    }
}
