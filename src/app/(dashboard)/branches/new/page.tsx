import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNewBranchPage from "@/app/(dashboard)/admin/branches/new/server-page";
import ExecutiveNewBranchPage from "@/app/(dashboard)/executive/branches/new/server-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Branch | Sauna SPA Engine",
    description: "Register a new branch location.",
};

export const dynamic = "force-dynamic";

export default async function NewBranchPage() {
    const session = await auth();
    const userRole = (session?.user as { role?: string })?.role;
    
    // Return appropriate new branch experience per role
    if (userRole === "ADMIN") {
        return <AdminNewBranchPage />;
    }
    if (userRole === "OWNER") {
        return <ExecutiveNewBranchPage />;
    }

    // Unauthorized roles
    redirect("/dashboard");
}
