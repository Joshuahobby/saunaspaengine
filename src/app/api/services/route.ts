import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { apiAuth, validateFields, apiHandler } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
    return apiHandler(async () => {
        const { user, error } = await apiAuth(["OWNER", "ADMIN"]);
        if (error) return error;

        const body = await req.json();
        const validation = validateFields(body, ["name", "price", "duration"]);
        if (!validation.valid) return validation.error;

        const { name, category, price, duration } = body;

        if (!user!.businessId) {
            return NextResponse.json({ error: "No business assigned" }, { status: 403 });
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
                businessId: user!.businessId,
                status: "ACTIVE",
            },
        });

        return NextResponse.json(service, { status: 201 });
    });
}
