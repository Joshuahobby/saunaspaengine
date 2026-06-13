import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const CORPORATE_CATEGORIES = [
    {
        title: "Company Profile",
        description: "Manage your main office records, brand visuals (logos/colors), and digital security.",
        icon: "business",
        href: "/settings/corporate",
        color: "bg-slate-800",
        badge: "Identity"
    },
    {
        title: "Rules & Fiscal Setup",
        description: "Set up international tax, region rules, and automated VAT logic.",
        icon: "public",
        href: "/settings/compliance-regions",
        color: "bg-indigo-600",
        badge: "Legal"
    }
];

const SETTINGS_CATEGORIES = [
    {
        title: "Safe & Secure",
        description: "Physical health audits, safety checklists, and QR access protocols.",
        icon: "verified_user",
        href: "/settings/compliance",
        color: "bg-red-500",
        badge: "Safety"
    },
    {
        title: "Daily Routine",
        description: "Manage opening hours, holiday schedules, and client reviews.",
        icon: "schedule",
        href: "/settings/operations",
        color: "bg-emerald-500",
        badge: "Pulse"
    },
    {
        title: "Records & History",
        description: "Access immutable audit logs and perform bulk data transfers.",
        icon: "history_edu",
        href: "/settings/records",
        color: "bg-blue-500",
        badge: "Transparency"
    },
    {
        title: "Team & Permissions",
        description: "Manage staff access levels, roles, and administrative security.",
        icon: "admin_panel_settings",
        href: "/settings/roles",
        color: "bg-purple-500",
        badge: "Access"
    }
];

export const metadata = {
    title: "System Settings Hub | Sauna SPA Engine",
};

export default async function SettingsHubPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const isOwner = session.user.role === "OWNER";

    return (
        <main className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
            <div className="max-w-6xl mx-auto space-y-16">
                {/* Header Section */}
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter font-serif text-[var(--color-primary)]">
                        Business <span className="text-[var(--text-main)]">Setup.</span>
                    </h1>
                    <p className="text-sm font-bold text-[var(--text-muted)] opacity-60 leading-relaxed">
                        Global configuration and administrative mechanics for your global branch network.
                    </p>
                </div>

                {/* Section 1: Corporate Governance (Owners Only) */}
                {isOwner && (
                    <div className="space-y-8">
                        <div className="px-4 border-l-4 border-[var(--color-primary)]">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-main)]">Main Office Setup</h2>
                            <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 opacity-50">Headquarters Management</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {CORPORATE_CATEGORIES.map((cat, idx) => (
                                <Link 
                                    key={idx} 
                                    href={cat.href}
                                    className="group relative glass-card rounded-[2.5rem] p-10 border border-[var(--border-muted)] hover:border-[var(--color-primary)] transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 flex flex-col gap-8 bg-gradient-to-br from-[var(--bg-surface-muted)]/10 to-transparent"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className={`size-16 rounded-2xl ${cat.color} flex items-center justify-center text-white shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                            <span className="material-symbols-outlined text-3xl font-black">{cat.icon}</span>
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 bg-[var(--bg-app)] border border-[var(--border-muted)] rounded-xl text-[var(--text-muted)]">
                                            {cat.badge}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                                            {cat.title}
                                        </h3>
                                        <p className="text-sm text-[var(--text-muted)] mt-4 leading-relaxed font-bold opacity-70">
                                            {cat.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section 2: Operational Settings (All) */}
                <div className="space-y-8">
                    <div className="px-4 border-l-4 border-emerald-500">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-main)]">Branch Settings</h2>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 opacity-50">Local rules for specific locations</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SETTINGS_CATEGORIES.map((cat, idx) => (
                            <Link 
                                key={idx} 
                                href={cat.href}
                                className="group relative glass-card rounded-3xl p-8 border border-[var(--border-muted)] hover:border-[var(--color-primary)] transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 flex flex-col gap-6"
                            >
                                <div className="flex justify-between items-start">
                                    <div className={`size-14 rounded-2xl ${cat.color} flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                        <span className="material-symbols-outlined text-3xl font-black">{cat.icon}</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-[var(--bg-app)] border border-[var(--border-muted)] rounded-full text-[var(--text-muted)]">
                                        {cat.badge}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold font-serif text-[var(--text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                                        {cat.title}
                                    </h3>
                                    <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed font-bold">
                                        {cat.description}
                                    </p>
                                </div>

                                <div className="mt-auto flex items-center gap-2 text-[var(--color-primary)] font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                    Configure Module
                                    <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Footer Section */}
                <div className="p-10 glass-card border border-[var(--border-muted)] rounded-[2.5rem] flex flex-col lg:flex-row items-center justify-between gap-10 bg-[var(--bg-surface-muted)]/5 group/footer">
                    <div className="flex items-center gap-8">
                        <div className="size-20 rounded-[2rem] bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 flex items-center justify-center group-hover/footer:rotate-12 transition-transform duration-700">
                            <span className="material-symbols-outlined text-[var(--color-primary)] text-5xl animate-pulse">history</span>
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold font-serif mb-2">History of Changes</h4>
                            <p className="text-sm text-[var(--text-muted)] max-w-xl font-bold leading-relaxed">
                                We track every change made across your business. You can see who changed what 
                                and when, ensuring your business stays safe and organized.
                            </p>
                        </div>
                    </div>
                    <Link 
                        href="/settings/records"
                        className="px-10 py-5 rounded-2xl bg-[var(--text-main)] text-[var(--bg-app)] font-black uppercase tracking-widest text-xs hover:bg-[var(--color-primary)] transition-all hover:px-12 active:scale-95 whitespace-nowrap"
                    >
                        Review Records & History
                    </Link>
                </div>
            </div>
        </main>
    );
}
