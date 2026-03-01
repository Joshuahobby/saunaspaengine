import Link from "next/link";
import { SpaIndicator } from "@/components/ui/spa-indicator";

export default function BookingPortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <div className="layout-container flex h-full grow flex-col">
                {/* Header / Navigation */}
                <header className="flex items-center justify-between border-b border-primary/10 px-6 py-4 bg-white dark:bg-slate-900/50 md:px-20">
                    <div className="flex items-center gap-3">
                        <div className="text-primary">
                            <SpaIndicator />
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                            Sauna SPA Engine
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <nav className="hidden items-center gap-8 md:flex">
                            <Link
                                href="#"
                                className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-400"
                            >
                                Our Services
                            </Link>
                            <Link
                                href="#"
                                className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-400"
                            >
                                My Bookings
                            </Link>
                        </nav>
                        <Link
                            href="/login"
                            className="flex h-10 min-w-[100px] cursor-pointer items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-slate-900 shadow-sm transition-all hover:bg-primary/90"
                        >
                            Sign In
                        </Link>
                    </div>
                </header>

                <main className="flex flex-1 justify-center px-4 py-10">
                    <div className="layout-content-container flex w-full max-w-[800px] flex-col gap-8">
                        {children}
                    </div>
                </main>

                {/* Footer Support */}
                <footer className="flex justify-center gap-6 py-8 text-sm text-slate-400">
                    <Link href="#" className="transition-colors hover:text-primary">
                        Help Center
                    </Link>
                    <Link href="#" className="transition-colors hover:text-primary">
                        Cancelation Policy
                    </Link>
                    <Link href="#" className="transition-colors hover:text-primary">
                        Contact Spa
                    </Link>
                </footer>
            </div>
        </div>
    );
}
