"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerEmployeeAction } from "@/app/(dashboard)/employees/new/actions";

interface RegistrationFormProps {
    categories: { id: string; name: string }[];
    branches: { id: string; name: string }[];
    defaultBranchId?: string;
    isOwner: boolean;
}

export default function RegistrationForm({ categories, branches, defaultBranchId, isOwner }: RegistrationFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        
        try {
            const result = await registerEmployeeAction(formData);
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

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="glass-card p-8 space-y-6 border-[var(--border-main)]">
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
                            name="fullName"
                            type="text"
                            placeholder="e.g. Jean Pierre"
                            className="w-full px-4 py-3 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Phone Number (Optional)</label>
                        <input
                            name="phone"
                            type="tel"
                            placeholder="e.g. +250 78x xxx xxx"
                            className="w-full px-4 py-3 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Professional Role</label>
                        <select
                            required
                            aria-label="Professional Role"
                            name="categoryId"
                            className="w-full px-4 py-3 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all appearance-none"
                        >
                            <option value="">Select Category...</option>
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
                                defaultValue={defaultBranchId}
                                className="w-full px-4 py-3 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all appearance-none"
                            >
                                <option value="">Assign to Branch...</option>
                                {branches.map(branch => (
                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="px-4 py-3 bg-[var(--bg-surface-muted)]/50 border border-[var(--border-muted)] rounded-xl text-sm text-[var(--text-muted)] font-medium italic">
                                Automatically assigned to current branch
                                <input type="hidden" name="branchId" value={defaultBranchId} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-xl text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] transition-all"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[var(--color-primary)] text-[var(--color-bg-dark)] px-8 py-3 rounded-xl text-sm font-bold hover:brightness-110 shadow-lg shadow-[var(--color-primary)]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                                Processing...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                Register Staff Member
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
