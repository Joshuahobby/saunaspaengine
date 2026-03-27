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

        if (!user!.branchId) {
            return NextResponse.json({ error: "No branch assigned" }, { status: 403 });
        }

        const body = await req.json();
        const { name, email, phone, category, address, notes, status } = body;

        const supplier = await prisma.supplier.update({
            where: { id, branchId: user!.branchId },
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
        const { user, error } = await apiAuth(["MANAGER", "ADMIN", "OWNER"]);
        if (error) return error;

        if (!user!.branchId) {
            return NextResponse.json({ error: "No branch assigned" }, { status: 403 });
        }

        await prisma.supplier.delete({
            where: { id, branchId: user!.branchId },
        });

        return NextResponse.json({ success: true });
    });
}
