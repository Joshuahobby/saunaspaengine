"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function generateSettlement(formData: FormData) {
    const session = await auth();
    if (!session?.user || (session.user.role !== "OWNER" && session.user.role !== "ADMIN")) {
        throw new Error("Unauthorized");
    }

    const branchId = formData.get("branchId") as string;
    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;

    if (!branchId || !startDateStr || !endDateStr) {
        throw new Error("Missing required fields");
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    endDate.setHours(23, 59, 59, 999);

    // 1. Identify unpaid CommissionLog entries for the branch and period
    const unpaidLogs = await prisma.commissionLog.findMany({
        where: {
            status: "UNPAID",
            createdAt: {
                gte: startDate,
                lte: endDate
            },
            employee: {
                branchId: branchId
            }
        },
        include: {
            serviceRecord: true
        }
    });

    if (unpaidLogs.length === 0) {
        return { success: false, message: "No unpaid commissions found for this period." };
    }

    // 2. Calculate totals
    let totalGross = 0;
    let totalCommission = 0;
    
    unpaidLogs.forEach((log) => {
        totalGross += log.serviceRecord.amount || 0;
        totalCommission += log.amount || 0;
    });

    const totalNet = totalGross - totalCommission;

    // 3. Create the Settlement record
    const settlement = await prisma.settlement.create({
        data: {
            businessId: session.user.businessId,
            branchId,
            periodStart: startDate,
            periodEnd: endDate,
            totalGross,
            totalCommission,
            totalNet,
            status: "PENDING",
        }
    });

    // 4. Link logs to the settlement and mark as PAID
    // Note: The CommissionLog model doesn't have a direct link to Settlement in the schema I saw earlier,
    // but it has a payoutId. If we want to group them under a settlement, we might need a migration or 
    // just use the payoutId field if it suits. 
    // Looking at the schema again, CommissionLog has: `payoutId String?` and `payout EmployeePayout?`.
    // It seems Payout is for employees, and Settlement is for the business/branch.
    
    // For now, let's mark logs as PAID.
    await prisma.commissionLog.updateMany({
        where: {
            id: { in: unpaidLogs.map(l => l.id) }
        },
        data: {
            status: "PAID"
        }
    });

    revalidatePath("/finance/settlements");
    return { success: true, settlementId: settlement.id };
}
