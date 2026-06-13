import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicLayout } from "@/components/layout/PublicLayout";

const devNav = [
    { label: "Docs", href: "/developer" },
    { label: "API Reference", href: "/developer/reference" },
    { label: "Changelog", href: "/changelog" },
    { label: "Status", href: "/status" },
    { label: "Support", href: "/support" },
];

export default function DeveloperPortalPage() {
    return (
        <PublicLayout>
            {/* Developer sub-nav */}
            <div className="border-b border-[var(--border-main)] bg-[var(--bg-card)] sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-6 lg:px-20 flex items-center gap-1 overflow-x-auto">
                    {devNav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="px-4 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-[var(--text-muted)] hover:text-[var(--color-primary)] whitespace-nowrap transition-colors border-b-2 border-transparent hover:border-[var(--color-primary)]"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="ml-auto flex-shrink-0 py-2 pl-4">
                        <Link
                            href="/login"
                            className="flex items-center justify-center h-9 px-5 bg-[var(--color-primary)] text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:brightness-110 transition-all"
                        >
                            Get API Key
                        </Link>
                    </div>
                </div>
            </div>

            <main className="flex-1">
                {/* Hero Section */}
                <div className="px-6 lg:px-20 py-12">
                    <div className="relative overflow-hidden rounded-2xl bg-[#0d1f1a] min-h-[440px] flex flex-col justify-center px-8 lg:px-16">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1f1a] via-[#0d1f1a]/80 to-transparent z-10"></div>
                        <Image
                            alt="Technical circuit board pattern background"
                            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                            src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop"
                            fill
                            priority
                        />
                        <div className="relative z-20 max-w-2xl space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
                                </span>
                                v2.4.0 is now live
                            </div>
                            <h1 className="text-slate-100 text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                                Build with <span className="text-[var(--color-primary)]">Sauna SPA</span> Engine
                            </h1>
                            <p className="text-slate-300 text-lg lg:text-xl font-medium leading-relaxed">
                                The high-performance API platform for modern wellness operations. Integrate booking, inventory, and staff management into your apps with a few lines of code.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link href="/login" className="flex items-center justify-center h-12 px-8 bg-[var(--color-primary)] text-white rounded-lg font-bold text-base hover:brightness-110 transition-all">
                                    Get API Key
                                </Link>
                                <Link href="/developer/reference" className="flex items-center justify-center h-12 px-8 border border-slate-500 text-slate-100 rounded-lg font-bold text-base hover:bg-white/10 transition-colors">
                                    Explore Docs
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Developer Pillars */}
                <div className="px-6 lg:px-20 py-12">
                    <div className="mb-10">
                        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-main)]">Developer Pillars</h2>
                        <p className="text-[var(--text-muted)] mt-2 text-lg">Foundation for building spa management solutions.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: "api",
                                title: "API Reference",
                                desc: "Exhaustive RESTful API documentation with interactive playgrounds for testing endpoints in real-time.",
                                linkLabel: "Learn More",
                                href: "/developer/reference",
                            },
                            {
                                icon: "webhook",
                                title: "Webhooks & Events",
                                desc: "Stay in sync with real-time updates. Register webhooks for booking changes, payments, and staff shifts.",
                                linkLabel: "Setup Webhooks",
                                href: "/developer/reference",
                            },
                            {
                                icon: "terminal",
                                title: "SDKs & Libraries",
                                desc: "Official client libraries for JavaScript, Python, Go, and Ruby to speed up your development process.",
                                linkLabel: "Browse SDKs",
                                href: "/developer/reference",
                            },
                        ].map((pillar) => (
                            <div key={pillar.title} className="group p-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[var(--color-primary)]/40 transition-all duration-300">
                                <div className="size-12 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">{pillar.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[var(--text-main)]">{pillar.title}</h3>
                                <p className="text-[var(--text-muted)] leading-relaxed mb-6">{pillar.desc}</p>
                                <Link className="text-[var(--color-primary)] font-bold inline-flex items-center gap-2 group/link" href={pillar.href}>
                                    {pillar.linkLabel} <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Start */}
                <div className="px-6 lg:px-20 py-16 bg-[var(--bg-surface-muted)]/50 border-y border-[var(--border-main)]">
                    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
                        <div className="w-full lg:w-1/2 space-y-6">
                            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-main)]">Quick Start</h2>
                            <p className="text-[var(--text-muted)] text-lg leading-relaxed">
                                Get your first request running in under 60 seconds. Authenticate using your developer API key and start fetching resources immediately.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Generate an API Key in your dashboard",
                                    "Authenticate using Bearer token or Custom Header",
                                    "Access sandbox or production environments",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-sm font-medium text-[var(--text-main)]">
                                        <span className="material-symbols-outlined text-[var(--color-primary)]">check_circle</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/developer/reference" className="inline-flex items-center justify-center h-10 px-6 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg font-bold text-sm hover:bg-[var(--color-primary)]/10 transition-colors">
                                View Auth Guide
                            </Link>
                        </div>
                        <div className="w-full lg:w-1/2 rounded-xl bg-[#0d1f1a] overflow-hidden shadow-2xl border border-slate-800">
                            <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-slate-700">
                                <div className="flex gap-2">
                                    <div className="size-3 rounded-full bg-red-500/50"></div>
                                    <div className="size-3 rounded-full bg-amber-500/50"></div>
                                    <div className="size-3 rounded-full bg-emerald-500/50"></div>
                                </div>
                                <span className="text-xs text-slate-400 font-mono">bash</span>
                                <button aria-label="Copy code" className="material-symbols-outlined text-slate-400 text-sm cursor-pointer hover:text-white transition-colors border-none bg-transparent p-0">content_copy</button>
                            </div>
                            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                                <div className="text-slate-400 mb-2"># Authenticate with cURL</div>
                                <div>
                                    <span className="text-[var(--color-primary)]">curl</span>
                                    <span className="text-slate-300"> -X</span> POST https://api.saunaspa.rw/v1/auth \
                                </div>
                                <div className="pl-4">
                                    <span className="text-slate-300">-H</span> <span className="text-amber-300">&lsquo;Content-Type: application/json&rsquo;</span> \
                                </div>
                                <div className="pl-4">
                                    <span className="text-slate-300">-H</span> <span className="text-amber-300">&lsquo;X-API-KEY: YOUR_SECRET_KEY&rsquo;</span> \
                                </div>
                                <div className="pl-4">
                                    <span className="text-slate-300">-d</span> <span className="text-amber-300">&lsquo;{`{ "scope": "read:bookings" } `}&rsquo;</span>
                                </div>
                                <div className="text-slate-400 mt-6 mb-2"># Expected Response</div>
                                <div className="text-slate-500">
                                    {`{`}<br />
                                    &nbsp;&nbsp;<span className="text-[var(--color-primary)]">&quot;status&quot;</span>: <span className="text-amber-200">&quot;success&quot;</span>,<br />
                                    &nbsp;&nbsp;<span className="text-[var(--color-primary)]">&quot;token&quot;</span>: <span className="text-amber-200">&quot;eyJhbGciOiJIUzI1NiI...&quot;</span><br />
                                    {`}`}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help & Community */}
                <div className="px-6 lg:px-20 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col sm:flex-row gap-6 items-start p-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)]">
                            <div className="size-14 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shrink-0">
                                <span className="material-symbols-outlined text-3xl">support_agent</span>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-[var(--text-main)]">Developer Support</h3>
                                <p className="text-[var(--text-muted)] leading-relaxed">
                                    Need help with your integration? Our technical support engineers are available for architecture reviews and debugging.
                                </p>
                                <Link className="inline-flex items-center text-[var(--color-primary)] font-bold hover:underline" href="/support">
                                    Open a ticket
                                </Link>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 items-start p-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)]">
                            <div className="size-14 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shrink-0">
                                <span className="material-symbols-outlined text-3xl">forum</span>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-[var(--text-main)]">Community Forum</h3>
                                <p className="text-[var(--text-muted)] leading-relaxed">
                                    Join the conversation with other developers. Share your projects, ask questions, and contribute to the community.
                                </p>
                                <Link className="inline-flex items-center text-[var(--color-primary)] font-bold hover:underline" href="/contact">
                                    Get in touch
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}
