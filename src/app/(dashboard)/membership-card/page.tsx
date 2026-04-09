import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import QRCode from "qrcode";

export default async function DigitalMembershipCardPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const memberName = session.user.fullName || "Member";
    const memberId = `SPA-${session.user.id?.slice(-5).toUpperCase() || "00000"}`;
    const qrDataUrl = await QRCode.toDataURL(memberId, {
        margin: 1,
        color: { dark: "#000000", light: "#ffffff" }
    });

    return (
        <div className="space-y-8">
            {/* Breadcrumbs & Title */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-4xl font-display font-bold tracking-tight text-[var(--text-main)]">Your Digital <span className="text-[var(--color-primary)] underline decoration-2 decoration-[var(--color-primary)]/20 underline-offset-8">Pass</span></h2>
                    <p className="text-[var(--text-muted)] text-lg font-bold mt-1">Scan this QR code at the reception for seamless check-in and loyalty tracking.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Membership Card Visual */}
                <div className="lg:col-span-7">
                    <div className="relative group">
                        <div className="w-full aspect-[1.6/1] rounded-[2.5rem] overflow-hidden shadow-2xl relative bg-slate-950 p-10 flex flex-col justify-between text-white ring-1 ring-white/10 group-hover:ring-[var(--color-primary)]/30 transition-all duration-700">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/40 via-black/40 to-black z-0"></div>
                            <div className="absolute inset-0 opacity-10 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSczMCcgaGVpZ2h0PSczMCc+PHJlY3QgZmlsbD0nbm9uZScgc3Ryb2tlPScjZmZmJyBzdHJva2Utb3BhY2l0eT0nMC4xJyB3aWR0aD0nMzAnIGhlaWdodD0nMzAnLz48L3N2Zz4=')]"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] opacity-80">Sauna SPA Engine</span>
                                    <h3 className="text-2xl font-display font-bold tracking-tight">Premium Member</h3>
                                </div>
                                <div className="text-[var(--color-primary)]">
                                    <span className="material-symbols-outlined text-4xl animate-pulse-soft">verified</span>
                                </div>
                            </div>
                            <div className="relative z-10 flex items-end justify-between">
                                <div className="flex flex-col">
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">Cardholder</p>
                                    <p className="text-xl font-bold tracking-tight font-display mt-1">{memberName}</p>
                                    <p className="text-xs text-white/30 font-mono mt-2 tracking-widest">ID: #{memberId}</p>
                                </div>
                                <div className="bg-white/95 p-4 rounded-2xl shadow-inner flex items-center justify-center backdrop-blur-sm">
                                    <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-xl flex items-center justify-center border border-dashed border-slate-200 overflow-hidden">
                                        <div className="flex flex-col items-center gap-1 w-full h-full p-2">
                                            <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="absolute -bottom-4 right-8 flex items-center gap-3 bg-[var(--color-primary)] text-[var(--color-bg-dark)] px-8 py-4 rounded-full font-bold shadow-xl shadow-[var(--color-primary)]/20 hover:-translate-y-1 transition-all active:scale-95 text-[10px] uppercase tracking-widest">
                            <span className="material-symbols-outlined text-lg">refresh</span>
                            <span>Refresh Pass</span>
                        </button>
                    </div>
                </div>

                {/* Wallet & Quick Actions */}
                <div className="lg:col-span-5 flex flex-col gap-6 justify-center">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 italic opacity-40">Mobile Access</p>
                    <button className="w-full flex items-center justify-center gap-4 bg-[#FFCC00] text-slate-900 px-6 py-5 rounded-[2rem] hover:opacity-90 transition-all active:scale-95 border border-[#FFCC00]/50 shadow-lg shadow-[#FFCC00]/5">
                        <span className="material-symbols-outlined text-2xl">phone_android</span>
                        <span className="text-lg font-bold tracking-tight italic">Link to MTN MoMo</span>
                    </button>
                    <button className="w-full flex items-center justify-center gap-4 bg-[#ED1C24] text-white px-6 py-5 rounded-[2rem] hover:opacity-90 transition-all active:scale-95 border border-[#ED1C24]/50 shadow-lg shadow-[#ED1C24]/5">
                        <span className="material-symbols-outlined text-2xl">sim_card</span>
                        <span className="text-lg font-bold tracking-tight italic">Link to Airtel Money</span>
                    </button>
                    <button className="w-full flex items-center justify-center gap-4 bg-[var(--text-main)] text-[var(--bg-app)] px-6 py-5 rounded-[2rem] hover:opacity-90 transition-all active:scale-95 border border-[var(--border-muted)] shadow-lg shadow-[var(--text-main)]/5">
                        <span className="material-symbols-outlined text-2xl">share</span>
                        <span className="text-lg font-bold tracking-tight italic">Share via WhatsApp</span>
                    </button>
                    <div className="mt-4 p-6 rounded-2xl bg-[var(--color-primary-muted)] border border-[var(--color-primary-border)] flex gap-4 items-center">
                        <span className="material-symbols-outlined text-[var(--color-primary)] font-bold">lightbulb</span>
                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest leading-loose">Tip: Increase screen brightness for faster scanning at the front desk.</p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col gap-3 rounded-[2.5rem] p-10 bg-[var(--bg-card)] border border-[var(--border-muted)] hover:-translate-y-1 transition-all duration-500 shadow-sm group">
                    <div className="flex items-center justify-between">
                        <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest opacity-40">Status</p>
                        <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--color-primary)] animate-pulse shadow-[0_0_10px_var(--color-primary)]"></span>
                    </div>
                    <p className="text-4xl font-display font-bold text-[var(--text-main)]">Active</p>
                    <p className="text-[10px] text-[var(--color-primary)] font-bold uppercase tracking-widest opacity-60">Valid Membership</p>
                </div>
                <div className="flex flex-col gap-3 rounded-[2.5rem] p-10 bg-[var(--bg-card)] border border-[var(--border-muted)] hover:-translate-y-1 transition-all duration-500 shadow-sm group">
                    <div className="flex items-center justify-between">
                        <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest opacity-40">Tier</p>
                        <span className="material-symbols-outlined text-amber-500 text-xl font-bold animate-float">workspace_premium</span>
                    </div>
                    <p className="text-4xl font-display font-bold text-[var(--text-main)]">Gold</p>
                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest opacity-40">1,250 pts to Platinum</p>
                </div>
                <div className="flex flex-col gap-3 rounded-[2.5rem] p-10 bg-[var(--bg-card)] border border-[var(--border-muted)] hover:-translate-y-1 transition-all duration-500 shadow-sm group">
                    <div className="flex items-center justify-between">
                        <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest opacity-40">Balance</p>
                        <span className="material-symbols-outlined text-[var(--color-primary)] text-xl animate-spin-slow">monetization_on</span>
                    </div>
                    <p className="text-4xl font-display font-bold text-[var(--text-main)]">4,250 <span className="text-sm font-bold tracking-widest uppercase opacity-40">pts</span></p>
                    <p className="text-[10px] text-[var(--color-primary)] font-bold uppercase tracking-widest opacity-60">Ready to redeem</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-serif font-bold tracking-tight text-[var(--text-main)] italic">Recent <span className="not-italic text-[var(--color-primary)] underline decoration-2 decoration-[var(--color-primary)]/20 underline-offset-8">Activity</span></h2>
                    <button className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest italic opacity-40 hover:opacity-100 transition-all">View All History</button>
                </div>
                <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-muted)] overflow-hidden shadow-none">
                    {[
                        { icon: "hot_tub", label: "Infrared Sauna Session", sub: "Kigali Oasis • Recently", pts: "+150 pts" },
                        { icon: "self_care", label: "Swedish Massage (60 min)", sub: "Kigali Oasis • Last week", pts: "+300 pts" },
                    ].map((activity, i) => (
                        <div key={i} className={`p-8 flex items-center justify-between ${i < 1 ? "border-b border-[var(--border-muted)]" : ""} hover:bg-[var(--bg-surface-muted)]/30 transition-colors group`}>
                            <div className="flex items-center gap-6">
                                <div className="size-16 rounded-2xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--color-primary)] border border-[var(--border-muted)] group-hover:scale-110 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-2xl font-bold italic">{activity.icon}</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-[var(--text-main)] italic tracking-tight font-serif text-lg">{activity.label}</p>
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-40">{activity.sub}</p>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-[var(--color-primary)] italic tracking-widest">{activity.pts}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
