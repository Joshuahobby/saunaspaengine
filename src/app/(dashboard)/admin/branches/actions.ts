"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateBranchAction(id: string, data: { name: string; email?: string | null; phone?: string | null; address?: string | null }) {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.branch.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
            },
        });
        revalidatePath("/branches");

        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to update branch";
        console.error("Failed to update branch", error);
        return { success: false, error: message };
    }
}

export async function deleteBranchAction(id: string) {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.branch.delete({
            where: { id },
        });
        revalidatePath("/branches");

        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to delete branch";
        console.error("Failed to delete branch", error);
        return { success: false, error: message };
    }
}

export async function createBranchAction(data: { 
    name: string; 
    email?: string; 
    phone?: string; 
    address?: string; 
    businessId: string;
}) {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
        throw new Error("Unauthorized");
    }

    // For owners, ensure they only create branches for their own business
    if (session.user.role === "OWNER" && session.user.businessId !== data.businessId) {
        throw new Error("Unauthorized: You can only create branches for your own business");
    }

    try {
        await prisma.branch.create({
            data: {
                name: data.name,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address || null,
                businessId: data.businessId,
                status: "ACTIVE",
            },
        });
        revalidatePath("/branches");

        if (data.businessId) {
            revalidatePath(`/businesses/${data.businessId}`);
        }
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to create branch";
        console.error("Failed to create branch", error);
        return { success: false, error: message };
    }
}
