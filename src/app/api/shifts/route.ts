import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only MANAGER and OWNER can assign shifts
        if (session.user.role !== "MANAGER" && session.user.role !== "OWNER") {
            return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
        }

        const body = await req.json();
        const { employeeId, date, startTime, endTime } = body;

        // Input Validation
        if (!employeeId || !date || !startTime || !endTime) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        // Verify the targeted employee exists and belongs to the same branch if role is MANAGER
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId }
        });

        if (!employee) {
            return NextResponse.json({ error: "Employee not found." }, { status: 404 });
        }

        if (session.user.role === "MANAGER" && employee.branchId !== session.user.branchId) {
            return NextResponse.json({ error: "Cannot assign shifts outside your branch." }, { status: 403 });
        }

        // Use the branch ID from the employee profile
        const targetBranchId = employee.branchId;

        // Create the Shift Block
        const shift = await prisma.shift.create({
            data: {
                employeeId,
                branchId: targetBranchId,
                date: new Date(date),
                startTime,
                endTime,
                status: "SCHEDULED" // default
            }
        });

        return NextResponse.json({ success: true, shift }, { status: 201 });

    } catch (error) {
        console.error("Failed to create shift:", error);
        return NextResponse.json(
            { error: "Internal server error while creating shift." },
            { status: 500 }
        );
    }
}
