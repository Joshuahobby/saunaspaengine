"use client";

import React, { useState } from "react";

const TABS = [
    { id: "admin", icon: "shield_person", label: "Admin Support" },
    { id: "manager", icon: "branch_center", label: "Branch Manager Guide" },
    { id: "employee", icon: "groups", label: "Employee FAQs" },
];

const SECTIONS: Record<string, { title: string; count: number; items: { q: string; a?: string }[] }[]> = {
    admin: [
        {
            title: "Account & System Administration", count: 12, items: [
                { q: "How to reset a member's entry QR code?", a: "To reset a QR code, navigate to the Members tab, search for the specific user, and click 'Regenerate Access Key'. The user will automatically receive their new QR code via the mobile app and email." },
                { q: "Managing staff roles and granular permissions" },
                { q: "Integrating third-party payment gateways" },
            ]
        },
        {
            title: "Growth & Reporting", count: 8, items: [
                { q: "How to manage multi-branch reporting?", a: "Multi-branch reporting can be accessed via the Global Reports dashboard. You can toggle between specific locations or view aggregated revenue and traffic data for your entire franchise network." },
                { q: "Setting up automated loyalty campaigns" },
            ]
        },
    ],
    manager: [
        {
            title: "Branch Setup", count: 6, items: [
                { q: "How to complete the onboarding checklist?", a: "Follow the step-by-step onboarding wizard that appears after your first login. It will guide you through branch profile setup, service creation, employee invitations, and QR code generation." },
                { q: "Setting up your first branch location" },
            ]
        },
    ],
    employee: [
        {
            title: "Daily Operations", count: 10, items: [
                { q: "How to check in a client using QR scanner?", a: "Open the QR Scanner from the sidebar or press the shortcut key. Point the camera at the client's QR code. The system will automatically validate membership and log the check-in." },
                { q: "Recording a new service session" },
            ]
        },
    ],
};

const RESOURCES = [
    { icon: "book", label: "Knowledge Base", active: true },
    { icon: "play_circle", label: "Tutorial Videos", active: false },
    { icon: "description", label: "API Documentation", active: false },
    { icon: "update", label: "Changelog", active: false },
];

export function SupportContent() {
    const [activeTab, setActiveTab] = useState("admin");
    const [expandedQ, setExpandedQ] = useState<string | null>(null);

    return (
        <div className="max-w-[1280px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-12">
            {/* Sidebar */}
            <aside className="lg:col-span-3 space-y-8">
                <div className="bg-[var(--bg-card)] rounded-xl p-6 shadow-sm border border-[var(--border-muted)]">
                    <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-[var(--text-muted)]">Resources</h3>
                    <nav className="space-y-2">
                        {RESOURCES.map((r) => (
                            <a key={r.label} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${r.active ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium" : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)]/30"}`} href="#">
                                <span className="material-symbols-outlined text-[20px]">{r.icon}</span>
                                {r.label}
                            </a>
                        ))}
                    </nav>
                </div>
                {/* Quick Contact */}
                <div className="bg-[var(--color-primary)] rounded-xl p-6 shadow-lg text-white">
                    <h3 className="font-bold text-lg mb-4">Still need help?</h3>
                    <p className="text-white/80 text-sm mb-6 leading-relaxed">Our support team is available 24/7 to help you with any technical issues.</p>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-center gap-2 bg-white text-[var(--color-primary)] font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                            <span className="material-symbols-outlined">chat</span> Live Chat
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 bg-white/20 border border-white/30 text-white font-bold py-3 rounded-lg hover:bg-white/30 transition-colors">
                            <span className="material-symbols-outlined">mail</span> Email Support
                        </button>
                    </div>
                </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-9">
                {/* Tabs */}
                <div className="flex border-b border-[var(--border-muted)] gap-8 mb-8 overflow-x-auto">
                    {TABS.map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 pb-4 font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]" : "border-b-2 border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}>
                            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* FAQ Content */}
                <div className="space-y-8">
                    {(SECTIONS[activeTab] || []).map((section) => (
                        <section key={section.title}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">{section.title}</h2>
                                <span className="text-sm text-[var(--text-muted)]">{section.count} Articles</span>
                            </div>
                            <div className="space-y-4">
                                {section.items.map((item) => (
                                    <div key={item.q} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-muted)] overflow-hidden shadow-sm">
                                        <button onClick={() => setExpandedQ(expandedQ === item.q ? null : item.q)} className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--bg-surface-muted)]/10 transition-colors">
                                            <span className="font-semibold">{item.q}</span>
                                            <span className={`material-symbols-outlined text-[var(--text-muted)] transition-transform ${expandedQ === item.q ? "rotate-180" : ""}`}>expand_more</span>
                                        </button>
                                        {expandedQ === item.q && item.a && (
                                            <div className="px-5 pb-5 text-[var(--text-muted)] leading-relaxed">{item.a}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    {/* Video Tutorial Banner */}
                    <section className="mt-12 bg-slate-900 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-xl">
                        <div className="p-8 md:w-3/5 flex flex-col justify-center">
                            <span className="text-[var(--color-primary)] font-bold text-sm tracking-widest uppercase mb-2">New Feature</span>
                            <h3 className="text-white text-2xl font-bold mb-4">Video Tutorial: Advanced Heat Management</h3>
                            <p className="text-slate-300 mb-6">Learn how to optimize your spa&apos;s energy consumption with our new smart sensor integration guide.</p>
                            <button className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all w-fit">
                                <span className="material-symbols-outlined">play_circle</span>
                                Watch Guide (12 min)
                            </button>
                        </div>
                        <div className="md:w-2/5 min-h-[200px] bg-slate-800 relative group cursor-pointer flex items-center justify-center">
                            <div className="size-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-4xl">play_arrow</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
