"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BranchStatusToggleProps {
    branchId: string;
    initialStatus: string;
}

export function BranchStatusToggle({ branchId, initialStatus }: BranchStatusToggleProps) {
    const [status, setStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const toggleStatus = async () => {
        setIsLoading(true);
        const nextStatus = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

        try {
            const res = await fetch(`/api/admin/businesses/branches/${branchId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });

            if (res.ok) {
                setStatus(nextStatus);
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to toggle branch status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                aria-label="Toggle Branch Status"
                type="checkbox"
                className="sr-only peer"
                checked={status === 'ACTIVE'}
                onChange={toggleStatus}
                disabled={isLoading}
            />
            <div className={`w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-primary)] ${isLoading ? 'opacity-50' : ''}`}></div>
        </label>
    );
}
