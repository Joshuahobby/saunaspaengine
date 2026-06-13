import { LoyaltyTier } from "@prisma/client";

export const LOYALTY_CONFIG = {
    TIERS: {
        BRONZE: { minPoints: 0, multiplier: 1.0, label: "Bronze" },
        SILVER: { minPoints: 2000, multiplier: 1.1, label: "Silver" },
        GOLD: { minPoints: 5000, multiplier: 1.2, label: "Gold" },
        PLATINUM: { minPoints: 10000, multiplier: 1.5, label: "Platinum" },
    } as Record<LoyaltyTier, { minPoints: number; multiplier: number; label: string }>,
};

/**
 * Determines the loyalty tier based on total points.
 */
export function determineTier(points: number): LoyaltyTier {
    if (points >= LOYALTY_CONFIG.TIERS.PLATINUM.minPoints) return "PLATINUM";
    if (points >= LOYALTY_CONFIG.TIERS.GOLD.minPoints) return "GOLD";
    if (points >= LOYALTY_CONFIG.TIERS.SILVER.minPoints) return "SILVER";
    return "BRONZE";
}

/**
 * Calculates points earned for a given amount, based on the current tier and program settings.
 */
export function calculatePointsEarned(
    amount: number,
    currentTier: LoyaltyTier,
    pointsPerRwf: number
): number {
    const tierMultiplier = LOYALTY_CONFIG.TIERS[currentTier].multiplier;
    return Math.floor(amount * pointsPerRwf * tierMultiplier);
}
