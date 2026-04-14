import { auth } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import RegionSelector from "@/app/(dashboard)/admin/settings/region-selector";
import SavePresetForm from "@/app/(dashboard)/admin/settings/save-preset-form";
import { TaxSettingsForm } from "@/components/settings/TaxSettingsForm";
import { getActiveBranchContext } from "@/lib/branch-context";
import { getEffectiveSettings, getGlobalBusinessSettings } from "@/lib/settings-utils";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function RegionalCompliancePage({
    searchParams,
}: {
    searchParams: Promise<{ region?: string; branchId?: string }>;
}) {
    const resolvedParams = await searchParams;
    const session = await auth();

    if (!session?.user) redirect("/login");

    const isOwner = session.user.role === "OWNER" || session.user.role === "ADMIN";
    const context = await getActiveBranchContext(session, resolvedParams);
    
    // Fetch Global Business Data
    const globalBiz = await getGlobalBusinessSettings(session.user.businessId!);
    
    // Fetch Branch Settings if active
    const branchSettings = context.activeBranchId ? await getEffectiveSettings(context.activeBranchId) : null;
    
    // Fetch Regional Compliance Presets
    const allRegions = await db.compliance.findMany({
        orderBy: { region: "asc" }
    });
    const activeRegionName = resolvedParams.region || allRegions[0]?.region || "European Union";
    const activeRegionData = allRegions.find((r) => r.region === activeRegionName) || allRegions[0];

    // Server Action for saving presets
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

        revalidatePath("/settings/compliance-regions");
    };

    return (
        <main className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
            <div className="max-w-6xl mx-auto space-y-16 pb-24">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <Link href="/settings" className="size-10 rounded-xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors border border-[var(--border-muted)]">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] opacity-60">Control Center / Settings</span>
                </div>

                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter font-serif text-[var(--text-main)]">
                        Rules & <span className="text-[var(--color-primary)]">Fiscal Setup.</span>
                    </h1>
                    <p className="text-sm font-bold text-[var(--text-muted)] opacity-60 leading-relaxed">
                        Manage regional tax laws and specific branch fiscal identities in one command center.
                    </p>
                </div>

                {/* Section 1: Regional Presets (OWNER ONLY) */}
                {isOwner && (
                    <div className="space-y-10">
                        <div className="px-4 border-l-4 border-[var(--color-primary)]">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-main)]">Territory Defaults</h2>
                            <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 opacity-50">Master preset rules by region</p>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                            <div className="xl:col-span-7 space-y-10">
                                <div className="glass-card border border-[var(--border-muted)] overflow-hidden rounded-[2.5rem] shadow-2xl shadow-[var(--color-primary)]/5">
                                    <div className="p-8 border-b border-[var(--border-muted)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-[var(--bg-surface-muted)]/30 backdrop-blur-xl">
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-display font-bold">Region Profiles</h2>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-60">Global Presets</p>
                                        </div>
                                        <RegionSelector activeRegion={activeRegionName} regions={allRegions.map(r => r.region)} />
                                    </div>
                                    <div className="relative aspect-[21/9] bg-slate-950 flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center grayscale contrast-150 opacity-20 transition-transform duration-[10000ms] hover:scale-110"></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>
                                        <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row justify-between items-end gap-6 pointer-events-none">
                                            <div className="bg-[var(--bg-card)]/40 backdrop-blur-2xl p-6 px-10 rounded-[2rem] border border-white/5 shadow-2xl text-[10px] tracking-widest uppercase font-bold pointer-events-auto">
                                                <p className="flex items-center gap-4">
                                                    <span className="size-2.5 bg-[var(--color-primary)] rounded-full animate-pulse shadow-[0_0_8px_var(--color-primary)]"></span>
                                                    Information for: <span className="text-[var(--text-main)] text-lg ml-2 font-display">{activeRegionName}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-8 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2rem] shadow-sm">
                                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 opacity-50">Default Tax</p>
                                        <p className="text-4xl font-display font-bold text-[var(--color-primary)] tracking-tight">{activeRegionData?.taxRate}% <span className="text-[var(--text-muted)] text-xs font-sans ml-1">VAT</span></p>
                                    </div>
                                    <div className="p-8 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2rem] shadow-sm">
                                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 opacity-50">Privacy Laws</p>
                                        <p className="text-4xl font-display font-bold text-[var(--color-primary)] tracking-tight">{activeRegionData?.gdprFlag ? "GDPR" : "Basic"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="xl:col-span-5">
                                <div className="glass-card border border-[var(--border-muted)] p-10 flex flex-col rounded-[2.5rem] bg-[var(--bg-card)] shadow-xl h-full">
                                    <div className="flex flex-col gap-6 mb-12">
                                        <span className="w-fit px-4 py-1.5 bg-[var(--color-primary)] text-slate-900 text-[9px] font-bold rounded-full uppercase tracking-[0.2em]">Regional Override</span>
                                        <h2 className="text-3xl font-display font-bold text-[var(--text-main)]">Update Presets</h2>
                                        <p className="text-sm text-[var(--text-muted)] leading-relaxed font-bold">Adjust the legal minimums for the <span className="text-[var(--text-main)] font-bold">{activeRegionName}</span> territory.</p>
                                    </div>

                                    <div className="bg-[var(--bg-surface-muted)]/30 rounded-[2.5rem] p-1 border border-[var(--border-muted)] shadow-inner">
                                        <SavePresetForm region={activeRegionData!} saveAction={savePresets} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section 2: Branch Fiscal Identity (ALL context-aware) */}
                <div className="space-y-10">
                    <div className="px-4 border-l-4 border-blue-500">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-main)]">Branch Fiscal Identity</h2>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 opacity-50">Custom IDs and Receipt Formatting</p>
                    </div>

                    {context.activeBranchId ? (
                        <div className="space-y-8">
                            <div className="glass-card border border-[var(--border-muted)] p-12 rounded-[2.5rem] bg-[var(--bg-card)] shadow-xl">
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="size-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <span className="material-symbols-outlined text-3xl font-black">receipt_long</span>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold font-serif">Fiscal Details</h3>
                                        <p className="text-[10px] font-black tracking-widest text-[var(--text-muted)] uppercase opacity-60">Location: {branchSettings?.branchName || "Main Office"}</p>
                                    </div>
                                </div>

                                <TaxSettingsForm 
                                    branchId={context.activeBranchId} 
                                    initialData={{
                                        taxId: branchSettings?.taxId || null,
                                        taxLabel: branchSettings?.taxLabel || "VAT",
                                        corporateTaxId: globalBiz?.taxId ?? null,
                                        corporateTaxLabel: globalBiz?.taxLabel || "VAT"
                                    }} 
                                />
                            </div>

                            <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl flex items-start gap-6">
                                <span className="material-symbols-outlined text-blue-500 text-3xl">info</span>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-blue-500/80 uppercase text-[10px] tracking-widest">Receipt Compliance</h4>
                                    <p className="text-sm text-[var(--text-muted)] leading-relaxed italic">
                                        These settings control what appears on printed and digital receipts at this location. 
                                        If you leave them blank, we will use your company's master tax record.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-20 border-2 border-dashed border-[var(--border-muted)] rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                            <span className="material-symbols-outlined text-6xl text-[var(--text-muted)]">account_tree</span>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold font-serif">Select a Location</h3>
                                <p className="text-sm max-w-sm font-bold text-[var(--text-muted)]">Please choose a specific branch from the sidebar to manage its unique Tax ID and Receipt headers.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
