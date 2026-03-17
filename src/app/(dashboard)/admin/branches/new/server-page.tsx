import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import { BranchForm } from "./BranchForm.client";
import Link from "next/link";

export const metadata = {
    title: "New Branch | Business Management",
    description: "Register and provision a new branch location.",
};

export default async function NewBranchPage() {
    const session = await requireRole(["ADMIN", "OWNER"]);

    // Fetch businesses for selection (if ADMIN) or just the owner's business
    const businesses = await prisma.business.findMany({
        where: session.user.role === "OWNER" ? { id: session.user.businessId as string } : {},
        select: {
            id: true,
            name: true,
        },
        orderBy: { name: "asc" },
    });

    return (
        <main className="flex-1 p-4 lg:p-8 w-full">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Back Link */}
                <Link 
                    href="/branches"
                    className="flex items-center gap-2 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest hover:text-[var(--text-main)] transition-colors group italic"
                >
                    <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Return to {session.user.role === "ADMIN" ? "Portfolio" : "Dashboard"}
                </Link>

                <BranchForm availableBusinesses={businesses} session={session} />
            </div>
        </main>
    );
}
