import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Only Owners and Admins can modify category configuration." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, description } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    const where: any = { id };
    if (session.user.role === 'OWNER') {
        where.branch = { businessId: session.user.businessId };
    }

    try {
        const category = await prisma.employeeCategory.update({
            where,
            data: {
                name: name.trim(),
                description: description?.trim() || null,
            }
        });
        return NextResponse.json(category);
    } catch {
        return NextResponse.json({ error: "Category not found or access denied." }, { status: 404 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Critical Violation: Only Business Owners can delete staff roles." }, { status: 403 });
    }

    const { id } = await params;

    const where: any = { id };
    if (session.user.role === 'OWNER') {
        where.branch = { businessId: session.user.businessId };
    }

    // Check if any employees are assigned to this category
    const employeeCount = await prisma.employee.count({ where: { categoryId: id } });
    if (employeeCount > 0) {
        return NextResponse.json({ 
            error: `Cannot delete: ${employeeCount} employee(s) are using this role. Please reassign them first.` 
        }, { status: 409 });
    }

    try {
        await prisma.employeeCategory.delete({ where });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Category not found or access denied." }, { status: 404 });
    }
}
