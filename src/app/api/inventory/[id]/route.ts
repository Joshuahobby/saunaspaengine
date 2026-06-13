import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { apiAuth, apiHandler } from "@/lib/api-utils";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return apiHandler(async () => {
        const { id } = await params;
        const { user, error } = await apiAuth(["MANAGER", "ADMIN", "OWNER"]);
        if (error) return error;

        const body = await req.json();
        const { productName, stockCount, minThreshold, unit, supplierId } = body;

        // Scope check before mutating
        const existing = await prisma.inventory.findFirst({
            where: {
                id,
                ...(user!.role === 'OWNER' || user!.role === 'ADMIN'
                    ? { branch: { businessId: user!.businessId ?? undefined } }
                    : { branchId: user!.branchId ?? undefined }),
            },
        });
        if (!existing) return NextResponse.json({ error: "Item not found or access denied." }, { status: 404 });

        const item = await prisma.inventory.update({
            where: { id },
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
        // Only Business Owners or Platform Admins can permanently delete inventory items
        const { user, error } = await apiAuth(["ADMIN", "OWNER"]);
        if (error) return error;

        // Scope check before deleting
        const existing = await prisma.inventory.findFirst({
            where: {
                id,
                branch: { businessId: user!.businessId ?? undefined },
            },
            include: { branch: true },
        });
        if (!existing) return NextResponse.json({ error: "Item not found or access denied." }, { status: 404 });

        await prisma.inventory.delete({ where: { id } });

        await prisma.auditLog.create({
            data: {
                userId: user!.id!,
                action: "DELETE_INVENTORY",
                entity: "Inventory",
                entityId: id,
                details: `Permanently removed inventory record: ${existing.productName} in branch ${existing.branch.name}`,
                branchId: existing.branchId
            }
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
        const { user, error } = await apiAuth(["MANAGER", "ADMIN", "OWNER", "RECEPTIONIST"]);
        if (error) return error;

        const body = await req.json();
        const { addStock, notes } = body;

        if (!addStock || parseInt(addStock) <= 0) {
            return NextResponse.json({ error: "addStock must be a positive number" }, { status: 400 });
        }

        const quantity = parseInt(addStock);

        // Scope check before mutating
        const existing = await prisma.inventory.findFirst({
            where: {
                id,
                ...(user!.role === 'OWNER' || user!.role === 'ADMIN'
                    ? { branch: { businessId: user!.businessId ?? undefined } }
                    : { branchId: user!.branchId ?? undefined }),
            },
        });
        if (!existing) return NextResponse.json({ error: "Item not found or access denied." }, { status: 404 });

        // Use a transaction to update stock and create log atomically
        const [item] = await prisma.$transaction([
            prisma.inventory.update({
                where: { id },
                data: {
                    stockCount: { increment: quantity },
                },
            }),
            prisma.inventoryLog.create({
                data: {
                    inventoryId: id,
                    type: "RESTOCK",
                    quantity,
                    notes: notes ? String(notes).trim() : `Restocked ${quantity} units`,
                    performedBy: user!.id,
                    branchId: user!.branchId || "",
                },
            }),
        ]);

        return NextResponse.json(item);
    });
}
