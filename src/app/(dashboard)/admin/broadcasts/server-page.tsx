import { requireRole } from "@/lib/role-guard";
import AdminBroadcastsClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Transmission Hub | Admin Broadcasts",
    description: "Platforms-wide communication and global alert management center.",
};

export const dynamic = "force-dynamic";

export default async function AdminBroadcastsPage() {
    await requireRole(["ADMIN"]);

    return <AdminBroadcastsClientPage />;
}
