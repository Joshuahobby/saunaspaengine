import { prisma } from "./prisma";
import { cache } from "react";

export interface EffectiveSettings {
    name: string;
    taxId: string | null;
    taxLabel: string;
    logo: string | null;
    primaryColor: string;
    currency: string;
    timezone: string;
    businessHours: any;
    businessName: string;
    branchName: string;
}

/**
 * Resolves settings using the "Global Default → Branch Override" pattern.
 * If a branch-specific setting is null, it falls back to the Business (Corporate) value.
 */
export const getEffectiveSettings = cache(async (branchId: string): Promise<EffectiveSettings> => {
    const branch = await prisma.branch.findUnique({
        where: { id: branchId },
        include: {
            business: true,
        },
    });

    if (!branch) {
        throw new Error(`Branch with ID ${branchId} not found.`);
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
        primaryColor: branch.primaryColor ?? biz?.primaryColor ?? "#fbbf24", // Default Gold
        currency: branch.currency ?? biz?.currency ?? "RWF",
        timezone: branch.timezone ?? biz?.timezone ?? "Africa/Kigali",
        businessHours: branch.businessHours ?? null,
    };
});

/**
 * Resolves global corporate settings when no branch is selected.
 */
export const getGlobalBusinessSettings = cache(async (businessId: string) => {
    const biz = await prisma.business.findUnique({
        where: { id: businessId },
    });

    if (!biz) {
        throw new Error(`Business with ID ${businessId} not found.`);
    }

    return {
        name: biz.name,
        taxId: biz.taxId,
        taxLabel: biz.taxLabel ?? "VAT",
        logo: biz.logo,
        primaryColor: biz.primaryColor ?? "#fbbf24",
        currency: biz.currency ?? "RWF",
        timezone: biz.timezone ?? "Africa/Kigali",
    };
});
