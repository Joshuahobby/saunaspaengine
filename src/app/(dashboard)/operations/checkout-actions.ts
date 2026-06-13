"use server";

import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { createDeposit, detectCorrespondent, normalizePhone } from "@/lib/pawapay";
import { auth } from "@/lib/auth";
import { resolveEffectiveBranchId } from "@/lib/branch-context";
import { completeServiceRecord } from "@/lib/operations-logic";
import { revalidatePath } from "next/cache";

export async function initiateServiceCheckoutAction(recordId: string, phone: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const record = await prisma.serviceRecord.findUnique({
        where: { id: recordId },
        include: { service: true }
    });

    if (!record) throw new Error("Service record not found");
    if (record.status === "COMPLETED") throw new Error("Service already completed");

    // Detect correspondent
    const correspondent = detectCorrespondent(phone);
    if (!correspondent) {
        throw new Error("Unrecognised phone number. Use an MTN (078/079) or Airtel (072/073) Rwanda number.");
    }

    const depositId = randomUUID();

    // Initiate PawaPay deposit (B2M)
    const pawapayRes = await createDeposit(
        depositId,
        record.amount,
        normalizePhone(phone),
        correspondent,
        `Spa Service ${recordId.slice(-4)}`
    );

    if (pawapayRes.status === "REJECTED") {
        throw new Error(`Payment rejected: ${pawapayRes.rejectionReason?.rejectionMessage ?? "Unknown reason"}`);
    }

    // Link deposit to service record
    await prisma.serviceRecord.update({
        where: { id: recordId },
        data: {
            pawapayDepositId: depositId,
            paymentStatus: "PENDING",
            paymentMode: "MOMO"
        }
    });

    revalidatePath("/operations");
    return { depositId, status: "PENDING" };
}

export async function completeVisitAction(recordId: string, paymentMode: string, comment?: string) {
    const session = await auth();
    const branchId = await resolveEffectiveBranchId(session);
    if (!session?.user || !branchId) throw new Error("Unauthorized");

    // Update metadata if provided
    if (comment || paymentMode) {
        await prisma.serviceRecord.update({
            where: { id: recordId, branchId },
            data: {
                ...(comment && { comment }),
                ...(paymentMode && { paymentMode: paymentMode as any }),
            }
        });
    }

    const record = await completeServiceRecord(recordId, branchId);
    revalidatePath("/operations");
    return record;
}
