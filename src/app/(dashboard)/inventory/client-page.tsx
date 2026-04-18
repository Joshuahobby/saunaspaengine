"use client";

import { useState } from "react";
import Link from "next/link";

interface InventoryItem {
    id: string;
    productName: string;
    stockCount: number;
    minThreshold: number;
    unit: string;
    supplierId: string | null;
    supplier?: { id: string; name: string; category: string | null } | null;
}

interface Supplier {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    category: string | null;
    address: string | null;
    notes: string | null;
    status: string;
    _count?: { inventory: number };
}

interface InventoryClientPageProps {
    items: InventoryItem[];
    suppliers: Supplier[];
    branchId: string;
}

type TabType = "items" | "suppliers" | "alerts";

export default function InventoryClientPage({ items: initialItems, suppliers: initialSuppliers }: InventoryClientPageProps) {
    const [activeTab, setActiveTab] = useState<TabType>("items");
    const [items, setItems] = useState(initialItems);
    const [suppliers, setSuppliers] = useState(initialSuppliers);
    const [restockModal, setRestockModal] = useState<InventoryItem | null>(null);
    const [supplierModal, setSupplierModal] = useState(false);
    const [restockQty, setRestockQty] = useState("");
    const [restockNotes, setRestockNotes] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [deletingSupplier, setDeletingSupplier] = useState<string | null>(null);

    // Supplier form
    const [supplierForm, setSupplierForm] = useState({ name: "", email: "", phone: "", category: "", address: "" });

    const lowStockItems = items.filter(i => i.stockCount <= i.minThreshold);
    const outOfStockItems = items.filter(i => i.stockCount === 0);
    const totalItems = items.length;

    const getStatusIconInfo = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('oil')) return { icon: 'oil_barrel', colorClass: 'text-[var(--color-primary)] bg-[var(--color-primary)]/5' };
        if (lower.includes('towel') || lower.includes('linen')) return { icon: 'dry_cleaning', colorClass: 'text-[var(--color-primary)] bg-[var(--color-primary)]/5' };
        if (lower.includes('wood') || lower.includes('charcoal')) return { icon: 'fireplace', colorClass: 'text-[var(--text-main)] bg-[var(--bg-surface-muted)]' };
        if (lower.includes('essence') || lower.includes('eucalyptus')) return { icon: 'eco', colorClass: 'text-[var(--color-primary)] bg-[var(--color-primary)]/5' };
        return { icon: 'inventory_2', colorClass: 'text-[var(--text-muted)] bg-[var(--bg-surface-muted)]' };
    };

    const handleRestock = async () => {
        if (!restockModal || !restockQty || parseInt(restockQty) <= 0) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/inventory/${restockModal.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ addStock: restockQty, notes: restockNotes }),
            });
            if (res.ok) {
                const updated = await res.json();
                setItems(prev => prev.map(i => i.id === updated.id ? { ...i, stockCount: updated.stockCount } : i));
                setRestockModal(null);
                setRestockQty("");
                setRestockNotes("");
            }
        } catch (e) { console.error(e); }
        setIsLoading(false);
    };

    const handleAddSupplier = async () => {
        if (!supplierForm.name.trim()) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/suppliers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(supplierForm),
            });
            if (res.ok) {
                const newSupplier = await res.json();
                setSuppliers(prev => [...prev, { ...newSupplier, _count: { inventory: 0 } }]);
                setSupplierModal(false);
                setSupplierForm({ name: "", email: "", phone: "", category: "", address: "" });
            }
        } catch (e) { console.error(e); }
        setIsLoading(false);
    };

    const handleDeleteSupplier = async (id: string) => {
        setDeletingSupplier(null);
        try {
            const res = await fetch(`/api/suppliers/${id}`, { method: "DELETE" });
            if (res.ok) setSuppliers(prev => prev.filter(s => s.id !== id));
        } catch (e) { console.error(e); }
    };

    const tabs: { key: TabType; label: string; count?: number }[] = [
        { key: "items", label: "All Items", count: totalItems },
        { key: "suppliers", label: "Suppliers", count: suppliers.length },
        { key: "alerts", label: "Stock Alerts", count: lowStockItems.length },
    ];

    return (
        <div className="p-4 lg:p-8 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-4xl font-display font-bold tracking-tight text-[var(--text-main)]">Inventory <span className="text-[var(--color-primary)]">& Supply</span></h2>
                    <p className="text-[var(--text-muted)] mt-2 font-bold">Monitor your spa essentials and coordinate with replenishment partners.</p>
                </div>
                <div className="flex gap-4">
                    {activeTab === "suppliers" ? (
                        <button type="button" onClick={() => setSupplierModal(true)} className="flex items-center gap-3 px-8 py-4 bg-[var(--color-primary)] text-[var(--color-bg-dark)] rounded-3xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/10">
                            <span className="material-symbols-outlined text-lg">person_add</span>
                            Add Supplier
                        </button>
                    ) : (
                        <Link href="/inventory/new" className="flex items-center gap-3 px-8 py-4 bg-[var(--color-primary)] text-[var(--color-bg-dark)] rounded-3xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/10">
                            <span className="material-symbols-outlined text-lg">add</span>
                            Add New Item
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div className="p-10 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] hover:-translate-y-1 transition-all duration-500 shadow-sm">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 opacity-60">Total Categories</p>
                    <p className="text-4xl font-display font-bold text-[var(--text-main)]">{totalItems}</p>
                </div>
                <div className="p-10 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] hover:-translate-y-1 transition-all duration-500 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="size-2 bg-[var(--color-primary)] rounded-full shadow-[0_0_8px_var(--color-primary)]"></span>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">Low Stock Items</p>
                    </div>
                    <p className="text-4xl font-display font-bold text-[var(--color-primary)]">{lowStockItems.length}</p>
                </div>
                <div className="p-10 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] hover:-translate-y-1 transition-all duration-500 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="size-2 bg-red-400 dark:bg-red-500/50 rounded-full shadow-[0_0_8px_rgba(248,113,113,0.3)]"></span>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">Out of Stock</p>
                    </div>
                    <p className="text-4xl font-display font-bold text-red-500 dark:text-red-400">{outOfStockItems.length}</p>
                </div>
                <div className="p-10 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] hover:-translate-y-1 transition-all duration-500 shadow-sm">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 opacity-60">Active Suppliers</p>
                    <p className="text-4xl font-display font-bold text-[var(--text-main)]">{suppliers.length}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--border-muted)] mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        type="button"
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-10 py-5 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === tab.key
                            ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border-transparent opacity-60'
                        }`}
                    >
                        {tab.label} {tab.count !== undefined && <span className="ml-1 opacity-60">({tab.count})</span>}
                    </button>
                ))}
            </div>

            {/* TAB: All Items */}
            {activeTab === "items" && (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    <div className="xl:col-span-3">
                        <div className="glass-card overflow-hidden border border-[var(--border-muted)] shadow-none rounded-[2.5rem]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-max border-collapse">
                                    <thead className="bg-[var(--bg-surface-muted)]">
                                        <tr>
                                            <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-60">Item Name</th>
                                            <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-60">Supplier</th>
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
                                                            <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center ${colorClass} shadow-sm border border-[var(--border-muted)]/10`}>
                                                                <span className="material-symbols-outlined text-xl">{icon}</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold font-display text-[var(--text-main)]">{item.productName}</p>
                                                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-40 mt-0.5">Min: {item.minThreshold} {item.unit}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-xs font-medium text-[var(--text-muted)]">
                                                            {item.supplier?.name || "—"}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`text-xs font-bold ${isLowStock ? 'text-red-500' : 'text-[var(--text-main)]'}`}>
                                                            {item.stockCount} {item.unit}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        {isOutOfStock ? (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-widest">Out of Stock</span>
                                                        ) : isLowStock ? (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 uppercase tracking-widest">Low Stock</span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold bg-[var(--bg-surface-muted)] text-[var(--text-muted)] border border-[var(--border-muted)] uppercase tracking-widest">Optimal</span>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button type="button" onClick={() => setRestockModal(item)} className={`px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${isLowStock ? 'bg-[var(--text-main)] text-[var(--bg-app)] shadow-lg shadow-[var(--text-main)]/10' : 'bg-[var(--bg-surface-muted)] text-[var(--text-main)] border border-[var(--border-muted)] hover:bg-[var(--border-muted)]'}`}>
                                                            Restock
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {items.length === 0 && (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-[var(--text-muted)] opacity-60 font-bold">No inventory items found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Alert Settings */}
                    <div className="space-y-6">
                        <div className="bg-[var(--color-primary)]/5 dark:bg-[var(--color-primary)]/10 p-10 rounded-[2.5rem] border border-[var(--color-primary)]/10 shadow-sm">
                            <h3 className="text-[10px] font-bold text-[var(--text-main)] uppercase tracking-widest mb-8">Alert Thresholds</h3>
                            <div className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-4 opacity-60">Restock point</label>
                                    <div className="flex items-center gap-6">
                                        <input aria-label="Restock Alert Threshold" className="flex-1 accent-[var(--color-primary)] cursor-pointer h-1.5 bg-[var(--text-main)]/10 rounded-full appearance-none" type="range" defaultValue={15} />
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
            )}

            {/* TAB: Suppliers */}
            {activeTab === "suppliers" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {suppliers.map(supplier => (
                        <div key={supplier.id} className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-[2.5rem] p-8 hover:-translate-y-1 transition-all duration-500 shadow-sm group">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-lg font-display border border-[var(--color-primary)]/10 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                        {supplier.name?.substring(0, 2).toUpperCase() || "??"}
                                    </div>
                                    <div>
                                        <p className="text-base font-bold font-display text-[var(--text-main)]">{supplier.name || "Unknown Supplier"}</p>
                                        <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest mt-0.5">
                                            {supplier.category || "General Supplier"}
                                        </p>
                                    </div>
                                </div>
                                <button type="button" onClick={() => setDeletingSupplier(supplier.id)} className="p-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all" aria-label={`Delete ${supplier.name}`}>
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>

                            <div className="space-y-3 mb-6">
                                {supplier.email && (
                                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                                        <span className="material-symbols-outlined text-sm opacity-40">mail</span>
                                        {supplier.email}
                                    </div>
                                )}
                                {supplier.phone && (
                                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                                        <span className="material-symbols-outlined text-sm opacity-40">call</span>
                                        {supplier.phone}
                                    </div>
                                )}
                                {supplier.address && (
                                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                                        <span className="material-symbols-outlined text-sm opacity-40">location_on</span>
                                        {supplier.address}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-muted)]">
                                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">
                                    {supplier._count?.inventory || 0} Products Supplied
                                </span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${supplier.status === "ACTIVE" ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20" : "bg-[var(--bg-surface-muted)] text-[var(--text-muted)] border border-[var(--border-muted)]"}`}>
                                    {supplier.status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {suppliers.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-[var(--bg-card)] border border-dashed border-[var(--border-muted)] rounded-[2.5rem]">
                            <span className="material-symbols-outlined text-5xl text-[var(--text-muted)] opacity-30 mb-4">local_shipping</span>
                            <p className="text-[var(--text-muted)] font-bold opacity-40">No suppliers yet. Add your first supplier to get started.</p>
                        </div>
                    )}
                </div>
            )}

            {/* TAB: Stock Alerts */}
            {activeTab === "alerts" && (
                <div className="space-y-6">
                    {lowStockItems.length === 0 ? (
                        <div className="text-center py-20 bg-[var(--bg-card)] border border-dashed border-[var(--border-muted)] rounded-[2.5rem]">
                            <span className="material-symbols-outlined text-5xl text-[var(--color-primary)] opacity-30 mb-4">verified</span>
                            <p className="text-[var(--text-main)] font-bold text-lg mb-1">All Stock Levels Optimal</p>
                            <p className="text-[var(--text-muted)] font-medium opacity-60">No items are below their minimum threshold.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {lowStockItems.map(item => {
                                const isOutOfStock = item.stockCount === 0;
                                const pctRemaining = item.minThreshold > 0 ? Math.round((item.stockCount / (item.minThreshold * 3)) * 100) : 0;
                                return (
                                    <div key={item.id} className={`bg-[var(--bg-card)] border rounded-[2rem] p-8 transition-all shadow-sm ${isOutOfStock ? 'border-red-500/30 bg-red-500/5' : 'border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`material-symbols-outlined text-2xl ${isOutOfStock ? 'text-red-500' : 'text-[var(--color-primary)]'}`}>
                                                    {isOutOfStock ? 'error' : 'warning'}
                                                </span>
                                                <div>
                                                    <p className="font-bold font-display text-[var(--text-main)]">{item.productName}</p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-[var(--text-muted)]">
                                                        {isOutOfStock ? 'CRITICAL — OUT OF STOCK' : 'LOW STOCK WARNING'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-2xl font-bold font-display ${isOutOfStock ? 'text-red-500' : 'text-[var(--color-primary)]'}`}>
                                                {item.stockCount}
                                            </span>
                                        </div>

                                        <div className="w-full bg-[var(--text-main)]/10 rounded-full h-2 mb-4">
                                            <div className={`h-2 rounded-full transition-all ${isOutOfStock ? 'bg-red-500' : 'bg-[var(--color-primary)]'}`} data-width={`${Math.min(pctRemaining, 100)}%`}></div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">
                                                Min threshold: {item.minThreshold} {item.unit}
                                            </span>
                                            <button type="button" onClick={() => setRestockModal(item)} className="px-5 py-2.5 bg-[var(--text-main)] text-[var(--bg-app)] rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-sm">
                                                Restock Now
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Restock Modal */}
            {restockModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setRestockModal(null)}>
                    <div className="bg-[var(--bg-card)] rounded-[2.5rem] p-10 max-w-md w-full border border-[var(--border-muted)] shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold font-display text-[var(--text-main)] mb-2">Restock Item</h3>
                        <p className="text-sm text-[var(--text-muted)] mb-8">{restockModal.productName} — Current: {restockModal.stockCount} {restockModal.unit}</p>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="restock-qty" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3 opacity-60">Quantity to add</label>
                                <input id="restock-qty" type="number" min="1" value={restockQty} onChange={e => setRestockQty(e.target.value)} placeholder="e.g. 50" className="w-full px-6 py-4 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl text-[var(--text-main)] placeholder:text-[var(--text-muted)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50" />
                            </div>
                            <div>
                                <label htmlFor="restock-notes" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3 opacity-60">Notes (optional)</label>
                                <input id="restock-notes" type="text" value={restockNotes} onChange={e => setRestockNotes(e.target.value)} placeholder="e.g. Delivery from Supplier X" className="w-full px-6 py-4 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl text-[var(--text-main)] placeholder:text-[var(--text-muted)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50" />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <button type="button" onClick={() => setRestockModal(null)} className="flex-1 px-6 py-4 bg-[var(--bg-surface-muted)] text-[var(--text-main)] rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-[var(--border-muted)] hover:bg-[var(--border-muted)] transition-all cursor-pointer">Cancel</button>
                            <button type="button" onClick={handleRestock} disabled={isLoading || !restockQty} className="flex-1 px-6 py-4 bg-[var(--color-primary)] text-[var(--color-bg-dark)] rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[var(--color-primary)]/20">
                                {isLoading ? "Restocking..." : "Confirm Restock"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Supplier Modal */}
            {supplierModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSupplierModal(false)}>
                    <div className="bg-[var(--bg-card)] rounded-[2.5rem] p-10 max-w-lg w-full border border-[var(--border-muted)] shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold font-display text-[var(--text-main)] mb-2">New Supplier</h3>
                        <p className="text-sm text-[var(--text-muted)] mb-8">Add a replenishment partner for your spa supplies.</p>

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="supplier-name" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3 opacity-60">Supplier Name *</label>
                                <input id="supplier-name" type="text" value={supplierForm.name} onChange={e => setSupplierForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Rwanda Essentials Ltd" className="w-full px-6 py-4 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl text-[var(--text-main)] placeholder:text-[var(--text-muted)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="supplier-email" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3 opacity-60">Email</label>
                                    <input id="supplier-email" type="email" value={supplierForm.email} onChange={e => setSupplierForm(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" className="w-full px-6 py-4 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl text-[var(--text-main)] placeholder:text-[var(--text-muted)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50" />
                                </div>
                                <div>
                                    <label htmlFor="supplier-phone" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3 opacity-60">Phone</label>
                                    <input id="supplier-phone" type="tel" value={supplierForm.phone} onChange={e => setSupplierForm(p => ({ ...p, phone: e.target.value }))} placeholder="+250 78X XXX XXX" className="w-full px-6 py-4 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl text-[var(--text-main)] placeholder:text-[var(--text-muted)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="supplier-category" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3 opacity-60">Category</label>
                                    <input id="supplier-category" type="text" value={supplierForm.category} onChange={e => setSupplierForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Essential Oils" className="w-full px-6 py-4 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl text-[var(--text-main)] placeholder:text-[var(--text-muted)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50" />
                                </div>
                                <div>
                                    <label htmlFor="supplier-address" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3 opacity-60">Address</label>
                                    <input id="supplier-address" type="text" value={supplierForm.address} onChange={e => setSupplierForm(p => ({ ...p, address: e.target.value }))} placeholder="Kigali, Rwanda" className="w-full px-6 py-4 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl text-[var(--text-main)] placeholder:text-[var(--text-muted)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <button type="button" onClick={() => setSupplierModal(false)} className="flex-1 px-6 py-4 bg-[var(--bg-surface-muted)] text-[var(--text-main)] rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-[var(--border-muted)] hover:bg-[var(--border-muted)] transition-all cursor-pointer">Cancel</button>
                            <button type="button" onClick={handleAddSupplier} disabled={isLoading || !supplierForm.name.trim()} className="flex-1 px-6 py-4 bg-[var(--color-primary)] text-[var(--color-bg-dark)] rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[var(--color-primary)]/20">
                                {isLoading ? "Creating..." : "Add Supplier"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deletingSupplier && (() => {
                const supplier = suppliers.find(s => s.id === deletingSupplier);
                if (!supplier) return null;
                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-3xl p-8 w-full max-w-sm shadow-2xl space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-red-500 text-2xl">local_shipping</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)]">Remove Supplier</h3>
                                    <p className="text-[10px] text-[var(--text-muted)] mt-1">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="text-xs font-bold text-[var(--text-main)] px-1">
                                Remove <span className="text-red-500">{supplier.name}</span> from your supplier list?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDeletingSupplier(null)}
                                    className="flex-1 h-12 rounded-2xl border border-[var(--border-muted)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteSupplier(deletingSupplier)}
                                    className="flex-1 h-12 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
