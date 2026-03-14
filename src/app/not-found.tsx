import Link from "next/link";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[var(--bg-app)] text-[var(--text-main)] overflow-x-hidden">
            <header className="flex items-center justify-between border-b border-[var(--border-muted)] px-6 lg:px-40 py-4 bg-[var(--bg-card)]">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">spa</span>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight">Sauna SPA Engine</h2>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/support" className="hidden md:flex items-center justify-center rounded-lg h-10 px-4 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-bold hover:bg-[var(--color-primary)]/20 transition-all">Support</Link>
                    <Link href="/login" className="rounded-lg h-10 px-5 bg-[var(--color-primary)] text-white text-sm font-bold shadow-lg shadow-[var(--color-primary)]/20 hover:brightness-105 transition-all flex items-center justify-center">Profile</Link>
                </div>
            </header>
            <main className="flex flex-col items-center justify-center flex-1 px-4 py-12 md:py-24 text-center">
                <div className="relative mb-8 w-full max-w-lg">
                    <div className="absolute -inset-4 bg-[var(--color-primary)]/5 rounded-full blur-3xl opacity-50"></div>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[var(--color-primary)]/10 border border-white/20 bg-[var(--bg-surface-muted)]/30 aspect-video flex items-end justify-center pb-8">
                        <span className="text-8xl font-black text-[var(--color-primary)] opacity-20 select-none">404</span>
                    </div>
                </div>
                <div className="flex max-w-[560px] flex-col items-center gap-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Lost in the <span className="text-[var(--color-primary)] italic">Mist?</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[var(--text-muted)] font-medium max-w-[450px]">
                        Oops! This page has gone for a steam... and we can&apos;t find it.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                    <Link href="/dashboard" className="flex min-w-[200px] items-center justify-center rounded-xl h-14 px-8 bg-[var(--color-primary)] text-white text-base font-bold shadow-xl shadow-[var(--color-primary)]/30 hover:-translate-y-0.5 transition-all">
                        <span className="material-symbols-outlined mr-2">dashboard</span>
                        Back to Dashboard
                    </Link>
                    <Link href="/support" className="flex min-w-[200px] items-center justify-center rounded-xl h-14 px-8 bg-[var(--bg-card)] border-2 border-[var(--color-primary)]/20 text-base font-bold hover:border-[var(--color-primary)] transition-all">
                        <span className="material-symbols-outlined mr-2">help_outline</span>
                        Contact Support
                    </Link>
                </div>
                <p className="mt-12 text-[var(--text-muted)] text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Error Code: NS-404-STEAM
                </p>
            </main>
            <footer className="flex flex-col gap-8 px-5 py-12 text-center border-t border-[var(--border-muted)]">
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                    <Link className="text-[var(--text-muted)] hover:text-[var(--color-primary)] text-sm font-medium transition-colors" href="#">Privacy Policy</Link>
                    <Link className="text-[var(--text-muted)] hover:text-[var(--color-primary)] text-sm font-medium transition-colors" href="#">Terms of Service</Link>
                    <Link className="text-[var(--text-muted)] hover:text-[var(--color-primary)] text-sm font-medium transition-colors" href="/status">System Status</Link>
                </div>
                <p className="text-[var(--text-muted)] text-xs">© 2026 Sauna SPA Engine Professional. All rights reserved.</p>
            </footer>
        </div>
    );
}
