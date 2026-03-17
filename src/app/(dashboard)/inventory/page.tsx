import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function InventoryDashboardPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");
    if (!session.user.branchId && session.user.role !== 'OWNER') redirect("/login");

    const branchIds = session.user.role === 'OWNER'
        ? (await prisma.branch.findMany({ where: { businessId: session.user.businessId as string }, select: { id: true } })).map(b => b.id)
        : [session.user.branchId as string];

    const items = await prisma.inventory.findMany({
        where: { branchId: { in: branchIds } },
        orderBy: { productName: 'asc' }
    });

    // Calculate metrics
    const totalItems = items.length;
    const lowStockCount = items.filter(i => i.stockCount <= i.minThreshold).length;
    const outOfStockCount = items.filter(i => i.stockCount === 0).length;

    // Mock suppliers based on inventory for now since there's no Supplier model
    const uniqueSuppliers = Array.from(new Set(items.map(i => i.supplierId).filter(Boolean)));

    const getStatusIconInfo = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('oil')) return { icon: 'oil_barrel', colorClass: 'text-[var(--color-primary)] bg-[var(--color-primary)]/5' };
        if (lower.includes('towel') || lower.includes('linen')) return { icon: 'dry_cleaning', colorClass: 'text-[var(--color-primary)] bg-[var(--color-primary)]/5' };
        if (lower.includes('wood') || lower.includes('charcoal')) return { icon: 'fireplace', colorClass: 'text-[var(--text-main)] bg-[var(--bg-surface-muted)]' };
        if (lower.includes('essence') || lower.includes('eucalyptus')) return { icon: 'eco', colorClass: 'text-[var(--color-primary)] bg-[var(--color-primary)]/5' };
        return { icon: 'inventory_2', colorClass: 'text-[var(--text-muted)] bg-[var(--bg-surface-muted)]' };
    };

    return (
        <div className="p-4 lg:p-8 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-4xl font-display font-bold tracking-tight text-[var(--text-main)]">Inventory <span className="text-[var(--color-primary)]">& Supply</span></h2>
                    <p className="text-[var(--text-muted)] mt-2 font-bold">Monitor your spa essentials and coordinate with replenishment partners.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-3 px-8 py-4 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-3xl text-[10px] font-bold text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)] transition-all uppercase tracking-widest shadow-sm">
                        <span className="material-symbols-outlined text-lg text-[var(--color-primary)]">download</span>
                        Export Report
                    </button>
                    <Link href="/inventory/new" className="flex items-center gap-3 px-8 py-4 bg-[var(--color-primary)] text-[var(--color-bg-dark)] rounded-3xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/10">
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add New Item
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div className="p-10 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] hover:-translate-y-1 transition-all duration-500 shadow-sm group">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 opacity-60">Total Categories</p>
                    <p className="text-4xl font-display font-bold text-[var(--text-main)]">{totalItems}</p>
                </div>
                <div className="p-10 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] hover:-translate-y-1 transition-all duration-500 shadow-sm group">
                    <div className="flex items-center gap-3 mb-2">
                         <span className="size-2 bg-[var(--color-primary)] rounded-full shadow-[0_0_8px_var(--color-primary)]"></span>
                         <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">Low Stock Items</p>
                    </div>
                    <p className="text-4xl font-display font-bold text-[var(--color-primary)]">{lowStockCount}</p>
                </div>
                <div className="p-10 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] hover:-translate-y-1 transition-all duration-500 shadow-sm group">
                    <div className="flex items-center gap-3 mb-2">
                         <span className="size-2 bg-red-400 dark:bg-red-500/50 rounded-full shadow-[0_0_8px_rgba(248,113,113,0.3)]"></span>
                         <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">Out of Stock</p>
                    </div>
                    <p className="text-4xl font-display font-bold text-red-500 dark:text-red-400">{outOfStockCount}</p>
                </div>
                <div className="p-10 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] hover:-translate-y-1 transition-all duration-500 shadow-sm group">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 opacity-60">Active Suppliers</p>
                    <p className="text-4xl font-display font-bold text-[var(--text-main)]">{uniqueSuppliers.length}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--border-muted)] mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <button className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest border-b-2 border-[var(--color-primary)] text-[var(--color-primary)] transition-all">All Items</button>
                <button className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] border-b-2 border-transparent transition-all opacity-60">Suppliers</button>
                <button className="px-10 py-5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] border-b-2 border-transparent transition-all opacity-60">Stock Alerts</button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Table Section */}
                <div className="xl:col-span-3">
                    <div className="glass-card overflow-hidden border border-[var(--border-muted)] shadow-none rounded-[2.5rem]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-max border-collapse">
                                <thead className="bg-[var(--bg-surface-muted)]">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-60">Item Name</th>
                                        <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-60">Current Stock</th>
                                        <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-60">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-60 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-muted)]">
                                    {items.map((item) => {
                                        const { icon, colorClass } = getStatusIconInfo(item.productName);
                                        const isLowStock = item.stockCount <= item.minThreshold;
                                        const isOutOfStock = item.stockCount === 0;

                                        return (
                                            <tr key={item.id} className="hover:bg-[var(--bg-surface-muted)]/30 border-b border-[var(--border-muted)]/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center ${colorClass} shadow-sm border border-[var(--border-muted)]/10 group-hover:scale-110 transition-transform duration-500`}>
                                                            <span className="material-symbols-outlined text-xl">{icon}</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold font-display text-[var(--text-main)]">{item.productName}</p>
                                                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-40 mt-0.5">Min: {item.minThreshold} {item.unit}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`text-xs font-bold ${isLowStock ? 'text-red-500' : 'text-[var(--text-main)]'}`}>
                                                        {item.stockCount} {item.unit}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {isOutOfStock ? (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-widest">
                                                            Out of Stock
                                                        </span>
                                                    ) : isLowStock ? (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 uppercase tracking-widest">
                                                            Low Stock
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold bg-[var(--bg-surface-muted)] text-[var(--text-muted)] border border-[var(--border-muted)] uppercase tracking-widest">
                                                            Optimal
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <Link href={`/inventory/${item.id}/restock`} className={`px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${isLowStock ? 'bg-[var(--text-main)] text-[var(--bg-app)] shadow-lg shadow-[var(--text-main)]/10' : 'bg-[var(--bg-surface-muted)] text-[var(--text-main)] border border-[var(--border-muted)] hover:bg-[var(--border-muted)]'}`}>
                                                        Restock Item
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-[var(--text-muted)] opacity-60 font-bold">
                                                No inventory items found. Add some starting supplies.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Suppliers & Settings */}
                <div className="space-y-6">
                    {/* Suppliers Card - Static for now */}
                    {/* Suppliers Card - Static for now */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] p-8 rounded-[2.5rem] shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">Top Suppliers</h3>
                            <button className="text-[10px] text-[var(--color-primary)] font-bold hover:underline cursor-pointer uppercase tracking-widest">See All</button>
                        </div>
                        <div className="space-y-6">
                            {uniqueSuppliers.length > 0 ? (
                                uniqueSuppliers.map((supplier, idx) => {
                                    if (!supplier) return null;
                                    return (
                                        <div key={idx} className="flex items-center justify-between group py-1">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-2xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--color-primary)] font-bold text-xs border border-[var(--border-muted)]/20 font-display shadow-sm group-hover:scale-110 transition-transform duration-500">
                                                    {supplier.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold font-display text-[var(--text-main)]">{supplier}</p>
                                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-40 mt-0.5">Premium Partner</p>
                                                </div>
                                            </div>
                                            <button aria-label={`Contact ${supplier}`} className="p-2.5 opacity-0 group-hover:opacity-100 bg-[var(--bg-surface-muted)] hover:bg-[var(--border-muted)] rounded-2xl transition-all text-[var(--text-main)] border border-[var(--border-muted)] shadow-sm">
                                                <span className="material-symbols-outlined text-lg">mail</span>
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-6 bg-[var(--bg-surface-muted)] rounded-[1.5rem] border border-dashed border-[var(--border-muted)]">
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-40">No suppliers recorded</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Alert Settings */}
                    <div className="bg-[var(--color-primary)]/5 dark:bg-[var(--color-primary)]/10 p-10 rounded-[2.5rem] border border-[var(--color-primary)]/10 shadow-sm">
                        <h3 className="text-[10px] font-bold text-[var(--text-main)] uppercase tracking-widest mb-8">Alert Thresholds</h3>
                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-4 opacity-60">Restock point</label>
                                <div className="flex items-center gap-6">
                                    <input aria-label="Standard Items Alert Threshold" className="flex-1 accent-[var(--color-primary)] cursor-pointer h-1.5 bg-[var(--text-main)]/10 rounded-full appearance-none" type="range" defaultValue={15} />
                                    <span className="text-xs font-bold text-[var(--text-main)]">15%</span>
                                </div>
                            </div>
                            <div className="pt-2">
                                <label className="relative inline-flex items-center cursor-pointer group">
                                    <input defaultChecked className="sr-only peer" type="checkbox" />
                                    <div className="w-14 h-7 bg-[var(--text-main)]/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[var(--color-bg-dark)] after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                                    <span className="ml-4 text-[10px] font-bold text-[var(--text-main)] uppercase tracking-widest">Auto-Notify Suppliers</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
