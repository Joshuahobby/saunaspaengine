import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAuth } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
    const auth = await apiAuth(["RECEPTIONIST", "MANAGER", "ADMIN", "OWNER"]);
    if (auth.error) return auth.error;

    const id = req.nextUrl.pathname.split("/").at(-2);
    if (!id) {
        return NextResponse.json({ error: "Record ID required" }, { status: 400 });
    }

    try {
        const record = await prisma.serviceRecord.findUnique({
            where: { id },
            select: { status: true, paymentStatus: true },
        });

        if (!record) {
            return NextResponse.json({ error: "Service record not found" }, { status: 404 });
        }

        return NextResponse.json(record);
    } catch (error) {
        console.error("Status check error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
