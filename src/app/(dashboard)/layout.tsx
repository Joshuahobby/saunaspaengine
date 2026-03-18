export const dynamic = "force-dynamic";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    let branchName = "Sauna SPA Engine";
    if (session.user.role === "OWNER" && session.user.businessId) {
        const business = await prisma.business.findUnique({
            where: { id: session.user.businessId },
            select: { name: true }
        });
        if (business) branchName = business.name;
    } else if (session.user.branchId) {
        const branch = await prisma.branch.findUnique({
            where: { id: session.user.branchId },
            select: { name: true, onboardingCompleted: true }
        }) as any;
        
        if (branch) {
            branchName = branch.name;
            
            // Redirect managers to onboarding if not completed
            if (session.user.role === "MANAGER" && !branch.onboardingCompleted) {
                redirect("/onboarding");
            }
        }
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--bg-app)] text-[var(--text-main)] transition-colors duration-500">
            <Sidebar
                userRole={session.user.role as "ADMIN" | "OWNER" | "MANAGER" | "EMPLOYEE"}
                branchName={branchName}
            />
            <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 relative">
                <Header title="Dashboard" />
                <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
                    {children}
                </div>
            </main>
            <MobileNav />
        </div>
    );
}
