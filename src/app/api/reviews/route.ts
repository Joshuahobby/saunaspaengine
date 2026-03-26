import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { serviceRecordId, rating, comment, employeeId, clientId } = body;

        // Input Validation
        if (!serviceRecordId || !rating || !employeeId || !clientId) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
        }

        // Verify the Service Record exists and is COMPLETED, and does not already have a review
        const serviceRecord = await prisma.serviceRecord.findUnique({
            where: { id: serviceRecordId },
            include: { review: true }
        });

        if (!serviceRecord) {
            return NextResponse.json({ error: "Service record not found." }, { status: 404 });
        }

        if (serviceRecord.status !== "COMPLETED") {
            return NextResponse.json({ error: "Cannot review an incomplete service." }, { status: 400 });
        }

        if (serviceRecord.review) {
            return NextResponse.json({ error: "This service has already been reviewed." }, { status: 400 });
        }

        // Create exactly one review attached to the service record
        const review = await prisma.review.create({
            data: {
                rating,
                comment: comment || null,
                serviceRecordId,
                clientId,
                employeeId,
                branchId: serviceRecord.branchId,
            }
        });

        return NextResponse.json({ success: true, review }, { status: 201 });

    } catch (error) {
        console.error("Failed to create review:", error);
        return NextResponse.json(
            { error: "Internal server error while linking review." },
            { status: 500 }
        );
    }
}
