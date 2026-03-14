import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { apiAuth, apiHandler } from "@/lib/api-utils";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    return apiHandler(async () => {
        const { id } = await params;
        const { user, error } = await apiAuth(["OWNER", "ADMIN"]);
        if (error) return error;

        if (!user!.businessId) {
            return NextResponse.json({ error: "No business assigned" }, { status: 403 });
        }

        const body = await request.json();
        const { name, category, price, duration, status } = body;

        const service = await prisma.service.update({
            where: { id, businessId: user!.businessId },
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
        const { user, error } = await apiAuth(["OWNER", "ADMIN"]);
        if (error) return error;

        if (!user!.businessId) {
            return NextResponse.json({ error: "No business assigned" }, { status: 403 });
        }

        await prisma.service.delete({
            where: { id, businessId: user!.businessId },
        });

        return NextResponse.json({ success: true });
    });
}
