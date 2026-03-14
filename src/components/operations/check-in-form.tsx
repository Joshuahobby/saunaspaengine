"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CheckInFormProps {
    clients: { id: string; fullName: string }[];
    services: { id: string; name: string; category: string; duration: number; price: number }[];
    employees: { id: string; fullName: string }[];
}

export default function CheckInForm({ clients, services, employees }: CheckInFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [selectedClient, setSelectedClient] = useState("");

    // Handle initial client from URL
    useEffect(() => {
        const clientId = searchParams.get("clientId");
        if (clientId && clients.find(c => c.id === clientId)) {
            setSelectedClient(clientId);
        }
    }, [searchParams, clients]);

    const serviceInfo = services.find(s => s.id === selectedService);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const body = {
            clientId: formData.get("clientId"),
            serviceId: formData.get("serviceId"),
            employeeId: formData.get("employeeId") || null,
            boxNumber: formData.get("boxNumber") || null,
            paymentMode: formData.get("paymentMode") || "CASH",
            comment: formData.get("comment") || null,
        };

        try {
            const res = await fetch("/api/operations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create record");
            }

            router.push("/operations");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-[var(--bg-card)] p-0 overflow-hidden h-full rounded-[2.5rem] shadow-none border border-[var(--border-muted)]">
            <div className="p-8 border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]">
                <h3 className="font-bold font-serif text-[var(--text-main)] flex items-center gap-4 italic text-lg">
                    <span className="material-symbols-outlined text-[var(--color-primary)] not-italic font-bold">edit_note</span>
                    2. Service <span className="not-italic text-[var(--color-primary)]">&</span> Assignment
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 text-xs text-red-600 dark:text-red-400 font-bold italic">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Client */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 italic opacity-60">Select Client</label>
                        <select
                            name="clientId"
                            required
                            aria-label="Select Client"
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-[2rem] px-6 py-5 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all outline-none font-bold text-[var(--text-main)] appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Choose a client...</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.fullName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Service */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 italic opacity-60">Select Service</label>
                        <select
                            name="serviceId"
                            required
                            aria-label="Select Service"
                            value={selectedService}
                            onChange={e => setSelectedService(e.target.value)}
                            className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-[2rem] px-6 py-5 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all outline-none font-bold text-[var(--text-main)] appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Choose a service...</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.duration}min)</option>
                            ))}
                        </select>
                        {serviceInfo && (
                            <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest bg-[var(--color-primary)]/5 px-4 py-1.5 rounded-full w-fit mt-1 italic">
                                RWF {serviceInfo.price.toLocaleString()} · {serviceInfo.category}
                            </p>
                        )}
                    </div>

                    {/* Employee */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 italic opacity-60">Assign Staff</label>
                        <select
                            name="employeeId"
                            aria-label="Assign Staff"
                            className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-[2rem] px-6 py-5 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all outline-none font-bold text-[var(--text-main)] appearance-none cursor-pointer"
                        >
                            <option value="">Select staff member (optional)...</option>
                            {employees.map(e => (
                                <option key={e.id} value={e.id}>{e.fullName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Box / Room */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 italic opacity-60">Box / Cabin Number</label>
                        <input
                            name="boxNumber"
                            type="text"
                            placeholder="e.g. B-104"
                            className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-[2rem] px-6 py-5 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all outline-none font-bold text-[var(--text-main)]"
                        />
                    </div>
                </div>

                {/* Payment Mode */}
                <div className="flex flex-col gap-6">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 italic opacity-60">Payment Mode</label>
                    <div className="grid grid-cols-3 gap-6">
                        {[
                            { value: "CASH", icon: "payments", label: "Cash" },
                            { value: "MOBILE_MONEY", icon: "smartphone", label: "MoMo" },
                            { value: "CARD", icon: "point_of_sale", label: "POS / Card" },
                        ].map(pm => (
                            <label key={pm.value} className="cursor-pointer group">
                                <input type="radio" name="paymentMode" value={pm.value} defaultChecked={pm.value === "CASH"} className="sr-only peer" />
                                <div className="flex flex-col items-center justify-center p-8 border border-[var(--border-muted)] rounded-[2.5rem] bg-[var(--bg-surface-muted)] peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]/[0.05] peer-checked:shadow-inner transition-all duration-500 group-hover:bg-[var(--color-primary)]/[0.02] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-primary)]/5 rounded-full blur-2xl -mr-8 -mt-8 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                    <span className="material-symbols-outlined text-[var(--text-muted)] peer-checked:text-[var(--color-primary)] mb-4 text-3xl transition-all duration-500 font-bold peer-checked:scale-110 relative z-10">{pm.icon}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] peer-checked:text-[var(--text-main)] transition-colors relative z-10 italic">{pm.label}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 italic opacity-60">Special Notes (Optional)</label>
                    <textarea
                        name="comment"
                        rows={3}
                        placeholder="e.g. Skin sensitivity, preferred temperature..."
                        className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-[2rem] px-6 py-5 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all outline-none font-bold text-[var(--text-main)] resize-none"
                    />
                </div>

                {/* Actions */}
                <div className="pt-8 border-t border-[var(--border-muted)] flex items-center justify-between gap-4">
                    <button type="reset" className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors italic opacity-60 hover:opacity-100">
                        Clear Selection
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-12 py-4 bg-[var(--color-primary)] text-[var(--color-bg-dark)] rounded-3xl font-bold uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-[var(--color-primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed group italic"
                    >
                        {isSubmitting ? "Processing..." : "Confirm & Check-in"}
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
