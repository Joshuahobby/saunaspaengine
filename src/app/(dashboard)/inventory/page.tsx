import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function InventoryDashboardPage() {
    const session = await auth();
    if (!session?.user?.businessId) redirect("/login");

    const items = await prisma.inventory.findMany({
        where: { businessId: session.user.businessId },
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
        if (lower.includes('oil')) return { icon: 'oil_barrel', colorClass: 'text-[var(--color-primary)] bg-[rgba(19,236,164,0.1)]' };
        if (lower.includes('towel') || lower.includes('linen')) return { icon: 'dry_cleaning', colorClass: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' };
        if (lower.includes('wood') || lower.includes('charcoal')) return { icon: 'fireplace', colorClass: 'text-slate-500 bg-slate-100 dark:bg-slate-800' };
        if (lower.includes('essence') || lower.includes('eucalyptus')) return { icon: 'eco', colorClass: 'text-[var(--color-primary)] bg-[rgba(19,236,164,0.1)]' };
        return { icon: 'inventory_2', colorClass: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' };
    };

    return (
        <div className="p-4 lg:p-8 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory & Supply Management</h2>
                    <p className="text-slate-500 dark:text-slate-400">Monitor your spa essentials and coordinate with replenishment partners.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-[var(--color-border-light)] rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export Report
                    </button>
                    <Link href="/inventory/new" className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-[#102220] rounded-lg text-sm font-bold hover:brightness-110 transition-all shadow-md">
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add New Item
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-white dark:bg-slate-900 border border-[var(--color-border-light)] rounded-xl shadow-sm">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Categories</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{totalItems}</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border border-[var(--color-border-light)] rounded-xl shadow-sm border-l-amber-500 border-l-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Low Stock Items</p>
                    <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{lowStockCount}</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border border-[var(--color-border-light)] rounded-xl shadow-sm border-l-red-500 border-l-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Out of Stock</p>
                    <p className="text-2xl font-black text-red-600 dark:text-red-400">{outOfStockCount}</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border border-[var(--color-border-light)] rounded-xl shadow-sm">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Suppliers</p>
                    <p className="text-2xl font-black text-[var(--color-primary)]">{uniqueSuppliers.length}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border-light)] mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <button className="px-6 py-3 text-sm font-semibold border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]">All Items</button>
                <button className="px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent transition-colors">Suppliers</button>
                <button className="px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent transition-colors">Stock Alerts</button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Table Section */}
                <div className="xl:col-span-3">
                    <div className="bg-[var(--color-surface-light)] rounded-xl border border-[var(--color-border-light)] overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-max border-collapse">
                                <thead className="bg-[#102220]/5 dark:bg-[#102220] border-b border-[var(--color-border-light)]">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Item Name</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Stock</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--color-border-light)]">
                                    {items.map((item) => {
                                        const { icon, colorClass } = getStatusIconInfo(item.productName);
                                        const isLowStock = item.stockCount <= item.minThreshold;

                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${colorClass}`}>
                                                            <span className="material-symbols-outlined">{icon}</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.productName}</p>
                                                            <p className="text-xs text-slate-500">Threshold: {item.minThreshold} {item.unit}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-sm ${isLowStock ? 'font-bold text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                        {item.stockCount} {item.unit}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isLowStock ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 uppercase tracking-wider">
                                                            Low Stock
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[rgba(19,236,164,0.1)] text-[var(--color-primary)] uppercase tracking-wider">
                                                            In Stock
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {isLowStock ? (
                                                        <Link href={`/inventory/${item.id}/restock`} className="bg-amber-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-amber-600 shadow-sm transition-colors">
                                                            Restock
                                                        </Link>
                                                    ) : (
                                                        <Link href={`/inventory/${item.id}/restock`} className="text-[var(--color-primary)] hover:underline text-sm font-semibold">
                                                            Restock
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
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
                    <div className="bg-[var(--color-surface-light)] rounded-xl border border-[var(--color-border-light)] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Top Suppliers</h3>
                            <button className="text-xs text-[var(--color-primary)] font-bold hover:underline cursor-pointer">See All</button>
                        </div>
                        <div className="space-y-4">
                            {uniqueSuppliers.length > 0 ? (
                                uniqueSuppliers.map((supplier, idx) => {
                                    if (!supplier) return null;
                                    return (
                                        <div key={idx} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[var(--color-primary)] font-bold text-[10px]">
                                                    {supplier.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{supplier}</p>
                                                    <p className="text-[10px] text-slate-500">Partner Supplier</p>
                                                </div>
                                            </div>
                                            <button aria-label={`Contact ${supplier}`} className="p-1.5 opacity-0 group-hover:opacity-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all text-slate-600 dark:text-slate-400">
                                                <span className="material-symbols-outlined text-sm">mail</span>
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-xs text-slate-500">No suppliers recorded</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Alert Settings */}
                    <div className="bg-[var(--color-surface-light)] rounded-xl border border-[var(--color-border-light)] p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Alert Thresholds</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-500 block mb-1">Standard Items</label>
                                <div className="flex items-center gap-3">
                                    <input aria-label="Standard Items Alert Threshold" className="flex-1 accent-[var(--color-primary)]" type="range" defaultValue={15} />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">15%</span>
                                </div>
                            </div>
                            <div className="pt-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input defaultChecked className="sr-only peer" type="checkbox" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--color-primary)]"></div>
                                    <span className="ml-3 text-xs font-medium text-slate-800 dark:text-slate-200">Auto-Notify Suppliers</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
