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
        <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="space-y-2 max-w-lg">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 shadow-sm animate-bounce">
                    <span className="material-symbols-outlined !text-[10px]">celebration</span>
                    <span className="text-[8px] font-bold uppercase tracking-widest">Branch Account Created</span>
                </div>
                
                <h2 className="text-xl font-display font-black text-[var(--text-main)] tracking-tight leading-tight">
                    Welcome to <span className="text-[var(--color-primary)]">Sauna SPA</span>
                </h2>
                
                <p className="text-xs text-[var(--text-muted)] font-medium opacity-80 leading-relaxed mx-auto max-w-[320px]">
                    &ldquo;{branch.name || 'Your Spa'}&rdquo; is registered. Let's set up your services and team in under 5 minutes.
                </p>
            </div>

            {/* Video Placeholder Box */}
            <div role="button" aria-label="Watch Setup Guide Video" className="w-full max-w-[400px] aspect-video bg-[var(--bg-card)] rounded-xl border border-[var(--border-muted)] overflow-hidden shadow-sm relative group cursor-pointer group/video">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent flex items-center justify-center">
                    <div title="Play Video" className="size-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white shadow-sm group-hover/video:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-xl font-bold translate-x-0.5">play_arrow</span>
                    </div>
                </div>
                {/* Visual Flair Layer */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="px-2 py-0.5 bg-black/40 backdrop-blur-md rounded border border-white/10 text-[8px] font-bold text-white uppercase tracking-widest">
                        Setup Guide: 1:24
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-3 mt-1">
                <button 
                    onClick={onNext}
                    className="h-10 px-6 bg-[var(--text-main)] text-[var(--bg-app)] rounded-lg font-black text-xs uppercase tracking-[0.1em] shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 group"
                >
                    Start Setup
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </button>
                <p className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] opacity-40">
                    Trusted by wellness centers
                </p>
            </div>
        </div>
    );
}
