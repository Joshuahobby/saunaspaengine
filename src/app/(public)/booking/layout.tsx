import Link from "next/link";

export default function BookingPortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[var(--bg-app)] text-[var(--text-main)]">
            <div className="flex h-full grow flex-col">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-[var(--border-main)] px-6 py-4 md:px-20">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="size-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white shadow-sm">
                            <span className="material-symbols-outlined text-xl">spa</span>
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight text-[var(--text-main)]">
                            Sauna SPA Engine
                        </h2>
                    </Link>
                    <div className="flex items-center gap-6">
                        <nav className="hidden items-center gap-8 md:flex">
                            <Link
                                href="/support"
                                className="text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--color-primary)]"
                            >
                                Help
                            </Link>
                            <Link
                                href="/contact"
                                className="text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--color-primary)]"
                            >
                                Contact
                            </Link>
                        </nav>
                        <Link
                            href="/login"
                            className="flex h-10 min-w-[100px] cursor-pointer items-center justify-center rounded-lg bg-[var(--color-primary)] px-5 text-sm font-bold text-white shadow-sm transition-all hover:brightness-110"
                        >
                            Sign In
                        </Link>
                    </div>
                </header>

                <main className="flex flex-1 justify-center px-4 py-10">
                    <div className="flex w-full max-w-[800px] flex-col gap-8">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="flex justify-center gap-6 py-8 text-sm text-[var(--text-muted)] border-t border-[var(--border-main)]">
                    <Link href="/support" className="transition-colors hover:text-[var(--color-primary)]">
                        Help Center
                    </Link>
                    <Link href="/terms" className="transition-colors hover:text-[var(--color-primary)]">
                        Cancellation Policy
                    </Link>
                    <Link href="/contact" className="transition-colors hover:text-[var(--color-primary)]">
                        Contact Us
                    </Link>
                </footer>
            </div>
        </div>
    );
}
