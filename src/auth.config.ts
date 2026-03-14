import type { NextAuthConfig, DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "ADMIN" | "CORPORATE" | "OWNER" | "EMPLOYEE";
            businessId?: string | null;
            corporateId?: string | null;
            fullName: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: "ADMIN" | "CORPORATE" | "OWNER" | "EMPLOYEE";
        businessId?: string | null;
        corporateId?: string | null;
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
                token.businessId = user.businessId;
                token.corporateId = user.corporateId;
                token.fullName = user.fullName;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as "ADMIN" | "CORPORATE" | "OWNER" | "EMPLOYEE";
                session.user.businessId = token.businessId as string | null;
                session.user.corporateId = token.corporateId as string | null;
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
                    const role = auth.user.role;
                    if (role === "ADMIN") {
                        return Response.redirect(new URL("/admin/dashboard", nextUrl));
                    }
                    if (role === "CORPORATE") {
                        return Response.redirect(new URL("/executive/dashboard", nextUrl));
                    }
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
