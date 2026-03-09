import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminBranchesClientPage from "./client-page";

export const dynamic = "force-dynamic";

export default async function AdminBranchesPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    return <AdminBranchesClientPage />;
}
