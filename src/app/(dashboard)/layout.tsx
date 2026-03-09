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

    let businessName = "Sauna SPA Engine";
    if (session.user.role === "CORPORATE" && session.user.corporateId) {
        const corporate = await prisma.corporate.findUnique({
            where: { id: session.user.corporateId },
            select: { name: true }
        });
        if (corporate) businessName = corporate.name;
    } else if (session.user.businessId) {
        const business = await prisma.business.findUnique({
            where: { id: session.user.businessId },
            select: { name: true }
        });
        if (business) businessName = business.name;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--color-bg-light)]">
            <Sidebar
                userRole={session.user.role as "ADMIN" | "CORPORATE" | "OWNER" | "EMPLOYEE"}
                businessName={businessName}
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
