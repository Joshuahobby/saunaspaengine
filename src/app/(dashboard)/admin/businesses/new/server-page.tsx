import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import BusinessFormClient from "./BusinessForm.client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register New Business | Admin",
    description: "Initialize a new business on the platform.",
};

export default async function NewBusinessPage() {
    await requireRole(["ADMIN"]);

    // Fetch available platform packages (subscriptions)
    const packages = await prisma.platformPackage.findMany({
        orderBy: { priceMonthly: 'asc' }
    });

    return (
        <main className="flex flex-1 flex-col px-4 lg:px-6 py-6 gap-6 max-w-3xl mx-auto w-full relative">
            <div className="flex flex-col gap-2 border-b border-[var(--border-muted)] pb-5">
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-[var(--text-main)] tracking-tight">
                    Register New Business
                </h1>
                <p className="text-sm text-[var(--text-muted)] font-medium opacity-60">
                    Register a new business and provision their primary administrator account.
                </p>
            </div>

            <BusinessFormClient packages={packages} />
        </main>
    );
}
