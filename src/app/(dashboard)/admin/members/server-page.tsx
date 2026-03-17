import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";

export default async function AdminMembersPage() {
    const session = await auth();

    // Safety check: only system admins should access this
    if (session?.user?.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const clients = await prisma.client.findMany({
        include: {
            branch: {
                select: { name: true }
            },
            _count: {
                select: { serviceRecords: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="max-w-[1440px] mx-auto w-full p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-[var(--border-muted)] pb-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl lg:text-5xl font-display font-bold text-[var(--text-main)] tracking-tight">
                        Client <span className="text-[var(--color-primary)]">Records</span>
                    </h1>
                    <p className="text-base text-[var(--text-muted)] font-medium opacity-80">Comprehensive records of all registered clients across the platform.</p>
                </div>
                <div className="bg-[var(--bg-card)] px-6 py-4 rounded-2xl border border-[var(--border-muted)] shadow-sm flex flex-col gap-0.5 min-w-[200px] group/stats">
                    <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-60">Total Registered Clients</p>
                    <div className="flex items-center gap-3">
                        <p className="text-3xl font-display font-bold text-[var(--text-main)] tracking-tighter leading-none">{clients.length}</p>
                        <span className="material-symbols-outlined text-[var(--color-primary)] opacity-40 group-hover/stats:scale-110 transition-transform font-bold">group</span>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--bg-card)] rounded-[2rem] border border-[var(--border-muted)] overflow-hidden shadow-sm group/registry">
                <div className="px-8 py-6 border-b border-[var(--border-muted)] flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-xl font-display font-bold text-[var(--text-main)] flex items-center gap-3">
                            Registered Clients
                            <span className="px-3 py-1 rounded-full bg-[var(--bg-surface-muted)]/10 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest border border-[var(--border-muted)]">{clients.length} total</span>
                        </h2>
                        <p className="text-sm text-[var(--text-muted)] font-medium opacity-60 mt-1">Administering profiles and service history for all clients.</p>
                    </div>
                    <div className="relative flex-1 max-w-xl group/search">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] opacity-40 group-hover/search:text-[var(--color-primary)] transition-colors font-bold">search</span>
                        <input
                            type="text"
                            placeholder="Search by name, phone, or client ID..."
                            className="w-full pl-12 pr-6 py-3.5 bg-[var(--bg-surface-muted)]/10 border border-[var(--border-muted)] rounded-xl text-[11px] font-bold tracking-wide text-[var(--text-main)] placeholder:opacity-30 focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1100px]">
                        <thead>
                            <tr className="bg-[var(--bg-surface-muted)]/10 border-b border-[var(--border-muted)]">
                                <th className="px-8 py-5 text-[9px] font-display font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-60">Client</th>
                                <th className="px-8 py-5 text-[9px] font-display font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-60">Join Date</th>
                                <th className="px-8 py-5 text-[9px] font-display font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-60">Contact / ID</th>
                                <th className="px-8 py-5 text-[9px] font-display font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-60">Service Sessions</th>
                                <th className="px-8 py-5 text-[9px] font-display font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-60">Status</th>
                                <th className="px-8 py-5 text-[9px] font-display font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-60 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {clients.map((client) => (
                                <tr key={client.id} className="group/row hover:bg-[var(--bg-surface-muted)]/5 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-[var(--bg-surface-muted)]/10 flex items-center justify-center text-[var(--text-main)] font-display font-bold border border-[var(--border-muted)] shadow-inner text-base group-hover/row:rotate-6 transition-transform">
                                                {client.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-display font-bold text-[var(--text-main)] leading-tight">{client.fullName}</p>
                                                <p className="text-[9px] text-[var(--color-primary)] font-bold uppercase tracking-wider mt-0.5 opacity-80">{client.branch.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-display font-bold text-[var(--text-main)] opacity-70">{format(new Date(client.createdAt), 'MMM dd, yyyy')}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-display font-bold text-[var(--text-main)] tracking-tight">{client.phone || 'N/A'}</p>
                                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5 opacity-40">{client.qrCode || 'No Client ID'}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 rounded-full bg-[var(--bg-surface-muted)]/10 text-[9px] font-bold text-[var(--text-main)] uppercase tracking-widest border border-[var(--border-muted)] group-hover/row:bg-[var(--color-primary)]/10 transition-colors">
                                            {client._count.serviceRecords} sessions
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${client.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-[var(--bg-surface-muted)]/10 text-[var(--text-muted)] border-[var(--border-muted)]'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${client.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-[var(--text-muted)] opaciy-40'}`}></span>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <Link href={`/clients/${client.id}`} className="size-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-primary)] bg-[var(--bg-surface-muted)]/10 rounded-lg transition-all inline-flex opacity-0 group-hover/row:opacity-100 hover:scale-110">
                                            <span className="material-symbols-outlined text-base opacity-60">visibility</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {clients.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <span className="material-symbols-outlined text-5xl text-[var(--text-muted)] opacity-20">group_off</span>
                                            <p className="text-lg font-display font-bold text-[var(--text-muted)] opacity-40">No clients found in the records.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
