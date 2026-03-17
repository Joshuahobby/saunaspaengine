import { requireRole } from "@/lib/role-guard";
import LocalAuditLogClientPage from "./client-page";

export const dynamic = "force-dynamic";

export default async function LocalAuditPage() {
    await requireRole(["MANAGER", "ADMIN"]);

    return <LocalAuditLogClientPage />;
}
