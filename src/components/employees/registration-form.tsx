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

function validatePassword(password: string): string | null {
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return "Password must contain at least one special character.";
    return null;
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 4) return { score, label: "Fair", color: "bg-yellow-500" };
    return { score, label: "Strong", color: "bg-green-500" };
}

export default function RegistrationForm({ categories, branches, defaultBranchId, isOwner }: RegistrationFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const passwordError = password ? validatePassword(password) : null;
    const passwordMismatch = confirmPassword && password !== confirmPassword;
    const strength = getPasswordStrength(password);

    async function handleSubmit(formData: FormData) {
        // Client-side validation
        const pw = formData.get("password") as string;
        const cpw = formData.get("confirmPassword") as string;
        
        const pwError = validatePassword(pw);
        if (pwError) {
            setError(pwError);
            return;
        }
        if (pw !== cpw) {
            setError("Passwords do not match.");
            return;
        }

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

                {/* Section: Identity */}
                <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-widest flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">person</span>
                        Identity & Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Full Name *</label>
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

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Email Address *</label>
                            <input
                                required
                                name="email"
                                type="email"
                                placeholder="e.g. jean.pierre@saunaspa.rw"
                                className="w-full px-4 py-3 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                            />
                            <p className="text-[9px] text-[var(--text-muted)] opacity-60 px-1">This email will be used as the employee&apos;s login credential.</p>
                        </div>
                    </div>
                </div>

                {/* Section: Security */}
                <div className="pt-4 border-t border-[var(--border-muted)]">
                    <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-widest flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">lock</span>
                        Login Credentials
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Password *</label>
                            <div className="relative">
                                <input
                                    required
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Set initial password"
                                    className="w-full px-4 py-3 pr-12 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </span>
                                </button>
                            </div>
                            {/* Password strength meter */}
                            {password && (
                                <div className="space-y-1 mt-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all ${
                                                    i <= strength.score ? strength.color : "bg-[var(--border-muted)]"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest ${
                                        strength.label === "Weak" ? "text-red-500" : strength.label === "Fair" ? "text-yellow-500" : "text-green-500"
                                    }`}>{strength.label}</p>
                                </div>
                            )}
                            {passwordError && (
                                <p className="text-[9px] text-red-400 font-medium px-1">{passwordError}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Confirm Password *</label>
                            <input
                                required
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter password"
                                className={`w-full px-4 py-3 bg-[var(--bg-surface-muted)] border rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all ${
                                    passwordMismatch ? "border-red-500" : "border-[var(--border-muted)]"
                                }`}
                            />
                            {passwordMismatch && (
                                <p className="text-[9px] text-red-400 font-medium px-1">Passwords do not match.</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-3 p-3 bg-[var(--bg-surface-muted)]/50 rounded-lg border border-[var(--border-muted)]">
                        <p className="text-[9px] text-[var(--text-muted)] opacity-60 leading-relaxed">
                            <span className="font-bold">Password Requirements:</span> Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character.
                        </p>
                    </div>
                </div>

                {/* Section: Role & Assignment */}
                <div className="pt-4 border-t border-[var(--border-muted)]">
                    <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-widest flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">badge</span>
                        Role & Assignment
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Professional Role *</label>
                            <select
                                required
                                aria-label="Professional Role"
                                title="Professional Role"
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
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Commission Rate (%)</label>
                            <input
                                name="commissionRate"
                                type="number"
                                step="0.5"
                                min="0"
                                max="100"
                                defaultValue="5"
                                placeholder="5.0"
                                className="w-full px-4 py-3 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                            />
                            <p className="text-[9px] text-[var(--text-muted)] opacity-60 px-1">Percentage of service revenue paid as commission.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">Physical Location *</label>
                            {isOwner ? (
                                <select
                                    required
                                    aria-label="Physical Location"
                                    title="Physical Location"
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
                        disabled={loading || !!passwordError || !!passwordMismatch}
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
