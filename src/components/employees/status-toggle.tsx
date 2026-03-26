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

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextStatus = e.target.value;
        if (!confirm(`Are you sure you want to change this employee's status to ${nextStatus}?`)) return;
        
        setIsLoading(true);

        try {
            const res = await fetch(`/api/employees/${employeeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });

            if (res.ok) {
                setStatus(nextStatus);
                router.refresh();
            } else {
                alert("Failed to update status.");
            }
        } catch (error) {
            console.error("Failed to update employee status:", error);
            alert("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative inline-block">
            <select
                aria-label="Employee Status"
                title="Employee Status"
                value={status}
                onChange={handleStatusChange}
                disabled={isLoading}
                className={`appearance-none focus:outline-none focus:ring-2 flex items-center pr-8 pl-3 py-1.5 rounded-full transition-all border text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-sm
                    ${status === 'ACTIVE'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 focus:ring-emerald-500/20'
                        : status === 'ARCHIVED'
                            ? 'bg-red-50 border-red-200 text-red-700 focus:ring-red-500/20'
                            : 'bg-slate-50 border-slate-200 text-slate-500 focus:ring-slate-500/20'
                    } disabled:opacity-50`}
            >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive / Leave</option>
                <option value="ARCHIVED">Archived</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                {isLoading ? (
                    <span className="material-symbols-outlined text-[14px] animate-spin opacity-50">sync</span>
                ) : (
                    <span className="material-symbols-outlined text-[14px] opacity-50">arrow_drop_down</span>
                )}
            </div>
        </div>
    );
}
