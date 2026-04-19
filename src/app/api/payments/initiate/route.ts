import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { createDeposit, detectCorrespondent, normalizePhone } from "@/lib/pawapay";
import { calculateUpgradeProration } from "@/lib/subscription";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as { email?: string; phone?: string; planId?: string; cycle?: "Monthly" | "Yearly" };
        const { email, phone, planId, cycle = "Monthly" } = body;

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
                        subscriptionRenewal: true,
                        subscriptionPlanId: true,
                        subscriptionPlan: {
                            select: { id: true, priceMonthly: true, priceYearly: true },
                        },
                    },
                },
            },
        });

        if (!user?.business) {
            return NextResponse.json({ error: "Account not found." }, { status: 404 });
        }

        const { business } = user;
        
        // Use provided planId OR the business's current plan
        const targetPlanId = planId || business.subscriptionPlanId;
        if (!targetPlanId) {
            return NextResponse.json({ error: "No plan selected." }, { status: 400 });
        }

        const targetPlan = await prisma.platformPackage.findUnique({ where: { id: targetPlanId } });

        if (!targetPlan) {
            return NextResponse.json({ error: "Subscription plan not found." }, { status: 404 });
        }

        const correspondent = detectCorrespondent(phone);
        if (!correspondent) {
            return NextResponse.json(
                { error: "Unrecognised phone number. Use an MTN (078/079) or Airtel (072/073) Rwanda number." },
                { status: 400 },
            );
        }

        // Calculate Amount (with Proration if active)
        let amount = cycle === "Yearly" ? targetPlan.priceYearly : targetPlan.priceMonthly;
        let creditApplied = 0;

        if (business.subscriptionStatus === "ACTIVE" && business.subscriptionPlanId) {
            // Check if it's an upgrade or change
            const proration = await calculateUpgradeProration(business.id, targetPlanId, cycle);
            amount = proration.finalAmount;
            creditApplied = proration.creditApplied;
        }

        // Skip pawaPay for Free plans (0 RWF)
        if (amount === 0) {
            await prisma.business.update({
                where: { id: business.id },
                data: { 
                    subscriptionStatus: "FREE",
                    subscriptionPlanId: targetPlan.id,
                    subscriptionCycle: cycle,
                },
            });
            return NextResponse.json({ status: "SUCCESS", message: "Plan activated successfully." });
        }

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

        await prisma.subscriptionPayment.create({
            data: {
                depositId,
                businessId: business.id,
                amount,
                currency: process.env.PAWAPAY_CURRENCY ?? "RWF",
                phone: normalizePhone(phone),
                correspondent,
                status: "PENDING",
                metadata: {
                    planId: targetPlan.id,
                    cycle,
                    isUpgrade: business.subscriptionStatus === "ACTIVE",
                    creditApplied
                }
            },
        });

        return NextResponse.json({ depositId, status: "PENDING" });
    } catch (err) {
        console.error("Payment initiation error:", err);
        return NextResponse.json({ error: "Failed to initiate payment. Please try again." }, { status: 500 });
    }
}
