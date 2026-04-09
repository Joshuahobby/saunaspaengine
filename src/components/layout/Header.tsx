import { auth } from "@/lib/auth";
import UserMenu from "./UserMenu";
import { ThemeToggle } from "../theme/ThemeToggle";
import NotificationBell from "./NotificationBell";
import { CommandCenter } from "../admin/command-center";
import MobileMenuButton from "./MobileMenuButton";
import BranchSwitcher from "./BranchSwitcher";
import { prisma } from "@/lib/prisma";

export default async function Header({ title }: { title: string }) {
    const session = await auth();
    
    // Fetch branches if user is an owner
    let branches: { id: string, name: string }[] = [];
    if (session?.user?.role === 'OWNER' && session.user.businessId) {
        branches = await prisma.branch.findMany({
            where: { businessId: session.user.businessId, status: 'ACTIVE' },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });
    }

    return (
        <header className="h-16 bg-[var(--bg-app)] sticky top-0 z-50 px-6 lg:px-8 flex items-center justify-between border-b border-[var(--border-main)] shadow-none">
            {/* Left: Title & Search */}
            <div className="flex items-center gap-6">
                <MobileMenuButton />

                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-serif font-bold leading-tight tracking-tight text-[var(--text-main)] italic whitespace-nowrap">
                        {title.split(' ')[0]} <span className="not-italic text-[var(--color-primary)]">{title.split(' ').slice(1).join(' ')}</span>
                    </h2>

                    {branches.length > 0 && (
                        <div className="hidden md:block h-8 w-[1px] bg-[var(--border-muted)] opacity-30 mx-2" />
                    )}

                    {branches.length > 0 && (
                        <BranchSwitcher branches={branches} />
                    )}
                </div>

                <CommandCenter />
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-2">
                <ThemeToggle />

                <NotificationBell />

                <div className="h-6 w-[1px] bg-[var(--border-main)] mx-2 hidden md:block"></div>

                {/* User Profile */}
                {session?.user ? (
                    <UserMenu
                        user={{
                            fullName: session.user.fullName,
                            role: session.user.role
                        }}
                    />
                ) : (
                    <div className="flex items-center gap-3 border-l border-[rgba(17,212,196,0.2)] pl-4 md:pl-6 ml-2 md:ml-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-bold leading-tight">Guest</span>
                            <span className="text-xs text-[#11d4c4] font-semibold">Staff</span>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--text-muted)] font-bold shadow-sm border border-[var(--border-muted)]">
                            G
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
