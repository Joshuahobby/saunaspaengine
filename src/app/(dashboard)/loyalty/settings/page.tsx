import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { requireRole } from "@/lib/role-guard";

async function publishLoyaltyChanges(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.businessId) throw new Error("Unauthorized");

    const pointsPerRwf = parseFloat(formData.get("pointsPerRwf") as string);

    await prisma.loyaltyProgram.upsert({
        where: { businessId: session.user.businessId },
        update: { pointsPerRwf },
        create: {
            businessId: session.user.businessId,
            pointsPerRwf
        }
    });

    revalidatePath("/loyalty/settings");
}

export default async function LoyaltySettingsPage() {
    const session = await requireRole(["OWNER", "ADMIN"]);
    if (!session?.user?.businessId) redirect("/dashboard");

    const program = await prisma.loyaltyProgram.findUnique({
        where: { businessId: session.user.businessId }
    });

    const activeMembersCount = await prisma.loyaltyPoint.count({
        where: { businessId: session.user.businessId }
    });

    const totalPointsAgg = await prisma.loyaltyPoint.aggregate({
        where: { businessId: session.user.businessId },
        _sum: { points: true }
    });

    const totalPointsIssued = totalPointsAgg._sum.points || 0;
    const formatPoints = (pts: number) => pts > 1000 ? `${(pts / 1000).toFixed(1)}k` : pts.toString();

    const earningRate = program?.pointsPerRwf || 0.01;

    return (
        <div className="flex flex-col lg:flex-row w-full gap-8 p-4 lg:p-8">
            {/* Inner Navigation (Optional, acts as side menu for settings) */}
            <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-2">
                <div className="mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]/60">Configuration</h3>
                </div>
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--color-primary)] text-slate-900 font-semibold shadow-md shadow-[var(--color-primary)]/10 w-full text-left">
                    <span className="material-symbols-outlined font-variation-settings-'FILL'-1">stars</span>
                    <span className="text-sm">Earning Rules</span>
                </button>
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] hover:bg-[var(--color-primary)]/10 transition-colors w-full text-left">
                    <span className="material-symbols-outlined">redeem</span>
                    <span className="text-sm">Redemption Tiers</span>
                </button>
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] hover:bg-[var(--color-primary)]/10 transition-colors w-full text-left">
                    <span className="material-symbols-outlined">military_tech</span>
                    <span className="text-sm">Member Tiers</span>
                </button>
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] hover:bg-[var(--color-primary)]/10 transition-colors w-full text-left">
                    <span className="material-symbols-outlined">credit_card</span>
                    <span className="text-sm">Card Preview</span>
                </button>

                <div className="mt-8 mb-4 border-t border-[var(--color-primary)]/10 pt-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]/60">System</h3>
                </div>
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] hover:bg-[var(--color-primary)]/10 transition-colors w-full text-left">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-sm">Global Settings</span>
                </button>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 w-full max-w-6xl">
                {/* Header Section */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Loyalty & Rewards</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Driving repeat business through a flexible rewards ecosystem.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/loyalty/performance" className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-center">
                            View Analytics
                        </Link>
                        <button className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-[#102220] text-sm font-bold shadow-lg shadow-[var(--color-primary)]/20 hover:brightness-110 transition-all">
                            + Add New Rule
                        </button>
                    </div>
                </div>

                <form action={publishLoyaltyChanges} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column: Settings */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Earning Rules Section */}
                        <section className="glass-card p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg text-[var(--color-primary)]">
                                        <span className="material-symbols-outlined">monetization_on</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Earning Rules</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-slate-500 uppercase">Status</span>
                                    <div className="w-10 h-5 bg-[var(--color-primary)] rounded-full relative">
                                        <div className="absolute right-1 top-1 size-3 bg-[#102220] rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-[var(--color-border-light)] gap-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Standard Earning Base Rate</span>
                                        <span className="text-sm text-slate-500">How many points awarded per 10,000 RWF spent</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            step="0.001"
                                            name="pointsPerRwf"
                                            title="Points per RWF"
                                            placeholder="Example: 0.01"
                                            defaultValue={earningRate}
                                            className="w-24 px-3 py-1.5 rounded glass-card text-sm focus:ring-1 focus:ring-[var(--color-primary)] font-mono"
                                        />
                                        <span className="text-sm text-slate-500 font-bold">PTS / RWF</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border-light)]">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">New Client Bonus</span>
                                        <span className="text-sm text-slate-500">50 points awarded on first visit registration</span>
                                    </div>
                                    <button type="button" className="text-[var(--color-primary)] font-bold text-sm hover:underline">Edit</button>
                                </div>

                                <div className="p-4 rounded-lg bg-[var(--color-primary)]/5 border border-dashed border-[var(--color-primary)]/30 flex items-center justify-center cursor-pointer hover:bg-[var(--color-primary)]/10 transition-colors">
                                    <span className="text-[var(--color-primary)] text-sm font-bold">+ Create Custom Earning Rule</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-[var(--color-border-light)] flex items-center justify-between">
                                <label className="flex items-center cursor-pointer gap-3">
                                    <input defaultChecked className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" type="checkbox" />
                                    <span className="text-sm font-medium text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)]">Exclude Discounted Services from point accrual</span>
                                </label>
                                <button type="submit" className="px-6 py-2 rounded-lg bg-[var(--color-primary)] text-[#102220] text-sm font-bold shadow-sm hover:brightness-110 transition-all">
                                    Save Rules
                                </button>
                            </div>
                        </section>

                        {/* Redemption Tiers */}
                        <section className="glass-card p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg text-[var(--color-primary)]">
                                    <span className="material-symbols-outlined">redeem</span>
                                </div>
                                <h2 className="text-xl font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Redemption Tiers</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border-2 border-[var(--color-primary)]/20 flex flex-col items-center text-center group hover:border-[var(--color-primary)] transition-colors cursor-pointer">
                                    <div className="size-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-3 transition-transform group-hover:scale-110">
                                        <span className="material-symbols-outlined">payments</span>
                                    </div>
                                    <h3 className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">100 Points</h3>
                                    <p className="text-xs text-slate-500 mb-4">5,000 RWF Off Any Service</p>
                                    <button type="button" className="w-full py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold rounded-lg group-hover:bg-[var(--color-primary)] group-hover:text-[#102220] transition-colors">Manage Reward</button>
                                </div>

                                <div className="p-4 rounded-xl border-2 border-[var(--color-primary)]/20 flex flex-col items-center text-center group hover:border-[var(--color-primary)] transition-colors cursor-pointer">
                                    <div className="size-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-3 transition-transform group-hover:scale-110">
                                        <span className="material-symbols-outlined">spa</span>
                                    </div>
                                    <h3 className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">500 Points</h3>
                                    <p className="text-xs text-slate-500 mb-4">Free 30-min Sauna Session</p>
                                    <button type="button" className="w-full py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold rounded-lg group-hover:bg-[var(--color-primary)] group-hover:text-[#102220] transition-colors">Manage Reward</button>
                                </div>
                            </div>
                        </section>

                        {/* Member Tiering */}
                        <section className="glass-card p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg text-[var(--color-primary)]">
                                    <span className="material-symbols-outlined">military_tech</span>
                                </div>
                                <h2 className="text-xl font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Member Tiering</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                        <span className="material-symbols-outlined">star_half</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Silver Tier</span>
                                            <span className="text-xs font-bold text-slate-500">0 - 999,999 RWF / year</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Standard earning rates applied.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10">
                                    <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 shadow-lg shadow-yellow-400/20">
                                        <span className="material-symbols-outlined font-variation-settings-'FILL'-1">star</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-yellow-800 dark:text-yellow-400">Gold Tier</span>
                                            <span className="text-xs font-bold text-yellow-600 dark:text-yellow-500">1,000,000 - 2,499,999 RWF / year</span>
                                        </div>
                                        <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">1.2x Point multiplier & birthday gift.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-500">
                                        <span className="material-symbols-outlined">workspace_premium</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Platinum Tier</span>
                                            <span className="text-xs font-bold text-[var(--color-primary)]">2,500,000+ RWF / year</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">1.5x Multiplier & Priority Booking.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Card Preview & Stats */}
                    <div className="xl:col-span-1 space-y-8">
                        <section className="sticky top-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg text-[var(--color-primary)]">
                                    <span className="material-symbols-outlined">visibility</span>
                                </div>
                                <h2 className="text-xl font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">Client Preview</h2>
                            </div>

                            {/* Digital Card Mockup */}
                            <div className="relative w-full aspect-[1.6/1] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 overflow-hidden shadow-2xl group">
                                <div className="absolute -right-12 -top-12 size-48 bg-[var(--color-primary)]/20 rounded-full blur-3xl group-hover:bg-[var(--color-primary)]/30 transition-all duration-700"></div>
                                <div className="absolute -left-12 -bottom-12 size-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>

                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div className="size-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[#102220] text-lg font-bold">celebration</span>
                                            </div>
                                            <span className="text-white text-sm font-bold tracking-tight">VIP REWARDS</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest">Gold Member</span>
                                            <div className="h-1 w-12 bg-[var(--color-primary)] rounded-full mt-1"></div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Current Balance</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-white text-4xl font-black">1,248</span>
                                            <span className="text-[var(--color-primary)] text-sm font-bold">PTS</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-white/60 text-[10px] font-medium">Card Member Since</span>
                                            <span className="text-white text-xs font-bold">Nov 2023</span>
                                        </div>
                                        <div className="size-10 bg-white rounded flex items-center justify-center p-1 cursor-pointer hover:scale-105 transition-transform">
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded-sm">
                                                <span className="material-symbols-outlined text-slate-900 text-xl font-black">qr_code_2</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
                                <h4 className="text-sm font-bold text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)] mb-1">Visual Branding</h4>
                                <p className="text-xs text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)] mb-4">Customize how your loyalty card looks to your clients.</p>
                                <div className="flex gap-2">
                                    <div className="size-6 cursor-pointer rounded-full bg-slate-900 border-2 border-white ring-2 ring-[var(--color-primary)]"></div>
                                    <div className="size-6 cursor-pointer rounded-full bg-yellow-500 border-2 border-white hover:scale-110 transition-transform"></div>
                                    <div className="size-6 cursor-pointer rounded-full bg-blue-600 border-2 border-white hover:scale-110 transition-transform"></div>
                                    <div className="size-6 cursor-pointer rounded-full bg-emerald-600 border-2 border-white hover:scale-110 transition-transform"></div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Program Stats</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                        <span className="text-xs text-slate-500">Active Members</span>
                                        <p className="text-xl font-black mt-1 text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]">{activeMembersCount}</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                        <span className="text-xs text-slate-500">Points Issued</span>
                                        <p className="text-xl font-black mt-1 text-[var(--color-primary)]">{formatPoints(totalPointsIssued)}</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </form>
            </div>
        </div>
    );
}
