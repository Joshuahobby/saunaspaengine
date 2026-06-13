import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        // Only Admins can send global broadcasts (or high-level business if allowed later)
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { subject, content, target, level, branchId, isDraft } = body;

        if (!subject || !content || !target || !level) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const broadcast = await prisma.broadcast.create({
            data: {
                subject,
                content,
                target,
                level,
                branchId: branchId || null,
                isDraft: isDraft || false,
            }
        });

        // Optional log for accountability
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "CREATE",
                entity: "Broadcast",
                entityId: broadcast.id,
                details: JSON.stringify({ subject: broadcast.subject, target: broadcast.target }),
            }
        });

        return NextResponse.json(broadcast, { status: 201 });

    } catch (error) {
        console.error("Failed to create broadcast:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
