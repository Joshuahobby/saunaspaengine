import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { status } = body;

        const business = await prisma.business.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(business);
    } catch (error) {
        console.error("Business update error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
