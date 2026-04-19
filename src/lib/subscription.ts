import { prisma } from "./prisma";
import { addDays, isAfter } from "date-fns";

export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "PAST_DUE" | "EXPIRED" | "REJECTED" | "FREE";

export interface SubscriptionState {
    status: SubscriptionStatus;
    isActive: boolean; // Can they operate?
    isTrial: boolean;
    isExpired: boolean;
    daysRemaining: number;
    plan: {
        name: string;
        employeeLimit: number;
        serviceLimit: number;
        checkInLimit: number;
        branchLimit: number;
    } | null;
    usage: {
        employees: number;
        services: number;
        branches: number;
        monthlyCheckIns: number;
    };
}

/**
 * Calculates the definitive subscription state for a business.
 */
export async function getSubscriptionState(businessId: string): Promise<SubscriptionState | null> {
    const business = await prisma.business.findUnique({
        where: { id: businessId },
        include: {
            subscriptionPlan: true,
            branches: {
                select: {
                    id: true,
                    monthlyCheckInCount: true,
                    _count: {
                        select: {
                            services: true,
                            employees: true,
                        }
                    }
                }
            }
        }
    });

    if (!business) return null;

    const plan = business.subscriptionPlan;
    const now = new Date();
    
    let status: SubscriptionStatus = (business.subscriptionStatus as SubscriptionStatus) || "ACTIVE";
    
    // Logic for TRIAL vs EXPIRED (with Automated Database Sync)
    if (business.trialEndsAt && isAfter(now, business.trialEndsAt)) {
        // Trial has ended.
        if (status === "ACTIVE" || status === "TRIAL") {
            // PASSIVE SYNC: Update database to EXPIRED if they haven't paid yet
            // This ensures the business is blocked even if they don't explicitly "end" their trial
            await prisma.business.update({
                where: { id: businessId },
                data: { subscriptionStatus: "EXPIRED" }
            });
            status = "EXPIRED";
        }
    } else if (business.trialEndsAt && !isAfter(now, business.trialEndsAt)) {
        status = "TRIAL";
    }

    if (plan?.name === "Free") {
        status = "FREE";
    }

    const isActive = status === "ACTIVE" || status === "TRIAL" || status === "FREE";
    const isExpired = status === "EXPIRED" || status === "PAST_DUE";
    
    const daysRemaining = business.trialEndsAt 
        ? Math.max(0, Math.ceil((business.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

    // Aggregate usage across all branches
    const usage = {
        employees: business.branches.reduce((acc, b) => acc + b._count.employees, 0),
        services: business.branches.reduce((acc, b) => acc + b._count.services, 0),
        branches: business.branches.length,
        monthlyCheckIns: business.branches.reduce((acc, b) => acc + b.monthlyCheckInCount, 0),
    };

    return {
        status,
        isActive,
        isTrial: status === "TRIAL",
        isExpired,
        daysRemaining,
        plan: plan ? {
            name: plan.name,
            employeeLimit: plan.employeeLimit,
            serviceLimit: plan.serviceLimit,
            checkInLimit: plan.checkInLimit,
            branchLimit: plan.branchLimit,
        } : null,
        usage
    };
}

/**
 * Checks if a specific branch is over its limits.
 */
export async function checkLimit(branchId: string, feature: "employee" | "service" | "checkIn") {
    const branch = await prisma.branch.findUnique({
        where: { id: branchId },
        include: {
            business: {
                include: { subscriptionPlan: true }
            },
            _count: {
                select: {
                    employees: true,
                    services: true
                }
            }
        }
    });

    if (!branch) return { allowed: true };
    const business = branch.business;
    const plan = business?.subscriptionPlan;

    if (!business || !plan) return { allowed: true };
    
    // --- GLOBAL ACTIVITY CHECK ---
    // If the business is EXPIRED, PAST_DUE, or REJECTED, block all operational actions
    const now = new Date();
    const isTrialExpired = business.trialEndsAt && now > business.trialEndsAt;
    const status = business.subscriptionStatus;
    
    const isActive = (status === "ACTIVE" || status === "TRIAL" || status === "FREE") && !isTrialExpired;

    if (!isActive) {
        return { 
            allowed: false, 
            reason: "INACTIVE_SUBSCRIPTION",
            message: "Your workspace is currently locked due to an inactive subscription." 
        };
    }
    
    if (feature === "employee") {
        if (plan.employeeLimit > 0 && branch._count.employees >= plan.employeeLimit) {
            return { allowed: false, limit: plan.employeeLimit, current: branch._count.employees };
        }
    }

    if (feature === "service") {
        if (plan.serviceLimit > 0 && branch._count.services >= plan.serviceLimit) {
            return { allowed: false, limit: plan.serviceLimit, current: branch._count.services };
        }
    }

    if (feature === "checkIn") {
        if (plan.checkInLimit > 0 && branch.monthlyCheckInCount >= plan.checkInLimit) {
            return { allowed: false, limit: plan.checkInLimit, current: branch.monthlyCheckInCount };
        }
    }

    return { allowed: true };
}

export interface ProrationResult {
    originalAmount: number;
    finalAmount: number;
    creditApplied: number;
    remainingDays: number;
    isUpgrade: boolean;
}

/**
 * Calculates the prorated amount for upgrading/changing a subscription plan.
 * Follows the "Fresh Cycle" model: starts a brand new period and applies credit for unused days.
 */
export async function calculateUpgradeProration(
    businessId: string,
    targetPlanId: string,
    targetCycle: "Monthly" | "Yearly"
): Promise<ProrationResult> {
    const business = await prisma.business.findUnique({
        where: { id: businessId },
        include: { subscriptionPlan: true }
    });

    const targetPlan = await prisma.platformPackage.findUnique({
        where: { id: targetPlanId }
    });

    if (!business || !targetPlan) {
        throw new Error("Business or target plan not found");
    }

    const now = new Date();
    const isMonthly = targetCycle === "Monthly";
    const newPrice = isMonthly ? targetPlan.priceMonthly : targetPlan.priceYearly;

    // 1. If trial or no active plan, pay full new price
    if (business.subscriptionStatus === "TRIAL" || !business.subscriptionRenewal || !business.subscriptionPlan) {
        return {
            originalAmount: newPrice,
            finalAmount: newPrice,
            creditApplied: 0,
            remainingDays: 0,
            isUpgrade: true
        };
    }

    // 2. Calculate remaining value of current plan
    const renewalDate = business.subscriptionRenewal;
    const diffTime = renewalDate.getTime() - now.getTime();
    const remainingDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    
    // We assume 30 days for monthly, 365 for yearly to simplify billing
    const cycleDays = business.subscriptionCycle === "Yearly" ? 365 : 30;
    const currentPrice = business.subscriptionCycle === "Yearly" 
        ? business.subscriptionPlan.priceYearly 
        : business.subscriptionPlan.priceMonthly;

    const unusedValue = Math.max(0, (remainingDays / cycleDays) * currentPrice);
    
    // 3. Final calculation
    const finalCalculated = newPrice - unusedValue;
    
    // Enforce 500 RWF minimum to cover gateway fees
    const finalAmount = Math.max(500, Math.round(finalCalculated));

    return {
        originalAmount: newPrice,
        finalAmount,
        creditApplied: Math.round(unusedValue),
        remainingDays,
        isUpgrade: newPrice > currentPrice
    };
}
