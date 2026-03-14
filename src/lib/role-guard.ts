import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

type UserRole = "ADMIN" | "CORPORATE" | "OWNER" | "EMPLOYEE";

/**
 * Require the current user to have one of the specified roles.
 * If not authenticated or not authorized, redirects to /dashboard (or /login).
 * Returns the session for further use.
 */
export async function requireRole(allowedRoles: UserRole[]) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    if (!allowedRoles.includes(session.user.role as UserRole)) {
        redirect("/dashboard");
    }

    return session;
}
