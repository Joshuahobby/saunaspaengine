import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PawapayWebhookPayload } from "@/lib/pawapay";
import { Prisma } from "@prisma/client";

import { completeServiceRecord } from "@/lib/operations-logic";

type SubscriptionPaymentWithBusiness = Prisma.SubscriptionPaymentGetPayload<{
    include: { business: true };
}>;

type ServiceRecordResult = NonNullable<
    Awaited<ReturnType<typeof prisma.serviceRecord.findFirst>>
>;

export async function POST(req: NextRequest) {
    try {
        const payload = (await req.json()) as PawapayWebhookPayload;

        if (!payload.depositId || !payload.status) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // 1. Attempt to find the deposit in Subscription Payments (B2B SaaS metric)
        const subscriptionPayment = await prisma.subscriptionPayment.findUnique({
            where: { depositId: payload.depositId },
            include: { business: true }
        });

        if (subscriptionPayment) {
            return handleSubscriptionPayment(subscriptionPayment, payload);
        }

        // 2. Locate the ServiceRecord linked to this MoMo checkout
        const serviceRecord = await prisma.serviceRecord.findFirst({
            where: { pawapayDepositId: payload.depositId }
        });

        if (serviceRecord) {
            return handleServiceRecordPayment(serviceRecord, payload);
        }

        return NextResponse.json({ message: "Webhook ignored. Deposit ID not linked to any internal schema." }, { status: 200 });

    } catch (e) {
        console.error("PawaPay Webhook Error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Helper to isolate logic when the webhook targets a Business renewing its SaaS plan
async function handleSubscriptionPayment(payment: SubscriptionPaymentWithBusiness, payload: PawapayWebhookPayload) {
    if (payment.status === "COMPLETED") {
         return NextResponse.json({ message: "Already processed safely." }, { status: 200 });
    }

    if (payload.status === "FAILED") {
        await prisma.subscriptionPayment.update({
            where: { id: payment.id },
            data: {
                status: "FAILED",
                failureReason: payload.failureReason?.failureMessage || "Unknown failure reason"
            }
        });
        return NextResponse.json({ message: "Subscription payment strictly marked as failed" }, { status: 200 });
    }

    if (payload.status === "COMPLETED") {
        const business = payment.business;
        const now = new Date();
        const baseDate = business.subscriptionRenewal && new Date(business.subscriptionRenewal) > now
            ? new Date(business.subscriptionRenewal)
            : now;

        const nextRenewalDate = new Date(baseDate);
        if (business.subscriptionCycle === "Yearly") {
            nextRenewalDate.setFullYear(nextRenewalDate.getFullYear() + 1);
        } else {
            nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);
        }

        // Atomic double-update block using Prisma nested transactions!
        await prisma.$transaction([
            prisma.subscriptionPayment.update({
                where: { id: payment.id },
                data: { status: "COMPLETED" }
            }),
            prisma.business.update({
                where: { id: business.id },
                data: {
                     subscriptionStatus: "ACTIVE",
                     subscriptionRenewal: nextRenewalDate
                }
            })
        ]);

        return NextResponse.json({ message: "Subscription successfully activated!" }, { status: 200 });
    }

    return NextResponse.json({ message: "Status ignored / Unrecognized" }, { status: 200 });
}

async function handleServiceRecordPayment(record: ServiceRecordResult, payload: PawapayWebhookPayload) {
    if (record.status === "COMPLETED") {
        return NextResponse.json({ message: "Service already marked as completed." }, { status: 200 });
    }

    if (payload.status === "FAILED") {
        await prisma.serviceRecord.update({
            where: { id: record.id },
            data: {
                paymentStatus: "FAILED",
                // We keep the record status as IN_PROGRESS (PENDING_PAYMENT in UI)
                // so the user can re-trigger checkout if they want.
            }
        });
        return NextResponse.json({ message: "Service payment marked as failed." }, { status: 200 });
    }

    if (payload.status === "COMPLETED") {
        try {
            // Trigger the centralized completion logic (Loyalty, Commission, Financials)
            await completeServiceRecord(record.id, record.branchId);
            return NextResponse.json({ message: "Service record finalized via webhook!" }, { status: 200 });
        } catch (error) {
            console.error("Webhook Completion Error:", error);
            return NextResponse.json({ error: "Failed to finalize service record" }, { status: 500 });
        }
    }

    return NextResponse.json({ message: "Status ignored." }, { status: 200 });
}
