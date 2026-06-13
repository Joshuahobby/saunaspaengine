export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { resolveEffectiveBranchId } from "@/lib/branch-context";

export async function GET() {
    try {
        const session = await auth();
        const branchId = await resolveEffectiveBranchId(session);
        if (!session?.user || !branchId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const alerts = await prisma.safetyAlert.findMany({
            where: {
                branchId,
                status: { not: "RESOLVED" },
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(alerts);
    } catch (error) {
        console.error("Safety alerts GET error:", error);
        const msg = error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        const branchId = await resolveEffectiveBranchId(session);
        if (!session?.user || !branchId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { type, location, message } = await req.json();

        const alert = await prisma.safetyAlert.create({
            data: {
                type: type || "SILENT",
                location: location || null,
                message: message || null,
                branchId,
            },
        });

        return NextResponse.json(alert);
    } catch (error) {
        console.error("Safety alerts POST error:", error);
        const msg = error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        const branchId = await resolveEffectiveBranchId(session);
        if (!session?.user || !branchId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, status } = await req.json();

        // Scope update to the requesting branch to prevent cross-branch mutations
        const alert = await prisma.safetyAlert.update({
            where: { id, branchId },
            data: { status },
        });

        return NextResponse.json(alert);
    } catch (error) {
        console.error("Safety alerts PATCH error:", error);
        const msg = error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
