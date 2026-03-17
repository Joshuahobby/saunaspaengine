"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { PermissionMatrix } from "@/lib/permissions";

export async function updateRolePermissionsAction(matrix: PermissionMatrix) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    
    // Only ADMIN or OWNER can manage roles
    if (session.user.role !== "ADMIN" && session.user.role !== "OWNER") {
        throw new Error("Insufficient authority to modify security matrix.");
    }

    const businessId = session.user.businessId;
    if (!businessId) throw new Error("No business context found.");

    await prisma.business.update({
        where: { id: businessId },
        data: {
            permissions: matrix as any
        }
    });

    revalidatePath("/settings/roles");
    return { success: true };
}
