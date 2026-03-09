import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function ClientsPage() {
    const session = await auth();
    if (!session?.user?.businessId) redirect("/login");

    // Fetch clients and their active memberships, plus their last service record for "Last Visit" or total spent.
    const clients = await prisma.client.findMany({
        where: { businessId: session.user.businessId },
        include: {
            memberships: {
                where: { status: "ACTIVE" },
                include: { category: true }
            },
            serviceRecords: {
                where: { status: "COMPLETED" },
                orderBy: { createdAt: "desc" }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    const totalClients = clients.length;
    const activeMembers = clients.filter(c => c.clientType === "MEMBER").length;
    const walkIns = clients.filter(c => c.clientType === "WALK_IN").length;

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black leading-tight tracking-[-0.033em]">Client &amp; Membership Directory</h1>
                    <p className="text-slate-500 text-base font-normal leading-normal">Manage and search your spa&apos;s active members and walk-in clients.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-slate-200 text-slate-900 text-sm font-bold hover:bg-slate-300 transition-colors">
                        <span className="material-symbols-outlined mr-2 text-lg">file_download</span> Export CSV
                    </button>
                    <Link href="/clients/new" className="flex items-center justify-center rounded-lg h-10 px-4 bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-sm font-bold hover:opacity-90 transition-opacity">
                        <span className="material-symbols-outlined mr-2 text-lg">person_add</span> Register New Client
                    </Link>
                </div>
            </div>

            <div className="mb-8">
                <label className="flex flex-col w-full">
                    <div className="flex w-full items-stretch rounded-xl h-14 bg-white border border-slate-200 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[var(--color-primary)]/50 transition-all">
                        <div className="text-slate-400 flex items-center justify-center pl-5">
                            <span className="material-symbols-outlined text-2xl">search</span>
                        </div>
                        <input className="flex w-full border-none bg-transparent focus:ring-0 h-full placeholder:text-slate-400 px-4 text-lg font-normal outline-none" placeholder="Search clients by name, phone number, or email..." />
                        <div className="flex items-center gap-2 px-4 border-l border-slate-200">
                            <button className="p-2 text-slate-500 hover:text-[var(--color-primary)] transition-colors">
                                <span className="material-symbols-outlined">tune</span>
                            </button>
                        </div>
                    </div>
                </label>
            </div>

            <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[var(--color-primary)] text-[var(--color-bg-dark)] px-5 font-bold text-sm">
                    All Clients <span className="bg-[var(--color-bg-dark)]/10 px-2 py-0.5 rounded-full text-xs">{totalClients}</span>
                </button>
                <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-slate-200 px-5 text-sm font-medium hover:border-[var(--color-primary)] transition-colors">
                    Active Members <span className="text-slate-400 text-xs">{activeMembers}</span>
                </button>
                <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-slate-200 px-5 text-sm font-medium hover:border-[var(--color-primary)] transition-colors">
                    Walk-ins <span className="text-slate-400 text-xs">{walkIns}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => {
                    const isMember = client.clientType === "MEMBER";
                    const lastVisit = client.serviceRecords.length > 0 ? formatDistanceToNow(new Date(client.serviceRecords[0].createdAt), { addSuffix: true }) : "Never";
                    const totalSpent = client.serviceRecords.reduce((sum, record) => sum + record.amount, 0);

                    // Optional: Get active membership details
                    const activeMembership = client.memberships[0];

                    return (
                        <div key={client.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`size-12 rounded-full flex items-center justify-center ${isMember ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-slate-200 text-slate-500'}`}>
                                        <span className="material-symbols-outlined text-2xl font-bold">person</span>
                                    </div>
                                    <div>
                                        <h3 className="text-slate-900 font-bold text-lg group-hover:text-[var(--color-primary)] transition-colors truncate max-w-[150px]">{client.fullName}</h3>
                                        <p className="text-slate-500 text-xs">{client.phone || "No Phone"}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${isMember ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'bg-slate-100 text-slate-500'}`}>
                                    {client.clientType.replace("_", " ")}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg mb-4 h-[100px]">
                                {client.qrCode ? (
                                    <div className="size-16 bg-white p-1 rounded border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                                        <div className="text-[9px] text-center font-mono opacity-50 break-all leading-tight">
                                            {client.qrCode.substring(0, 30)}...
                                        </div>
                                    </div>
                                ) : (
                                    <div className="size-16 bg-white rounded border border-slate-200 shadow-sm flex items-center justify-center text-slate-300">
                                        <span className="material-symbols-outlined">qr_code_2</span>
                                    </div>
                                )}
                                <div className="flex flex-col overflow-hidden">
                                    {isMember && activeMembership ? (
                                        <>
                                            <span className="text-slate-400 text-xs uppercase font-bold tracking-tight truncate">{activeMembership.category.name}</span>
                                            <span className="text-xl font-black text-slate-900">Active</span>
                                            <span className="text-slate-500 text-xs truncate">Expires: {activeMembership.endDate ? new Date(activeMembership.endDate).toLocaleDateString() : "Never"}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-slate-400 text-xs uppercase font-bold tracking-tight">Last Visit</span>
                                            <span className="text-xl font-black text-slate-900 truncate">{lastVisit}</span>
                                            <span className="text-slate-500 text-xs">Total Spent: RWF {totalSpent.toLocaleString()}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link href={`/clients/${client.id}`} className="flex-1 bg-slate-100 hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-dark)] py-2 rounded-lg text-sm font-bold transition-all text-center flex items-center justify-center">
                                    View Profile
                                </Link>
                                <button className="w-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined text-lg">calendar_month</span>
                                </button>
                            </div>
                        </div>
                    );
                })}

                <Link href="/clients/new" className="flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 min-h-[300px] hover:border-[var(--color-primary)]/50 transition-colors cursor-pointer group">
                    <div className="size-16 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-[var(--color-primary)] mb-4 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-4xl">add</span>
                    </div>
                    <p className="font-bold text-slate-900">Add New Client</p>
                    <p className="text-slate-500 text-sm text-center">Quickly register a new member or guest</p>
                </Link>
            </div>
        </div>
    );
}
