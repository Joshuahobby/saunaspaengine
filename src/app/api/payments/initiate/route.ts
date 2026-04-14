import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { createDeposit, detectCorrespondent, normalizePhone } from "@/lib/pawapay";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as { email?: string; phone?: string };
        const { email, phone } = body;

        if (!email || !phone) {
            return NextResponse.json({ error: "Email and phone are required." }, { status: 400 });
        }

        // Resolve business via user email
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
            include: {
                business: {
                    select: {
                        id: true,
                        subscriptionStatus: true,
                        subscriptionCycle: true,
                        subscriptionPlan: {
                            select: { priceMonthly: true, priceYearly: true },
                        },
                    },
                },
            },
        });

        if (!user?.business) {
            return NextResponse.json({ error: "Account not found." }, { status: 404 });
        }

        const { business } = user;

        if (business.subscriptionStatus === "ACTIVE") {
            return NextResponse.json({ error: "Subscription is already active." }, { status: 400 });
        }

        const correspondent = detectCorrespondent(phone);
        if (!correspondent) {
            return NextResponse.json(
                { error: "Unrecognised phone number. Use an MTN (078/079) or Airtel (072/073) Rwanda number." },
                { status: 400 },
            );
        }

        const amount =
            business.subscriptionCycle === "Yearly"
                ? (business.subscriptionPlan?.priceYearly ?? 500000)
                : (business.subscriptionPlan?.priceMonthly ?? 50000);

        const depositId = randomUUID();

        const pawapayRes = await createDeposit(
            depositId,
            amount,
            normalizePhone(phone),
            correspondent,
            "SSE Subscription",
        );

        if (pawapayRes.status === "REJECTED") {
            return NextResponse.json(
                { error: `Payment rejected: ${pawapayRes.rejectionReason?.rejectionMessage ?? "Unknown reason"}` },
                { status: 400 },
            );
        }

        await db.subscriptionPayment.create({
            data: {
                depositId,
                businessId: business.id,
                amount,
                currency: process.env.PAWAPAY_CURRENCY ?? "RWF",
                phone: normalizePhone(phone),
                correspondent,
                status: "PENDING",
            },
        });

        return NextResponse.json({ depositId, status: "PENDING" });
    } catch (err) {
        console.error("Payment initiation error:", err);
        return NextResponse.json({ error: "Failed to initiate payment. Please try again." }, { status: 500 });
    }
}
