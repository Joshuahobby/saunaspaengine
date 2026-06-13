"use client";

interface StepProps {
    branch: {
        id: string;
        name: string | null;
    };
    onNext: () => void;
}

export function Step0Welcome({ branch, onNext }: StepProps) {
    return (
        <div className="flex flex-col items-center text-center gap-10 py-10">
            <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 shadow-sm animate-bounce">
                    <span className="material-symbols-outlined !text-sm">celebration</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Branch Account Created</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-display font-black text-[var(--text-main)] tracking-tight leading-tight">
                    Welcome to <br/>
                    <span className="text-[var(--color-primary)]">Sauna SPA</span>
                </h2>
                
                <p className="text-base text-[var(--text-muted)] font-bold opacity-70 leading-relaxed mx-auto max-w-xl">
                    &ldquo;{branch.name || 'Your Spa'}&rdquo; is now registered. We&apos;ll guide you through setting up your services, team, and operations in under 5 minutes.
                </p>
            </div>

            {/* Video Placeholder Box */}
            <div role="button" aria-label="Watch Setup Guide Video" className="w-full max-w-[720px] aspect-video bg-[var(--bg-card)] rounded-[2rem] border border-[var(--border-muted)] overflow-hidden shadow-2xl relative group cursor-pointer group/video">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent flex items-center justify-center">
                    <div title="Play Video" className="size-20 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-[var(--bg-app)] shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.5)] group-hover/video:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-4xl font-bold translate-x-0.5">play_arrow</span>
                    </div>
                </div>
                {/* Visual Flair Layer */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-[9px] font-bold text-white uppercase tracking-widest">
                        Setup Guide: 1:24
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-6 mt-4">
                <button 
                    onClick={onNext}
                    className="px-12 py-5 bg-[var(--text-main)] text-[var(--bg-app)] rounded-2xl font-bold text-lg shadow-2xl shadow-black/20 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-4 group"
                >
                    Start Setup
                    <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] opacity-40">
                    Trusted by many wellness centers across the region
                </p>
            </div>
        </div>
    );
}
