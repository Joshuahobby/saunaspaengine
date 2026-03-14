import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.businessId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { status } = body;

        const employee = await prisma.employee.update({
            where: {
                id,
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

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.businessId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { fullName, phone, categoryId, status } = body;

        const employee = await prisma.employee.update({
            where: { id, businessId: session.user.businessId },
            data: {
                ...(fullName && { fullName }),
                ...(phone !== undefined && { phone }),
                ...(categoryId && { categoryId }),
                ...(status && { status }),
            },
        });

        return NextResponse.json(employee);
    } catch (error) {
        console.error("Employee PUT error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.businessId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        await prisma.employee.delete({
            where: { id, businessId: session.user.businessId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Employee DELETE error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

