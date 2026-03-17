"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateEmployeeAction, deleteEmployeeAction } from "@/app/(dashboard)/employees/[id]/actions";

interface EditEmployeeFormProps {
    employee: {
        id: string;
        fullName: string;
        phone: string | null;
        categoryId: string;
        branchId: string;
        status: string;
    };
    categories: { id: string; name: string }[];
    branches: { id: string; name: string }[];
    isOwner: boolean;
}

export default function EditEmployeeForm({ employee, categories, branches, isOwner }: EditEmployeeFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    async function handleUpdate(formData: FormData) {
        setLoading(true);
        setError(null);
        
        try {
            const result = await updateEmployeeAction(employee.id, formData);
            if (result?.error) {
                setError(result.error);
            } else {
                router.push("/employees");
                router.refresh();
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        setLoading(true);
        try {
            const result = await deleteEmployeeAction(employee.id);
            if (result?.error) {
                setError(result.error);
                setShowDeleteConfirm(false);
            } else {
                router.push("/employees");
                router.refresh();
            }
        } catch {
            setError("Failed to delete record. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <form action={handleUpdate} className="space-y-6">
                <div className="glass-card p-8 space-y-6 border-[var(--border-main)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                            employee.status === 'ACTIVE' 
                            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20' 
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                            {employee.status}
                        </span>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Full Name</label>
                            <input
                                required
                                aria-label="Full Name"
                                name="fullName"
                                type="text"
                                defaultValue={employee.fullName}
                                className="w-full px-4 py-3 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Phone Number</label>
                            <input
                                aria-label="Phone Number"
                                name="phone"
                                type="tel"
                                defaultValue={employee.phone || ""}
                                className="w-full px-4 py-3 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Professional Role</label>
                            <select
                                required
                                aria-label="Professional Role"
                                name="categoryId"
                                defaultValue={employee.categoryId}
                                className="w-full px-4 py-3 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all appearance-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Physical Location</label>
                            {isOwner ? (
                                <select
                                    required
                                    aria-label="Physical Location"
                                    name="branchId"
                                    defaultValue={employee.branchId}
                                    className="w-full px-4 py-3 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all appearance-none"
                                >
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="px-4 py-3 bg-[var(--bg-surface-muted)]/50 border border-[var(--border-muted)] rounded-xl text-sm text-[var(--text-muted)] font-medium italic">
                                    Locked to current branch
                                    <input type="hidden" name="branchId" value={employee.branchId} />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Employment Status</label>
                            <select
                                required
                                aria-label="Employment Status"
                                name="status"
                                defaultValue={employee.status}
                                className="w-full px-4 py-3 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all appearance-none"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                                <option value="ON_LEAVE">On Leave</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center border-t border-[var(--border-muted)]">
                        {isOwner && (
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="text-red-500 text-xs font-bold hover:underline flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">delete_forever</span>
                                Archive Staff Record
                            </button>
                        )}
                        <div className="flex gap-4 ml-auto">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 rounded-xl text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[var(--text-main)] text-[var(--bg-app)] px-8 py-3 rounded-xl text-sm font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] p-8 rounded-[2rem] max-w-md w-full shadow-2xl space-y-6">
                        <div className="size-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-display font-bold text-[var(--text-main)]">Archive Staff Profile?</h3>
                            <p className="text-sm text-[var(--text-muted)]">
                                You are about to remove <strong>{employee.fullName}</strong> from the active registry. Active service records will persist for accounting integrity.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-6 py-4 rounded-xl text-sm font-bold bg-[var(--bg-surface-muted)] text-[var(--text-main)] border border-[var(--border-muted)]"
                            >
                                Keep Profile
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="px-6 py-4 rounded-xl text-sm font-bold bg-red-500 text-white shadow-lg shadow-red-500/20"
                            >
                                {loading ? "Archiving..." : "Confirm Archive"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
