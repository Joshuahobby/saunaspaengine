import React from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MatrixClient from "./matrix-client";
import { PermissionMatrix } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function RolesAndPermissionsPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    // Only Admin or Owners can access this matrix
    if (session.user.role !== "ADMIN" && session.user.role !== "OWNER") {
        redirect("/dashboard");
    }

    const businessId = session.user.businessId;
    
    let initialMatrix: PermissionMatrix | null = null;
    if (businessId) {
        const business = await prisma.business.findUnique({
            where: { id: businessId },
            select: { permissions: true }
        });
        if (business?.permissions) {
            initialMatrix = business.permissions as any as PermissionMatrix;
        }
    }

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-12 md:px-10">
            <MatrixClient initialMatrix={initialMatrix} />
        </main>
    );
}
