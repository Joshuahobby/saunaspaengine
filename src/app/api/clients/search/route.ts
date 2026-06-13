import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { searchLimiter, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
    const rl = searchLimiter.check(getClientIp(request));
    if (!rl.success) {
        return NextResponse.json(
            { error: "Too many requests" },
            { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
        );
    }

    const session = await auth();
    if (!session?.user?.branchId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query || query.length > 100) {
        return NextResponse.json({ error: "Search query is required and must be under 100 characters" }, { status: 400 });
    }

    try {
        // 1. Get the branch and business context
        const branch = await prisma.branch.findUnique({
            where: { id: session.user.branchId },
            select: { businessId: true }
        });

        if (!branch?.businessId) {
            return NextResponse.json({ error: "Branch or Business context not found" }, { status: 404 });
        }

        // 2. Search for the client
        // We look specifically for the client across the whole corporate network
        let searchCondition: Prisma.ClientWhereInput;
        if (query.startsWith("spa-client:")) {
            const extractedId = query.replace("spa-client:", "");
            searchCondition = { id: extractedId };
        } else {
            searchCondition = {
                OR: [
                    { qrCode: query },
                    { phone: query },
                    { phone: `+25${query}` }, 
                ]
            };
        }

        const client = await prisma.client.findFirst({
            where: {
                branch: { businessId: branch.businessId },
                status: "ACTIVE",
                ...searchCondition,
            },
            include: {
                branch: true,
                memberships: {
                    where: { 
                        status: "ACTIVE",
                        OR: [
                            { category: { branchId: session.user.branchId } }, // Local branch membership
                            { category: { isGlobal: true } }   // Or a global membership from another branch
                        ]
                    },
                    include: { category: true },
                },
                loyaltyPoints: true,
            },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found in this business network" }, { status: 404 });
        }

        // Add a 'isExternal' flag if the client belongs to a different branch
        const result = {
            ...client,
            isExternal: client.branchId !== session.user.branchId
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error("Client search error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
