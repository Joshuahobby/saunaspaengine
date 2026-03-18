import LoginForm from "@/components/auth/login-form";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function LoginPage() {
    return (
        <div className="layout-container flex h-full grow flex-col bg-[var(--bg-app)]">
            {/* Navigation Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[var(--border-main)] px-6 md:px-10 py-5 bg-[var(--bg-app)]/80 backdrop-blur-xl sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="size-10 text-white flex items-center justify-center bg-[var(--color-primary)] rounded-xl shadow-sm group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-2xl font-black">spa</span>
                    </div>
                    <div>
                        <h2 className="text-[var(--text-main)] text-lg font-black font-serif leading-tight tracking-tight italic group-hover:text-[var(--color-primary)] transition-colors">
                            Sauna <span className="not-italic text-[var(--color-primary)]">SPA</span> Engine
                        </h2>
                    </div>
                </Link>
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/help"
                            className="text-[var(--text-muted)] text-xs font-black uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors"
                        >
                            Help Center
                        </Link>
                    </div>
                    <ThemeToggle />
                    <Link
                        href="/"
                        className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-6 bg-[var(--bg-surface-muted)] text-[var(--text-main)] text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[var(--border-muted)] border border-[var(--border-main)]"
                    >
                        Home
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-[480px] flex flex-col gap-6">

                    {/* Login Form Component */}
                    <LoginForm />

                    {/* Footer Links */}
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[var(--text-muted)] text-xs font-medium opacity-60">
                        <Link href="/privacy" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-[var(--color-primary)] transition-colors">Cookie Settings</Link>
                        <span className="hidden md:inline text-[var(--border-muted)]">•</span>
                        <p>© 2026 Sauna SPA Engine</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
