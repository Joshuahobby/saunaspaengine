import { prisma } from "@/lib/prisma";
import { calculatePointsEarned, determineTier } from "@/lib/loyalty";

interface FinancialData {
    taxAmount?: number;
    platformFee?: number;
    netAmount?: number;
    employeeCommission?: number;
    completedAt?: Date;
}

/**
 * Finalizes a service record, calculations taxes, commissions, loyalty points, etc.
 * This is used by both manual CASH/POS checkouts and automated MOMO webhook completions.
 */
export async function completeServiceRecord(id: string, branchId: string) {
    // 1. Fetch record with necessary data
    const record = await prisma.serviceRecord.findUnique({
        where: { id, branchId },
        include: {
            employee: { select: { id: true, commissionRate: true } },
            service: { select: { price: true } },
        },
    });

    if (!record) throw new Error("Record not found");
    if (record.status === "COMPLETED") return record;

    // 2. Fetch compliance and business settings
    const [compliance, branchWithBusiness] = await Promise.all([
        prisma.compliance.findFirst({ where: { region: "RWANDA" } }),
        prisma.branch.findUnique({
            where: { id: branchId },
            include: { business: { select: { platformCommissionRate: true } } },
        }),
    ]);

    const taxRate = compliance?.taxRate ?? 18.0;
    const commissionRate = branchWithBusiness?.business?.platformCommissionRate ?? 5.0;
    const totalAmount = record.amount;

    const taxAmount = totalAmount * (taxRate / 100);
    const netBeforeCommission = totalAmount - taxAmount;
    const platformFee = netBeforeCommission * (commissionRate / 100);

    const financialData: FinancialData = {
        taxAmount,
        platformFee,
        netAmount: totalAmount - taxAmount - platformFee,
        completedAt: new Date(),
    };

    // Calculate employee commission
    if (record.employee?.commissionRate) {
        financialData.employeeCommission = totalAmount * (record.employee.commissionRate / 100);
    }

    // 3. Perform atomic update for Completion
    const updatedRecord = await prisma.serviceRecord.update({
        where: { id },
        data: {
            status: "COMPLETED",
            paymentStatus: "SUCCESS",
            ...financialData,
        },
    });

    // 4. Post-completion side effects (Asynchronous/Decoupled)
    
    // A. Membership deduction
    if (record.paymentMode === "MEMBERSHIP") {
        const membership = await prisma.membership.findFirst({
            where: {
                clientId: record.clientId,
                status: "ACTIVE",
                OR: [
                    { category: { branchId } },
                    { category: { isGlobal: true } },
                ],
                AND: [
                    { OR: [{ endDate: null }, { endDate: { gte: new Date() } }] },
                    { OR: [{ balance: null }, { balance: { gt: 0 } }] },
                ],
            },
        });

        if (membership?.balance !== null && membership?.balance !== undefined) {
            await prisma.membership.update({
                where: { id: membership.id },
                data: { balance: { decrement: 1 } },
            });
        }
    }

    // B. Loyalty points accrual
    const loyaltyProgram = await prisma.loyaltyProgram.findFirst({
        where: { branchId: record.branchId, status: "ACTIVE" },
    });

    if (loyaltyProgram) {
        const existingLoyalty = await prisma.loyaltyPoint.findFirst({
            where: { clientId: record.clientId, branchId: record.branchId },
        });

        const currentPoints = existingLoyalty?.points ?? 0;
        const currentTier = existingLoyalty?.tier ?? "BRONZE";
        const pointsToEarn = calculatePointsEarned(
            record.amount,
            currentTier,
            loyaltyProgram.pointsPerRwf
        );

        if (pointsToEarn > 0) {
            const nextTier = determineTier(currentPoints + pointsToEarn);
            if (existingLoyalty) {
                await prisma.loyaltyPoint.update({
                    where: { id: existingLoyalty.id },
                    data: { points: { increment: pointsToEarn }, tier: nextTier },
                });
            } else {
                await prisma.loyaltyPoint.create({
                    data: {
                        clientId: record.clientId,
                        branchId: record.branchId,
                        points: pointsToEarn,
                        tier: nextTier,
                    },
                });
            }
        }
    }

    // C. Commission logging
    if (financialData.employeeCommission && financialData.employeeCommission > 0 && record.employeeId) {
        await prisma.commissionLog.upsert({
            where: { serviceRecordId: record.id },
            update: {
                amount: financialData.employeeCommission,
                employeeId: record.employeeId,
            },
            create: {
                serviceRecordId: record.id,
                employeeId: record.employeeId,
                amount: financialData.employeeCommission,
                status: "UNPAID",
            },
        });
    }

    return updatedRecord;
}
