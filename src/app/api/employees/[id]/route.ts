import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const isExecutive = session.user.role === "OWNER" || session.user.role === "ADMIN";
    if (!isExecutive && !session.user.branchId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { status } = body;

        // Verify the employee belongs to the user's scope before updating
        const employeeExists = await prisma.employee.findFirst({
            where: {
                id,
                ...(isExecutive ? { branch: { businessId: session.user.businessId as string } } : { branchId: session.user.branchId as string })
            }
        });

        if (!employeeExists) {
             return new NextResponse("Not Found or Unauthorized", { status: 404 });
        }

        const employee = await prisma.employee.update({
            where: { id },
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
    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const isExecutive = session.user.role === "OWNER" || session.user.role === "ADMIN";
    if (!isExecutive && !session.user.branchId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { fullName, phone, categoryId, status } = body;

        const employeeExists = await prisma.employee.findFirst({
            where: {
                id,
                ...(isExecutive 
                    ? { branch: { businessId: session.user.businessId as string } } 
                    : { branchId: session.user.branchId as string })
            }
        });

        if (!employeeExists) {
             return new NextResponse("Not Found or Unauthorized", { status: 404 });
        }

        const employee = await prisma.employee.update({
            where: { id },
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
    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const isExecutive = session.user.role === "OWNER" || session.user.role === "ADMIN";
    if (!isExecutive && !session.user.branchId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const employeeExists = await prisma.employee.findFirst({
            where: {
                id,
                ...(isExecutive ? { branch: { businessId: session.user.businessId as string } } : { branchId: session.user.branchId as string })
            }
        });

        if (!employeeExists) {
             return new NextResponse("Not Found or Unauthorized", { status: 404 });
        }

        await prisma.employee.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Employee DELETE error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

