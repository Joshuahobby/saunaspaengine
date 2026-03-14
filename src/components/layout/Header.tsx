import { auth } from "@/lib/auth";
import UserMenu from "./UserMenu";
import { ThemeToggle } from "../theme/ThemeToggle";
import NotificationBell from "./NotificationBell";

export default async function Header({ title }: { title: string }) {
    const session = await auth();

    return (
        <header className="h-16 bg-[var(--bg-app)] sticky top-0 z-50 px-6 lg:px-8 flex items-center justify-between border-b border-[var(--border-main)] shadow-none">
            {/* Left: Title & Search */}
            <div className="flex items-center gap-6">
                {/* Mobile menu button */}
                <button className="lg:hidden p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:outline-none rounded-lg">
                    <span className="material-symbols-outlined">menu</span>
                </button>

                <div>
                    <h2 className="text-xl font-serif font-bold leading-tight tracking-tight text-[var(--text-main)] italic">
                        {title.split(' ')[0]} <span className="not-italic text-[var(--color-primary)]">{title.split(' ').slice(1).join(' ')}</span>
                    </h2>
                </div>

                <div className="relative hidden md:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-[20px]">
                        search
                    </span>
                    <input
                        className="pl-10 pr-4 py-2 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]/20 w-72 placeholder:text-[var(--text-muted)] transition-all font-medium text-[var(--text-main)] outline-none"
                        placeholder="Search for something calming..."
                        type="text"
                    />
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-2">
                <ThemeToggle />

                <NotificationBell />
                <button className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:outline-none rounded-lg">
                    <span className="material-symbols-outlined">settings</span>
                </button>

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
