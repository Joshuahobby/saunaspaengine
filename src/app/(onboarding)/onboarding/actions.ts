"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateOnboardingStepAction(branchId: string, step: number) {
    try {
        await prisma.branch.update({
            where: { id: branchId },
            data: { onboardingStep: step }
        });
        revalidatePath("/onboarding");
        return { success: true };
    } catch (error) {
        console.error("Error updating onboarding step:", error);
        return { error: "Failed to sync progress." };
    }
}

export async function saveBranchProfileAction(branchId: string, data: { name: string; email?: string | null; phone?: string | null; address?: string | null; logoUrl?: string | null; businessHours?: unknown }) {
    try {
        await prisma.branch.update({
            where: { id: branchId },
            data: {
                name: data.name,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address || null,
                logo: data.logoUrl || null,
                businessHours: data.businessHours ?? undefined,
            }
        });
        revalidatePath("/onboarding");
        return { success: true };
    } catch (error) {
        console.error("Error saving branch profile:", error);
        return { error: "Failed to save profile." };
    }
}

export async function saveBranchServicesAction(branchId: string, servicesData: Array<{ name: string; category: string; duration: number; price: number }>) {
    try {
        // We'll create the selected services for the branch
        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            for (const service of servicesData) {
                await tx.service.create({
                    data: {
                        branchId,
                        name: service.name,
                        category: service.category,
                        duration: service.duration,
                        price: service.price,
                    }
                });
            }
            return true;
        });
        revalidatePath("/onboarding");
        return { success: true };
    } catch (error) {
        console.error("Error saving services:", error);
        return { error: "Failed to save services." };
    }
}

export async function saveBranchTeamAction(branchId: string, teamData: Array<{ fullName: string; role?: string; phone?: string; email?: string }>) {
    try {
        // Need to ensure an employee category exists first
        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            let category = await tx.employeeCategory.findFirst({
                where: { branchId, name: "General Staff" }
            });
            
            if (!category) {
                category = await tx.employeeCategory.create({
                    data: {
                        branchId,
                        name: "General Staff",
                        description: "Initial staff category"
                    }
                });
            }

            for (const member of teamData) {
                await tx.employee.create({
                    data: {
                        branchId,
                        categoryId: category.id,
                        fullName: member.fullName,
                        phone: member.phone || null,
                    }
                });
            }
            return true;
        });
        revalidatePath("/onboarding");
        return { success: true };
    } catch (error) {
        console.error("Error saving team:", error);
        return { error: "Failed to save team members." };
    }
}

import { addDays } from "date-fns";

export async function completeOnboardingAction(branchId: string) {
    try {
        const branch = await prisma.branch.findUnique({
            where: { id: branchId },
            select: { businessId: true }
        });

        const trialEndsAt = addDays(new Date(), 14);

        // Find the "Free" package to set as default if none exists
        const freePlan = await prisma.platformPackage.findFirst({
            where: { name: "Free" }
        });

        await prisma.$transaction([
            prisma.branch.update({
                where: { id: branchId },
                data: { 
                    onboardingCompleted: true,
                    onboardingStep: 4, // Final step
                    status: "ACTIVE" 
                }
            }),
            ...(branch?.businessId ? [
                prisma.business.update({
                    where: { id: branch.businessId },
                    data: { 
                        trialEndsAt,
                        subscriptionStatus: "ACTIVE",
                        subscriptionPlanId: freePlan?.id // default to Free
                    }
                })
            ] : [])
        ]);

        revalidatePath("/dashboard");
        revalidatePath("/onboarding");
        return { success: true };
    } catch (error) {
        console.error("Error completing onboarding:", error);
        return { error: "Failed to finalize commissioning." };
    }
}
