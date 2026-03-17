import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.branchId) redirect("/login");

    const client = await prisma.client.findUnique({
        where: { id, branchId: session.user.branchId },
        include: {
            memberships: {
                where: { status: "ACTIVE" },
                include: { category: true },
                orderBy: { createdAt: 'desc' },
                take: 1
            },
            loyaltyPoints: true,
            serviceRecords: {
                include: {
                    service: true,
                    employee: true
                },
                orderBy: { createdAt: 'desc' },
                take: 10
            }
        }
    });

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
                <h2 className="text-2xl font-bold mb-2">Client Not Found</h2>
                <p className="text-slate-500 mb-6">The client you are looking for does not exist or has been removed.</p>
                <Link href="/clients" className="bg-[var(--color-primary)] text-[var(--color-bg-dark)] px-6 py-2 rounded-lg font-bold">
                    Back to Directory
                </Link>
            </div>
        );
    }

    const activeMembership = client.memberships[0];
    const loyaltyInfo = client.loyaltyPoints[0];

    // Calculate visits this month
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());

    const visitsThisMonth = await prisma.serviceRecord.count({
        where: {
            clientId: client.id,
            completedAt: {
                gte: currentMonthStart,
                lte: currentMonthEnd
            },
            status: "COMPLETED"
        }
    });

    return (
        <div className="max-w-[1200px] mx-auto space-y-6">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 mb-6 text-sm items-center">
                <Link href="/clients" className="text-[var(--color-primary)] font-medium hover:underline">Clients</Link>
                <span className="text-slate-400">/</span>
                <span className="text-slate-900 font-medium">Profile</span>
            </div>

            {/* Header Profile Section */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex-1 flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl border border-[var(--color-primary)]/5 shadow-sm">
                    <div className="bg-slate-100 flex items-center justify-center rounded-lg min-h-32 w-32 shrink-0 shadow-sm border border-slate-200">
                        <span className="material-symbols-outlined text-4xl text-slate-400">account_circle</span>
                    </div>
                    <div className="flex flex-col justify-between w-full">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <p className="text-slate-900 text-3xl font-display font-bold tracking-tight">{client.fullName}</p>
                                <span className="bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    {client.clientType}
                                </span>
                            </div>
                            {client.phone && (
                                <p className="text-slate-500 text-lg flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">call</span> {client.phone}
                                </p>
                            )}
                            <p className="text-slate-500 text-sm mt-1">Client ID: {client.id.slice(-8).toUpperCase()} • Since {format(new Date(client.createdAt), 'MMM yyyy')}</p>
                        </div>
                        <div className="mt-4 flex gap-3">
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 h-11 bg-[var(--color-primary)] text-[var(--color-bg-dark)] font-bold rounded-lg shadow-sm hover:brightness-110 transition-all">
                                <span className="material-symbols-outlined text-xl">edit</span>
                                Edit Profile
                            </button>
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 h-11 bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold rounded-lg hover:bg-[var(--color-primary)]/20 transition-colors">
                                <span className="material-symbols-outlined text-xl">send</span>
                                Message
                            </button>
                        </div>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="w-full md:w-64 bg-white p-6 rounded-xl border border-[var(--color-primary)]/5 flex flex-col items-center justify-center text-center shadow-sm">
                    <p className="text-slate-900 font-bold mb-4">Client QR Access</p>
                    <div className="bg-white p-3 rounded-lg border-4 border-[var(--color-primary)] shadow-sm">
                        <div className="size-32 bg-slate-50 flex flex-col items-center justify-center rounded border border-slate-200 text-slate-300">
                            <span className="material-symbols-outlined text-5xl mb-1">qr_code_2</span>
                            <span className="text-[10px] font-mono whitespace-nowrap overflow-hidden text-ellipsis w-full px-1">{client.qrCode || 'NO-QR'}</span>
                        </div>
                    </div>
                    <button className="mt-4 text-[var(--color-primary)] text-sm font-bold flex items-center gap-1 hover:underline">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Download Pass
                    </button>
                </div>
            </div>

            {/* Membership & Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-[var(--color-primary)]/5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-slate-500 font-medium">Active Membership</p>
                        <span className="material-symbols-outlined text-[var(--color-primary)]">card_membership</span>
                    </div>
                    {activeMembership ? (
                        <>
                            <p className="text-2xl font-display font-bold text-slate-900">{activeMembership.category.name}</p>
                            {activeMembership.balance !== null && (
                                <p className="text-sm font-medium mt-1 text-slate-600 border border-slate-200 inline-block px-2 py-0.5 rounded-full">{activeMembership.balance} visits remaining</p>
                            )}
                            {activeMembership.endDate && (
                                <p className="text-xs text-slate-500 mt-2">Ends {format(new Date(activeMembership.endDate), 'MMM dd, yyyy')}</p>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-xl font-display font-bold text-slate-400">No Active Plan</p>
                            <p className="text-xs text-slate-500 mt-2">Client is currently Walk-in status</p>
                        </>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl border border-[var(--color-primary)]/5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-slate-500 font-medium">Loyalty Tier & Points</p>
                        <span className="material-symbols-outlined text-[var(--color-primary)]">workspace_premium</span>
                    </div>
                    <p className="text-2xl font-display font-bold text-slate-900">
                        {loyaltyInfo ? loyaltyInfo.tier : 'BRONZE'}
                    </p>
                    <p className="text-sm font-bold text-[var(--color-primary)] mt-1">{loyaltyInfo?.points || 0} Points</p>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">info</span>
                        Earn points on every visit
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-[var(--color-primary)]/5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-slate-500 font-medium">Visits This Month</p>
                        <span className="material-symbols-outlined text-[var(--color-primary)]">calendar_month</span>
                    </div>
                    <p className="text-2xl font-sans font-black text-slate-900">{visitsThisMonth} Session{visitsThisMonth !== 1 ? 's' : ''}</p>
                    <Link href={`/operations?clientId=${client.id}`} className="mt-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] border border-[var(--color-primary)]/30 rounded hover:bg-[var(--color-primary)]/5 transition-colors block text-center w-full">
                        Book a Session
                    </Link>
                </div>
            </div>

            {/* Past Visits Section */}
            <div className="bg-white rounded-xl border border-[var(--color-primary)]/5 shadow-sm overflow-hidden font-inter">
                <div className="px-6 py-5 border-b border-[var(--color-primary)]/10 flex items-center justify-between">
                    <h3 className="text-xl font-display font-bold text-slate-900">Recent Service History</h3>
                    <Link href={`/operations?clientId=${client.id}`} className="text-sm text-[var(--color-primary)] font-bold flex items-center gap-1 hover:underline">
                        View Full History <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>

                {client.serviceRecords.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--color-primary)]/5 border-b border-[var(--color-primary)]/5">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Staff</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {client.serviceRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 text-slate-900 font-medium whitespace-nowrap">
                                            {format(new Date(record.createdAt), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 font-medium">{record.service.name}</span>
                                                {record.boxNumber && <span className="text-xs text-slate-500">Box: {record.boxNumber}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {record.employee ? record.employee.fullName : 'Self-Service'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {record.service.duration} mins
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${record.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    record.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                        record.status === 'CREATED' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-red-100 text-red-700'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-900 font-bold text-right">
                                            {record.amount.toLocaleString()} RWF
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center bg-slate-50/50">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">history_toggle_off</span>
                        <p className="text-slate-500 font-medium">No service records found for this client.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
