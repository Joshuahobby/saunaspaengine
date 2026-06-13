"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { requireRole } from "@/lib/role-guard";
import { revalidatePath } from "next/cache";

/** Manually approve a subscription payment and activate the business. */
export async function approvePaymentAction(depositId: string) {
    await requireRole(["ADMIN"]);

    const payment = await prisma.subscriptionPayment.findUnique({ where: { depositId } });
    if (!payment) throw new Error("Payment not found.");

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.subscriptionPayment.update({
            where: { depositId },
            data: { status: "COMPLETED" },
        });

        await tx.business.update({
            where: { id: payment.businessId },
            data: {
                subscriptionStatus: "ACTIVE",
                approvalStatus: "APPROVED",
            },
        });
    });

    revalidatePath("/payments");
}

/** Manually reject / mark a payment as failed. */
export async function rejectPaymentAction(depositId: string, reason: string) {
    await requireRole(["ADMIN"]);

    await prisma.subscriptionPayment.update({
        where: { depositId },
        data: {
            status: "FAILED",
            failureReason: reason || "Rejected by admin",
        },
    });

    revalidatePath("/payments");
}
