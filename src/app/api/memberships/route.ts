import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || !session.user.branchId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { clientId, categoryId } = body;

        if (!clientId || !categoryId) {
            return NextResponse.json({ error: "clientId and categoryId are required" }, { status: 400 });
        }

        // Fetch category to determine duration/limits
        const category = await prisma.membershipCategory.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        const startDate = new Date();
        let endDate = null;
        if (category.durationDays) {
            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + category.durationDays);
        }

        const membership = await prisma.membership.create({
            data: {
                clientId,
                categoryId,
                startDate,
                endDate,
                balance: category.usageLimit || null,
                status: "ACTIVE"
            }
        });

        return NextResponse.json(membership, { status: 201 });
    } catch (error) {
        console.error("Failed to create membership:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
