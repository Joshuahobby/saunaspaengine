"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SubscriptionState } from "@/lib/subscription";
import UpgradeModal from "@/components/dashboard/UpgradeModal";
import { toast } from "react-hot-toast";

interface Service {
    id: string;
    name: string;
    category: string | null;
    price: number;
    duration: number;
    status: string;
}

interface ServicesClientPageProps {
    services: Service[];
    stats: {
        total: number;
        active: number;
        avgDuration: number;
        mostPopular: string;
    };
    userRole: string;
    subState: SubscriptionState | null;
}

export default function ServicesClientPage({ services, stats, userRole, subState }: ServicesClientPageProps) {
    const router = useRouter();
    const isEmployee = userRole === "EMPLOYEE";
    const [filter, setFilter] = useState<"all" | "ACTIVE" | "INACTIVE">("all");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formName, setFormName] = useState("");
    const [formCategory, setFormCategory] = useState("");
    const [formPrice, setFormPrice] = useState("");
    const [formDuration, setFormDuration] = useState("");

    const filtered = useMemo(() => {
        if (filter === "all") return services;
        return services.filter(s => s.status === filter);
    }, [services, filter]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-RW', {
            style: 'currency',
            currency: 'RWF',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getServiceIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('massage')) return 'self_care';
        if (lowerName.includes('sauna')) return 'hot_tub';
        if (lowerName.includes('steam')) return 'waves';
        if (lowerName.includes('facial')) return 'face';
        return 'spa';
    };

    function openAdd() {
        // --- LIMIT CHECK ---
        const limit = subState?.plan?.serviceLimit ?? 0;
        if (!subState?.isActive) {
            setShowUpgradeModal(true);
            return;
        }
        if (limit > 0 && services.length >= limit) {
            setShowUpgradeModal(true);
            return;
        }

        setFormName("");
        setFormCategory("");
        setFormPrice("");
        setFormDuration("");
        setShowAddModal(true);
    }

    function openEdit(service: Service) {
        setFormName(service.name);
        setFormCategory(service.category || "");
        setFormPrice(service.price.toString());
        setFormDuration(service.duration.toString());
        setEditingService(service);
    }

    async function handleSave() {
        setSaving(true);
        try {
            let res;
            if (editingService) {
                res = await fetch(`/api/services/${editingService.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: formName, category: formCategory, price: formPrice, duration: formDuration }),
                });
            } else {
                res = await fetch("/api/services", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: formName, category: formCategory, price: formPrice, duration: formDuration }),
                });
            }

            if (!res.ok) {
                const data = await res.json();
                if (data.error === "LIMIT_REACHED") {
                    setShowAddModal(false);
                    setShowUpgradeModal(true);
                    return;
                }
                throw new Error(data.error || "Failed to save");
            }

            setShowAddModal(false);
            setEditingService(null);
            router.refresh();
        } catch (err: any) {
            console.error("Save error:", err);
            toast.error(err.message || "Failed to save service");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        setSaving(true);
        try {
            await fetch(`/api/services/${id}`, { method: "DELETE" });
            setDeletingId(null);
            router.refresh();
        } catch (err) {
            console.error("Delete error:", err);
        } finally {
            setSaving(false);
        }
    }

    const isModalOpen = showAddModal || editingService !== null;

    return (
        <div className="flex-1 p-8 lg:p-12 overflow-y-auto bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-[var(--text-main)] text-3xl font-display font-bold leading-tight tracking-tight">Service Management</h2>
                    <p className="text-[var(--text-muted)] text-base font-medium mt-1">Configure and manage your spa&apos;s treatment menu and pricing.</p>
                </div>
                {!isEmployee && (
                <button onClick={openAdd} className="flex items-center justify-center gap-2 rounded-3xl h-12 px-6 bg-[var(--color-primary)] text-[var(--color-bg-dark)] font-bold shadow-lg shadow-[var(--color-primary)]/10 hover:opacity-90 transition-all">
                    <span className="material-symbols-outlined">add_circle</span>
                    <span>Add New Service</span>
                </button>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-5">
                    <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-1">Total Services</p>
                    <p className="text-3xl font-sans font-black text-[var(--text-main)]">{stats.total}</p>
                    <div className="flex items-center gap-1 text-[var(--color-primary)] text-[10px] font-bold mt-2 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span>Update real-time</span>
                    </div>
                </div>
                <div className="glass-card p-5">
                    <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-1">Active Treatments</p>
                    <p className="text-3xl font-sans font-black text-[var(--text-main)]">{stats.active}</p>
                    <div className="flex items-center gap-1 text-[var(--text-muted)] text-[10px] font-bold mt-2 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <span>{stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% Availability</span>
                    </div>
                </div>
                <div className="glass-card p-5">
                    <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-1">Usage Limit</p>
                    <p className="text-3xl font-sans font-black text-[var(--text-main)]">{stats.total} / {subState?.plan?.serviceLimit || "∞"}</p>
                    <div className="flex items-center gap-1 text-[var(--color-primary)] text-[10px] font-bold mt-2 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">rocket</span>
                        <span>{subState?.plan?.name || "Free"} Plan</span>
                    </div>
                </div>
                <div className="glass-card p-5">
                    <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-1">Most Popular</p>
                    <p className="text-2xl font-display font-bold text-[var(--text-main)] mt-1 truncate">{stats.mostPopular}</p>
                    <div className="flex items-center gap-1 text-[var(--color-primary)] text-[10px] font-bold mt-2 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">star</span>
                        <span>Based on bookings</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6 font-medium">
                <div className="glass-card p-1.5 flex border border-[var(--border-muted)] rounded-2xl">
                    {([["all", "All Services"], ["ACTIVE", "Active"], ["INACTIVE", "Inactive"]] as const).map(([val, label]) => (
                        <button
                            key={val}
                            onClick={() => setFilter(val)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === val ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)] shadow-sm" : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)]"}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Services Table */}
            <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-surface-muted)]">
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Service ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Service Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-right">Price</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Duration</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-muted)]">
                            {filtered.map((service) => (
                                <tr key={service.id} className="hover:bg-[var(--bg-surface-muted)]/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <span className="font-mono text-[10px] font-bold text-[var(--text-muted)] uppercase truncate max-w-[80px] block">
                                            #{service.id.slice(-6)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-primary)]/10">
                                                <span className="material-symbols-outlined text-xl">{getServiceIcon(service.name)}</span>
                                            </div>
                                            <span className="font-bold text-[var(--text-main)] font-display">{service.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                            {service.category || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right font-black text-[var(--color-primary)] font-sans">{formatPrice(service.price)}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-[var(--text-main)] font-display font-medium">
                                            <span className="material-symbols-outlined text-lg">timer</span>
                                            <span className="text-sm">{service.duration} min</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className={`size-2 rounded-full ${service.status === 'ACTIVE' ? 'bg-[var(--color-primary)] animate-pulse shadow-[0_0_8px_var(--color-primary)]' : 'bg-[var(--text-muted)]'}`}></span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${service.status === 'ACTIVE' ? 'text-[var(--color-primary)]' : 'text-[var(--text-muted)]'}`}>
                                                {service.status.charAt(0) + service.status.slice(1).toLowerCase()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {!isEmployee ? (
                                        <div className="flex items-center justify-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(service)} className="text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-all hover:scale-110">
                                                <span className="material-symbols-outlined text-xl">edit</span>
                                            </button>
                                            <button onClick={() => setDeletingId(service.id)} className="text-[var(--text-muted)] hover:text-red-500 transition-all hover:scale-110">
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </div>
                                        ) : (
                                        <span className="text-[10px] text-[var(--text-muted)] opacity-40 italic font-bold">View only</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-[var(--text-muted)] opacity-60 italic font-medium">
                                        {filter !== "all" ? "No services match this filter." : "No services found. Add your first treatment to get started."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-5 border-t border-[var(--border-muted)] flex items-center justify-between bg-[var(--bg-surface-muted)]">
                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest italic leading-none">Showing {filtered.length} of {services.length} services</p>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-app)]/80 backdrop-blur-sm" onClick={() => { setShowAddModal(false); setEditingService(null); }}>
                    <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-3xl p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-serif font-bold text-[var(--text-main)] italic mb-6">
                            {editingService ? "Edit Service" : "Add New Service"}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 block italic">Service Name</label>
                                <input value={formName} onChange={e => setFormName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] text-[var(--text-main)] font-medium focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none" placeholder="e.g. Deep Tissue Massage" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 block italic">Category</label>
                                <input value={formCategory} onChange={e => setFormCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] text-[var(--text-main)] font-medium focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none" placeholder="e.g. Massage, Sauna, Steam" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 block italic">Price (RWF)</label>
                                    <input type="number" value={formPrice} onChange={e => setFormPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] text-[var(--text-main)] font-medium focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none" placeholder="5000" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 block italic">Duration (min)</label>
                                    <input type="number" value={formDuration} onChange={e => setFormDuration(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] text-[var(--text-main)] font-medium focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none" placeholder="60" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => { setShowAddModal(false); setEditingService(null); }} className="flex-1 py-3 rounded-xl border border-[var(--border-muted)] text-[var(--text-main)] font-bold hover:bg-[var(--bg-surface-muted)] transition-all">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving || !formName || !formPrice || !formDuration} className="flex-1 py-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-bg-dark)] font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[var(--color-primary)]/20">
                                {saving ? "Saving..." : editingService ? "Update Service" : "Create Service"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-app)]/80 backdrop-blur-sm" onClick={() => setDeletingId(null)}>
                    <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                <span className="material-symbols-outlined text-2xl">warning</span>
                            </div>
                            <h3 className="text-xl font-serif font-bold text-[var(--text-main)] italic">Delete Service?</h3>
                        </div>
                        <p className="text-[var(--text-muted)] mb-6 font-medium">This action cannot be undone. All associated records will be affected.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeletingId(null)} className="flex-1 py-3 rounded-xl border border-[var(--border-muted)] text-[var(--text-main)] font-bold hover:bg-[var(--bg-surface-muted)] transition-all">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deletingId)} disabled={saving} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all disabled:opacity-50">
                                {saving ? "Deleting..." : "Delete Service"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
