import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
export default async function MembershipsHubPage() {
    const session = await auth();
    if (!session?.user?.businessId) redirect("/login");

    const categories = await prisma.membershipCategory.findMany({
        where: { businessId: session.user.businessId, status: "ACTIVE" },
        include: {
            memberships: {
                where: { status: "ACTIVE" }
            }
        },
        orderBy: { createdAt: 'asc' }
    });

    // Helper to get image & icon based on type
    const getDetails = (type: string) => {
        switch (type) {
            case 'SUBSCRIPTION':
                return {
                    icon: 'calendar_today',
                    label: 'Time-Based',
                    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    desc: 'Monthly or yearly passes with automatic renewal. Ideal for regular local guests who visit weekly.'
                };
            case 'LIST_PASS':
                return {
                    icon: 'counter_5',
                    label: 'Usage-Based',
                    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    desc: 'Pre-paid bundles of visits. Best for occasional visitors or tourists staying for a short period.'
                };
            case 'FREE_PASS':
                return {
                    icon: 'card_giftcard',
                    label: 'Promotion',
                    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    desc: 'Complimentary Access. Trial sessions or VIP invitations. Use for marketing campaigns.'
                };
            default:
                return {
                    icon: 'card_membership',
                    label: 'Standard',
                    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    desc: 'Standard membership.'
                };
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Membership Types</h1>
                    <p className="mt-2 text-slate-600 max-w-2xl">
                        Define and manage your sauna and spa membership offerings. Configure access rules, duration, and usage limits.
                    </p>
                </div>
                <button className="bg-[var(--color-primary)] text-[var(--color-bg-dark)] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:brightness-110 transition-all">
                    <span className="material-symbols-outlined text-sm">add</span>
                    New Category
                </button>
            </div>

            {/* Membership Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(category => {
                    const details = getDetails(category.type);
                    return (
                        <div key={category.id} className="bg-white rounded-xl border border-[var(--color-primary)]/10 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-48 relative">
                                <img src={details.image} alt={category.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                                    <span className="material-symbols-outlined">{details.icon}</span>
                                    <span className="font-bold">{category.name}</span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 rounded">
                                        {details.label}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{category.price.toLocaleString()} RWF</h3>
                                <p className="text-slate-600 text-sm mb-6 flex-1">
                                    {category.description || details.desc}
                                </p>
                                <div className="space-y-3 mb-8 text-sm">
                                    {category.durationDays && (
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">check_circle</span>
                                            <span>Valid for {category.durationDays} days</span>
                                        </div>
                                    )}
                                    {category.usageLimit && (
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">check_circle</span>
                                            <span>{category.usageLimit} total visits allowed</span>
                                        </div>
                                    )}
                                </div>
                                <Link
                                    href={`/memberships/${category.id}`}
                                    className="mt-auto w-full py-3 bg-slate-100 hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-dark)] font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">settings</span>
                                    Manage Rules
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Active Configuration Summary */}
            <div className="mt-12 bg-white rounded-xl border border-[var(--color-primary)]/10 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[var(--color-primary)]/10 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Quick Activity Overview</h2>
                    <button className="text-[var(--color-primary)] text-sm font-bold hover:underline">View All Reports</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-3 text-xs font-bold uppercase text-slate-400">Category Name</th>
                                <th className="px-6 py-3 text-xs font-bold uppercase text-slate-400">Total Active</th>
                                <th className="px-6 py-3 text-xs font-bold uppercase text-slate-400">Price</th>
                                <th className="px-6 py-3 text-xs font-bold uppercase text-slate-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories.map((cat, idx) => {
                                const colors = ['bg-[var(--color-primary)]', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500'];
                                return (
                                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`}></div>
                                                <span className="font-medium text-slate-900">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {cat.memberships.length} Member{cat.memberships.length !== 1 && 's'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {cat.price.toLocaleString()} RWF
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/memberships/${cat.id}`} className="material-symbols-outlined text-slate-400 hover:text-[var(--color-primary)] transition-colors">
                                                edit
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                                        No membership categories configured yet.
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
