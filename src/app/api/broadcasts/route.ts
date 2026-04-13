import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiAuth, apiHandler } from "@/lib/api-utils";

export async function GET() {
    return apiHandler(async () => {
        const { user, error } = await apiAuth();
        if (error) return error;

        // Scope broadcasts to the user's branch (or business-wide for owners/admins).
        // Never return broadcasts belonging to unrelated branches.
        const branchFilter = user!.branchId
            ? { OR: [{ branchId: user!.branchId }, { branchId: null }] }
            : {};

        const broadcasts = await prisma.broadcast.findMany({
            where: { isDraft: false, ...branchFilter },
            orderBy: { createdAt: "desc" },
            take: 20,
            select: {
                id: true,
                subject: true,
                content: true,
                level: true,
                target: true,
                createdAt: true,
            },
        });

        return NextResponse.json(broadcasts);
    });
}
