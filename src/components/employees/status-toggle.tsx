"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StatusToggleProps {
    employeeId: string;
    initialStatus: string;
}

export function StatusToggle({ employeeId, initialStatus }: StatusToggleProps) {
    const [status, setStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const toggleStatus = async () => {
        setIsLoading(true);
        const nextStatus = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

        try {
            const res = await fetch(`/api/employees/${employeeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });

            if (res.ok) {
                setStatus(nextStatus);
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to toggle employee status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleStatus}
            disabled={isLoading}
            className={`flex items-center gap-2 group p-1 pr-3 rounded-full transition-all border ${status === 'ACTIVE'
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    : 'bg-slate-50 border-slate-100 text-slate-500'
                } hover:shadow-sm disabled:opacity-50`}
        >
            <div className={`size-6 rounded-full flex items-center justify-center ${status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'
                }`}>
                <span className="material-symbols-outlined text-[14px] text-white">
                    {status === 'ACTIVE' ? 'check' : 'close'}
                </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider">
                {isLoading ? '...' : status}
            </span>
        </button>
    );
}
