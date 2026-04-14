import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { PawapayWebhookPayload } from "@/lib/pawapay";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json() as PawapayWebhookPayload;
        const { depositId, status } = payload;

        if (!depositId || !status) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const payment = await db.subscriptionPayment.findUnique({
            where: { depositId },
        });

        // Not our payment — acknowledge silently so PawaPay doesn't retry
        if (!payment) {
            return NextResponse.json({ received: true });
        }

        if (status === "COMPLETED") {
            await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
                await (tx as any).subscriptionPayment.update({
                    where: { depositId },
                    data: { status: "COMPLETED", metadata: payload as unknown as Prisma.InputJsonValue },
                });

                await tx.business.update({
                    where: { id: payment.businessId },
                    data: {
                        subscriptionStatus: "ACTIVE",
                        approvalStatus: "APPROVED",
                    },
                });
            });
        } else if (status === "FAILED") {
            await db.subscriptionPayment.update({
                where: { depositId },
                data: {
                    status: "FAILED",
                    failureReason: payload.failureReason?.failureMessage ?? null,
                    metadata: payload as unknown as Prisma.InputJsonValue,
                },
            });
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error("PawaPay webhook error:", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
