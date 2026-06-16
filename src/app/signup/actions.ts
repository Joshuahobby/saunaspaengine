"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

type BillingCycle = "Monthly" | "Yearly";
const BILLING_CYCLE_MONTHS: Record<BillingCycle, number> = { Monthly: 1, Yearly: 12 };

export async function registerBusinessAction(formData: FormData) {
    const businessName = (formData.get("businessName") as string)?.trim();
    const fullName = (formData.get("fullName") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const billingCycle: BillingCycle = "Monthly"; // Default to Monthly for auto-assigned plans

    if (!businessName || !fullName || !email || !password || !confirmPassword) {
        return { error: "All fields are required." };
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters." };
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match." };
    }

    // Automatically assign the Essential plan or fallback to the first available plan
    let plan = await prisma.platformPackage.findFirst({ where: { name: "Essential" } });
    if (!plan) {
        plan = await prisma.platformPackage.findFirst({ where: { isCustom: false } });
    }

    if (!plan) {
        return { error: "System error: No subscription plans available." };
    }

    // Check uniqueness
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
        return { error: "An account with this email already exists." };
    }

    // Auto-generate username from email local-part
    const base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const username = `${base}${suffix}`;

    const passwordHash = await bcrypt.hash(password, 10);

    // Set renewal date: 1 month or 1 year from today
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + BILLING_CYCLE_MONTHS[billingCycle]);

    try {
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const isFreePlan = plan.priceMonthly === 0;
            const trialEndsAt = new Date();
            trialEndsAt.setDate(trialEndsAt.getDate() + 14);

            const newBusiness = await tx.business.create({
                data: {
                    name: businessName,
                    status: "ACTIVE",
                    subscriptionPlanId: plan.id,
                    subscriptionCycle: billingCycle,
                    subscriptionStatus: isFreePlan ? "FREE" : "PENDING_PAYMENT",
                    subscriptionRenewal: renewalDate,
                    trialEndsAt: trialEndsAt,
                    approvalStatus: "PENDING",
                },
            });

            const initialBranch = await tx.branch.create({
                data: {
                    name: `${businessName} - Main Branch`,
                    businessId: newBusiness.id,
                    status: "ACTIVE",
                    onboardingCompleted: false,
                    onboardingStep: 0,
                },
            });

            await tx.user.create({
                data: {
                    fullName,
                    username,
                    email,
                    passwordHash,
                    role: "OWNER",
                    status: "ACTIVE",
                    business: { connect: { id: newBusiness.id } },
                    branch: { connect: { id: initialBranch.id } },
                },
            });
        });

        return { success: true };
    } catch (e) {
        console.error("registerBusinessAction error:", e);
        return { error: "Failed to create account. Please try again." };
    }
}
