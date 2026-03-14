import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CheckInForm from "@/components/operations/check-in-form";

export default async function CheckInPage() {
    const session = await auth();
    if (!session?.user?.businessId) redirect("/login");

    const [services, employees, activeClients, stats] = await Promise.all([
        prisma.service.findMany({
            where: { businessId: session.user.businessId },
            orderBy: { category: "asc" },
        }),
        prisma.employee.findMany({
            where: { businessId: session.user.businessId, status: "ACTIVE" },
            orderBy: { fullName: "asc" },
        }),
        prisma.client.findMany({
            where: { businessId: session.user.businessId, status: "ACTIVE" },
            orderBy: { fullName: "asc" },
        }),
        Promise.all([
            prisma.serviceRecord.count({
                where: { businessId: session.user.businessId, status: { in: ["CREATED", "IN_PROGRESS"] } },
            }),
            prisma.serviceRecord.count({
                where: {
                    businessId: session.user.businessId,
                    createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                },
            }),
        ]),
    ]);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="mb-12">
                <h2 className="text-4xl font-display font-bold tracking-tight text-[var(--text-main)]">New <span className="text-[var(--color-primary)]">Service Record</span></h2>
                <p className="text-[var(--text-muted)] mt-2 font-medium text-lg">Register a client session and assign service parameters.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Client Scanner Placeholder */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                    <div className="glass-card shadow-none border border-[var(--border-muted)] overflow-hidden rounded-[2.5rem]">
                        <div className="p-8 border-b border-[var(--border-muted)] flex justify-between items-center bg-[var(--bg-surface-muted)]">
                            <h3 className="font-bold font-display text-[var(--text-main)] flex items-center gap-4 text-lg">
                                <span className="material-symbols-outlined text-[var(--color-primary)] underline decoration-2 decoration-[var(--color-primary)]/20 underline-offset-8">qr_code_scanner</span>
                                1. Client <span className="text-[var(--color-primary)]">Identification</span>
                            </h3>
                            <span className="px-5 py-2 bg-[var(--color-primary)]/5 text-[var(--color-primary)] border border-[var(--color-primary)]/20 text-[9px] font-bold rounded-full uppercase tracking-widest">Manual Mode</span>
                        </div>
                        <div className="p-8">
                            {/* Scanner placeholder */}
                            <div className="relative aspect-video rounded-[2rem] bg-[var(--bg-surface-muted)] overflow-hidden flex items-center justify-center border border-[var(--border-muted)] shadow-inner group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/5 via-transparent to-[var(--color-primary)]/5"></div>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="size-56 border border-[var(--color-primary)]/20 rounded-[2.5rem] relative animate-pulse-soft">
                                        <div className="absolute -top-1 -left-1 size-10 border-t-2 border-l-2 border-[var(--color-primary)] rounded-tl-[1.5rem]"></div>
                                        <div className="absolute -top-1 -right-1 size-10 border-t-2 border-r-2 border-[var(--color-primary)] rounded-tr-[1.5rem]"></div>
                                        <div className="absolute -bottom-1 -left-1 size-10 border-b-2 border-l-2 border-[var(--color-primary)] rounded-bl-[1.5rem]"></div>
                                        <div className="absolute -bottom-1 -right-1 size-10 border-b-2 border-r-2 border-[var(--color-primary)] rounded-br-[1.5rem]"></div>
                                    </div>
                                </div>
                                <div className="z-10 text-center px-4 animate-float">
                                    <div className="size-20 bg-[var(--bg-card)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl border border-[var(--border-main)] relative group-hover:scale-110 transition-transform">
                                        <div className="absolute inset-0 bg-[var(--color-primary)]/5 rounded-full animate-ping"></div>
                                        <span className="material-symbols-outlined text-[var(--color-primary)] text-4xl font-bold relative z-10">photo_camera</span>
                                    </div>
                                    <p className="text-[var(--text-main)] font-bold text-[10px] uppercase tracking-widest opacity-80">Sanctuary <span className="text-[var(--color-primary)]">Safe-Scan</span></p>
                                    <p className="text-[var(--text-muted)] text-[8px] font-bold uppercase tracking-widest mt-3 opacity-40 italic">Position ID within marker</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-[var(--bg-app)] rounded-[2.5rem] p-10 border border-[var(--border-muted)] shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-primary)]/[0.03] rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-[var(--color-primary)]/[0.05] transition-colors"></div>
                        <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-10 relative z-10 opacity-40">Operations Pulse</h4>
                        <div className="grid grid-cols-2 gap-12 relative z-10">
                            <div>
                                <p className="text-6xl font-sans font-black text-[var(--color-primary)] leading-none mb-3">0{stats[0]}</p>
                                <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-40">In-Session</p>
                            </div>
                            <div>
                                <p className="text-6xl font-sans font-black text-[var(--text-main)] leading-none mb-3">{stats[1]}</p>
                                <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-40">Daily Traffic</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Registration Form */}
                <div className="lg:col-span-7">
                    <CheckInForm
                        clients={activeClients.map(c => ({ id: c.id, fullName: c.fullName }))}
                        services={services.map(s => ({ id: s.id, name: s.name, category: s.category || "General", duration: s.duration, price: s.price }))}
                        employees={employees.map(e => ({ id: e.id, fullName: e.fullName }))}
                    />
                </div>
            </div>
        </div>
    );
}
