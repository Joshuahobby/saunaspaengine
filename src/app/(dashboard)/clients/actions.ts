"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { EntityStatus } from "@prisma/client";

/**
 * Archive or Restore a client record.
 */
export async function updateClientStatus(id: string, status: EntityStatus) {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    try {
        await prisma.client.update({
            where: { id },
            data: { status }
        });
        revalidatePath("/clients");
        revalidatePath(`/clients/${id}`);
        return { success: true };
    } catch (error: any) {
        return { error: "Failed to update client status: " + error.message };
    }
}

/**
 * Permanently delete a client record.
 * WARNING: This will cascade to all related records.
 */
export async function deleteClient(id: string) {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };
    
    // Only ADMIN or OWNER can delete
    const role = session.user.role as string;
    if (role !== "ADMIN" && role !== "OWNER") {
        return { error: "Insufficient permissions to delete records." };
    }

    try {
        await prisma.client.delete({
            where: { id }
        });
        revalidatePath("/clients");
        return { success: true };
    } catch (error: any) {
        return { error: "Failed to delete client: " + error.message };
    }
}

/**
 * Update client profile details.
 */
export async function updateClientAction(id: string, formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const clientType = formData.get("clientType") as "WALK_IN" | "MEMBER";

    if (!fullName || !phone) {
        return { error: "Full name and phone number are required" };
    }

    try {
        await prisma.client.update({
            where: { id },
            data: {
                fullName,
                phone: phone.trim(),
                clientType
            }
        });

        revalidatePath("/clients");
        revalidatePath(`/clients/${id}`);
        return { success: true };
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('phone')) {
            return { error: "A client with this phone number already exists." };
        }
        return { error: "Failed to update client: " + error.message };
    }
}
