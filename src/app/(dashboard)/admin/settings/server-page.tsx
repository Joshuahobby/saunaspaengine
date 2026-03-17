import { redirect } from "next/navigation";
import { prisma as db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import RegionSelector from "./region-selector";
import SavePresetForm from "./save-preset-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
    searchParams,
}: {
    searchParams: Promise<{ region?: string }>;
}) {
    const { region } = await searchParams;
    const session = await auth();

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "MANAGER" && session.user.role !== "OWNER")) {
        redirect("/login");
    }

    // Ensure we have some default compliance records (seeding if empty)
    const existingCount = await db.compliance.count();
    if (existingCount === 0) {
        await db.compliance.createMany({
            data: [
                { region: "European Union", taxRate: 20.0, gdprFlag: true, currency: "EUR" },
                { region: "North America", taxRate: 8.5, gdprFlag: false, currency: "USD" },
                { region: "GCC Countries", taxRate: 5.0, gdprFlag: false, currency: "AED" },
                { region: "Asia Pacific", taxRate: 10.0, gdprFlag: true, currency: "SGD" },
                { region: "Rwanda", taxRate: 18.0, gdprFlag: false, currency: "RWF" },
            ]
        });
    }

    const allRegions = await db.compliance.findMany({
        orderBy: { region: "asc" }
    });

    const activeRegionName = region || allRegions[0]?.region || "European Union";

    // Find active region data
    const activeRegionData = allRegions.find((r) => r.region === activeRegionName) || allRegions[0];

    // Fetch recent audit logs for compliance
    const complianceLogs = await db.auditLog.findMany({
        where: {
            OR: [
                { entity: "Compliance" },
                { action: { contains: "Compliance" } }
            ]
        },
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 5
    });

    const savePresets = async (formData: FormData) => {
        "use server";
        const session = await auth();
        if (!session?.user) return;

        const regionId = formData.get("id") as string;
        const regionName = formData.get("region") as string;
        const gdprFlag = formData.get("gdprFlag") === "on";
        const taxRate = parseFloat(formData.get("taxRate") as string) || 0;

        await db.compliance.update({
            where: { id: regionId },
            data: {
                gdprFlag,
                taxRate
            }
        });

        // Audit Log
        if (session.user.id) {
            await db.auditLog.create({
                data: {
                    userId: session.user.id,
                    branchId: session.user.branchId,
                    action: "UPDATE",
                    entity: "Compliance",
                    entityId: regionId,
                    details: `Updated presets for ${regionName} (GDPR: ${gdprFlag}, Tax: ${taxRate}%)`,
                }
            });
        }

        revalidatePath("/governance");
    };

    return (
        <div className="flex h-full w-full flex-col lg:flex-row bg-[var(--bg-app)] text-[var(--text-main)] transition-colors duration-500 overflow-hidden">
            {/* Secondary Sidebar Navigation */}
            <aside className="w-full lg:w-85 glass-card p-10 space-y-12 flex-shrink-0 hidden lg:flex flex-col border-r border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/20 shadow-none">
                <div className="space-y-8">
                    <div className="px-2">
                        <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-8 opacity-40">System Administration</h3>
                        <div className="flex items-center gap-5">
                            <div className={`size-14 rounded-2xl flex items-center justify-center shadow-xl shadow-black/5 ${session.user.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'}`}>
                                <span className="material-symbols-outlined text-3xl font-bold">{session.user.role === 'ADMIN' ? 'shield_person' : 'stars'}</span>
                            </div>
                            <div>
                                <p className="text-base font-display font-bold leading-tight text-[var(--text-main)]">{session.user.fullName || "Admin User"}</p>
                                <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-2 opacity-60">{session.user.role === 'ADMIN' ? 'System Administrator' : 'Branch Manager'}</p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-2">
                        <Link href="/dashboard" className="flex items-center gap-4 px-6 py-4 text-sm font-display font-bold rounded-[1.5rem] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)]/30 transition-all tracking-tight group">
                            <span className="material-symbols-outlined text-xl opacity-40 group-hover:scale-110 transition-transform">monitoring</span>
                            <span>Main Dashboard</span>
                        </Link>
                        <Link href="/governance" className="flex items-center gap-4 px-6 py-4 text-sm font-display font-bold rounded-[1.5rem] bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-sm border border-[var(--color-primary)]/20 tracking-tight group">
                            <span className="material-symbols-outlined text-xl font-bold icon-filled">gavel</span>
                            <span>Regional Settings</span>
                        </Link>
                        <Link href="/audit" className="flex items-center gap-4 px-6 py-4 text-sm font-display font-bold rounded-[1.5rem] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)]/30 transition-all tracking-tight group">
                            <span className="material-symbols-outlined text-xl opacity-40 group-hover:scale-110 transition-transform">history</span>
                            <span>System Logs</span>
                        </Link>
                        <Link href="/settings/roles" className="flex items-center gap-4 px-6 py-4 text-sm font-display font-bold rounded-[1.5rem] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)]/30 transition-all tracking-tight group">
                            <span className="material-symbols-outlined text-xl opacity-40 group-hover:scale-110 transition-transform">security</span>
                            <span>Role & Permissions</span>
                        </Link>
                        <Link href="/analytics" className="flex items-center gap-4 px-6 py-4 text-sm font-display font-bold rounded-[1.5rem] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)]/30 transition-all tracking-tight group">
                            <span className="material-symbols-outlined text-xl opacity-40 group-hover:scale-110 transition-transform">account_balance</span>
                            <span>Financial Data</span>
                        </Link>
                        <Link href="/legal" className="flex items-center gap-4 px-6 py-4 text-sm font-display font-bold rounded-[1.5rem] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)]/30 transition-all tracking-tight group">
                            <span className="material-symbols-outlined text-xl opacity-40 group-hover:scale-110 transition-transform">policy</span>
                            <span>Legal & Policy</span>
                        </Link>
                    </nav>
                </div>

                <div className="mt-auto space-y-6">
                    <div className="bg-[var(--bg-app)]/50 rounded-[2.5rem] p-8 border border-[var(--border-muted)] shadow-inner relative overflow-hidden group/health">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-5 rounded-full blur-2xl -mr-16 -mt-16 group-hover/health:opacity-10 transition-opacity"></div>
                        <p className="text-[10px] font-bold text-[var(--color-primary)] mb-4 uppercase tracking-[0.2em] opacity-60">System Health</p>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-3xl font-display font-bold">94.8%</span>
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Optimal</span>
                        </div>
                        <div className="w-full bg-[var(--bg-surface-muted)] h-2.5 rounded-full overflow-hidden mb-3 p-0.5">
                            <div className="bg-[var(--color-primary)] h-full w-[94.8%] rounded-full shadow-[0_0_12px_var(--color-primary)]/40"></div>
                        </div>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-40">All locations calibrated</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <section className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full overflow-y-auto no-scrollbar scroll-smooth">
                <div className="mb-12 space-y-3">
                    <h1 className="text-5xl font-display font-bold tracking-tight text-[var(--text-main)]">Governance <span className="text-[var(--color-primary)] underline decoration-2 decoration-[var(--color-primary)]/20 underline-offset-8">Hub</span></h1>
                    <p className="text-[var(--text-muted)] mt-5 max-w-3xl text-xl font-bold leading-relaxed">Manage platform-wide settings, regional compliance, and system-level configurations from a central administration panel.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    {/* Left Column: Map & Region Selection */}
                    <div className="xl:col-span-12 2xl:col-span-7 flex flex-col gap-10">
                        <div className="glass-card border border-[var(--border-muted)] overflow-hidden rounded-[2.5rem] shadow-2xl shadow-[var(--color-primary)]/5">
                            <div className="p-8 border-b border-[var(--border-muted)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-[var(--bg-surface-muted)]/30 backdrop-blur-xl">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-display font-bold">Global Territories</h2>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-60">Selected Territory</p>
                                </div>
                                <RegionSelector activeRegion={activeRegionName} regions={allRegions.map(r => r.region)} />
                            </div>
                            <div className="relative aspect-[21/9] bg-slate-950 flex items-center justify-center overflow-hidden">
                                {/* Simulated Map Component with better styling */}
                                <div 
                                    className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center grayscale contrast-150 opacity-20 transition-transform duration-[10000ms] hover:scale-110" 
                                    aria-label="Abstract global map"
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>
                                
                                {/* Map Overlays */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="size-24 bg-[var(--color-primary)] rounded-full animate-ping opacity-10"></div>
                                    <div className="absolute size-6 bg-[var(--color-primary)] border-4 border-slate-950 rounded-full shadow-[0_0_20px_var(--color-primary)]"></div>
                                </div>

                                <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row justify-between items-end gap-6 pointer-events-none">
                                    <div className="bg-[var(--bg-card)]/40 backdrop-blur-2xl p-6 px-10 rounded-[2rem] border border-white/5 shadow-2xl text-[10px] tracking-widest uppercase font-bold pointer-events-auto">
                                        <p className="flex items-center gap-4">
                                            <span className="size-2.5 bg-[var(--color-primary)] rounded-full animate-pulse shadow-[0_0_8px_var(--color-primary)]"></span>
                                            Active Focus: <span className="text-[var(--text-main)] text-lg ml-2 font-display">{activeRegionName}</span>
                                        </p>
                                        <div className="flex items-center gap-6 mt-4">
                                            <p className="text-[var(--text-muted)] opacity-60">Status: Harmonized</p>
                                            <p className="text-[var(--text-muted)] opacity-60">Logic: Persistent</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pointer-events-auto">
                                        <div className="bg-white/5 backdrop-blur-md p-4 px-6 rounded-2xl border border-white/5 text-[9px] font-bold uppercase tracking-widest italic text-white/40">
                                            Lat: 1.9441° S · Long: 30.0619° E
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card border border-[var(--border-muted)] p-12 rounded-[2.5rem] bg-[var(--bg-surface-muted)]/10 relative overflow-hidden group shadow-xl shadow-[var(--color-primary)]/5">
                            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--color-primary)] opacity-5 rounded-full blur-[100px] group-hover:opacity-10 transition-opacity duration-1000"></div>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-10 opacity-40">Regional Signatures</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                                <div className="p-8 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2rem] shadow-sm hover:border-[var(--color-primary)]/30 transition-all group/stat">
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 opacity-50 group-hover/stat:opacity-100 transition-opacity">Fiscal Engine</p>
                                    <p className="text-4xl font-display font-bold text-[var(--color-primary)] tracking-tight">{activeRegionData?.taxRate}% <span className="text-[var(--text-muted)] text-xs font-sans ml-1">VAT</span></p>
                                </div>
                                <div className="p-8 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2rem] shadow-sm hover:border-[var(--color-primary)]/30 transition-all group/stat">
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 opacity-50 group-hover/stat:opacity-100 transition-opacity">Currency Resonance</p>
                                    <p className="text-4xl font-display font-bold text-[var(--text-main)] tracking-tight">{activeRegionData?.currency}</p>
                                </div>
                                <div className="p-8 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2rem] shadow-sm hover:border-[var(--color-primary)]/30 transition-all group/stat">
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 opacity-50 group-hover/stat:opacity-100 transition-opacity">Privacy Framework</p>
                                    <p className="text-4xl font-display font-bold text-[var(--color-primary)] tracking-tight">{activeRegionData?.gdprFlag ? "GDPR" : "Standard"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Compliance Toggles */}
                    <div className="xl:col-span-12 2xl:col-span-5 flex flex-col gap-8">
                        <div className="glass-card border border-[var(--border-muted)] p-10 flex flex-col rounded-[2.5rem] bg-[var(--bg-card)] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]">
                            <div className="flex flex-col gap-6 mb-12">
                                <span className="w-fit px-4 py-1.5 bg-[var(--color-primary)] text-slate-900 text-[9px] font-bold rounded-full uppercase tracking-[0.2em] shadow-lg shadow-[var(--color-primary)]/20">Preset Tuning v2.4</span>
                                <h2 className="text-3xl font-display font-bold text-[var(--text-main)]">Regional <span className="text-[var(--color-primary)] font-sans uppercase text-sm font-bold tracking-[0.3em] block mt-2 opacity-50">Calibration</span></h2>
                                <p className="text-sm text-[var(--text-muted)] leading-relaxed font-bold">Refine the atmospheric constraints and fiscal rituals for the <span className="text-[var(--text-main)] font-bold">{activeRegionName}</span> territory.</p>
                            </div>

                            <div className="bg-[var(--bg-surface-muted)]/30 rounded-[2.5rem] p-1 border border-[var(--border-muted)] shadow-inner">
                                <SavePresetForm region={activeRegionData!} saveAction={savePresets} />
                            </div>

                            <div className="mt-auto pt-10 flex items-center gap-6">
                                <div className="size-14 rounded-2xl bg-[var(--bg-surface-muted)]/50 border border-[var(--border-muted)] flex items-center justify-center text-[var(--color-primary)]">
                                    <span className="material-symbols-outlined text-2xl font-bold">lock_open</span>
                                </div>
                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest leading-relaxed italic opacity-50">Multi-factor authorization required for sensitive harmonic shifts.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Activity Log */}
                <div className="mt-16 mb-12 glass-card border border-[var(--border-muted)] overflow-hidden rounded-[2.5rem] bg-[var(--bg-card)] shadow-2xl shadow-black/5">
                    <div className="p-10 border-b border-[var(--border-muted)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-[var(--bg-surface-muted)]/20">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-display font-bold">Compliance <span>Stream</span></h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-50">Chronicle of regulatory shifts</p>
                        </div>
                        <Link href="/audit" className="group flex items-center gap-3 px-8 py-3 bg-[var(--bg-card)] hover:bg-[var(--text-main)] hover:text-[var(--bg-app)] border border-[var(--border-muted)] transition-all rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm active:scale-[0.98]">
                            View Archival Vault
                            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-[var(--bg-surface-muted)]/10 border-b border-[var(--border-muted)]">
                                    <th className="py-8 px-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-40">Timestamp</th>
                                    <th className="py-8 px-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-40">Oracle</th>
                                    <th className="py-8 px-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-40">Operation Manifest</th>
                                    <th className="py-8 px-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-40 text-right">Sanctity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-muted)]">
                                {complianceLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-24 text-center text-[var(--text-muted)] font-serif italic text-2xl opacity-40">No entries in the current resonance.</td>
                                    </tr>
                                ) : (
                                    complianceLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-[var(--bg-surface-muted)]/30 transition-colors group">
                                            <td className="py-8 px-10">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-display font-bold text-[var(--text-main)]">{format(new Date(log.createdAt), "MMM dd")}</span>
                                                    <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] opacity-40 uppercase tracking-tighter">{format(new Date(log.createdAt), "HH:mm:ss")}</span>
                                                </div>
                                            </td>
                                            <td className="py-8 px-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-11 rounded-2xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] text-[10px] flex items-center justify-center font-bold text-[var(--color-primary)] transition-all group-hover:border-[var(--color-primary)]/30 group-hover:shadow-[0_0_15px_var(--color-primary)]/10">
                                                        {log.user?.fullName?.substring(0, 2).toUpperCase() || "SY"}
                                                    </div>
                                                    <span className="text-sm font-display font-bold text-[var(--text-main)]">{log.user?.fullName || "System Oracle"}</span>
                                                </div>
                                            </td>
                                            <td className="py-8 px-10 max-w-md">
                                                <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed italic group-hover:text-[var(--text-main)] transition-colors">{log.details || `${log.action} on ${log.entity}`}</p>
                                            </td>
                                            <td className="py-8 px-10 text-right">
                                                <span className="inline-flex items-center px-5 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] italic">Verified Shield</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
