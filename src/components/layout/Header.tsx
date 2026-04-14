import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import UserMenu from "./UserMenu";
import { ThemeToggle } from "../theme/ThemeToggle";
import NotificationBell from "./NotificationBell";
import { CommandCenter } from "../admin/command-center";
import MobileMenuButton from "./MobileMenuButton";
import BranchSwitcher from "./BranchSwitcher";
import { prisma } from "@/lib/prisma";

export default async function Header() {
    const session = await auth();

    // Fetch branches if user is an owner
    let branches: { id: string, name: string }[] = [];
    let activeBranchId: string | undefined;
    if (session?.user?.role === 'OWNER' && session.user.businessId) {
        const cookieStore = await cookies();
        activeBranchId = cookieStore.get("sauna_active_branch")?.value || undefined;

        branches = await prisma.branch.findMany({
            where: { businessId: session.user.businessId, status: 'ACTIVE' },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });

        // If the cookie points to a branch that no longer belongs to this business, clear it
        if (activeBranchId && !branches.find(b => b.id === activeBranchId)) {
            activeBranchId = undefined;
        }
    }

    return (
        <header className="relative h-16 bg-[var(--bg-app)]/80 backdrop-blur-md sticky top-0 z-50 px-3 sm:px-6 lg:px-8 flex items-center justify-between border-b border-[var(--border-main)] shadow-sm transition-all duration-300">
            {/* Left */}
            <div className="flex items-center gap-2 sm:gap-6">
                <MobileMenuButton />

                <div className="flex items-center gap-2 sm:gap-4">
                    {branches.length > 0 && (
                        <BranchSwitcher branches={branches} activeBranchId={activeBranchId} />
                    )}
                </div>
            </div>

            {/* Center: Search (Desktop only) */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <CommandCenter />
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-1 sm:gap-2">
                {/* Mobile Search Icon */}
                <div className="md:hidden">
                    <CommandCenter />
                </div>

                <ThemeToggle />

                <NotificationBell />

                <div className="h-6 w-[1px] bg-[var(--border-main)] mx-1 sm:mx-2 hidden md:block"></div>

                {/* User Profile */}
                {session?.user ? (
                    <UserMenu
                        user={{
                            fullName: session.user.fullName,
                            role: session.user.role
                        }}
                    />
                ) : (
                    <div className="flex items-center gap-3 border-l border-[var(--border-main)] pl-6 ml-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-black font-serif leading-tight text-[var(--text-main)]">Guest User</span>
                            <span className="text-[10px] text-[var(--color-primary)] font-black uppercase tracking-[0.25em] leading-none mt-1.5 opacity-80">Observer</span>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-forest-400)] flex items-center justify-center text-white font-black shadow-lg shadow-[var(--color-primary)]/20 border border-[var(--border-muted)]">
                            ?
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
