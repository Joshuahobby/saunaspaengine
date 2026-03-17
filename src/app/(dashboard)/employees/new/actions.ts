"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function registerEmployeeAction(formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    const role = session.user.role;
    if (role !== "OWNER" && role !== "ADMIN" && role !== "MANAGER") {
        return { error: "Unauthorized: Insufficient permissions to register staff." };
    }

    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const categoryId = formData.get("categoryId") as string;
    const branchId = formData.get("branchId") as string;

    if (!fullName || !categoryId || !branchId) {
        return { error: "Full name, legal category, and branch assignment are required." };
    }

    // Security Check: If not OWNER/ADMIN, ensure they only register for their own branch
    if (role === "MANAGER" && branchId !== session.user.branchId) {
        return { error: "Security Violation: Managers can only register staff for their assigned branch." };
    }

    try {
        await prisma.employee.create({
            data: {
                fullName: fullName.trim(),
                phone: phone ? phone.trim() : null,
                categoryId,
                branchId,
                status: "ACTIVE",
            }
        });

        revalidatePath("/employees");
        return { success: true };
    } catch (err) {
        console.error("[REGISTER_EMPLOYEE_ERROR]", err);
        return { error: "Failed to register staff member. Please ensure the data is correct." };
    }
}
