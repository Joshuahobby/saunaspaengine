"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateBusinessAction(id: string, data: any) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.business.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
            },
        });
        revalidatePath("/admin/branches");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update business", error);
        return { success: false, error: error.message };
    }
}

export async function deleteBusinessAction(id: string) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.business.delete({
            where: { id },
        });
        revalidatePath("/admin/branches");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete business", error);
        return { success: false, error: error.message };
    }
}
