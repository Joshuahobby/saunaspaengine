import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminBranchesPage from "@/app/(dashboard)/admin/branches/server-page";
import ExecutiveBranchesPage from "@/app/(dashboard)/executive/branches/server-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Branch Network | Sauna SPA Engine",
    description: "Manage and monitor spa branch locations.",
};

export const dynamic = "force-dynamic";

export default async function BranchesPage() {
    const session = await auth();
    const userRole = (session?.user as { role?: string })?.role;
    
    // Return appropriate branches experience per role
    if (userRole === "ADMIN") {
        return <AdminBranchesPage />;
    }
    if (userRole === "OWNER") {
        return <ExecutiveBranchesPage />;
    }

    // Unauthorized roles
    redirect("/dashboard");
}
