"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Saves a generated membership card image URL to the client's database record.
 * In a real-world scenario, the image would be uploaded to Cloudinary/S3 first.
 * For now, this action handles the link between the generated asset and the Client model.
 */
export async function saveMembershipCardAction(clientId: string, imageUrl: string) {
    const session = await auth();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    try {
        // Update the client record with the new persistent URL
        await prisma.client.update({
            where: { id: clientId },
            data: {
                membershipCardUrl: imageUrl,
            },
        });

        // Log the issuance in Audit Log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id!,
                action: "ISSUE_MEMBERSHIP_CARD",
                entity: "Client",
                entityId: clientId,
                details: `Generated and stored new membership card asset.`,
            }
        });

        revalidatePath(`/clients/${clientId}`);
        revalidatePath("/clients");

        return { success: true };
    } catch (error: any) {
        console.error("Failed to save membership card:", error);
        return { error: "Failed to link card asset to database: " + error.message };
    }
}
