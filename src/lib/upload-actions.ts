"use server";

import cloudinary from "./cloudinary";
import { auth } from "./auth";

/**
 * Uploads a logo file to Cloudinary and returns the secure URL.
 */
export async function uploadLogoAction(formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const file = formData.get("file") as File;
    if (!file) return { error: "No file provided" };

    // Basic Validation
    if (!file.type.startsWith("image/")) {
        return { error: "Only image files are allowed." };
    }
    if (file.size > 2 * 1024 * 1024) {
        return { error: "File size must be under 2MB." };
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "sauna-spa/logos",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return { success: true, url: result.secure_url };
    } catch (error: any) {
        console.error("Cloudinary upload error:", error);
        return { error: error.message || "Failed to upload to Cloudinary." };
    }
}
