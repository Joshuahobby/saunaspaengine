import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { apiAuth, validateFields, apiHandler } from "@/lib/api-utils";
import { checkLimit } from "@/lib/subscription";

export async function POST(req: NextRequest) {
    return apiHandler(async () => {
        const { user, error } = await apiAuth(["MANAGER", "ADMIN"]);
        if (error) return error;

        const body = await req.json();
        const validation = validateFields(body, ["fullName", "categoryId"]);
        if (!validation.valid) return validation.error;

        const { fullName, phone, categoryId } = body;

        if (!user!.branchId) {
            return NextResponse.json({ error: "No branch assigned" }, { status: 403 });
        }

        // --- SUBSCRIPTION LIMIT CHECK ---
        const limitCheck = await checkLimit(user!.branchId, "employee");
        if (!limitCheck.allowed) {
            return NextResponse.json({ 
                error: "LIMIT_REACHED", 
                message: `You have reached the limit of ${limitCheck.limit} staff members for your current plan.`,
                limit: limitCheck.limit,
                current: limitCheck.current
            }, { status: 403 });
        }

        const employee = await prisma.employee.create({
            data: {
                fullName: String(fullName).trim(),
                phone: phone ? String(phone).trim() : null,
                branchId: user!.branchId,
                categoryId: String(categoryId),
                status: "ACTIVE",
            },
        });

        return NextResponse.json(employee, { status: 201 });
    });
}
