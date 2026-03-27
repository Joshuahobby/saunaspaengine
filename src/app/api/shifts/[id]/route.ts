import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const { id } = resolvedParams;

        // Only MANAGER and OWNER can edit shifts
        if (session.user.role !== "MANAGER" && session.user.role !== "OWNER") {
            return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
        }

        const body = await req.json();
        const { startTime, endTime, status } = body;

        // Verify shift exists and belongs to the same branch if role is MANAGER
        const existingShift = await prisma.shift.findUnique({
            where: { id }
        });

        if (!existingShift) {
            return NextResponse.json({ error: "Shift not found." }, { status: 404 });
        }

        if (session.user.role === "MANAGER" && existingShift.branchId !== session.user.branchId) {
            return NextResponse.json({ error: "Cannot edit shifts outside your branch." }, { status: 403 });
        }

        const updatedShift = await prisma.shift.update({
            where: { id },
            data: {
                ...(startTime && { startTime }),
                ...(endTime && { endTime }),
                ...(status && { status })
            }
        });

        return NextResponse.json({ success: true, shift: updatedShift });

    } catch (error) {
        console.error("Failed to update shift:", error);
        return NextResponse.json(
            { error: "Internal server error while updating shift." },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const { id } = resolvedParams;

        // Only MANAGER and OWNER can delete shifts
        if (session.user.role !== "MANAGER" && session.user.role !== "OWNER") {
            return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
        }

        // Verify shift exists and belongs to the same branch if role is MANAGER
        const existingShift = await prisma.shift.findUnique({
            where: { id }
        });

        if (!existingShift) {
            return NextResponse.json({ error: "Shift not found." }, { status: 404 });
        }

        if (session.user.role === "MANAGER" && existingShift.branchId !== session.user.branchId) {
            return NextResponse.json({ error: "Cannot delete shifts outside your branch." }, { status: 403 });
        }

        await prisma.shift.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Failed to delete shift:", error);
        return NextResponse.json(
            { error: "Internal server error while deleting shift." },
            { status: 500 }
        );
    }
}
