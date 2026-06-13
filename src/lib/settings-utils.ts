import { prisma } from "./prisma";
import { cache } from "react";

export type DayHours = { open: string; close: string; isClosed: boolean };
export type BusinessHours = Record<string, DayHours>;

export interface EffectiveSettings {
    name: string;
    taxId: string | null;
    taxLabel: string;
    logo: string | null;
    primaryColor: string;
    currency: string;
    timezone: string;
    businessHours: BusinessHours | null;
    businessName: string;
    branchName: string;
}

/**
 * Resolves settings using the "Global Default → Branch Override" pattern.
 * Returns null if the branch no longer exists (e.g. stale session after a reseed).
 */
export const getEffectiveSettings = cache(async (branchId: string): Promise<EffectiveSettings | null> => {
    const branch = await prisma.branch.findUnique({
        where: { id: branchId },
        include: {
            business: true,
        },
    });

    if (!branch) {
        console.warn(`[settings] Branch ${branchId} not found — returning null (stale session?)`);
        return null;
    }

    const biz = branch.business;

    return {
        name: branch.name,
        branchName: branch.name,
        businessName: biz?.name || "Corporate",

        // Resolution Logic: Branch (Override) ?? Business (Default) ?? System Fallback
        taxId: branch.taxId ?? biz?.taxId ?? null,
        taxLabel: branch.taxLabel ?? biz?.taxLabel ?? "VAT",
        logo: branch.logo ?? biz?.logo ?? null,
        primaryColor: branch.primaryColor ?? biz?.primaryColor ?? "#fbbf24",
        currency: branch.currency ?? biz?.currency ?? "RWF",
        timezone: branch.timezone ?? biz?.timezone ?? "Africa/Kigali",
        businessHours: branch.businessHours as unknown as BusinessHours | null,
    };
});

/**
 * Resolves global corporate settings when no branch is selected.
 * Returns null if the business no longer exists (e.g. stale session after a reseed).
 */
export const getGlobalBusinessSettings = cache(async (businessId: string): Promise<EffectiveSettings | null> => {
    const biz = await prisma.business.findUnique({
        where: { id: businessId },
    });

    if (!biz) {
        console.warn(`[settings] Business ${businessId} not found — returning null (stale session?)`);
        return null;
    }

    return {
        name: biz.name,
        businessName: biz.name,
        branchName: "Global Dashboard",

        taxId: biz.taxId,
        taxLabel: biz.taxLabel ?? "VAT",
        logo: biz.logo,
        primaryColor: biz.primaryColor ?? "#fbbf24",
        currency: biz.currency ?? "RWF",
        timezone: biz.timezone ?? "Africa/Kigali",
        businessHours: null,
    };
});
