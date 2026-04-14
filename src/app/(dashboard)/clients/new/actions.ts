"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export async function registerClient(formData: FormData) {
    const session = await auth();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    let branchId = formData.get("branchId") as string;
    
    if (!branchId) {
        branchId = session.user.branchId as string;
    }

    if (!branchId && session.user.role === 'OWNER' && session.user.businessId) {
        const firstBranch = await prisma.branch.findFirst({
            where: { businessId: session.user.businessId },
            orderBy: { createdAt: 'asc' }
        });
        if (firstBranch) branchId = firstBranch.id;
    }

    if (!branchId) {
        return { error: "No active branch found. Please select a branch." };
    }
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const clientType = formData.get("clientType") as "WALK_IN" | "MEMBER";
    const membershipCategoryId = formData.get("membershipCategoryId") as string;

    if (!fullName || !phone) {
        return { error: "Full name and phone number are required" };
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Generate a simple unique QR Code string (can be swapped with UUID later)
            const qrCodeStr = clientType === "MEMBER"
                ? `SE-${branchId.substring(0, 4).toUpperCase()}-${randomUUID().substring(0, 8).toUpperCase()}`
                : null;

            // 1. Create the Client
            const client = await tx.client.create({
                data: {
                    branchId,
                    fullName,
                    phone: phone.trim(),
                    clientType,
                    qrCode: qrCodeStr,
                    status: "ACTIVE",
                }
            });

            // 2. If MEMBER and category selected, create Membership
            let membership: Record<string, unknown> | null = null;
            let selectedCategory: { name: string } | null = null;
            if (clientType === "MEMBER" && membershipCategoryId) {
                const category = await tx.membershipCategory.findUnique({
                    where: { id: membershipCategoryId }
                });

                if (category) {
                    selectedCategory = category;
                    // Calculate end date if applicable
                    let endDate: Date | null = null;
                    if (category.durationDays) {
                        endDate = new Date();
                        endDate.setDate(endDate.getDate() + category.durationDays);
                    }

                    membership = await tx.membership.create({
                        data: {
                            clientId: client.id,
                            categoryId: category.id,
                            startDate: new Date(),
                            endDate: endDate,
                            balance: category.usageLimit || null,
                            status: "ACTIVE"
                        }
                    });
                }
            }

            return { 
                client, 
                membership: membership ? {
                    ...membership,
                    categoryName: selectedCategory?.name
                } : null 
            };
        });

        revalidatePath("/clients");
        return { success: true, ...result };
    } catch (error: any) {
        // Simple duplicate phone catch
        if (error.code === 'P2002' && error.meta?.target?.includes('phone')) {
            return { error: "A client with this phone number already exists." };
        }
        return { error: "Failed to register client: " + error.message };
    }
}
