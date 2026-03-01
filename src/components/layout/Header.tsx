import { auth } from "@/lib/auth";
import UserMenu from "./UserMenu";

export default async function Header({ title }: { title: string }) {
    const session = await auth();

    return (
        <header className="h-16 border-b border-[var(--color-border-light)] bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 lg:px-8 flex items-center justify-between">
            {/* Left: Title & Search */}
            <div className="flex items-center gap-6">
                {/* Mobile menu button */}
                <button className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-[var(--color-primary)] transition-colors">
                    <span className="material-symbols-outlined">menu</span>
                </button>

                <div>
                    <h2 className="text-lg font-bold leading-tight">{title}</h2>
                    {/* Subtitle removed as per new component signature */}
                </div>

                <div className="relative hidden md:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                        search
                    </span>
                    <input
                        className="pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] w-64"
                        placeholder="Search..."
                        type="text"
                    />
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-3">
                <button className="p-2 text-slate-500 hover:text-[var(--color-primary)] transition-colors relative">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 text-slate-500 hover:text-[var(--color-primary)] transition-colors">
                    <span className="material-symbols-outlined">settings</span>
                </button>

                <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden md:block"></div>

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
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-black shadow-sm">
                            G
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
