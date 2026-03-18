import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { apiAuth, apiHandler } from "@/lib/api-utils";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    return apiHandler(async () => {
        const { id } = await params;
        const { user, error } = await apiAuth(["MANAGER", "OWNER", "ADMIN", "RECEPTIONIST"]);
        if (error) return error;

        const body = await request.json();
        const { name, category, price, duration, status } = body;

        // Constraint for update: users must belong to the same branch, 
        // OR if they are an OWNER/ADMIN, the branch must belong to their business.
        const whereClause: { id: string; branchId?: string; branch?: { businessId: string } } = { id };
        if (user!.role === "OWNER" || user!.role === "ADMIN") {
            if (user!.businessId) {
                whereClause.branch = { businessId: user!.businessId };
            } else if (user!.branchId) {
                whereClause.branchId = user!.branchId;
            } else {
                return NextResponse.json({ error: "No business context found" }, { status: 403 });
            }
        } else {
            if (!user!.branchId) {
                return NextResponse.json({ error: "No branch assigned" }, { status: 403 });
            }
            whereClause.branchId = user!.branchId;
        }

        const service = await prisma.service.update({
            where: whereClause,
            data: {
                ...(name && { name: String(name).trim() }),
                ...(category && { category: String(category).trim() }),
                ...(price !== undefined && { price: parseFloat(price) }),
                ...(duration !== undefined && { duration: parseInt(duration) }),
                ...(status && { status: String(status) }),
            },
        });

        return NextResponse.json(service);
    });
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    return apiHandler(async () => {
        const { id } = await params;
        const { user, error } = await apiAuth(["MANAGER", "OWNER", "ADMIN", "RECEPTIONIST"]);
        if (error) return error;

        const whereClause: { id: string; branchId?: string; branch?: { businessId: string } } = { id };
        if (user!.role === "OWNER" || user!.role === "ADMIN") {
            if (user!.businessId) {
                whereClause.branch = { businessId: user!.businessId };
            } else if (user!.branchId) {
                whereClause.branchId = user!.branchId;
            } else {
                return NextResponse.json({ error: "No business context found" }, { status: 403 });
            }
        } else {
            if (!user!.branchId) {
                return NextResponse.json({ error: "No branch assigned" }, { status: 403 });
            }
            whereClause.branchId = user!.branchId;
        }

        await prisma.service.delete({
            where: whereClause,
        });

        return NextResponse.json({ success: true });
    });
}
