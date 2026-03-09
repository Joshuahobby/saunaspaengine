import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminBroadcastsClientPage from "./client-page";

export const dynamic = "force-dynamic";

export default async function AdminBroadcastsPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    return <AdminBroadcastsClientPage />;
}
