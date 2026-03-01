import NextAuth, { DefaultSession } from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "ADMIN" | "OWNER" | "EMPLOYEE";
            businessId?: string | null;
            fullName: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: "ADMIN" | "OWNER" | "EMPLOYEE";
        businessId?: string | null;
        fullName: string;
    }
}

export const authConfig: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email as string,
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
                    role: user.role,
                    businessId: user.businessId,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.businessId = user.businessId;
                token.fullName = user.fullName;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as "ADMIN" | "OWNER" | "EMPLOYEE";
                session.user.businessId = token.businessId as string | null;
                session.user.fullName = token.fullName as string;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAuthPage = nextUrl.pathname.startsWith("/login");
            const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
            const isPublicRoute = ["/help", "/security", "/privacy", "/terms"].includes(nextUrl.pathname);

            if (isApiAuthRoute) return true;

            if (isAuthPage) {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/dashboard", nextUrl));
                }
                return true;
            }

            if (!isLoggedIn && !isPublicRoute) {
                return false; // Redirects to login page
            }

            return true;
        },
    },
    session: {
        strategy: "jwt",
    },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
