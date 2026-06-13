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
        const { serviceRecordId, rating, comment } = body;

        // Input Validation — clientId and employeeId are derived from the DB record,
        // never accepted from the client to prevent IDOR / privilege escalation.
        if (!serviceRecordId || !rating) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        const ratingNum = Number(rating);
        if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return NextResponse.json({ error: "Rating must be an integer between 1 and 5." }, { status: 400 });
        }

        // Limit comment length
        if (comment && typeof comment === "string" && comment.length > 1000) {
            return NextResponse.json({ error: "Comment must not exceed 1000 characters." }, { status: 400 });
        }

        // Verify the Service Record exists within the session user's branch, is COMPLETED, and not yet reviewed
        const serviceRecord = await prisma.serviceRecord.findUnique({
            where: { id: serviceRecordId, branchId: session.user.branchId ?? undefined },
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

        if (!serviceRecord.employeeId) {
            return NextResponse.json({ error: "No employee assigned to this service record." }, { status: 400 });
        }

        // Create exactly one review attached to the service record
        const review = await prisma.review.create({
            data: {
                rating: ratingNum,
                comment: comment ? String(comment).trim() : null,
                serviceRecordId,
                clientId: serviceRecord.clientId,
                employeeId: serviceRecord.employeeId,
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
