"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { headers } from "next/headers";
import { loginLimiter, passwordResetLimiter } from "@/lib/rate-limit";
import { randomInt, timingSafeEqual } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    // Rate-limit by IP: 10 attempts per 15 minutes
    const headerStore = await headers();
    const ip = headerStore.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    const rl = loginLimiter.check(ip);
    if (!rl.success) {
        return `Too many login attempts. Please wait ${rl.retryAfter} seconds before trying again.`;
    }

    try {
        const plainFormData = Object.fromEntries(formData);
        const redirectTo = (plainFormData.redirectTo as string) || "/dashboard";

        await signIn("credentials", { ...plainFormData, redirectTo });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                case "CallbackRouteError":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
}


export async function requestPasswordReset(email: string) {
    // Rate-limit OTP requests by IP
    const headerStore = await headers();
    const ip = headerStore.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    const rl = passwordResetLimiter.check(ip);
    if (!rl.success) {
        // Return success-looking response to prevent email enumeration timing attack
        return { success: true };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Return success even when user not found to prevent email enumeration.
            // The "success" response is intentionally indistinguishable from a real one.
            return { success: true };
        }

        // Generate cryptographically secure 6-digit OTP
        const otp = randomInt(100000, 999999).toString();
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetOtp: otp,
                resetOtpExpiry: expiry,
            },
        });

        // Always log OTP for easy developer access


        // Send Email via Resend
        if (process.env.RESEND_API_KEY) {
            const { error: mailError } = await resend.emails.send({
                from: "Sauna SPA Engine <onboarding@resend.dev>",
                to: email,
                subject: "Password Recovery — Verification Code",
                html: `
                    <div style="font-family: serif; color: #1a1a1a; padding: 40px; background-color: #f9f9f9; border-radius: 20px;">
                        <h1 style="font-style: italic; border-bottom: 2px solid #fbbf24; display: inline-block;">Sauna SPA Engine</h1>
                        <p style="font-size: 16px; margin-top: 20px;">You requested a password reset for your account.</p>
                        <p style="font-size: 14px; color: #666;">Use the following 6-digit code to verify your identity. This code expires in 15 minutes.</p>
                        <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #ddd; margin: 30px 0; text-align: center;">
                            <span style="font-size: 32px; font-weight: 900; letter-spacing: 0.2em; color: #fbbf24;">${otp}</span>
                        </div>
                        <p style="font-size: 12px; color: #999;">If you did not request this, please ignore this email or contact support.</p>
                    </div>
                `,
            });

            if (mailError) {
                // In production, we report the error. In dev, the console.log above handles it.
                if (process.env.NODE_ENV === "production") {
                    return { error: `Email delivery failed: ${mailError.message}` };
                }
            }
        }

        return { success: true };
    } catch {
        
        return { error: "Internal server error. Please try again." };
    }
}

/** Constant-time OTP comparison to prevent timing attacks. */
function otpMatches(stored: string | null, provided: string): boolean {
    if (!stored || stored.length !== provided.length) return false;
    try {
        return timingSafeEqual(Buffer.from(stored), Buffer.from(provided));
    } catch {
        return false;
    }
}

export async function verifyResetOtp(email: string, otp: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (
            !user ||
            !otpMatches(user.resetOtp, otp) ||
            !user.resetOtpExpiry ||
            user.resetOtpExpiry < new Date()
        ) {
            return { error: "Invalid or expired verification code." };
        }

        return { success: true };
    } catch {
        return { error: "Verification failed." };
    }
}

export async function performPasswordReset(email: string, otp: string, password: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (
            !user ||
            !otpMatches(user.resetOtp, otp) ||
            !user.resetOtpExpiry ||
            user.resetOtpExpiry < new Date()
        ) {
            return { error: "Verification expired. Please restart the process." };
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                resetOtp: null,
                resetOtpExpiry: null,
            },
        });

        return { success: true };
    } catch {
        return { error: "Failed to reset password." };
    }
}
