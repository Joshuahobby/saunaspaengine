import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { apiAuth, validateFields, apiHandler } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
    return apiHandler(async () => {
        const { user, error } = await apiAuth(["MANAGER", "OWNER", "ADMIN", "RECEPTIONIST"]);
        if (error) return error;

        const body = await req.json();
        const validation = validateFields(body, ["name", "price", "duration"]);
        if (!validation.valid) return validation.error;

        const { name, category, price, duration } = body;

        let targetBranchId = user!.branchId;

        if (!targetBranchId) {
            // If user is OWNER or ADMIN, they might not have a branchId set.
            // Try to find the first branch belonging to their business.
            if ((user!.role === "OWNER" || user!.role === "ADMIN") && user!.businessId) {
                const firstBranch = await prisma.branch.findFirst({
                    where: { businessId: user!.businessId },
                    select: { id: true }
                });
                if (firstBranch) {
                    targetBranchId = firstBranch.id;
                }
            }
        }

        if (!targetBranchId) {
            return NextResponse.json({ error: "No branch assigned to user or business" }, { status: 403 });
        }

        const parsedPrice = parseFloat(price);
        const parsedDuration = parseInt(duration);

        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return NextResponse.json({ error: "Price must be a positive number" }, { status: 400 });
        }
        if (isNaN(parsedDuration) || parsedDuration <= 0) {
            return NextResponse.json({ error: "Duration must be a positive integer" }, { status: 400 });
        }

        const service = await prisma.service.create({
            data: {
                name: String(name).trim(),
                category: category ? String(category).trim() : "General",
                price: parsedPrice,
                duration: parsedDuration,
                branchId: targetBranchId,
                status: "ACTIVE",
            },
        });

        return NextResponse.json(service, { status: 201 });
    });
}
