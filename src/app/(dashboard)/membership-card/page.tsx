import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DigitalMembershipCardPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const memberName = session.user.fullName || "Member";
    const memberId = `SPA-${session.user.id?.slice(-5).toUpperCase() || "00000"}`;

    return (
        <div className="space-y-8">
            {/* Breadcrumbs & Title */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-4xl font-black tracking-tight">Your Digital Pass</h2>
                    <p className="text-slate-500 text-lg">Scan this QR code at the reception for seamless check-in and loyalty tracking.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Membership Card Visual */}
                <div className="lg:col-span-7">
                    <div className="relative group">
                        <div className="w-full aspect-[1.6/1] rounded-3xl overflow-hidden shadow-2xl relative bg-slate-900 p-8 flex flex-col justify-between text-white ring-1 ring-white/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/30 to-black/80 z-0"></div>
                            {/* eslint-disable-next-line react/forbid-dom-props */}
                            <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSczMCcgaGVpZ2h0PSczMCc+PHJlY3QgZmlsbD0nbm9uZScgc3Ryb2tlPScjZmZmJyBzdHJva2Utb3BhY2l0eT0nMC4xJyB3aWR0aD0nMzAnIGhlaWdodD0nMzAnLz48L3N2Zz4=')" }}></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Sauna SPA Engine</span>
                                    <h3 className="text-2xl font-bold tracking-tight">Premium Member</h3>
                                </div>
                                <div className="text-[var(--color-primary)]">
                                    <span className="material-symbols-outlined text-4xl">verified</span>
                                </div>
                            </div>
                            <div className="relative z-10 flex items-end justify-between">
                                <div className="flex flex-col">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400">Cardholder</p>
                                    <p className="text-lg font-medium">{memberName}</p>
                                    <p className="text-sm text-slate-400 font-mono mt-1">ID: #{memberId}</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-inner flex items-center justify-center">
                                    {/* QR Code placeholder */}
                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-[var(--color-primary)]/10 rounded flex items-center justify-center border-2 border-dashed border-[var(--color-primary)]/30">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">qr_code_2</span>
                                            <span className="text-[8px] font-bold text-[var(--color-primary)] uppercase">{memberId}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="absolute -bottom-4 right-8 flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-bg-dark)] px-6 py-3 rounded-full font-bold shadow-lg hover:opacity-90 transition-all active:scale-95">
                            <span className="material-symbols-outlined">refresh</span>
                            <span>Refresh Code</span>
                        </button>
                    </div>
                </div>

                {/* Wallet & Quick Actions */}
                <div className="lg:col-span-5 flex flex-col gap-4 justify-center">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Mobile Access</p>
                    <button className="w-full flex items-center justify-center gap-3 bg-[#FFCC00] text-slate-900 p-4 rounded-xl hover:bg-[#FFCC00]/90 transition-colors border border-[#FFCC00]/50 shadow-sm">
                        <span className="material-symbols-outlined text-2xl">phone_android</span>
                        <span className="text-lg font-semibold">Link to MTN MoMo</span>
                    </button>
                    <button className="w-full flex items-center justify-center gap-3 bg-[#ED1C24] text-white p-4 rounded-xl hover:bg-[#ED1C24]/90 transition-colors border border-[#ED1C24]/50 shadow-sm">
                        <span className="material-symbols-outlined text-2xl">sim_card</span>
                        <span className="text-lg font-semibold">Link to Airtel Money</span>
                    </button>
                    <button className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white p-4 rounded-xl hover:bg-[#25D366]/90 transition-colors border border-[#25D366]/50 shadow-sm">
                        <span className="material-symbols-outlined text-2xl">share</span>
                        <span className="text-lg font-semibold">Share via WhatsApp</span>
                    </button>
                    <div className="mt-4 p-4 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex gap-4 items-start">
                        <span className="material-symbols-outlined text-[var(--color-primary)]">lightbulb</span>
                        <p className="text-sm text-slate-600">Tip: Increase screen brightness for faster scanning at the front desk.</p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Status</p>
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <p className="text-3xl font-bold">Active</p>
                    <p className="text-xs text-emerald-600 font-medium">Valid Membership</p>
                </div>
                <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Tier</p>
                        <span className="material-symbols-outlined text-amber-500 text-xl">workspace_premium</span>
                    </div>
                    <p className="text-3xl font-bold">Gold</p>
                    <p className="text-xs text-slate-500 font-medium">1,250 pts to Platinum</p>
                </div>
                <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Balance</p>
                        <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">monetization_on</span>
                    </div>
                    <p className="text-3xl font-bold">4,250 pts</p>
                    <p className="text-xs text-[var(--color-primary)] font-medium">Ready to redeem</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Recent Activity</h2>
                    <button className="text-[var(--color-primary)] text-sm font-bold hover:underline">View All History</button>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    {[
                        { icon: "hot_tub", label: "Infrared Sauna Session", sub: "Kigali Oasis • Recently", pts: "+150 pts" },
                        { icon: "self_care", label: "Swedish Massage (60 min)", sub: "Kigali Oasis • Last week", pts: "+300 pts" },
                    ].map((activity, i) => (
                        <div key={i} className={`p-4 flex items-center justify-between ${i < 1 ? "border-b border-slate-100" : ""}`}>
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)]">
                                    <span className="material-symbols-outlined">{activity.icon}</span>
                                </div>
                                <div>
                                    <p className="font-bold">{activity.label}</p>
                                    <p className="text-xs text-slate-500">{activity.sub}</p>
                                </div>
                            </div>
                            <p className="text-sm font-bold">{activity.pts}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
