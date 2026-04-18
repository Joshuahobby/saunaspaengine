import { auth } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getActiveBranchContext } from "@/lib/branch-context";
import { BusinessHoursForm } from "@/components/settings/BusinessHoursForm";
import FeedbackTab from "./feedback-tab";
import OperationsTabs from "./operations-tabs";
import Link from "next/link";

export default async function OperationsPage({
    searchParams,
}: {
    searchParams: Promise<{ branchId?: string; tab?: string }>;
}) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const resolvedParams = await searchParams;
    const context = await getActiveBranchContext(session, resolvedParams);
    const activeTab = resolvedParams.tab || "hours";

    const branch = context.activeBranchId
        ? await db.branch.findUnique({
            where: { id: context.activeBranchId },
            select: { id: true, name: true, businessHours: true }
        })
        : null;

    return (
        <main className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
            <div className="max-w-6xl mx-auto space-y-12 pb-24">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <Link href="/settings" className="size-10 rounded-xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors border border-[var(--border-muted)]">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] opacity-60">Control Center / Settings</span>
                </div>

                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter font-serif text-[var(--text-main)]">
                        Daily <span className="text-emerald-500">Routine.</span>
                    </h1>
                    <p className="text-sm font-bold text-[var(--text-muted)] opacity-60 leading-relaxed">
                        Performance and operational mastery for your global talent bridge.
                    </p>
                </div>

                {/* Local Navigation Component (Client-side) */}
                <OperationsTabs activeTab={activeTab} />

                {activeTab === "hours" ? (
                    <div className="space-y-10 animate-in fade-in duration-500">
                        <div className="px-4 border-l-4 border-emerald-500">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-main)]">Opening Schedule</h2>
                            <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 opacity-50">Operational Availability</p>
                        </div>

                        {branch ? (
                            <div className="space-y-10">
                                <div className="glass-card rounded-[2.5rem] border border-[var(--border-muted)] p-12 bg-[var(--bg-card)] shadow-xl relative overflow-hidden group">
                                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500 opacity-5 rounded-full blur-[100px] group-hover:opacity-10 transition-opacity duration-1000"></div>
                                    <BusinessHoursForm 
                                        branchId={branch.id} 
                                        initialHours={branch.businessHours as Parameters<typeof BusinessHoursForm>[0]["initialHours"]}
                                    />
                                </div>

                                <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] flex items-start gap-6">
                                    <span className="material-symbols-outlined text-emerald-500 text-3xl">auto_awesome</span>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-emerald-500/80 uppercase text-[10px] tracking-widest">Smart Scheduling</h4>
                                        <p className="text-sm text-[var(--text-muted)] leading-relaxed font-bold">
                                            Setting a &quot;Closed&quot; status or blocking specific hours will automatically disable online bookings and staff assignments for those times.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-20 border-2 border-dashed border-[var(--border-muted)] rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                                <span className="material-symbols-outlined text-6xl text-[var(--text-muted)]">schedule</span>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold font-serif">Select a Location</h3>
                                    <p className="text-sm max-w-sm font-bold text-[var(--text-muted)]">Please choose a specific branch from the dropdown in the sidebar to manage its opening hours.</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-500">
                         <FeedbackTab />
                    </div>
                )}
            </div>
        </main>
    );
}
