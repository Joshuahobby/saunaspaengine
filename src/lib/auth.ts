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
                    console.log("[AUTH] Authorize payload:", credentials);
                    if (!credentials?.email || !credentials?.password) {
                        console.log("[AUTH] Missing email or password");
                        return null;
                    }

                    console.log("[AUTH] Querying database for:", credentials.email);
                    const user = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: credentials.email as string },
                                { username: credentials.email as string },
                            ],
                        },
                    });

                    if (!user) {
                        console.log("[AUTH] User not found");
                        return null;
                    }

                    if (user.status !== "ACTIVE") {
                        console.log("[AUTH] User status is not active:", user.status);
                        return null;
                    }

                    console.log("[AUTH] Comparing passwords...");
                    const isPasswordValid = await bcrypt.compare(
                        credentials.password as string,
                        user.passwordHash
                    );

                    if (!isPasswordValid) {
                        console.log("[AUTH] Invalid password");
                        return null;
                    }

                    console.log("[AUTH] Successful login for:", user.email);
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.username,
                        fullName: user.fullName,
                        role: user.role as any,
                        branchId: user.usr_branchId,
                        businessId: user.usr_businessId || null,
                    };
                } catch (error) {
                    console.error("[AUTH FATAL ERROR]", error);
                    throw error; // Let NextAuth catch it, but at least we log it!
                }
            },
        }),
    ],
});
