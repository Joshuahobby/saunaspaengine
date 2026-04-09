import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * NEXT.JS 16 PROXY (formerly middleware)
 * Updated to match the new naming convention for Turbopack environments.
 */
export const proxy = NextAuth(authConfig).auth;

export default proxy;

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|sw\\.js|.*\\.png$).*)'],
};
