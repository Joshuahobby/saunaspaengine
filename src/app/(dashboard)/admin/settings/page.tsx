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
    searchParams: { region?: string };
}) {
    const session = await auth();

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
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

    const activeRegionName = searchParams.region || allRegions[0]?.region || "European Union";

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
                    businessId: session.user.businessId,
                    action: "UPDATE",
                    entity: "Compliance",
                    entityId: regionId,
                    details: `Updated presets for ${regionName} (GDPR: ${gdprFlag}, Tax: ${taxRate}%)`,
                }
            });
        }

        revalidatePath("/admin/settings");
    };

    return (
        <div className="flex h-full w-full flex-col lg:flex-row bg-[#f6f8f8] dark:bg-[#102022] font-['Inter'] text-slate-900 dark:text-slate-100">
            {/* Secondary Sidebar Navigation */}
            <aside className="w-full lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 space-y-8 flex-shrink-0 hidden md:block">
                <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">System Admin</h3>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`size-10 rounded-lg flex items-center justify-center ${session.user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'}`}>
                            <span className="material-symbols-outlined">{session.user.role === 'ADMIN' ? 'admin_panel_settings' : 'business_center'}</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold">{session.user.fullName || "Admin User"}</p>
                            <p className="text-xs text-slate-500">{session.user.role === 'ADMIN' ? 'Compliance Manager' : 'Business Owner'}</p>
                        </div>
                    </div>
                </div>
                <nav className="space-y-1">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">public</span> Global Overview
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        {/* eslint-disable-next-line react/forbid-dom-props */}
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span> Regional Presets
                    </Link>
                    <Link href="/admin/audit" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">lock</span> Compliance Vault
                    </Link>
                    <Link href="/admin/analytics" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">account_balance</span> Tax Configurations
                    </Link>
                    <Link href="/admin/legal" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">description</span> Legal Templates
                    </Link>
                </nav>
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="bg-[var(--color-primary)]/5 rounded-xl p-4 border border-[var(--color-primary)]/10">
                        <p className="text-xs font-bold text-[var(--color-primary)] mb-1 uppercase tracking-tighter">System Status</p>
                        <p className="text-sm font-medium mb-3">All regions compliant</p>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[var(--color-primary)] h-full w-[94%]"></div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 italic">Last audit: Just now</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <section className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Regional Compliance &amp; Tax Presets</h1>
                    <p className="text-slate-500 mt-2 max-w-2xl text-lg">Manage international regulatory standards and automated tax logic for global scaling from a single interface.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Left Column: Map & Region Selection */}
                    <div className="xl:col-span-7 flex flex-col gap-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                                <h2 className="text-lg font-bold">Select Global Region</h2>
                                <RegionSelector activeRegion={activeRegionName} regions={allRegions.map(r => r.region)} />
                            </div>
                            <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-4">
                                {/* Simulated Map Component */}
                                {/* eslint-disable-next-line react/forbid-dom-props */}
                                <div className="w-full h-full rounded-xl bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-80" aria-label="Abstract global map"></div>
                                {/* Map Overlays */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="size-6 bg-[var(--color-primary)] rounded-full animate-ping opacity-75"></div>
                                    <div className="absolute size-4 bg-[var(--color-primary)] border-2 border-white rounded-full"></div>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-lg text-xs">
                                    <p className="font-bold flex items-center gap-2">
                                        <span className="size-2 bg-green-500 rounded-full"></span>
                                        Active Region: {activeRegionName}
                                    </p>
                                    <p className="text-slate-500 mt-1">Status: Operational | VAT Logic: Active</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Regional Summary</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <p className="text-xs text-slate-500 mb-1">Tax Engine</p>
                                    <p className="text-lg font-bold text-[var(--color-primary)]">{activeRegionData?.taxRate}% VAT</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <p className="text-xs text-slate-500 mb-1">Currency</p>
                                    <p className="text-lg font-bold text-[var(--color-primary)]">{activeRegionData?.currency}</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <p className="text-xs text-slate-500 mb-1">Privacy Standard</p>
                                    <p className="text-lg font-bold text-[var(--color-primary)]">{activeRegionData?.gdprFlag ? "GDPR" : "Local"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Compliance Toggles */}
                    <div className="xl:col-span-5 flex flex-col gap-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold">Compliance Presets</h2>
                                <span className="px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-black rounded uppercase">Standard v2.4</span>
                            </div>

                            <SavePresetForm region={activeRegionData!} saveAction={savePresets} />

                        </div>
                    </div>
                </div>

                {/* Bottom Activity Log */}
                <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold">Recent Compliance Updates</h3>
                        <Link href="/admin/audit" className="text-[var(--color-primary)] text-xs font-bold hover:underline">
                            View Full Audit Log
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                    <th className="pb-3 font-medium whitespace-nowrap px-2">Timestamp</th>
                                    <th className="pb-3 font-medium whitespace-nowrap px-2">Administrator</th>
                                    <th className="pb-3 font-medium whitespace-nowrap px-2">Action Details</th>
                                    <th className="pb-3 font-medium whitespace-nowrap px-2">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {complianceLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-slate-500">No recent compliance updates found.</td>
                                    </tr>
                                ) : (
                                    complianceLogs.map((log) => (
                                        <tr key={log.id}>
                                            <td className="py-4 text-xs px-2 whitespace-nowrap text-slate-500">{format(new Date(log.createdAt), "MMM dd, yyyy HH:mm")}</td>
                                            <td className="py-4 font-medium px-2 whitespace-nowrap flex items-center gap-2">
                                                <div className="size-6 rounded bg-slate-100 dark:bg-slate-800 text-[10px] flex items-center justify-center font-bold">
                                                    {log.user?.fullName?.substring(0, 2).toUpperCase() || "SY"}
                                                </div>
                                                {log.user?.fullName || "System"}
                                            </td>
                                            <td className="py-4 px-2 min-w-[200px] text-slate-600 dark:text-slate-300">{log.details || `${log.action} on ${log.entity}`}</td>
                                            <td className="py-4 px-2 whitespace-nowrap"><span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-[10px] font-bold">SUCCESS</span></td>
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
