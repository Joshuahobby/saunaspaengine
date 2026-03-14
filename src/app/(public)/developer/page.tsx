import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function DeveloperPortalPage() {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-[#10221c] text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] font-[Manrope,sans-serif] transition-colors duration-300">
            <div className="layout-container flex h-full grow flex-col">
                {/* Navigation */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-primary/20 bg-white dark:bg-[#10221c] px-6 py-4 lg:px-20 sticky top-0 z-50">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-3 text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">
                            <div className="size-8 bg-primary rounded flex items-center justify-center text-[#10221c]">
                                <span className="material-symbols-outlined font-bold text-lg">spa</span>
                            </div>
                            <h2 className="text-lg font-extrabold leading-tight tracking-tight">
                                Sauna SPA Engine <span className="text-primary text-xs font-mono ml-1 uppercase tracking-widest bg-primary/10 px-1 py-0.5 rounded">Dev</span>
                            </h2>
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/developer/reference">Docs</Link>
                            <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/developer/reference">API Reference</Link>
                            <Link className="text-sm font-semibold hover:text-primary transition-colors" href="#">SDKs</Link>
                            <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/status">Changelog</Link>
                        </nav>
                    </div>
                    <div className="flex flex-1 justify-end gap-4 items-center">
                        <div className="hidden sm:flex items-center relative">
                            <span className="material-symbols-outlined absolute left-3 text-slate-400 dark:text-slate-500 text-lg">search</span>
                            <input
                                className="bg-slate-100 dark:bg-primary/5 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary w-64 placeholder:text-slate-500 text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]"
                                placeholder="Search documentation..."
                                type="text"
                                aria-label="Search documentation"
                            />
                        </div>
                        <Link href="/login" className="flex items-center justify-center rounded-lg h-10 px-5 bg-primary text-[#10221c] text-sm font-bold hover:brightness-110 transition-all">
                            Get API Key
                        </Link>
                        <Link href="/login" className="size-10 rounded-full bg-slate-200 dark:bg-primary/10 flex items-center justify-center overflow-hidden border border-slate-300 dark:border-primary/20 hover:border-primary/50 transition-colors">
                            <span className="material-symbols-outlined text-slate-600 dark:text-primary/60">person</span>
                        </Link>
                    </div>
                </header>
                <main className="flex-1">
                    {/* Hero Section */}
                    <div className="px-6 lg:px-20 py-12 @container">
                        <div className="relative overflow-hidden rounded-xl bg-slate-900 min-h-[440px] flex flex-col justify-center px-8 lg:px-16" title="Dark abstract technical background">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#10221c] via-[#10221c]/80 to-transparent z-10"></div>
                            {/* Note: In a real app we'd use next/image here */}
                            <Image
                                alt="Technical circuit board pattern background"
                                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                                src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop"
                                fill
                                priority
                            />
                            <div className="relative z-20 max-w-2xl space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    v2.4.0 is now live
                                </div>
                                <h1 className="text-slate-100 text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                                    Build with <span className="text-primary">Sauna SPA</span> Engine
                                </h1>
                                <p className="text-slate-300 text-lg lg:text-xl font-medium leading-relaxed">
                                    The high-performance API platform for modern wellness operations. Integrate booking, inventory, and staff management into your apps with a few lines of code.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Link href="/login" className="flex items-center justify-center h-12 px-8 bg-primary text-[#10221c] rounded-lg font-bold text-base hover:scale-105 transition-transform">
                                        Get API Key
                                    </Link>
                                    <Link href="/developer/reference" className="flex items-center justify-center h-12 px-8 border border-slate-600 text-slate-100 rounded-lg font-bold text-base hover:bg-slate-800 transition-colors">
                                        Explore Docs
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Developer Pillars */}
                    <div className="px-6 lg:px-20 py-12">
                        <div className="mb-10">
                            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Developer Pillars</h2>
                            <p className="text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] mt-2 text-lg">Foundation for building world-class spa management solutions.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Pillar 1 */}
                            <div className="group p-8 rounded-xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 hover:border-primary/40 transition-all duration-300">
                                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">api</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">API Reference</h3>
                                <p className="text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] leading-relaxed mb-6">
                                    Exhaustive RESTful API documentation with interactive playgrounds for testing endpoints in real-time.
                                </p>
                                <Link className="text-primary font-bold inline-flex items-center gap-2 group/link" href="/developer/reference">
                                    Learn More <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                            </div>

                            {/* Pillar 2 */}
                            <div className="group p-8 rounded-xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 hover:border-primary/40 transition-all duration-300">
                                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">webhook</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Webhooks & Events</h3>
                                <p className="text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] leading-relaxed mb-6">
                                    Stay in sync with real-time updates. Register webhooks for booking changes, payments, and staff shifts.
                                </p>
                                <Link className="text-primary font-bold inline-flex items-center gap-2 group/link" href="/developer/reference">
                                    Setup Webhooks <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                            </div>

                            {/* Pillar 3 */}
                            <div className="group p-8 rounded-xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 hover:border-primary/40 transition-all duration-300">
                                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">terminal</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">SDKs & Libraries</h3>
                                <p className="text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] leading-relaxed mb-6">
                                    Official client libraries for JavaScript, Python, Go, and Ruby to speed up your development process.
                                </p>
                                <Link className="text-primary font-bold inline-flex items-center gap-2 group/link" href="/developer/reference">
                                    Browse SDKs <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Start */}
                    <div className="px-6 lg:px-20 py-16 bg-slate-100 dark:bg-primary/5 border-y border-slate-200 dark:border-primary/10">
                        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
                            <div className="w-full lg:w-1/2 space-y-6">
                                <h2 className="text-3xl font-extrabold tracking-tight">Quick Start</h2>
                                <p className="text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] text-lg leading-relaxed">
                                    Get your first request running in under 60 seconds. Authenticate using your developer API key and start fetching resources immediately.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="material-symbols-outlined text-primary">check_circle</span>
                                        Generate an API Key in your dashboard
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="material-symbols-outlined text-primary">check_circle</span>
                                        Authenticate using Bearer token or Custom Header
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="material-symbols-outlined text-primary">check_circle</span>
                                        Access sandbox or production environments
                                    </li>
                                </ul>
                                <Link href="/developer/reference" className="inline-flex items-center justify-center h-10 px-6 border border-primary text-primary rounded-lg font-bold text-sm hover:bg-primary/10 hover:text-primary transition-colors">
                                    View Auth Guide
                                </Link>
                            </div>
                            <div className="w-full lg:w-1/2 rounded-xl bg-slate-900 overflow-hidden shadow-2xl border border-slate-800">
                                <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
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
                                        <span className="text-primary">curl</span>
                                        <span className="text-slate-300"> -X</span> POST https://api.saunaspa.io/v1/auth \
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
                                        {`{
    `}<br />
                                        &nbsp;&nbsp;<span className="text-primary">&quot;status&quot;</span>: <span className="text-amber-200">&quot;success&quot;</span>,<br />
                                        &nbsp;&nbsp;<span className="text-primary">&quot;token&quot;</span>: <span className="text-amber-200">&quot;eyJhbGciOiJIUzI1NiI...&quot;</span><br />
                                        {`} `}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Help & Community */}
                    <div className="px-6 lg:px-20 py-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col sm:flex-row gap-6 items-start p-8 rounded-xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10">
                                <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined text-3xl">support_agent</span>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold">Developer Support</h3>
                                    <p className="text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] leading-relaxed">
                                        Need help with your integration? Our technical support engineers are available for architecture reviews and debugging.
                                    </p>
                                    <Link className="inline-flex items-center text-primary font-bold hover:underline" href="/help">
                                        Open a ticket
                                    </Link>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 items-start p-8 rounded-xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10">
                                <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined text-3xl">forum</span>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold">Community Forum</h3>
                                    <p className="text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] leading-relaxed">
                                        Join the conversation with other developers. Share your projects, ask questions, and contribute to the community.
                                    </p>
                                    <a className="inline-flex items-center text-primary font-bold hover:underline" href="#">
                                        Join Discord
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-primary/10 px-6 lg:px-20 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
                        <div className="col-span-2 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="size-6 bg-primary rounded flex items-center justify-center text-background-dark">
                                    <span className="material-symbols-outlined text-base font-bold">spa</span>
                                </div>
                                <h2 className="text-lg font-extrabold tracking-tight text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Sauna SPA Engine</h2>
                            </div>
                            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                                Empowering the next generation of wellness centers with robust, scalable, and developer-friendly technical solutions.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">Resources</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><Link className="hover:text-primary transition-colors" href="/developer">Documentation</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="/developer/reference">API Reference</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="#">SDKs</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="#">Guides</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">Community</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><Link className="hover:text-primary transition-colors" href="#">Forum</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="#">Discord</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="#">GitHub</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="#">Events</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><Link className="hover:text-primary transition-colors" href="#">About Us</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="#">Privacy</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="#">Security</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="/status">Status</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 dark:border-primary/5 text-slate-500 text-xs gap-4">
                        <p>© 2024 Sauna SPA Engine Engine. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link className="hover:text-primary transition-colors" href="#">Twitter</Link>
                            <Link className="hover:text-primary transition-colors" href="#">LinkedIn</Link>
                            <Link className="hover:text-primary transition-colors" href="#">GitHub</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
