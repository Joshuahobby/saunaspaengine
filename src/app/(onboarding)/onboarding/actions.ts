"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOnboardingStepAction(businessId: string, step: number) {
    try {
        await prisma.business.update({
            where: { id: businessId },
            data: { onboardingStep: step }
        });
        revalidatePath("/onboarding");
        return { success: true };
    } catch (error) {
        console.error("Error updating onboarding step:", error);
        return { error: "Failed to sync progress." };
    }
}

export async function saveBusinessProfileAction(businessId: string, data: any) {
    try {
        await prisma.business.update({
            where: { id: businessId },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
            }
        });
        revalidatePath("/onboarding");
        return { success: true };
    } catch (error) {
        console.error("Error saving business profile:", error);
        return { error: "Failed to save profile." };
    }
}

export async function saveBusinessServicesAction(businessId: string, servicesData: any[]) {
    try {
        // We'll create the selected services for the business
        const result = await prisma.$transaction(async (tx) => {
            for (const service of servicesData) {
                await tx.service.create({
                    data: {
                        businessId,
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

export async function saveBusinessTeamAction(businessId: string, teamData: any[]) {
    try {
        // Need to ensure an employee category exists first
        const result = await prisma.$transaction(async (tx) => {
            let category = await tx.employeeCategory.findFirst({
                where: { businessId, name: "General Staff" }
            });
            
            if (!category) {
                category = await tx.employeeCategory.create({
                    data: {
                        businessId,
                        name: "General Staff",
                        description: "Initial staff category"
                    }
                });
            }

            for (const member of teamData) {
                await tx.employee.create({
                    data: {
                        businessId,
                        categoryId: category.id,
                        fullName: member.name,
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

export async function completeOnboardingAction(businessId: string) {
    try {
        await prisma.business.update({
            where: { id: businessId },
            data: { 
                onboardingCompleted: true,
                onboardingStep: 4, // Final step
                status: "ACTIVE" 
            }
        });
        revalidatePath("/dashboard");
        revalidatePath("/onboarding");
        return { success: true };
    } catch (error) {
        console.error("Error completing onboarding:", error);
        return { error: "Failed to finalize commissioning." };
    }
}
