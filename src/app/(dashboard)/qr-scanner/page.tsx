import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

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
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black tracking-tight">Membership Validation</h2>
                <p className="text-slate-500 text-lg">Position a member&apos;s QR code in front of the camera or enter their details manually.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Scanner Area */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="relative aspect-video w-full bg-slate-900 rounded-xl overflow-hidden border-2 border-[var(--color-primary)]/30">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 rounded-2xl relative border-2 border-[var(--color-primary)] shadow-[0_0_20px_rgba(19,236,164,0.4)]" style={{ background: "linear-gradient(rgba(19,236,164,0.1),rgba(19,236,164,0.1))" }}>
                                <div className="absolute h-[2px] w-full bg-[var(--color-primary)] shadow-[0_0_15px_var(--color-primary)] top-1/2"></div>
                                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-[var(--color-primary)] rounded-tl-lg"></div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-[var(--color-primary)] rounded-tr-lg"></div>
                                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-[var(--color-primary)] rounded-bl-lg"></div>
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-[var(--color-primary)] rounded-br-lg"></div>
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-[var(--color-primary)]/30 flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-primary)]"></span>
                            </span>
                            <span className="text-[var(--color-primary)] font-bold tracking-widest text-sm uppercase">Active Scanner</span>
                        </div>
                        <div className="absolute top-6 right-6">
                            <button className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-lg transition-colors">
                                <span className="material-symbols-outlined">flip_camera_ios</span>
                            </button>
                        </div>
                    </div>

                    {/* Status Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Scanner Status</p>
                                <p className="font-bold">READY TO SCAN</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                                <span className="material-symbols-outlined">lightbulb</span>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Auto-Focus</p>
                                <p className="font-bold">ENABLED</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500">
                                <span className="material-symbols-outlined">history</span>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Last Check-in</p>
                                <p className="font-bold">{recentCheckins[0] ? "RECENT" : "NONE"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Manual Entry */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[var(--color-primary)]">keyboard</span>
                            Manual Entry
                        </h3>
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-600 text-sm font-medium">Client Phone Number</label>
                                <div className="flex">
                                    <div className="bg-slate-50 border border-slate-200 border-r-0 rounded-l-lg px-3 flex items-center text-slate-400">
                                        <span className="material-symbols-outlined text-xl">phone</span>
                                    </div>
                                    <input className="w-full bg-slate-50 border border-slate-200 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] rounded-r-lg p-3 placeholder:text-slate-400" placeholder="+250 788 000 000" type="text" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-600 text-sm font-medium">Or Member ID</label>
                                <div className="flex">
                                    <div className="bg-slate-50 border border-slate-200 border-r-0 rounded-l-lg px-3 flex items-center text-slate-400">
                                        <span className="material-symbols-outlined text-xl">badge</span>
                                    </div>
                                    <input className="w-full bg-slate-50 border border-slate-200 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] rounded-r-lg p-3 placeholder:text-slate-400" placeholder="SA-98234" type="text" />
                                </div>
                            </div>
                            <button className="w-full bg-[var(--color-primary)] hover:opacity-90 text-[var(--color-bg-dark)] font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-[var(--color-primary)]/20">
                                <span className="material-symbols-outlined">search</span>
                                Validate Member
                            </button>
                        </div>
                    </div>

                    {/* Recent History */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Recent History</h3>
                        </div>
                        <div className="space-y-4">
                            {recentCheckins.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-4">No recent check-ins</p>
                            ) : (
                                recentCheckins.map((record) => (
                                    <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold">
                                                {getInitials(record.client.fullName)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{record.client.fullName}</p>
                                                <p className="text-xs text-slate-400">{record.client.clientType === "MEMBER" ? "Member" : "Walk-in"}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${record.status === "COMPLETED" ? "text-slate-400 bg-slate-100" : "text-[var(--color-primary)] bg-[var(--color-primary)]/10"}`}>
                                            {record.status === "COMPLETED" ? "DONE" : "ACTIVE"}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
