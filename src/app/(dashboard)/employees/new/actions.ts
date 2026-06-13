"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

function validatePasswordServer(password: string): string | null {
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return "Password must contain at least one special character.";
    return null;
}

import { checkLimit } from "@/lib/subscription";

export async function registerEmployeeAction(formData: FormData) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    const role = session.user.role;
    if (role !== "OWNER" && role !== "ADMIN" && role !== "MANAGER") {
        return { error: "Unauthorized: Insufficient permissions to register staff." };
    }

    const branchId = formData.get("branchId") as string;
    
    // --- BACKEND LIMIT ENFORCEMENT ---
    const limitCheck = await checkLimit(branchId, "employee");
    if (!limitCheck.allowed) {
        return { 
            error: `Limit Reached: Your current plan only allows ${limitCheck.limit} staff members. Please upgrade to add more.` 
        };
    }

    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const categoryId = formData.get("categoryId") as string;
    const commissionRateRaw = formData.get("commissionRate") as string;
    const commissionRate = commissionRateRaw ? parseFloat(commissionRateRaw) : 5.0;

    if (!fullName || !categoryId || !branchId || !email || !password) {
        return { error: "Full name, email, password, professional role, and branch are required." };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: "Please provide a valid email address." };
    }

    // Validate password strength server-side
    const pwError = validatePasswordServer(password);
    if (pwError) {
        return { error: pwError };
    }

    // Validate commission rate
    if (isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100) {
        return { error: "Commission rate must be between 0 and 100." };
    }

    // Security Check: Managers can only register for their own branch
    if (role === "MANAGER" && branchId !== session.user.branchId) {
        return { error: "Security Violation: Managers can only register staff for their assigned branch." };
    }

    try {
        // Check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
        if (existingUser) {
            return { error: "An account with this email already exists. Please use a different email." };
        }

        // Generate username from email (part before @)
        let username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "_");
        // Ensure unique username
        const existingUsername = await prisma.user.findUnique({ where: { username } });
        if (existingUsername) {
            username = `${username}_${Date.now().toString(36)}`;
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create User + Employee in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    username,
                    email: email.trim().toLowerCase(),
                    fullName: fullName.trim(),
                    passwordHash,
                    role: "EMPLOYEE",
                    usr_branchId: branchId,
                }
            });

            const employee = await tx.employee.create({
                data: {
                    fullName: fullName.trim(),
                    phone: phone ? phone.trim() : null,
                    categoryId,
                    branchId,
                    status: "ACTIVE",
                    commissionRate,
                    userId: user.id,
                }
            });

            return { user, employee };
        });

        revalidatePath("/employees");
        return { success: true, employeeId: result.employee.id };
    } catch (err) {
        console.error("[REGISTER_EMPLOYEE_ERROR]", err);
        return { error: "Failed to register staff member. Please ensure the data is correct." };
    }
}
