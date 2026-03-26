import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only OWNER can generate payouts
        if (session.user.role !== "OWNER") {
            return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
        }

        const body = await req.json();
        const { employeeId, amount, commissionIds } = body;

        // Input Validation
        if (!employeeId || amount === undefined || !Array.isArray(commissionIds) || commissionIds.length === 0) {
            return NextResponse.json({ error: "Invalid settlement parameters." }, { status: 400 });
        }

        // Verify the targeted employee exists
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId }
        });

        if (!employee) {
            return NextResponse.json({ error: "Employee not found." }, { status: 404 });
        }

        // Atomically lock commissions and map to a new Settlement wrapper
        const payout = await prisma.$transaction(async (tx) => {
            // Verify that all requested commissions actually belong to this employee and are UNPAID
            const pendingCommissions = await tx.commissionLog.findMany({
                where: {
                    id: { in: commissionIds },
                    employeeId,
                    status: "UNPAID"
                }
            });

            if (pendingCommissions.length !== commissionIds.length) {
                throw new Error("One or more commissions have already been settled or are invalid.");
            }

            // Ensure amount explicitly matches backend aggregation to prevent tampering
            const backendTotal = pendingCommissions.reduce((sum, c) => sum + c.amount, 0);
            if (Math.abs(backendTotal - amount) > 0.01) { // float safety
                throw new Error("Settlement amount mismatch detected.");
            }

            // 1. Generate the immutable payout container
            const newPayout = await tx.employeePayout.create({
                data: {
                    employeeId,
                    amount: backendTotal,
                    status: "PAID",
                    branchId: employee.branchId,
                }
            });

            // 2. Lock underlying commission logs
            await tx.commissionLog.updateMany({
                where: { id: { in: commissionIds } },
                data: {
                    status: "PAID",
                    payoutId: newPayout.id
                }
            });

            return newPayout;
        });

        return NextResponse.json({ success: true, payout }, { status: 201 });

    } catch (error: any) {
        console.error("Failed to process settlement:", error);
        return NextResponse.json(
            { error: error?.message || "Internal server error while processing payout." },
            { status: 500 }
        );
    }
}
