"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import cloudinary from "./cloudinary";

/**
 * Saves a generated membership card image to Cloudinary and links it to the client.
 */
export async function saveMembershipCardAction(clientId: string, imageUrl: string) {
    const session = await auth();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    try {
        // 1. Upload the Base64 image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
            folder: "sauna-spa/membership-cards",
            resource_type: "image",
        });

        const cloudUrl = uploadResponse.secure_url;
        const qrCode = `spa-client:${clientId}`;

        // 2. Update the client record with the Cloudinary URL and ensure the QR code is persisted
        await prisma.client.update({
            where: { id: clientId },
            data: {
                membershipCardUrl: cloudUrl,
                qrCode: qrCode // Backfill QR code if missing
            },
        });

        // 3. Log the issuance in Audit Log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id!,
                action: "ISSUE_MEMBERSHIP_CARD",
                entity: "Client",
                entityId: clientId,
                details: `Generated and stored membership card at ${cloudUrl}.`,
            }
        });

        revalidatePath(`/clients/${clientId}`);
        revalidatePath("/clients");
        revalidatePath("/operations"); // Revalidate operations hub where scanning happens

        return { success: true, url: cloudUrl };
    } catch (error: unknown) {
        console.error("Cloudinary Sync Error:", error);
        return { error: "Failed to upload or link card asset: " + (error instanceof Error ? error.message : "Unknown error") };
    }
}
