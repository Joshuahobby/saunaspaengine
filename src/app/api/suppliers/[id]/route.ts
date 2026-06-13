import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { apiAuth, apiHandler } from "@/lib/api-utils";

// PUT /api/suppliers/[id] — update supplier
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return apiHandler(async () => {
        const { id } = await params;
        const { user, error } = await apiAuth(["MANAGER", "ADMIN", "OWNER"]);
        if (error) return error;

        const body = await req.json();
        const { name, email, phone, category, address, notes, status } = body;

        // Scope check before mutating
        const existing = await prisma.supplier.findFirst({
            where: {
                id,
                ...(user!.role === 'OWNER' || user!.role === 'ADMIN'
                    ? { branch: { businessId: user!.businessId ?? undefined } }
                    : { branchId: user!.branchId ?? undefined }),
            },
        });
        if (!existing) return NextResponse.json({ error: "Supplier not found or access denied." }, { status: 404 });

        const supplier = await prisma.supplier.update({
            where: { id },
            data: {
                ...(name && { name: String(name).trim() }),
                ...(email !== undefined && { email: email ? String(email).trim() : null }),
                ...(phone !== undefined && { phone: phone ? String(phone).trim() : null }),
                ...(category !== undefined && { category: category ? String(category).trim() : null }),
                ...(address !== undefined && { address: address ? String(address).trim() : null }),
                ...(notes !== undefined && { notes: notes ? String(notes).trim() : null }),
                ...(status && { status }),
            },
        });

        return NextResponse.json(supplier);
    });
}

// DELETE /api/suppliers/[id] — delete a supplier
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return apiHandler(async () => {
        const { id } = await params;
        // Only Business Owners or Platform Admins can permanently delete suppliers
        const { user, error } = await apiAuth(["ADMIN", "OWNER"]);
        if (error) return error;

        // Scope check before deleting
        const existing = await prisma.supplier.findFirst({
            where: {
                id,
                branch: { businessId: user!.businessId ?? undefined },
            },
            include: { branch: true },
        });
        if (!existing) return NextResponse.json({ error: "Supplier not found or access denied." }, { status: 404 });

        await prisma.supplier.delete({ where: { id } });

        await prisma.auditLog.create({
            data: {
                userId: user!.id!,
                action: "DELETE_SUPPLIER",
                entity: "Supplier",
                entityId: id,
                details: `Deleted supplier ${existing.name} in branch ${existing.branch.name}`,
                branchId: existing.branchId
            }
        });

        return NextResponse.json({ success: true });
    });
}
