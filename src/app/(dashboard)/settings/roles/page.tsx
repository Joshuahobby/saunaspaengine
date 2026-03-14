"use client";

import React from "react";

export default function RolesAndPermissionsPage() {
    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-12 md:px-10">
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
                        <button className="flex items-center justify-center gap-3 rounded-2xl bg-[var(--text-main)] px-8 py-4 font-bold text-[var(--bg-app)] shadow-xl shadow-[var(--text-main)]/10 transition-all hover:scale-[1.05]">
                            <span className="material-symbols-outlined font-bold">add_moderator</span>
                            Define New Role
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon="shield_person" label="Archetypes" value="4" />
                <StatCard icon="key" label="Active Keys" value="32" />
                <StatCard icon="admin_panel_settings" label="Governors" value="2" />
                <StatCard icon="security" label="Trust Level" value="Premium" />
                </div>

                {/* Roles Matrix Table */}
                <div className="overflow-hidden rounded-[2.5rem] border border-[var(--border-muted)] bg-[var(--bg-card)] shadow-sm group/matrix">
                    <div className="flex items-center justify-between border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10 px-10 py-8">
                        <div>
                            <h2 className="text-2xl font-display font-bold text-[var(--text-main)]">Authority Configuration Matrix</h2>
                            <p className="text-sm font-bold text-[var(--text-muted)] opacity-60 mt-1">Cross-referencing operational capabilities across archetypes.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative group">
                                <select title="Select Environment" className="h-12 px-6 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/50 text-xs font-bold text-[var(--text-main)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all appearance-none pr-10">
                                    <option>Production Environment</option>
                                    <option>Development Sandbox</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none text-sm font-bold">expand_more</span>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-[var(--bg-surface-muted)]/5">
                                <tr className="border-b border-[var(--border-muted)]">
                                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Foundational Modules</th>
                                    <th className="px-6 py-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-main)]">Admin</th>
                                    <th className="px-6 py-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-main)]">Manager</th>
                                    <th className="px-6 py-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-main)]">Receptionist</th>
                                    <th className="px-6 py-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-main)]">Employee</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-muted)]/50">
                                <SectionDivider label="Financial Management" />
                                <PermissionRow module="Process Refunds" admin manager reception={false} employee={false} />
                                <PermissionRow module="View Revenue Reports" admin manager reception={false} employee={false} />
                                <PermissionRow module="Override Pricing" admin manager={false} reception={false} employee={false} />
                                
                                <SectionDivider label="Operations & Logistics" />
                                <PermissionRow module="Cancel Bookings" admin manager reception employee={false} />
                                <PermissionRow module="Manage Inventory" admin manager reception={false} employee={false} />
                                <PermissionRow module="Update Equipment" admin manager reception employee />
                                
                                <SectionDivider label="Staff & HR" />
                                <PermissionRow module="View Audit Logs" admin manager={false} reception={false} employee={false} />
                                <PermissionRow module="Edit Staff Profiles" admin manager={false} reception={false} employee={false} />
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-[var(--bg-surface-muted)]/10 px-10 py-8 border-t border-[var(--border-muted)]">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-xs font-bold text-[var(--text-muted)] opacity-60">Architecting the flow of authority ensuring operational excellence.</p>
                            <button className="px-10 py-3 rounded-2xl border border-[var(--border-muted)] text-[var(--text-main)] font-bold text-sm hover:bg-[var(--bg-card)] transition-all">Reset Matrix Defaults</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-[var(--border-muted)] bg-[var(--bg-card)] p-10 text-center shadow-sm group hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 transition-all duration-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-[0.02] rounded-full blur-2xl -mr-16 -mt-16 group-hover:opacity-[0.05] transition-opacity"></div>
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm relative z-10">
                <span className="material-symbols-outlined text-4xl font-bold text-[var(--color-primary)]">{icon}</span>
            </div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-40 group-hover:opacity-60 transition-opacity z-10">{label}</p>
            <p className="text-5xl font-display font-bold text-[var(--text-main)] tracking-tighter z-10">{value}</p>
        </div>
    );
}

function SectionDivider({ label }: { label: string }) {
    return (
        <tr className="bg-[var(--bg-surface-muted)]/20 border-y border-[var(--border-muted)]">
            <td colSpan={5} className="px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-80">{label}</td>
        </tr>
    );
}

function PermissionRow({
    module,
    admin,
    manager,
    reception,
    employee,
}: {
    module: string;
    admin: boolean;
    manager: boolean;
    reception: boolean;
    employee: boolean;
}) {
    return (
        <tr className="group transition-all hover:bg-[var(--bg-surface-muted)]/10">
            <td className="px-10 py-8 text-lg font-display font-bold text-[var(--text-main)]">
                {module}
            </td>
            <td className="px-6 py-8 text-center">
                <StatusIcon active={admin} />
            </td>
            <td className="px-6 py-8 text-center">
                <StatusIcon active={manager} />
            </td>
            <td className="px-6 py-8 text-center">
                <StatusIcon active={reception} />
            </td>
            <td className="px-6 py-8 text-center">
                <StatusIcon active={employee} />
            </td>
        </tr>
    );
}

function StatusIcon({ active }: { active: boolean }) {
    return (
        <div className="flex justify-center group-hover:scale-110 transition-transform duration-500">
            <div className={`p-1.5 rounded-full border-2 ${active ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'border-[var(--border-muted)] grayscale opacity-20'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${active ? 'bg-[var(--color-primary)] text-[var(--bg-app)]' : 'bg-[var(--bg-surface-muted)] text-[var(--text-muted)]'}`}>
                    {active ? (
                        <span className="material-symbols-outlined text-sm font-bold">verified</span>
                    ) : (
                        <span className="material-symbols-outlined text-sm font-bold">block</span>
                    )}
                </div>
            </div>
        </div>
    );
}
