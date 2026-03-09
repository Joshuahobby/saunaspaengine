import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth();
    if (!session?.user?.businessId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { status } = body;

        const employee = await prisma.employee.update({
            where: {
                id: params.id,
                businessId: session.user.businessId
            },
            data: { status }
        });

        return NextResponse.json(employee);
    } catch (error) {
        console.error("Employee update error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
