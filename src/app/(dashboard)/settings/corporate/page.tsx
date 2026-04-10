import { auth } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BusinessProfileForm from "../../executive/settings/business-profile-form";
import { BrandingSettingsForm } from "@/components/settings/BrandingSettingsForm";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { getActiveBranchContext } from "@/lib/branch-context";
import { getEffectiveSettings, getGlobalBusinessSettings } from "@/lib/settings-utils";
import Link from "next/link";

export default async function CorporateProfilePage({
    searchParams,
}: {
    searchParams: Promise<any>;
}) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const resolvedParams = await searchParams;
    const isOwner = session.user.role === "OWNER";
    const isManager = session.user.role === "MANAGER";

    // Fetch context for branding (inherited from old profile page)
    const context = await getActiveBranchContext(session, resolvedParams);
    const globalBiz = await getGlobalBusinessSettings(session.user.businessId!);
    
    let effective = null;
    if (context.activeBranchId) {
        effective = await getEffectiveSettings(context.activeBranchId);
    }

    const isGlobalView = !context.activeBranchId && isOwner;

    // Fetch business data (for legal section)
    const userWithBusiness = await db.user.findUnique({
        where: { id: session.user.id },
        include: { business: true }
    });
    const businessData = userWithBusiness?.business;

    return (
        <main className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
            <div className="max-w-5xl mx-auto space-y-16 pb-20">
                {/* Navigation Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Link href="/settings" className="size-10 rounded-xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors border border-[var(--border-muted)]">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </Link>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] opacity-60">Business Settings</span>
                        </div>
                        <h1 className="text-5xl font-black font-serif tracking-tighter text-[var(--text-main)]">
                            {isOwner ? "Corporate" : "Your"} <span className="">Identity.</span>
                        </h1>
                    </div>
                </div>

                {/* Section 1: Headquarters (OWNER ONLY) - Legal/Office Info */}
                {isOwner && (
                    <div className="space-y-8">
                        <div className="px-4 border-l-4 border-amber-500">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-main)]">Headquarters</h2>
                            <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 opacity-50">Legal and Business Records</p>
                        </div>

                        <div className="glass-card border border-[var(--border-muted)] p-12 rounded-[2.5rem] bg-[var(--bg-surface-muted)]/10 relative overflow-hidden group shadow-xl">
                            <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500 opacity-5 rounded-full blur-[100px] group-hover:opacity-10 transition-opacity duration-1000"></div>
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-display font-bold">Business Information</h2>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-60">Official Records</p>
                                </div>
                                <div className="px-4 py-2 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-xl border border-emerald-500/20 uppercase tracking-widest flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[14px]">verified</span>
                                    Verified
                                </div>
                            </div>
                            
                            {businessData && (
                                <BusinessProfileForm business={businessData} />
                            )}
                        </div>

                        <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-3xl flex items-start gap-6">
                            <span className="material-symbols-outlined text-amber-500 text-3xl">info</span>
                            <div className="space-y-2">
                                <h4 className="font-bold text-amber-500/80 uppercase text-[10px] tracking-widest">Update All Branches</h4>
                                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                                    Changes made here will automatically show up across all your branches. 
                                    Make sure this information matches your official paperwork.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section 2: Identity & Style (OWNER & MANAGER) */}
                <div className="space-y-8">
                    <div className="px-4 border-l-4 border-[var(--color-primary)]">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-main)]">Brand Identity</h2>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 opacity-50">Logos and Business Theme</p>
                    </div>

                    <div className="glass-card border border-[var(--border-muted)] p-10 rounded-[2.5rem] bg-[var(--bg-card)]">
                        <BrandingSettingsForm 
                            businessId={session.user.businessId!}
                            branchId={context.activeBranchId}
                            initialData={{
                                logo: effective?.logo || null,
                                primaryColor: effective?.primaryColor || globalBiz.primaryColor,
                                corporateLogo: globalBiz.logo,
                                corporateColor: globalBiz.primaryColor,
                                isGlobal: isGlobalView
                            }}
                        />
                    </div>
                </div>

                {/* Section 3: Login & Safety (ALL) */}
                <div className="space-y-8">
                    <div className="px-4 border-l-4 border-red-500">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-main)]">Login & Safety</h2>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 opacity-50">Your Private Access</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        {/* Account Details */}
                        <div className="md:col-span-4 self-start">
                            <div className="bg-[var(--bg-card)] rounded-[2.5rem] p-8 border border-[var(--border-muted)] shadow-sm">
                                <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-forest-400)] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-[var(--color-primary)]/20 mb-6 overflow-hidden">
                                    {effective?.logo ? (
                                        <img src={effective.logo} className="w-full h-full object-contain p-2" alt="Avatar" />
                                    ) : (
                                        session.user.fullName?.charAt(0) || "U"
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-[var(--text-main)] font-serif mb-1">
                                    {session.user.fullName}
                                </h2>
                                <p className="text-sm text-[var(--text-muted)] mb-6 font-bold">{session.user.email}</p>
                                
                                <div className="inline-block px-4 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest rounded-full">
                                    {session.user.role}
                                </div>
                            </div>
                        </div>

                        {/* Password Form */}
                        <div className="md:col-span-8">
                            <div className="bg-[var(--bg-card)] rounded-[2.5rem] p-10 border border-[var(--border-muted)] shadow-sm">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="size-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                                        <span className="material-symbols-outlined font-black">shield_person</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold font-serif text-[var(--text-main)]">Login Details</h2>
                                        <p className="text-xs text-[var(--text-muted)] font-bold">Update your password and security settings.</p>
                                    </div>
                                </div>
                                
                                <ChangePasswordForm userId={session.user.id!} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
