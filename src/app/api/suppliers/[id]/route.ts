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

        const where: any = { id };
        if (user!.role === 'OWNER' || user!.role === 'ADMIN') {
            where.branch = { businessId: user!.businessId };
        } else {
            if (!user!.branchId) return NextResponse.json({ error: "No branch assigned" }, { status: 403 });
            where.branchId = user!.branchId;
        }

        const supplier = await prisma.supplier.update({
            where,
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

        const where: any = { id };
        if (user!.role === 'OWNER' || user!.role === 'ADMIN') {
            where.branch = { businessId: user!.businessId };
        } else {
            // Managers can't delete anyway per apiAuth above, but keep it safe
            where.branchId = user!.branchId;
        }

        await prisma.supplier.delete({
            where,
        });

        return NextResponse.json({ success: true });
    });
}
