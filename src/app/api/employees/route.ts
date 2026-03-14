import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { apiAuth, validateFields, apiHandler } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
    return apiHandler(async () => {
        const { user, error } = await apiAuth(["OWNER", "ADMIN"]);
        if (error) return error;

        const body = await req.json();
        const validation = validateFields(body, ["fullName", "categoryId"]);
        if (!validation.valid) return validation.error;

        const { fullName, phone, categoryId } = body;

        if (!user!.businessId) {
            return NextResponse.json({ error: "No business assigned" }, { status: 403 });
        }

        const employee = await prisma.employee.create({
            data: {
                fullName: String(fullName).trim(),
                phone: phone ? String(phone).trim() : null,
                businessId: user!.businessId,
                categoryId: String(categoryId),
                status: "ACTIVE",
            },
        });

        return NextResponse.json(employee, { status: 201 });
    });
}
