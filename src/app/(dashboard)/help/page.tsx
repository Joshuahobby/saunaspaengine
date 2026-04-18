import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HelpPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const categories = [
        {
            title: "Governance Protocols",
            description: "Documentation on regional settings, tax harmonics, and legal defaults for platform-wide alignment.",
            icon: "gavel",
            links: [
                { label: "Regional Tuning Guide", href: "#" },
                { label: "Managing Fiscal Logic", href: "#" },
                { label: "Compliance Standards", href: "#" }
            ],
            color: "text-indigo-400",
            bgColor: "bg-indigo-500/5",
            borderColor: "border-indigo-500/20"
        },
        {
            title: "Operational Mastery",
            description: "Best practices for managing business entities, branch distributions, and high-impact broadcasts.",
            icon: "hub",
            links: [
                { label: "Establishing New Businesses", href: "#" },
                { label: "Branch Oversight Workflow", href: "#" },
                { label: "Broadcasting Protocols", href: "#" }
            ],
            color: "text-[var(--color-primary)]",
            bgColor: "bg-[var(--color-primary)]/5",
            borderColor: "border-[var(--color-primary)]/20"
        },
        {
            title: "Commercial Intelligence",
            description: "Insights into platform commercial models, subscription tiers, and revenue management logic.",
            icon: "payments",
            links: [
                { label: "Subscription Tier Structures", href: "#" },
                { label: "Revenue Flow Logic", href: "#" },
                { label: "Tenant Commercial Health", href: "#" }
            ],
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/5",
            borderColor: "border-emerald-500/20"
        },
        {
            title: "System Integrity",
            description: "Technical manuals for auditing system shifts, monitoring health resonance, and platform security.",
            icon: "security",
            links: [
                { label: "Archival Vault Access", href: "#" },
                { label: "Health Monitoring Triggers", href: "#" },
                { label: "Security Audit Protocols", href: "#" }
            ],
            color: "text-amber-400",
            bgColor: "bg-amber-500/5",
            borderColor: "border-amber-500/20"
        }
    ];

    return (
        <div className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full overflow-y-auto no-scrollbar scroll-smooth">
            {/* Header Section */}
            <div className="mb-16 space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    Knowledge & Support Hub
                </div>
                <div className="flex items-baseline gap-6">
                    <h1 className="text-6xl font-display font-bold tracking-tight text-[var(--text-main)] shrink-0">
                        System <span className="text-[var(--color-primary)]">Manual</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed font-bold opacity-60">
                        — The definitive guide to platform governance, commercial operations, and administrative mastery.
                    </p>
                </div>

                {/* Global Search Bar */}
                <div className="max-w-2xl mt-10 relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-[var(--text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors">search</span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search protocols, guides, or system logic..."
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl py-5 pl-16 pr-6 text-sm font-bold focus:outline-none focus:border-[var(--color-primary)]/50 focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all shadow-xl shadow-black/5"
                    />
                </div>
            </div>

            {/* Knowledge Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {categories.map((cat, idx) => (
                    <div 
                        key={idx}
                        className={`glass-card p-10 rounded-[2.5rem] border ${cat.borderColor} ${cat.bgColor} hover:translate-y-[-4px] transition-all duration-300 group`}
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className={`size-14 rounded-2xl ${cat.bgColor} border ${cat.borderColor} flex items-center justify-center ${cat.color} shadow-lg shadow-black/5`}>
                                <span className="material-symbols-outlined text-3xl font-bold">{cat.icon}</span>
                            </div>
                            <span className="material-symbols-outlined text-[var(--text-muted)] opacity-20 group-hover:opacity-40 transition-opacity">north_east</span>
                        </div>
                        
                        <h2 className="text-2xl font-display font-bold mb-4">{cat.title}</h2>
                        <p className="text-sm text-[var(--text-muted)] font-bold leading-relaxed mb-8">
                            {cat.description}
                        </p>

                        <div className="space-y-3">
                            {cat.links.map((link, lIdx) => (
                                <Link 
                                    key={lIdx}
                                    href={link.href}
                                    className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors group/link"
                                >
                                    <span className="size-1.5 bg-[var(--color-primary)] rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity"></span>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Help & Support Bottom Action */}
            <div className="glass-card p-10 lg:p-16 rounded-[3rem] border border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/10 flex flex-col items-center text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent"></div>
                
                <div className="size-20 rounded-3xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)]">
                    <span className="material-symbols-outlined text-4xl font-bold">contact_support</span>
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-3xl font-display font-bold text-[var(--text-main)]">Still need assistance?</h3>
                    <p className="text-[var(--text-muted)] max-w-3xl font-bold text-lg leading-relaxed">
                        If you&apos;ve encountered a system anomaly or require architectural guidance, our primary support oracles are available to assist.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button className="px-10 py-5 bg-[var(--color-primary)] text-slate-900 font-bold rounded-2xl hover:scale-[1.02] transition-transform text-xs uppercase tracking-widest shadow-xl shadow-[var(--color-primary)]/20">
                        Initiate Support Ticket
                    </button>
                    <button className="px-10 py-5 bg-[var(--bg-card)] border border-[var(--border-muted)] text-[var(--text-main)] font-bold rounded-2xl hover:bg-[var(--bg-surface-muted)] transition-all text-xs uppercase tracking-widest">
                        Access Developer API Docs
                    </button>
                </div>
            </div>
            
            <div className="mt-12 text-center">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-40">Sauna Spa Engine · Governance Framework v2.4.0</p>
            </div>
        </div>
    );
}
