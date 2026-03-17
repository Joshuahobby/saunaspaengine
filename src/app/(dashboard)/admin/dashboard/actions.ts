"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createBranchAction(formData: FormData) {
    try {
        const branchName = formData.get("branchName") as string;
        const managerName = formData.get("managerName") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!branchName || !managerName || !email || !password) {
            return { error: "All fields are required" };
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "An account with this email already exists" };
        }

        // Hash password
        const passwordHash = await hash(password, 10);

        // Create branch and manager within a transaction
        const result = await prisma.$transaction(async (tx) => {
            const branch = await tx.branch.create({
                data: {
                    name: branchName,
                    status: "ACTIVE",
                },
            });

            const user = await tx.user.create({
                data: {
                    username: formData.get("username") as string || (email.split('@')[0] + '-' + Date.now().toString().slice(-4)),
                    email,
                    fullName: managerName,
                    passwordHash,
                    role: "MANAGER",
                    usr_branchId: branch.id,
                },
            });

            return { branchId: branch.id, username: user.username };
        });

        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/branches");
        
        return { success: true, data: result };
    } catch (error) {
        console.error("Error creating branch:", error);
        return { error: "Failed to establish vessel. Please try again." };
    }
}
