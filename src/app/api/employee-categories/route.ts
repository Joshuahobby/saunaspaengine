import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const categories = await prisma.employeeCategory.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: { select: { employees: true } }
        }
    });

    return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Only Owners and Admins can create categories." }, { status: 403 });
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    // Check for duplicate
    const existing = await prisma.employeeCategory.findFirst({
        where: { name: { equals: name.trim(), mode: "insensitive" } }
    });
    if (existing) {
        return NextResponse.json({ error: "A category with this name already exists." }, { status: 409 });
    }

    // Get branchId: either from session or first branch in business
    let targetBranchId = session.user.branchId;
    if (!targetBranchId) {
        const firstBranch = await prisma.branch.findFirst({
            where: { businessId: session.user.businessId as string }
        });
        if (!firstBranch) {
            return NextResponse.json({ error: "No branch found for this business." }, { status: 400 });
        }
        targetBranchId = firstBranch.id;
    }

    const category = await prisma.employeeCategory.create({
        data: {
            name: name.trim(),
            description: description?.trim() || null,
            branchId: targetBranchId as string,
        }
    });

    return NextResponse.json(category, { status: 201 });
}
