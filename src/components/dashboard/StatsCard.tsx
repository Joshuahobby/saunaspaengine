import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: string; // String for material design icons
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export default function StatsCard({ title, value, icon, description, trend }: StatsCardProps) {
    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 transition-all duration-700 group">
            <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-[var(--bg-surface-muted)]/50 border border-[var(--border-muted)] rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                    <span className="material-symbols-outlined text-3xl font-bold text-[var(--color-primary)] italic">{icon}</span>
                </div>
                {trend && (
                    <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full border italic animate-pulse ${trend.isPositive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        }`}>
                        {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 italic opacity-60">{title}</p>
                <h3 className="text-4xl font-serif font-bold text-[var(--text-main)] italic tracking-tight">{value}</h3>
                {description && <p className="text-[var(--text-muted)] text-xs mt-3 italic font-medium opacity-80">{description}</p>}
            </div>
        </div>
    );
}
