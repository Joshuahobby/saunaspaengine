import { requireRole } from "@/lib/role-guard";
import AdminBroadcastsClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Broadcasts | Admin",
    description: "Platform-wide announcements and alert management.",
};

export const dynamic = "force-dynamic";

export default async function AdminBroadcastsPage() {
    await requireRole(["ADMIN"]);

    return <AdminBroadcastsClientPage />;
}
