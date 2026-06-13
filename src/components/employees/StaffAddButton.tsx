"use client";

import { useState } from "react";
import Link from "next/link";
import UpgradeModal from "../dashboard/UpgradeModal";

interface StaffAddButtonProps {
    isOwnerOrAdmin: boolean;
    currentCount: number;
    limit: number;
    isActive: boolean;
}

export default function StaffAddButton({ isOwnerOrAdmin, currentCount, limit, isActive }: StaffAddButtonProps) {
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    if (!isOwnerOrAdmin) return null;

    const isOverLimit = limit > 0 && currentCount >= limit;
    const isLocked = !isActive || isOverLimit;

    if (isLocked) {
        return (
            <>
                <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="h-[46px] px-6 bg-[var(--text-main)] text-[var(--bg-app)] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[var(--color-primary)] hover:text-white transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg group relative"
                >
                    <span className="material-symbols-outlined text-sm">person_add</span>
                    <span className="max-sm:hidden">Add Staff</span>
                    <span className="sm:hidden">Add</span>
                    
                    <div className="absolute -top-1 -right-1 size-4 bg-[var(--color-primary)] rounded-full border-2 border-[var(--bg-app)] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[8px] font-black text-[var(--bg-app)]">lock</span>
                    </div>
                </button>

                <UpgradeModal 
                    isOpen={showUpgradeModal}
                    onClose={() => setShowUpgradeModal(false)}
                    title={isOverLimit ? "Staff Limit Reached" : "Action Required"}
                    message={isOverLimit 
                        ? `You have reached the limit of ${limit} staff members for your current plan. Upgrade to onboard more team members and grow your operations.`
                        : "Your subscription is currently inactive. Reactivate your workspace to resume staff management."}
                    limit={limit}
                    current={currentCount}
                    featureName="Staff Member"
                />
            </>
        );
    }

    return (
        <Link
            href="/employees/new"
            className="h-[46px] px-6 bg-[var(--text-main)] text-[var(--bg-app)] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[var(--color-primary)] hover:text-white transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg"
        >
            <span className="material-symbols-outlined text-sm">person_add</span>
            <span className="max-sm:hidden">Add Staff</span>
            <span className="sm:hidden">Add</span>
        </Link>
    );
}
