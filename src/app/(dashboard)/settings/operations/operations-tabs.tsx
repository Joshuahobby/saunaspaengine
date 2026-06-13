"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function OperationsTabs({ activeTab }: { activeTab: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleTabChange = (tab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex w-full overflow-x-auto no-scrollbar pb-1">
            <div className="flex gap-2 p-1 bg-[var(--bg-surface-muted)]/30 rounded-2xl w-fit border border-[var(--border-muted)] whitespace-nowrap">
                <button 
                    onClick={() => handleTabChange('hours')}
                    className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'hours' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
                >
                    Operating Schedule
                </button>
                <button 
                    onClick={() => handleTabChange('feedback')}
                    className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'feedback' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
                >
                    Client Reviews
                </button>
            </div>
        </div>
    );
}
