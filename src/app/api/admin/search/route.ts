import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const session = await auth();
    const userRole = session?.user?.role;
    const userId = session?.user?.id;

    if (!userRole || !["ADMIN", "OWNER"].includes(userRole)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
        return NextResponse.json({ businesses: [], branches: [], clients: [] });
    }

    // Get Owner's businessId if applicable
    let businessId: string | null = null;
    if (userRole === "OWNER" && userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { usr_businessId: true }
        });
        businessId = user?.usr_businessId || null;
        
        if (!businessId) {
            return NextResponse.json({ businesses: [], branches: [], clients: [] });
        }
    }

    try {
        const [businessesRaw, branches, clients] = await Promise.all([
            // Search Businesses (Scoped for Owners)
            prisma.business.findMany({
                where: {
                    AND: [
                        businessId ? { id: businessId } : {},
                        {
                            OR: [
                                { name: { contains: query, mode: "insensitive" } },
                                { users: { some: { email: { contains: query, mode: "insensitive" } } } },
                                { id: { contains: query, mode: "insensitive" } },
                            ]
                        }
                    ]
                },
                select: {
                    id: true,
                    name: true,
                    status: true,
                    users: {
                        where: { role: "OWNER" },
                        select: { email: true },
                        take: 1
                    }
                },
                take: businessId ? 1 : 5,
            }),
            // Search Branches (Scoped for Owners)
            prisma.branch.findMany({
                where: {
                    AND: [
                        businessId ? { businessId } : {},
                        {
                            OR: [
                                { name: { contains: query, mode: "insensitive" } },
                                { id: { contains: query, mode: "insensitive" } },
                                { email: { contains: query, mode: "insensitive" } },
                                { phone: { contains: query, mode: "insensitive" } },
                            ]
                        }
                    ]
                },
                select: {
                    id: true,
                    name: true,
                    businessId: true,
                    status: true,
                    email: true,
                },
                take: 5,
            }),
            // Search Clients (Scoped for Owners via their branches)
            prisma.client.findMany({
                where: {
                    AND: [
                        businessId ? { branch: { businessId } } : {},
                        {
                            OR: [
                                { fullName: { contains: query, mode: "insensitive" } },
                                { phone: { contains: query, mode: "insensitive" } },
                                { qrCode: { contains: query, mode: "insensitive" } },
                                { id: { contains: query, mode: "insensitive" } },
                            ]
                        }
                    ]
                },
                include: {
                    branch: {
                        select: { name: true }
                    }
                },
                take: 5,
            }),
        ]);

        const businesses = businessesRaw.map(b => ({
            id: b.id,
            name: b.name,
            status: b.status,
            ownerEmail: b.users[0]?.email || "No Email"
        }));

        const branchesFinal = branches.map(b => ({
            ...b,
            identifier: b.email || b.id.substring(b.id.length - 6).toUpperCase()
        }));

        return NextResponse.json({
            businesses,
            branches: branchesFinal,
            clients,
        });
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
