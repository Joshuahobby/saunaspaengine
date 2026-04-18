"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
    id: string;
    name: string;
    description: string | null;
    _count: { employees: number };
};

export default function RolesClientPage({ initialCategories }: { initialCategories: Category[] }) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch("/api/employee-categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create role");

            // Attach default count
            data._count = { employees: 0 };
            setCategories([...categories, data].sort((a, b) => a.name.localeCompare(b.name)));
            setIsAdding(false);
            setFormData({ name: "", description: "" });
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch(`/api/employee-categories/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update role");

            setCategories(categories.map(c => c.id === id ? { ...c, ...data } : c));
            setEditingId(null);
            setFormData({ name: "", description: "" });
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(null);
        setError(null);
        try {
            const res = await fetch(`/api/employee-categories/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete role");

            setCategories(categories.filter(c => c.id !== id));
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    };

    const startEditing = (category: Category) => {
        setEditingId(category.id);
        setFormData({ name: category.name, description: category.description || "" });
        setIsAdding(false);
        setError(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setIsAdding(false);
        setFormData({ name: "", description: "" });
        setError(null);
    };

    return (
        <>
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                    <Link href="/staff?tab=directory" className="text-[var(--color-primary)] hover:underline text-sm font-bold flex items-center gap-1 mb-2">
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        Back to Staff
                    </Link>
                    <h2 className="text-3xl font-display font-bold tracking-tight text-[var(--text-main)]">Manage Roles</h2>
                    <p className="mt-2 text-[var(--text-muted)] max-w-2xl font-medium">
                        Define professional categories (e.g., Receptionist, Massage Therapist). These roles are assigned to staff and used in performance tracking.
                    </p>
                </div>
                {!isAdding && !editingId && (
                    <button
                        type="button"
                        onClick={() => { setIsAdding(true); setFormData({ name: "", description: "" }); setError(null); }}
                        className="bg-[var(--color-primary)] text-[var(--color-bg-dark)] px-5 py-3 rounded-lg text-sm font-bold flex items-center gap-2 hover:brightness-110 shadow-lg shadow-[var(--color-primary)]/20 transition-all"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        New Role
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm font-bold flex items-start gap-3">
                    <span className="material-symbols-outlined">error</span>
                    <p>{error}</p>
                </div>
            )}

            {(isAdding || editingId) && (
                <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--color-primary)]/40 shadow-lg shadow-[var(--color-primary)]/5 mb-8">
                    <h3 className="text-xl font-bold text-[var(--text-main)] mb-4">{isAdding ? 'Create New Role' : 'Edit Role'}</h3>
                    <form onSubmit={(e) => isAdding ? handleCreate(e) : handleUpdate(e, editingId!)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Role Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[var(--bg-surface-muted)] border-[var(--border-muted)] border rounded-xl px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] transition-colors text-[var(--text-main)]"
                                    placeholder="e.g. Master Therapist"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Description (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-[var(--bg-surface-muted)] border-[var(--border-muted)] border rounded-xl px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] transition-colors text-[var(--text-main)]"
                                    placeholder="What does this role entail?"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                type="button"
                                onClick={cancelEdit}
                                disabled={isLoading}
                                className="px-5 py-2.5 rounded-lg text-sm font-bold text-[var(--text-main)] hover:bg-[var(--bg-surface-muted)] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-[var(--color-primary)] text-[var(--color-bg-dark)] px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center min-w-[120px] hover:brightness-110 disabled:opacity-70 transition-all"
                            >
                                {isLoading ? "Saving..." : "Save Role"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--bg-surface-muted)]">
                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest">Role Name</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest">Description</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest text-center">Active Staff</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-muted)]">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-[var(--bg-surface-muted)]/50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                        {category.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--text-muted)]">
                                    {category.description || <span className="italic opacity-50">No description</span>}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm font-sans font-bold text-[var(--text-main)]">{category._count.employees}</span>
                                        <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase opacity-40">Assigned</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => startEditing(category)}
                                            className="text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-all p-2 hover:bg-[var(--bg-surface-muted)] rounded-xl"
                                            title="Edit Role"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeletingId(category.id)}
                                            disabled={category._count.employees > 0}
                                            className={`transition-all p-2 rounded-xl text-[18px] ${
                                                category._count.employees > 0
                                                    ? 'text-[var(--border-muted)] cursor-not-allowed'
                                                    : 'text-red-400/70 hover:text-red-400 hover:bg-red-400/10 cursor-pointer'
                                            }`}
                                            title={category._count.employees > 0 ? "Cannot delete role with assigned staff" : "Delete Role"}
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-[var(--text-muted)] font-bold opacity-60">
                                    No roles have been created yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {deletingId && (() => {
                const category = categories.find(c => c.id === deletingId);
                if (!category) return null;
                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-3xl p-8 w-full max-w-sm shadow-2xl space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-red-500 text-2xl">delete</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)]">Delete Role</h3>
                                    <p className="text-[10px] text-[var(--text-muted)] mt-1">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="text-xs font-bold text-[var(--text-main)] px-1">
                                Delete the <span className="text-red-500">{category.name}</span> role permanently?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDeletingId(null)}
                                    className="flex-1 h-12 rounded-2xl border border-[var(--border-muted)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(deletingId)}
                                    className="flex-1 h-12 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                );
        })()}
        </>
    );
}
