"use client";

import { useState } from "react";

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    if (score <= 2) return { score, label: "Weak", color: "bg-red-500 border-red-600" };
    if (score <= 4) return { score, label: "Fair", color: "bg-orange-500 border-orange-600" };
    if (score <= 5) return { score, label: "Good", color: "bg-amber-400 border-amber-500" };
    return { score: 6, label: "Strong", color: "bg-emerald-500 border-emerald-600" };
}

export function ChangePasswordForm({ userId }: { userId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordStrength, setPasswordStrength] = useState<{ score: number; label?: string; color?: string }>({ score: 0 });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setNewPassword(val);
        if (val) {
            setPasswordStrength(getPasswordStrength(val));
        } else {
            setPasswordStrength({ score: 0 });
        }
    };

    const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-slate-200 border-slate-300";
        if (score === 1) return "bg-red-500 border-red-600";
        if (score === 2) return "bg-orange-500 border-orange-600";
        if (score === 3) return "bg-amber-400 border-amber-500";
        if (score === 4) return "bg-emerald-500 border-emerald-600";
        return "bg-slate-200";
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (passwordStrength.score < 3) {
            setError("Password is too weak. Please choose a stronger password.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`/api/users/${userId}/password`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to update password");
            }

            setSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordStrength({ score: 0 });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-[var(--text-main)] mb-1">
                        Current Password
                    </label>
                    <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <div className="h-[1px] bg-[var(--border-light)] w-full my-4"></div>

                <div>
                    <label className="block text-sm font-bold text-[var(--text-main)] mb-1">
                        New Password
                    </label>
                    <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={handlePasswordChange}
                        className="w-full h-11 px-4 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                        placeholder="New strong password"
                    />
                    
                    {/* Password Strength Meter */}
                    {newPassword && (
                        <div className="mt-2 text-xs">
                            <div className="flex gap-1 h-1.5 mb-1">
                                {[0, 1, 2, 3, 4, 5].map((index) => ( // Adjusted to 6 segments for score 0-6
                                    <div
                                        key={index}
                                        className={`flex-1 rounded-full border transition-all duration-300 ${
                                            passwordStrength.score > index
                                                ? getStrengthColor(passwordStrength.score)
                                                : "bg-slate-100 dark:bg-slate-800 border-transparent"
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <p className={`text-[9px] font-bold uppercase tracking-widest ${
                                    passwordStrength.label === 'Weak' ? 'text-red-500' :
                                    passwordStrength.label === 'Fair' ? 'text-orange-500' :
                                    passwordStrength.label === 'Good' ? 'text-amber-500' :
                                    'text-emerald-500'
                                }`}>
                                    {passwordStrength.label || 'Evaluating...'}
                                </p>
                                {passwordStrength.score > 0 && passwordStrength.score < 6 && (
                                <p className="text-[9px] text-[var(--color-primary)] font-medium px-1">
                                    Include more complexity: Numbers, symbols, mixed casing.
                                </p>
                            )}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold text-[var(--text-main)] mb-1">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                        placeholder="Repeat new password"
                    />
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-xl flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Password updated successfully.</span>
                </div>
            )}

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || passwordStrength.score < 3 || newPassword !== confirmPassword}
                    className="w-full h-11 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-forest-400)] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                            Updating...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                            Update Password
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
