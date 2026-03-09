"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerClient } from "@/app/(dashboard)/clients/new/actions";

interface MembershipCategory {
    id: string;
    name: string;
    price: number;
    type: string;
}

interface ClientRegistrationFormProps {
    membershipCategories: MembershipCategory[];
}

export default function ClientRegistrationForm({ membershipCategories }: ClientRegistrationFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successData, setSuccessData] = useState<any>(null);
    const [clientType, setClientType] = useState<"WALK_IN" | "MEMBER">("MEMBER");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        formData.append("clientType", clientType);

        // Ensure phone is present
        const phone = formData.get("phone") as string;
        if (!phone) {
            setError("Phone number is required");
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await registerClient(formData) as any;
            if (res.error) {
                setError(res.error);
            } else {
                setSuccessData(res.client);
                setTimeout(() => {
                    router.push("/clients");
                    router.refresh();
                }, 3000);
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (successData) {
        return (
            <div className="bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)] border-dashed rounded-xl p-6 flex flex-col items-center text-center mt-6">
                <div className="w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-[var(--color-bg-dark)] mb-4">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Registration Success!</h3>
                <p className="text-sm text-slate-600 mb-6">Client profile created. Redirecting to directory...</p>
                {successData.qrCode && (
                    <div className="bg-white p-4 rounded-xl shadow-inner mb-6 relative group">
                        <div className="size-40 border border-slate-200 rounded flex items-center justify-center text-slate-300">
                            <span className="material-symbols-outlined text-6xl">qr_code_2</span>
                        </div>
                        <p className="mt-2 font-mono text-xs text-slate-400 uppercase tracking-widest text-center">ID: {successData.qrCode}</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 font-medium">
                    {error}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 col-span-2">
                    <label className="text-sm font-bold">Full Name <span className="text-red-500">*</span></label>
                    <input name="fullName" required className="w-full rounded-lg border-slate-200 bg-slate-50 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/50 h-12 px-4" placeholder="e.g. Alexander Lindholm" type="text" />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold">Phone Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 material-symbols-outlined text-slate-400">call</span>
                        <input name="phone" required className="w-full pl-10 rounded-lg border-slate-200 bg-slate-50 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/50 h-12 px-4" placeholder="+250 788 000 000" type="tel" />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold">Email Address (Optional)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 material-symbols-outlined text-slate-400">mail</span>
                        <input name="email" className="w-full pl-10 rounded-lg border-slate-200 bg-slate-50 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/50 h-12 px-4" placeholder="alexander@example.com" type="email" />
                    </div>
                </div>

                <div className="col-span-2 py-4 border-t border-slate-100">
                    <label className="text-sm font-bold block mb-4">Client Category</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                        <button
                            type="button"
                            onClick={() => setClientType("MEMBER")}
                            className={`px-6 py-2 rounded-lg shadow-sm text-sm font-bold flex items-center gap-2 transition-colors ${clientType === "MEMBER" ? "bg-white text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            <span className={`material-symbols-outlined text-lg ${clientType === "MEMBER" ? "text-[var(--color-primary)]" : ""}`}>verified_user</span>
                            Member
                        </button>
                        <button
                            type="button"
                            onClick={() => setClientType("WALK_IN")}
                            className={`px-6 py-2 rounded-lg shadow-sm text-sm font-bold flex items-center gap-2 transition-colors ${clientType === "WALK_IN" ? "bg-white text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            <span className={`material-symbols-outlined text-lg ${clientType === "WALK_IN" ? "text-[var(--color-primary)]" : ""}`}>directions_walk</span>
                            Walk-In
                        </button>
                    </div>
                </div>

                {clientType === "MEMBER" && (
                    <div className="flex flex-col gap-2 col-span-2">
                        <label className="text-sm font-bold">Membership Plan Selection</label>
                        <select name="membershipCategoryId" className="w-full rounded-lg border-slate-200 bg-slate-50 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/50 h-12 px-4">
                            <option value="">-- No Initial Membership Plan --</option>
                            {membershipCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name} (RWF {cat.price.toLocaleString()})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500">Plan billing and duration will commence upon activation.</p>
                    </div>
                )}
            </div>

            <div className="flex gap-4 pt-4">
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-[var(--color-primary)] text-[var(--color-bg-dark)] py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    <span className="material-symbols-outlined">how_to_reg</span>
                    {isSubmitting ? "Processing..." : "Create Profile & Activate"}
                </button>
                <button type="button" onClick={() => router.push("/clients")} className="px-8 py-4 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50" disabled={isSubmitting}>
                    Cancel
                </button>
            </div>
        </form>
    );
}
