import { ReactNode } from "react";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--bg-app)] font-inter text-[var(--text-main)] relative overflow-hidden">
            {/* Atmospheric Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)] opacity-[0.03] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)] opacity-[0.02] rounded-full blur-[120px] pointer-events-none animate-pulse [animation-delay:2s]"></div>
            
            {/* Main Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Minimal Header */}
                <header className="px-6 py-6 md:px-12 flex items-center justify-between border-b border-[var(--border-muted)]/50 bg-[var(--bg-card)]/30 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-[var(--bg-app)] shadow-lg shadow-[var(--color-primary)]/20">
                            <span className="material-symbols-outlined text-xl font-bold">spa</span>
                        </div>
                        <h1 className="text-lg font-display font-black tracking-tight uppercase">
                            Sauna <span className="text-[var(--color-primary)]">SPA</span> Engine
                        </h1>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-surface-muted)]/10 px-3 py-1.5 rounded-full border border-[var(--border-muted)]/50">
                            Commissioning Phase
                        </span>
                    </div>
                </header>

                <main className="flex-1 flex flex-col">
                    {children}
                </main>

                {/* Minimal Footer */}
                <footer className="px-8 py-6 border-t border-[var(--border-muted)]/30 text-center">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">
                        &copy; 2026 Sauna SPA Engine &bull; Operations Framework V1.0
                    </p>
                </footer>
            </div>
        </div>
    );
}
