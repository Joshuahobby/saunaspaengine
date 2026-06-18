import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAuth, apiHandler } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const auth = await apiAuth(["RECEPTIONIST", "MANAGER", "ADMIN", "OWNER"]);
    if (auth.error) return auth.error;

    const id = req.nextUrl.pathname.split("/").at(-2);
    if (!id) {
        return NextResponse.json({ error: "Record ID required" }, { status: 400 });
    }

    return apiHandler(async () => {
        const record = await prisma.serviceRecord.findUnique({
            where: { id },
            select: { status: true, paymentStatus: true },
        });

        if (!record) {
            return NextResponse.json({ error: "Service record not found" }, { status: 404 });
        }

        return NextResponse.json(record);
    });
}
