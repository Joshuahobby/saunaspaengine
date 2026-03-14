import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ManualValidationForm from "@/components/operations/manual-validation-form";

function getInitials(name: string) {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export default async function QRScannerPage() {
    const session = await auth();
    if (!session?.user?.businessId) redirect("/login");

    const recentCheckins = await prisma.serviceRecord.findMany({
        where: { businessId: session.user.businessId },
        include: {
            client: { select: { fullName: true, clientType: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    return (
        <div className="mx-auto w-full max-w-[1440px] px-4 py-12 md:px-10 space-y-12">
            <div className="flex flex-col gap-3 border-b border-[var(--border-muted)] pb-12">
                <h2 className="text-4xl lg:text-5xl font-display font-bold text-[var(--text-main)] tracking-tight">
                    Membership <span className="text-[var(--color-primary)] opacity-50">&</span> Identity Validation
                </h2>
                <p className="text-lg text-[var(--text-muted)] font-medium opacity-80 mt-1">Gaze upon the digital seal or manually invoke the registry.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Scanner Area */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="relative aspect-video w-full bg-[#1A1F16] rounded-[2.5rem] overflow-hidden border border-[var(--border-muted)] shadow-2xl group/scanner">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 rounded-[2rem] relative border-2 border-[var(--color-primary)]/50 shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.2)] bg-[var(--color-primary)]/5 group-hover/scanner:scale-105 transition-transform duration-1000">
                                <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent shadow-[0_0_15px_var(--color-primary)] top-1/2 animate-pulse"></div>
                                <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-[var(--color-primary)] opacity-40 rounded-tl-2xl"></div>
                                <div className="absolute -top-3 -right-3 w-10 h-10 border-t-2 border-r-2 border-[var(--color-primary)] opacity-40 rounded-tr-2xl"></div>
                                <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-2 border-l-2 border-[var(--color-primary)] opacity-40 rounded-bl-2xl"></div>
                                <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-2 border-r-2 border-[var(--color-primary)] opacity-40 rounded-br-2xl"></div>
                            </div>
                        </div>
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[var(--bg-app)]/20 backdrop-blur-2xl px-8 py-3 rounded-full border border-[var(--border-muted)] flex items-center gap-4">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-40"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-primary)] opacity-60 shadow-[0_0_10px_var(--color-primary)]"></span>
                            </span>
                            <span className="text-[10px] text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase opacity-80">Vision Synchronized</span>
                        </div>
                        <div className="absolute top-8 right-8">
                            <button className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white p-3 rounded-2xl border border-white/10 transition-all hover:scale-110 active:scale-90">
                                <span className="material-symbols-outlined text-xl opacity-60">flip_camera_ios</span>
                            </button>
                        </div>
                    </div>

                    {/* Status Cards */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-[var(--bg-card)] p-6 rounded-[2rem] border border-[var(--border-muted)] flex items-center gap-4 shadow-sm group/status">
                            <div className="p-4 rounded-2xl bg-[var(--bg-surface-muted)]/10 text-[var(--color-primary)] border border-[var(--border-muted)] group-hover/status:rotate-12 transition-transform">
                                <span className="material-symbols-outlined opacity-60">visibility</span>
                            </div>
                            <div>
                                <p className="text-[var(--text-muted)] text-[9px] uppercase font-bold tracking-[0.2em] opacity-60">Insight Status</p>
                                <p className="font-display font-bold text-[var(--text-main)]">OMNIPRESENT</p>
                            </div>
                        </div>
                        <div className="bg-[var(--bg-card)] p-6 rounded-[2rem] border border-[var(--border-muted)] flex items-center gap-4 shadow-sm group/status">
                            <div className="p-4 rounded-2xl bg-[var(--bg-surface-muted)]/10 text-emerald-500 border border-[var(--border-muted)] group-hover/status:-rotate-12 transition-transform">
                                <span className="material-symbols-outlined opacity-60">auto_fix_high</span>
                            </div>
                            <div>
                                <p className="text-[var(--text-muted)] text-[9px] uppercase font-bold tracking-[0.2em] opacity-60">Ethereal Focus</p>
                                <p className="font-display font-bold text-[var(--text-main)]">ALIGNED</p>
                            </div>
                        </div>
                        <div className="bg-[var(--bg-card)] p-6 rounded-[2rem] border border-[var(--border-muted)] flex items-center gap-4 shadow-sm group/status">
                            <div className="p-4 rounded-2xl bg-[var(--bg-surface-muted)]/10 text-[var(--color-primary)] border border-[var(--border-muted)] group-hover/status:scale-110 transition-transform">
                                <span className="material-symbols-outlined opacity-60">history_edu</span>
                            </div>
                            <div>
                                <p className="text-[var(--text-muted)] text-[9px] uppercase font-bold tracking-[0.2em] opacity-60">Last Ritual</p>
                                <p className="font-display font-bold text-[var(--text-main)]">{recentCheckins[0] ? "RECENT" : "NONE"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    {/* Manual Entry */}
                    <div className="bg-[var(--bg-card)] p-10 rounded-[2.5rem] border border-[var(--border-muted)] shadow-sm">
                        <h3 className="text-2xl font-display font-bold mb-8 flex items-center gap-3 text-[var(--text-main)]">
                            <span className="material-symbols-outlined text-[var(--color-primary)] opacity-40">stylus</span>
                            Manual Invocation
                        </h3>
                        <ManualValidationForm />
                    </div>

                    {/* Recent History */}
                    <div className="bg-[var(--bg-card)] p-10 rounded-[2.5rem] border border-[var(--border-muted)] shadow-sm flex-1">
                        <div className="flex justify-between items-center mb-8 border-b border-[var(--border-muted)] pb-6">
                            <h3 className="text-2xl font-display font-bold text-[var(--text-main)] tracking-tight text-center w-full">Ancestry Logs</h3>
                        </div>
                        <div className="space-y-6">
                            {recentCheckins.length === 0 ? (
                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-center py-12 italic opacity-40">No records manifest yet</p>
                            ) : (
                                recentCheckins.map((record) => (
                                    <div key={record.id} className="flex items-center justify-between p-5 rounded-2xl bg-[var(--bg-surface-muted)]/5 border border-[var(--border-muted)] group hover:bg-[var(--color-primary)]/[0.02] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface-muted)]/10 text-[var(--text-main)] border border-[var(--border-muted)] flex items-center justify-center text-xs font-bold shadow-sm group-hover:scale-110 transition-transform">
                                                {getInitials(record.client.fullName)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-display font-bold text-[var(--text-main)] leading-tight">{record.client.fullName}</p>
                                                <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mt-1 opacity-60">
                                                    {record.client.clientType === "MEMBER" ? "Sanctuary Member" : "Wandering Spirit"}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-bold px-3 py-1.5 rounded-full border tracking-widest ${record.status === "COMPLETED" ? "text-[var(--text-muted)] bg-[var(--bg-surface-muted)]/5 border-[var(--border-muted)]" : "text-[var(--color-primary)] bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20 shadow-sm shadow-[var(--color-primary)]/10"}`}>
                                            {record.status === "COMPLETED" ? "TRANSCENDED" : "ASCENDING"}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                        <button className="w-full mt-10 text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest italic hover:underline hover:opacity-80 transition-all">View All Manifests</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
