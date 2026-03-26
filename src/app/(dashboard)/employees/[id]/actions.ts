"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateEmployeeAction(id: string, formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    const role = session.user.role;
    if (role !== "OWNER" && role !== "ADMIN" && role !== "MANAGER") {
        return { error: "Unauthorized: Insufficient permissions to modify staff records." };
    }

    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const categoryId = formData.get("categoryId") as string;
    const branchId = formData.get("branchId") as string;
    const status = formData.get("status") as string;
    const commissionRateRaw = formData.get("commissionRate") as string;
    const commissionRate = commissionRateRaw ? parseFloat(commissionRateRaw) : undefined;

    if (!fullName || !categoryId || !branchId) {
        return { error: "Required fields missing." };
    }

    // Security Check: If not OWNER/ADMIN, ensure they only modify for their own branch
    if (role === "MANAGER" && branchId !== session.user.branchId) {
        return { error: "Security Violation: Managers can only manage staff within their assigned branch." };
    }

    // Validate commission rate if provided
    if (commissionRate !== undefined && (isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100)) {
        return { error: "Commission rate must be between 0 and 100." };
    }

    try {
        await prisma.employee.update({
            where: { id },
            data: {
                fullName: fullName.trim(),
                phone: phone ? phone.trim() : null,
                categoryId,
                branchId,
                status: status as "ACTIVE" | "INACTIVE" | "ARCHIVED",
                ...(commissionRate !== undefined && { commissionRate }),
            }
        });

        revalidatePath("/employees");
        revalidatePath(`/employees/${id}`);
        return { success: true };
    } catch (err) {
        console.error("[UPDATE_EMPLOYEE_ERROR]", err);
        return { error: "Failed to update staff record." };
    }
}

export async function deleteEmployeeAction(id: string) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
        return { error: "Critical Violation: Only Business Owners or Platform Admins can remove staff records." };
    }

    try {
        await prisma.employee.delete({
            where: { id }
        });

        revalidatePath("/employees");
        return { success: true };
    } catch (err) {
        console.error("[DELETE_EMPLOYEE_ERROR]", err);
        return { error: "Failed to delete staff record. They may have active service history." };
    }
}
