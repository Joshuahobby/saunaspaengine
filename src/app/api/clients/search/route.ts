import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.branchId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    try {
        const client = await prisma.client.findFirst({
            where: {
                branchId: session.user.branchId,
                status: "ACTIVE",
                OR: [
                    { qrCode: query },
                    { phone: query },
                    { phone: `+25${query}` }, // Support both local and international format
                ],
            },
            include: {
                memberships: {
                    where: { status: "ACTIVE" },
                    include: { category: true },
                },
                loyaltyPoints: true,
            },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found or membership inactive" }, { status: 404 });
        }

        return NextResponse.json(client);
    } catch (error) {
        console.error("Client search error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
