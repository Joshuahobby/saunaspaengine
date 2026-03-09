import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user?.businessId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const alerts = await prisma.safetyAlert.findMany({
        where: {
            businessId: session.user.businessId,
            status: { not: "RESOLVED" },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(alerts);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.businessId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { type, location, message } = await req.json();

        const alert = await prisma.safetyAlert.create({
            data: {
                type: type || "SILENT",
                location,
                message,
                businessId: session.user.businessId,
            },
        });

        return NextResponse.json(alert);
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user?.businessId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, status } = await req.json();

        const alert = await prisma.safetyAlert.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(alert);
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
