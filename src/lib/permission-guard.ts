import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PermissionKey, hasPermission, PermissionMatrix } from "./permissions";
import { UserRole } from "@prisma/client";

/**
 * Require the current user to have a specific permission.
 * Checks against the dynamic business matrix if available, otherwise fallbacks to system defaults.
 */
export async function requirePermission(permission: PermissionKey) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const role = session.user.role as UserRole;
    const businessId = session.user.businessId;

    let businessPermissions: PermissionMatrix | null = null;
    if (businessId) {
        const business = await prisma.business.findUnique({
            where: { id: businessId },
            select: { permissions: true }
        });
        if (business) {
            businessPermissions = business.permissions as any as PermissionMatrix;
        }
    }

    const authorized = hasPermission(role, permission, businessPermissions);

    if (!authorized) {
        // Redirect to a specific "Unauthorized" page or the dashboard with a toast/param
        redirect("/dashboard?error=unauthorized_capability");
    }

    return session;
}
