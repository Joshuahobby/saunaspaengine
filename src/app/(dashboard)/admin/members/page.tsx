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
            business: {
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--color-border-light)] pb-8">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Global Member Directory</h1>
                    <p className="text-slate-500 mt-2 font-medium">Platform-wide overview of all registered clients across all spa branches.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-[var(--color-border-light)] shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Members</p>
                    <p className="text-2xl font-black text-slate-900">{clients.length}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-[var(--color-border-light)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        Platform Users
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-xs font-medium text-slate-500">{clients.length} total</span>
                    </h2>
                    <div className="relative flex-1 max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            type="text"
                            placeholder="Search globally by name, phone or ID..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-[var(--color-border-light)]">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Registered At</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone / ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Visits</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border-light)]">
                            {clients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold border border-slate-200">
                                                {client.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{client.fullName}</p>
                                                <p className="text-xs text-[var(--color-primary)] font-bold uppercase tracking-tight">{client.business.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600">{format(new Date(client.createdAt), 'MMM dd, yyyy')}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium">{client.phone || 'N/A'}</p>
                                        <p className="text-[10px] font-mono text-slate-400 uppercase">{client.qrCode || 'No QR'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded bg-slate-100 text-xs font-bold text-slate-600">
                                            {client._count.serviceRecords} visits
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${client.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/clients/${client.id}`} className="text-slate-400 hover:text-slate-900 transition-colors">
                                            <span className="material-symbols-outlined">visibility</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {clients.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined text-4xl text-slate-300">group_off</span>
                                            <p className="text-slate-500 font-medium italic">No members found on the platform yet.</p>
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
