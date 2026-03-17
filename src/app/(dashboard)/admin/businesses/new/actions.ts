"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/role-guard";
import bcrypt from "bcryptjs";

export async function createBusinessAction(formData: FormData) {
    try {
        await requireRole(["ADMIN"]);

        const businessName = formData.get("businessName") as string;
        const managerName = formData.get("managerName") as string;
        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const platformPackageId = formData.get("platformPackageId") as string;

        if (!businessName || !managerName || !username || !email || !password || !platformPackageId) {
            return { error: "All fields are required." };
        }

        // Check if username/email exists globally
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }]
            }
        });

        if (existingUser) {
            return { error: "Username or Email already exists." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction: Create Business -> Create Branch -> Create OWNER user
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Business
            const newBusiness = await tx.business.create({
                data: {
                    name: businessName,
                    subscriptionPlanId: platformPackageId,
                    status: "ACTIVE",
                }
            });

            // 2. Create the default initial branch for this business
            const initialBranch = await tx.branch.create({
                data: {
                    name: `${businessName} - Main Branch`,
                    businessId: newBusiness.id,
                    status: "ACTIVE",
                }
            });

            // 3. Create the OWNER user
            const newUser = await tx.user.create({
                data: {
                    fullName: managerName,
                    username,
                    email,
                    passwordHash: hashedPassword,
                    role: "OWNER", 
                    status: "ACTIVE",
                    business: { connect: { id: newBusiness.id } },
                    branch: { connect: { id: initialBranch.id } }
                }
            });

            return { businessId: newBusiness.id, username: newUser.username };
        });

        return { success: true, data: result };

    } catch (e: any) {
        console.error("Create business failed: ", e);
        return { error: e.message || "Failed to register business." };
    }
}
