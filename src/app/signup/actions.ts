"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function registerBusinessAction(formData: FormData) {
    const businessName = (formData.get("businessName") as string)?.trim();
    const fullName = (formData.get("fullName") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const planId = (formData.get("planId") as string)?.trim();
    const billingCycle = (formData.get("billingCycle") as string)?.trim() || "Monthly";

    if (!businessName || !fullName || !email || !password || !confirmPassword) {
        return { error: "All fields are required." };
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters." };
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match." };
    }

    if (!planId) {
        return { error: "Please select a subscription plan." };
    }

    // Verify plan exists
    const plan = await prisma.platformPackage.findUnique({ where: { id: planId } });
    if (!plan) {
        return { error: "Selected plan not found. Please refresh and try again." };
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
    if (billingCycle === "Yearly") {
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    } else {
        renewalDate.setMonth(renewalDate.getMonth() + 1);
    }

    try {
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const newBusiness = await tx.business.create({
                data: {
                    name: businessName,
                    status: "ACTIVE",
                    subscriptionPlanId: plan.id,
                    subscriptionCycle: billingCycle,
                    subscriptionStatus: "PENDING_PAYMENT",
                    subscriptionRenewal: renewalDate,
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
    } catch (e: any) {
        console.error("registerBusinessAction error:", e);
        return { error: "Failed to create account. Please try again." };
    }
}
