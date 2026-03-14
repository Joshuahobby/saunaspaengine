import LoginForm from "@/components/auth/login-form";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function LoginPage() {
    return (
        <div className="layout-container flex h-full grow flex-col bg-[var(--bg-app)]">
            {/* Navigation Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[var(--border-main)] px-6 md:px-10 py-5 bg-[var(--bg-app)]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="size-10 text-white flex items-center justify-center bg-[var(--color-primary)] rounded-xl shadow-sm">
                        <span className="material-symbols-outlined text-2xl font-black">spa</span>
                    </div>
                    <div>
                        <h2 className="text-[var(--text-main)] text-lg font-black font-serif leading-tight tracking-tight italic">
                            Sauna <span className="not-italic text-[var(--color-primary)]">SPA</span> Engine
                        </h2>
                    </div>
                </div>
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
                    {/* Branding & Hero Image Card */}
                    <div className="overflow-hidden rounded-[2.5rem] group shadow-lg border border-[var(--border-muted)]">
                        <div className="bg-cover bg-center flex flex-col justify-end min-h-[260px] relative transition-transform duration-1000 group-hover:scale-105 bg-[linear-gradient(0deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.2)_100%),url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2070')]" >
                            <div className="p-10 relative z-10">
                                <span className="bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-4 inline-block shadow-xl shadow-[var(--color-primary)]/30">
                                    Staff Portal
                                </span>
                                <h1 className="text-white tracking-tight text-5xl font-black leading-tight font-serif italic">
                                    Pure <span className="not-italic text-[var(--color-primary)]">Serenity</span>
                                </h1>
                            </div>
                        </div>
                    </div>

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
