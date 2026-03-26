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
                    if (!credentials?.email || !credentials?.password) {
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

                    if (!user || user.status !== "ACTIVE") {
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password as string,
                        user.passwordHash
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

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
                    console.error("[AUTH] Authorization error:", error instanceof Error ? error.message : error);
                    return null;
                }
            },
        }),
    ],
});
