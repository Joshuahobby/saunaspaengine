"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface BranchFilterProps {
    branches: { id: string; name: string }[];
    selectedBranchId?: string;
}

export function BranchFilter({ branches, selectedBranchId }: BranchFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        const value = e.target.value;
        
        if (value) {
            params.set('branchId', value);
        } else {
            params.delete('branchId');
        }
        
        router.push(`/employees?${params.toString()}`);
    };

    return (
        <div className="relative w-full md:w-48">
            <select 
                aria-label="Filter by branch location"
                defaultValue={selectedBranchId || ""}
                onChange={handleChange}
                className="w-full pl-4 pr-10 py-2 bg-[var(--bg-surface-muted)] border-[var(--border-muted)] border rounded-xl text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-main)] appearance-none cursor-pointer"
            >
                <option value="">All Branches</option>
                {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none opacity-40">expand_more</span>
        </div>
    );
}
