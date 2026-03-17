"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function registerClient(formData: FormData) {
    const session = await auth();
    if (!session?.user?.branchId) {
        return { error: "Unauthorized" };
    }

    const branchId = session.user.branchId;
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
                ? `SE-${branchId.substring(0, 4).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
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
            let membership = null;
            if (clientType === "MEMBER" && membershipCategoryId) {
                const category = await tx.membershipCategory.findUnique({
                    where: { id: membershipCategoryId }
                });

                if (category) {
                    // Calculate end date if applicable
                    let endDate = null;
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

            return { client, membership };
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
