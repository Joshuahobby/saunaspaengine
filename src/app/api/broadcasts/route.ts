import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAuth, apiHandler } from "@/lib/api-utils";

export async function GET() {
    return apiHandler(async () => {
        const { error } = await apiAuth();
        if (error) return error;

        const broadcasts = await prisma.broadcast.findMany({
            where: { isDraft: false },
            orderBy: { createdAt: "desc" },
            take: 10,
        });

        return NextResponse.json(broadcasts);
    });
}
