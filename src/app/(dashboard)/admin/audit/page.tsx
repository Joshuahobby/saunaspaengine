import { requireRole } from "@/lib/role-guard";
import { prisma as db } from "@/lib/prisma";
import AdminAuditClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Audit Nexus | System Integrity",
    description: "Immutable logs and permissions management for platform governance.",
};

export const dynamic = "force-dynamic";

export default async function AdminAuditPage(props: {
    searchParams: Promise<{ tab?: string }>;
}) {
    const searchParams = await props.searchParams;
    await requireRole(["ADMIN"]);

    const activeTab = searchParams?.tab === "Roles" ? "Matrix" : "Logs";

    // Fetch initial logs for the server-side render
    const initialLogs = await db.auditLog.findMany({
        include: {
            user: {
                select: {
                    fullName: true,
                    role: true,
                }
            },
            business: {
                select: {
                    name: true,
                }
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 50,
    });

    return (
        <div className="flex-1 overflow-x-hidden">
            <AdminAuditClientPage 
                initialLogs={initialLogs as AuditLog[]} 
                initialTab={activeTab} 
            />
        </div>
    );
}

// Define the type locally to match the structure from Prisma fetch
interface AuditLog {
    id: string;
    createdAt: Date;
    action: string;
    entity: string;
    entityId: string;
    details: string | null;
    reason: string | null;
    user: {
        fullName: string;
        role: string;
    };
    business?: {
        name: string;
    } | null;
}

