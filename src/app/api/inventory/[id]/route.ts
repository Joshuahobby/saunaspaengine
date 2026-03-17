import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { apiAuth, apiHandler } from "@/lib/api-utils";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return apiHandler(async () => {
        const { id } = await params;
        const { user, error } = await apiAuth(["MANAGER", "ADMIN"]);
        if (error) return error;

        if (!user!.branchId) {
            return NextResponse.json({ error: "No branch assigned" }, { status: 403 });
        }

        const body = await req.json();
        const { productName, stockCount, minThreshold, unit, supplierId } = body;

        const item = await prisma.inventory.update({
            where: { id, branchId: user!.branchId },
            data: {
                ...(productName && { productName: String(productName).trim() }),
                ...(stockCount !== undefined && { stockCount: parseInt(stockCount) }),
                ...(minThreshold !== undefined && { minThreshold: parseInt(minThreshold) }),
                ...(unit && { unit: String(unit).trim() }),
                ...(supplierId !== undefined && { supplierId: supplierId ? String(supplierId).trim() : null }),
            },
        });

        return NextResponse.json(item);
    });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return apiHandler(async () => {
        const { id } = await params;
        const { user, error } = await apiAuth(["MANAGER", "ADMIN"]);
        if (error) return error;

        if (!user!.branchId) {
            return NextResponse.json({ error: "No branch assigned" }, { status: 403 });
        }

        await prisma.inventory.delete({
            where: { id, branchId: user!.branchId },
        });

        return NextResponse.json({ success: true });
    });
}

// PATCH for restock operations
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return apiHandler(async () => {
        const { id } = await params;
        const { user, error } = await apiAuth(["MANAGER", "ADMIN"]);
        if (error) return error;

        if (!user!.branchId) {
            return NextResponse.json({ error: "No branch assigned" }, { status: 403 });
        }

        const body = await req.json();
        const { addStock } = body;

        if (!addStock || parseInt(addStock) <= 0) {
            return NextResponse.json({ error: "addStock must be a positive number" }, { status: 400 });
        }

        const item = await prisma.inventory.update({
            where: { id, branchId: user!.branchId },
            data: {
                stockCount: { increment: parseInt(addStock) },
            },
        });

        return NextResponse.json(item);
    });
}
