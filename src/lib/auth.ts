import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        ...authConfig.providers,
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    console.log(`[AUTH] Attempting login for: ${credentials?.email}`);
                    
                    if (!credentials?.email || !credentials?.password) {
                        console.warn("[AUTH] Missing credentials");
                        return null;
                    }

                    const user = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: credentials.email as string },
                                { username: credentials.email as string },
                            ],
                        },
                    });

                    if (!user) {
                        console.warn(`[AUTH] User not found: ${credentials.email}`);
                        return null;
                    }

                    if (user.status !== "ACTIVE") {
                        console.warn(`[AUTH] User account status is not ACTIVE (was: ${user.status})`);
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password as string,
                        user.passwordHash
                    );

                    if (!isPasswordValid) {
                        console.warn(`[AUTH] Invalid password for user: ${credentials.email}`);
                        return null;
                    }

                    console.log(`[AUTH] Login successful: ${user.email} (${user.role})`);

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.username,
                        fullName: user.fullName,
                        role: user.role as "ADMIN" | "OWNER" | "MANAGER" | "RECEPTIONIST" | "EMPLOYEE",
                        branchId: user.usr_branchId,
                        businessId: user.usr_businessId || null,
                    };
                } catch (error) {
                    console.error("[AUTH] Authorization flow encountered an error:");
                    console.error(error instanceof Error ? {
                        message: error.message,
                        stack: error.stack,
                        name: error.name
                    } : error);
                    return null;
                }
            },
        }),
    ],
});
