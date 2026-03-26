import type { NextAuthConfig, DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "ADMIN" | "OWNER" | "MANAGER" | "RECEPTIONIST" | "EMPLOYEE";
            branchId?: string | null;
            businessId?: string | null;
            fullName: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: "ADMIN" | "OWNER" | "MANAGER" | "RECEPTIONIST" | "EMPLOYEE";
        branchId?: string | null;
        businessId?: string | null;
        fullName: string;
    }
}

export const authConfig: NextAuthConfig = {
    providers: [], // Providers are added in lib/auth.ts to keep this edge-compatible
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.branchId = user.branchId;
                token.businessId = user.businessId;
                token.fullName = user.fullName;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as "ADMIN" | "OWNER" | "MANAGER" | "EMPLOYEE";
                session.user.branchId = token.branchId as string | null;
                session.user.businessId = token.businessId as string | null;
                session.user.fullName = token.fullName as string;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAuthPage = nextUrl.pathname.startsWith("/login");
            const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
            const isPublicRoute = ["/", "/help", "/security", "/privacy", "/terms"].includes(nextUrl.pathname);

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
        maxAge: 60 * 60, // 60 minutes - Inactivity Timeout
        updateAge: 15 * 60, // 15 minutes - Refresh frequency
    },
};
