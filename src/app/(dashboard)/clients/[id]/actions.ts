"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateClientNotes(clientId: string, notes: string) {
    try {
        await prisma.client.update({
            where: { id: clientId },
            data: { notes }
        });
        revalidatePath(`/clients/${clientId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update notes:", error);
        return { success: false, error: "Failed to save governance notes" };
    }
}
