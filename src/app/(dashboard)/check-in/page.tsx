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
            <div>
                <h2 className="text-3xl font-black tracking-tight">New Service Record & Check-in</h2>
                <p className="text-slate-500 mt-1">Register a client session and assign service parameters.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Client Scanner Placeholder */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">qr_code_scanner</span>
                                1. Client Identification
                            </h3>
                            <span className="px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold rounded">MANUAL</span>
                        </div>
                        <div className="p-6">
                            {/* Scanner placeholder */}
                            <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border-2 border-dashed border-[var(--color-primary)]/30">
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="size-48 border-2 border-[var(--color-primary)] rounded-lg relative">
                                        <div className="absolute -top-1 -left-1 size-4 border-t-4 border-l-4 border-[var(--color-primary)] rounded-tl-sm"></div>
                                        <div className="absolute -top-1 -right-1 size-4 border-t-4 border-r-4 border-[var(--color-primary)] rounded-tr-sm"></div>
                                        <div className="absolute -bottom-1 -left-1 size-4 border-b-4 border-l-4 border-[var(--color-primary)] rounded-bl-sm"></div>
                                        <div className="absolute -bottom-1 -right-1 size-4 border-b-4 border-r-4 border-[var(--color-primary)] rounded-br-sm"></div>
                                    </div>
                                </div>
                                <div className="z-10 text-center px-4">
                                    <span className="material-symbols-outlined text-[var(--color-primary)] text-5xl mb-2">photo_camera</span>
                                    <p className="text-white/60 text-xs mt-4 font-medium uppercase tracking-widest">QR Scanner Coming Soon</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl p-5">
                        <h4 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3">Session Status</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-2xl font-black">{stats[0]}</p>
                                <p className="text-sm text-slate-500">In-Session</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black">{stats[1]}</p>
                                <p className="text-sm text-slate-500">Today&apos;s Check-ins</p>
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
