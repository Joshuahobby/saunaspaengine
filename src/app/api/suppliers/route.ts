import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { apiAuth, validateFields, apiHandler } from "@/lib/api-utils";

// GET /api/suppliers — list all suppliers for the branch
export async function GET() {
    return apiHandler(async () => {
        const { user, error } = await apiAuth(["MANAGER", "ADMIN", "OWNER"]);
        if (error) return error;

        if (!user!.branchId) {
            return NextResponse.json({ error: "No branch assigned" }, { status: 403 });
        }

        const suppliers = await prisma.supplier.findMany({
            where: { branchId: user!.branchId },
            include: {
                _count: { select: { inventory: true } },
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(suppliers);
    });
}

// POST /api/suppliers — create a new supplier
export async function POST(req: NextRequest) {
    return apiHandler(async () => {
        const { user, error } = await apiAuth(["MANAGER", "ADMIN", "OWNER"]);
        if (error) return error;

        if (!user!.branchId) {
            return NextResponse.json({ error: "No branch assigned" }, { status: 403 });
        }

        const body = await req.json();
        const validation = validateFields(body, ["name"]);
        if (!validation.valid) return validation.error;

        const { name, email, phone, category, address, notes } = body;

        const supplier = await prisma.supplier.create({
            data: {
                name: String(name).trim(),
                email: email ? String(email).trim() : null,
                phone: phone ? String(phone).trim() : null,
                category: category ? String(category).trim() : null,
                address: address ? String(address).trim() : null,
                notes: notes ? String(notes).trim() : null,
                branchId: user!.branchId,
            },
        });

        return NextResponse.json(supplier, { status: 201 });
    });
}
