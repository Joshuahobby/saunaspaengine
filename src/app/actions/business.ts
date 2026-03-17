"use server";

import { auth } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBusinessProfileAction(formData: FormData) {
    const session = await auth();
    if (!session?.user || session.user.role !== "OWNER") {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;
    if (!userId) throw new Error("User ID missing");

    // Fetch user's businessId
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { usr_businessId: true }
    });

    const businessId = user?.usr_businessId;
    if (!businessId) throw new Error("Business not found");

    const name = formData.get("name") as string;
    const taxId = formData.get("taxId") as string;
    const headquarters = formData.get("headquarters") as string;

    await db.business.update({
        where: { id: businessId },
        data: {
            name,
            taxId,
            headquarters
        }
    });

    // Audit Log
    await db.auditLog.create({
        data: {
            userId,
            action: "UPDATE",
            entity: "Business",
            entityId: businessId,
            details: `Updated business profile: ${name}`,
        }
    });

    revalidatePath("/governance");
    return { success: true };
}
