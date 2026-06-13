import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { apiAuth, validateFields, apiHandler } from "@/lib/api-utils";

export async function GET() {
    return apiHandler(async () => {
        const { user, error } = await apiAuth(["MANAGER", "ADMIN", "OWNER"]);
        if (error) return error;

        if (!user!.branchId) {
            return NextResponse.json({ error: "No branch assigned" }, { status: 403 });
        }

        const items = await prisma.inventory.findMany({
            where: { branchId: user!.branchId },
            orderBy: { productName: "asc" },
        });

        return NextResponse.json(items);
    });
}

export async function POST(req: NextRequest) {
    return apiHandler(async () => {
        const { user, error } = await apiAuth(["MANAGER", "ADMIN"]);
        if (error) return error;

        if (!user!.branchId) {
            return NextResponse.json({ error: "No branch assigned" }, { status: 403 });
        }

        const body = await req.json();
        const validation = validateFields(body, ["productName"]);
        if (!validation.valid) return validation.error;

        const { productName, stockCount, minThreshold, unit, supplierId } = body;

        const item = await prisma.inventory.create({
            data: {
                productName: String(productName).trim(),
                stockCount: stockCount ? parseInt(stockCount) : 0,
                minThreshold: minThreshold ? parseInt(minThreshold) : 5,
                unit: unit ? String(unit).trim() : "pcs",
                supplierId: supplierId ? String(supplierId).trim() : null,
                branchId: user!.branchId,
            },
        });

        return NextResponse.json(item, { status: 201 });
    });
}
