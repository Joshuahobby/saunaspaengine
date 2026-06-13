import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    
    // Allow ADMIN or OWNER of the business to toggle branch status
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { status } = body;

        // If OWNER, ensure they own the business the branch belongs to
        if (session.user.role === 'OWNER') {
            const branch = await prisma.branch.findUnique({
                where: { id },
                select: { businessId: true }
            });
            if (!branch || branch.businessId !== session.user.businessId) {
                return new NextResponse("Forbidden", { status: 403 });
            }
        }

        const updatedBranch = await prisma.branch.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(updatedBranch);
    } catch (error) {
        console.error("Branch status update error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
