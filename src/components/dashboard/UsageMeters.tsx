import React from "react";

interface UsageMeterProps {
    label: string;
    current: number;
    limit: number;
    icon: string;
    showLimit?: boolean;
}

export function UsageMeter({ label, current, limit, icon, showLimit = true }: UsageMeterProps) {
    const isUnlimited = limit === 0;
    const percentage = isUnlimited ? 0 : Math.min(100, (current / limit) * 100);
    const isAtLimit = !isUnlimited && current >= limit;
    const isNearLimit = !isUnlimited && current >= limit * 0.8;

    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-xl flex items-center justify-center ${isAtLimit ? 'bg-red-500/10 text-red-500' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'}`}>
                        <span className="material-symbols-outlined text-xl">{icon}</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">{label}</p>
                        <p className="text-xl font-black text-[var(--text-main)]">
                            {current}
                            {showLimit && (
                                <span className="text-sm font-medium text-[var(--text-muted)] ml-1 opacity-40">
                                    / {isUnlimited ? "∞" : limit}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                {isAtLimit && (
                    <span className="px-3 py-1 bg-red-500 text-white text-[8px] font-black uppercase rounded-lg tracking-widest">
                        LIMIT REACHED
                    </span>
                )}
            </div>

            <div className="h-2 w-full bg-[var(--bg-surface-muted)] rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 ${
                        isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-orange-500' : 'bg-[var(--color-primary)]'
                    }`}
                    style={{ width: `${isUnlimited ? (current > 0 ? 10 : 0) : percentage}%` }}
                />
            </div>
            
            {!isUnlimited && isNearLimit && !isAtLimit && (
                <p className="text-[9px] font-bold text-orange-500 uppercase tracking-tight">
                    Approaching limit. Consider upgrading soon.
                </p>
            )}
        </div>
    );
}

interface UsageMetersContainerProps {
    usage: {
        employees: number;
        services: number;
        monthlyCheckIns: number;
    };
    limits: {
        employeeLimit: number;
        serviceLimit: number;
        checkInLimit: number;
    };
}

export default function UsageMeters({ usage, limits }: UsageMetersContainerProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UsageMeter 
                label="Staff Members" 
                current={usage.employees} 
                limit={limits.employeeLimit} 
                icon="badge"
            />
            <UsageMeter 
                label="Service Menu Items" 
                current={usage.services} 
                limit={limits.serviceLimit} 
                icon="spa"
            />
            <UsageMeter 
                label="Monthly Check-ins" 
                current={usage.monthlyCheckIns} 
                limit={limits.checkInLimit} 
                icon="sensors"
            />
        </div>
    );
}
