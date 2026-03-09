import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LocalAuditLogClientPage from "./client-page";

export const dynamic = "force-dynamic";

export default async function LocalAuditPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return <LocalAuditLogClientPage />;
}
