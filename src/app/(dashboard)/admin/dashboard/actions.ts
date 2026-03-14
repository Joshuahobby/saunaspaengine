"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createBusinessAction(formData: FormData) {
    try {
        const businessName = formData.get("businessName") as string;
        const ownerName = formData.get("ownerName") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!businessName || !ownerName || !email || !password) {
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

        // Create business and owner within a transaction
        const result = await prisma.$transaction(async (tx) => {
            const business = await tx.business.create({
                data: {
                    name: businessName,
                    status: "ACTIVE",
                },
            });

            const user = await tx.user.create({
                data: {
                    username: formData.get("username") as string || (email.split('@')[0] + '-' + Date.now().toString().slice(-4)),
                    email,
                    fullName: ownerName,
                    passwordHash,
                    role: "OWNER",
                    status: "ACTIVE",
                    businessId: business.id,
                },
            });

            return { businessId: business.id, username: user.username };
        });

        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/branches");
        
        return { success: true, data: result };
    } catch (error) {
        console.error("Error creating business:", error);
        return { error: "Failed to establish vessel. Please try again." };
    }
}
