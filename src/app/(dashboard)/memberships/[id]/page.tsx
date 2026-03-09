import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";

export default async function MembershipCategoryEditPage({ params }: { params: { id: string } }) {
    const session = await auth();
    if (!session?.user?.businessId) redirect("/login");

    const category = await prisma.membershipCategory.findUnique({
        where: { id: params.id, businessId: session.user.businessId },
        include: {
            memberships: {
                include: {
                    client: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    if (!category) {
        redirect("/memberships");
    }

    const activeMemberships = category.memberships.filter(m => m.status === 'ACTIVE');
    const mrr = activeMemberships.length * category.price;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 text-sm font-medium">
                <Link href="/dashboard" className="text-[var(--color-primary)]">Dashboard</Link>
                <span className="text-slate-400">/</span>
                <Link href="/memberships" className="text-[var(--color-primary)]">Memberships</Link>
                <span className="text-slate-400">/</span>
                <span className="text-slate-500">{category.name} Edit</span>
            </div>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">{category.name}</h1>
                    <p className="mt-2 text-slate-600">Manage settings, usage rules, and enrolled clients for this tier.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-300 transition-colors">
                        Archive Plan
                    </button>
                    <button className="bg-[var(--color-primary)] text-[var(--color-bg-dark)] px-6 py-2 rounded-lg text-sm font-bold shadow-lg hover:brightness-110 transition-all">
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Settings */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Information */}
                    <section className="bg-white p-6 rounded-xl border border-[var(--color-primary)]/10 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                            <span className="material-symbols-outlined text-[var(--color-primary)]">info</span>
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="flex flex-col gap-2">
                                <span className="text-slate-700 font-semibold text-sm">Category Name</span>
                                <input
                                    className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                    defaultValue={category.name}
                                />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="text-slate-700 font-semibold text-sm">Price (RWF)</span>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">RWF</span>
                                    <input
                                        className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 pl-14 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                        defaultValue={category.price}
                                        type="number"
                                    />
                                </div>
                            </label>
                            <label className="flex flex-col gap-2 md:col-span-2">
                                <span className="text-slate-700 font-semibold text-sm">Description</span>
                                <textarea
                                    className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] min-h-[100px]"
                                    defaultValue={category.description || ""}
                                />
                            </label>
                        </div>
                    </section>

                    {/* Validation Rules */}
                    <section className="bg-white p-6 rounded-xl border border-[var(--color-primary)]/10 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                            <span className="material-symbols-outlined text-[var(--color-primary)]">gavel</span>
                            Usage & Validation Rules
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div className="flex gap-4 items-start">
                                    <div className="p-2 bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-lg">
                                        <span className="material-symbols-outlined">calendar_today</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Validity Period</p>
                                        <p className="text-sm text-slate-500">How long is the membership active?</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        className="w-20 rounded-lg border-slate-200 bg-white text-center py-2"
                                        defaultValue={category.durationDays || ""}
                                        placeholder="∞"
                                    />
                                    <span className="font-medium text-slate-600">days</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div className="flex gap-4 items-start">
                                    <div className="p-2 bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-lg">
                                        <span className="material-symbols-outlined">arming_countdown</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Session Limit</p>
                                        <p className="text-sm text-slate-500">Total number of sauna sessions allowed.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        className="w-20 rounded-lg border-slate-200 bg-white text-center py-2"
                                        defaultValue={category.usageLimit || ""}
                                        placeholder="∞"
                                    />
                                    <span className="font-medium text-slate-600">sessions</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Quick Stats */}
                <div className="space-y-6">
                    <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 p-6 rounded-xl">
                        <h3 className="font-bold mb-4 text-xs tracking-widest uppercase text-slate-900">Plan Insights</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-3xl font-black text-slate-900">{activeMemberships.length}</p>
                                <p className="text-sm text-slate-600">Active Members</p>
                            </div>
                            <div className="h-px bg-[var(--color-primary)]/20"></div>
                            <div>
                                <p className="text-3xl font-black text-slate-900">{mrr.toLocaleString()} RWF</p>
                                <p className="text-sm text-slate-600">MRR from this tier</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold mb-4 text-slate-900">Quick Actions</h3>
                        <div className="flex flex-col gap-2">
                            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">mail</span>
                                <span>Email all members</span>
                            </button>
                            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">
                                <span className="material-symbols-outlined text-[var(--color-primary)]">download</span>
                                <span>Export CSV data</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enrolled Clients List */}
            <section className="bg-white rounded-xl border border-[var(--color-primary)]/10 shadow-sm overflow-hidden mt-12">
                <div className="p-6 border-b border-[var(--color-primary)]/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                        <span className="material-symbols-outlined text-[var(--color-primary)]">person_search</span>
                        Enrolled Clients
                    </h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            <input
                                type="text"
                                placeholder="Filter clients..."
                                className="pl-10 pr-4 py-2 border-slate-200 bg-slate-50 rounded-lg text-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                            />
                        </div>
                        <Link href="/clients/new" className="bg-[var(--color-primary)] text-[var(--color-bg-dark)] font-bold text-sm px-4 py-2 rounded-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">person_add</span>
                            Add Client
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sessions Left</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Renewal Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {category.memberships.map((membership) => {
                                const isExpiringSoon = false; // Add real logic here if needed
                                const visitsUsed = category.usageLimit && membership.balance !== null
                                    ? category.usageLimit - membership.balance
                                    : 0;
                                const usagePercentage = category.usageLimit
                                    ? ((visitsUsed / category.usageLimit) * 100).toFixed(0)
                                    : 100;

                                return (
                                    <tr key={membership.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 relative overflow-hidden">
                                                    {membership.client.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <Link href={`/clients/${membership.client.id}`} className="font-bold text-slate-900 hover:text-[var(--color-primary)] hover:underline">
                                                        {membership.client.fullName}
                                                    </Link>
                                                    <p className="text-xs text-slate-500">{membership.client.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {membership.status === 'ACTIVE' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            ) : membership.status === 'INACTIVE' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Inactive
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                    {membership.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {category.usageLimit ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${visitsUsed >= category.usageLimit ? 'bg-red-500' : 'bg-[var(--color-primary)]'}`}
                                                            style={{ width: `${Math.min((visitsUsed / category.usageLimit) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700">
                                                        {category.usageLimit - visitsUsed}/{category.usageLimit}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-500 italic">Unlimited</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {membership.endDate ? format(new Date(membership.endDate), 'MMM dd, yyyy') : 'No expiry'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-[var(--color-primary)] transition-colors">
                                                <span className="material-symbols-outlined">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {category.memberships.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic font-medium">
                                        No clients are currently enrolled in this membership tier.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
