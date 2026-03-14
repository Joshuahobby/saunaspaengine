"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { EntityStatus } from "@prisma/client";

export async function createCorporateAction(data: { name: string, taxId?: string, headquarters?: string }) {
    try {
        await prisma.corporate.create({
            data: {
                name: data.name,
                taxId: data.taxId || null,
                headquarters: data.headquarters || null,
            }
        });
        revalidatePath("/admin/businesses");
        return { success: true };
    } catch (error) {
        console.error("Failed to create corporate entity:", error);
        return { success: false, error: "Failed to create corporate entity." };
    }
}

export async function updateCorporateAction(id: string, data: {
    name?: string;
    taxId?: string;
    headquarters?: string;
    status?: EntityStatus;
    subscriptionPlanId?: string;
    subscriptionCycle?: string;
    subscriptionStatus?: string;
}) {
    try {
        await prisma.corporate.update({
            where: { id },
            data: {
                ...data,
                subscriptionStatus: data.subscriptionStatus || undefined,
            }
        });
        revalidatePath("/admin/businesses");
        revalidatePath(`/admin/businesses/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update corporate entity:", error);
        return { success: false, error: "Failed to update corporate entity." };
    }
}

export async function deleteCorporateAction(id: string) {
    try {
        await prisma.corporate.delete({
            where: { id }
        });
        revalidatePath("/admin/businesses");
        revalidatePath(`/admin/businesses/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to delete corporate entity:", error);
        return { success: false, error: "Failed to delete corporate entity. Check for operational constraints." };
    }
}
