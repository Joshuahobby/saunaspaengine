"use client";

import React, { useState } from "react";
import { UserRole } from "@prisma/client";
import { 
    PermissionKey, 
    SYSTEM_PERMISSIONS, 
    DEFAULT_ROLE_PERMISSIONS, 
    PermissionMatrix 
} from "@/lib/permissions";
import { updateRolePermissionsAction } from "./actions";

interface MatrixClientProps {
    initialMatrix: PermissionMatrix | null;
}

const ROLES: UserRole[] = ["ADMIN", "MANAGER", "RECEPTIONIST", "EMPLOYEE"];

export default function MatrixClient({ initialMatrix }: MatrixClientProps) {
    const [matrix, setMatrix] = useState<PermissionMatrix>(initialMatrix || DEFAULT_ROLE_PERMISSIONS);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const togglePermission = (role: UserRole, permission: PermissionKey) => {
        if (role === "ADMIN") return; // Admin permissions are immutable (always full)
        
        setMatrix(prev => {
            const rolePermissions = prev[role] || [];
            const newPermissions = rolePermissions.includes(permission)
                ? rolePermissions.filter(p => p !== permission)
                : [...rolePermissions, permission];
            
            return {
                ...prev,
                [role]: newPermissions
            };
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateRolePermissionsAction(matrix);
            setLastSaved(new Date());
        } catch (error) {
            console.error("Failed to save matrix:", error);
            alert("Security breach detected or failed validation. Check audit logs.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        if (confirm("Reset to sanctuary defaults? This will erase all custom overrides.")) {
            setMatrix(DEFAULT_ROLE_PERMISSIONS);
        }
    };

    return (
        <div className="flex flex-col gap-12">
            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                <div>
                    <h1 className="text-4xl font-display font-bold leading-tight tracking-tight text-[var(--text-main)]">
                        Access <span className="text-[var(--color-primary)] opacity-50">&</span> Permission Matrix
                    </h1>
                    <p className="text-lg font-bold text-[var(--text-muted)] mt-2 opacity-80">
                        Govern the digital hierarchy of your sanctuary with precision.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center justify-center gap-3 rounded-2xl border border-[var(--border-muted)] px-6 py-4 font-bold text-[var(--text-main)] transition-all hover:bg-[var(--bg-card)]">
                        <span className="material-symbols-outlined font-bold">history</span>
                        Audit Trail
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-3 rounded-2xl bg-[var(--text-main)] px-8 py-4 font-bold text-[var(--bg-app)] shadow-xl shadow-[var(--text-main)]/10 transition-all hover:scale-[1.05] disabled:opacity-50 disabled:scale-100"
                    >
                        <span className="material-symbols-outlined font-bold">
                            {isSaving ? "sync" : "save_as"}
                        </span>
                        {isSaving ? "Safeguarding..." : "Finalize Changes"}
                    </button>
                </div>
            </div>

            {/* Matrix Console */}
            <div className="overflow-hidden rounded-[2.5rem] border border-[var(--border-muted)] bg-[var(--bg-card)] shadow-sm group/matrix">
                <div className="flex items-center justify-between border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10 px-10 py-8">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-[var(--text-main)]">Authority Configuration Matrix</h2>
                        <p className="text-sm font-bold text-[var(--text-muted)] opacity-60 mt-1">
                            {lastSaved ? `Last configuration synchronized at ${lastSaved.toLocaleTimeString()}` : "Cross-referencing operational capabilities across archetypes."}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={handleReset}
                            className="h-12 px-6 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/50 text-[10px] font-black uppercase tracking-widest text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-all"
                        >
                            Reset Defaults
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead className="bg-[var(--bg-surface-muted)]/5">
                            <tr className="border-b border-[var(--border-muted)]">
                                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Foundational Modules</th>
                                {ROLES.map(role => (
                                    <th key={role} className="px-6 py-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-main)]">
                                        {role}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]/50">
                            {/* Grouping by Category */}
                            {["Financial Management", "Operations & Logistics", "Staff & HR"].map(category => (
                                <React.Fragment key={category}>
                                    <tr className="bg-[var(--bg-surface-muted)]/20 border-y border-[var(--border-muted)]">
                                        <td colSpan={ROLES.length + 1} className="px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-80">{category}</td>
                                    </tr>
                                    {SYSTEM_PERMISSIONS.filter(p => p.category === category).map(permission => (
                                        <tr key={permission.key} className="group transition-all hover:bg-[var(--bg-surface-muted)]/10">
                                            <td className="px-10 py-8 text-lg font-display font-bold text-[var(--text-main)]">
                                                {permission.label}
                                            </td>
                                            {ROLES.map(role => (
                                                <td key={role} className="px-6 py-8 text-center">
                                                    <PermissionToggle 
                                                        active={role === "ADMIN" || (matrix[role] as PermissionKey[])?.includes(permission.key)}
                                                        disabled={role === "ADMIN"}
                                                        onClick={() => togglePermission(role, permission.key)}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function PermissionToggle({ active, disabled, onClick }: { active: boolean; disabled?: boolean; onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className={`flex justify-center mx-auto transition-all duration-500 ${disabled ? 'cursor-default' : 'hover:scale-110 active:scale-95'}`}
        >
            <div className={`p-1.5 rounded-full border-2 ${active ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'border-[var(--border-muted)] grayscale opacity-20'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${active ? 'bg-[var(--color-primary)] text-[var(--bg-app)]' : 'bg-[var(--bg-surface-muted)] text-[var(--text-muted)]'}`}>
                    {active ? (
                        <span className="material-symbols-outlined text-sm font-bold">verified</span>
                    ) : (
                        <span className="material-symbols-outlined text-sm font-bold">block</span>
                    )}
                </div>
            </div>
        </button>
    );
}
