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
            <div className="p-5 border-b border-[var(--border-muted)] bg-[var(--bg-surface-muted)]">
                <h3 className="font-bold text-[var(--text-main)] flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-[var(--color-primary)] not-italic font-bold text-lg">medical_services</span>
                    Select Service & <span className="not-italic text-[var(--color-primary)]">Details</span>
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-[10px] text-red-600 dark:text-red-400 font-bold">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Client */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-60">Select Guest</label>
                        <select
                            name="clientId"
                            required
                            aria-label="Select Client"
                            title="Select Guest"
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-4 py-3 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all outline-none font-bold text-[var(--text-main)] appearance-none cursor-pointer text-sm"
                        >
                            <option value="" disabled>Choose a guest...</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.fullName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Service */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-60">Select Service</label>
                        <select
                            name="serviceId"
                            required
                            aria-label="Select Service"
                            title="Select Service"
                            value={selectedService}
                            onChange={e => setSelectedService(e.target.value)}
                            className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-4 py-3 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all outline-none font-bold text-[var(--text-main)] appearance-none cursor-pointer tracking-tight text-sm"
                        >
                            <option value="" disabled>Choose a service...</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.duration}min)</option>
                            ))}
                        </select>
                        {serviceInfo && (
                            <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest bg-[var(--color-primary)]/5 px-4 py-1.5 rounded-full w-fit mt-1">
                                RWF {serviceInfo.price.toLocaleString()} · {serviceInfo.category}
                            </p>
                        )}
                    </div>

                    {/* Employee */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-60">Assign Attendant</label>
                        <select
                            name="employeeId"
                            aria-label="Assign Attendant"
                            title="Assign Attendant"
                            className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-4 py-3 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all outline-none font-bold text-[var(--text-main)] appearance-none cursor-pointer text-sm"
                        >
                            <option value="">Select attendant (optional)...</option>
                            {employees.map(e => (
                                <option key={e.id} value={e.id}>{e.fullName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Box / Room */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-60">Station Number</label>
                        <input
                            name="boxNumber"
                            type="text"
                            placeholder="e.g. B-104"
                            className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-4 py-3 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all outline-none font-bold text-[var(--text-main)] tracking-tight placeholder:opacity-50 text-sm"
                        />
                    </div>
                </div>

                {/* Payment Mode (Horizontal) */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-muted)]/30">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-60 text-center">Payment Mode</label>
                    <div className="flex bg-[var(--bg-surface-muted)] p-1 rounded-2xl border border-[var(--border-muted)]/50">
                        {[
                            { value: "CASH", icon: "payments", label: "CASH" },
                            { value: "MOMO", icon: "smartphone", label: "MOMO" },
                            { value: "POS", icon: "point_of_sale", label: "POS" },
                        ].map(pm => (
                            <label key={pm.value} className="flex-1 cursor-pointer group">
                                <input type="radio" name="paymentMode" value={pm.value} defaultChecked={pm.value === "CASH"} className="sr-only peer" />
                                <div className="flex flex-col items-center justify-center py-2 rounded-xl peer-checked:bg-[var(--color-primary)]/10 peer-checked:border-[var(--color-primary)] transition-all hover:bg-[var(--color-primary)]/5 border border-transparent">
                                    <span className="material-symbols-outlined text-[var(--text-muted)] peer-checked:text-[var(--color-primary)] text-base font-bold transition-colors">{pm.icon}</span>
                                    <span className="text-[7px] font-black text-[var(--text-muted)] peer-checked:text-[var(--text-main)] mt-0.5 tracking-tighter">{pm.label}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-60">Special Notes (Optional)</label>
                    <textarea
                        name="comment"
                        rows={2}
                        placeholder="e.g. Skin sensitivity..."
                        className="w-full bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] rounded-2xl px-4 py-3 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all outline-none font-bold text-[var(--text-main)] resize-none text-sm"
                    />
                </div>

                {/* Actions */}
                <div className="pt-5 border-t border-[var(--border-muted)] flex items-center gap-3">
                    <button type="reset" className="h-10 px-4 bg-[var(--bg-surface-muted)] border border-[var(--border-muted)] text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-red-500 hover:border-red-500/30 transition-all rounded-xl flex-1">
                        Clear
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-10 px-6 bg-[var(--color-primary)] text-[var(--color-bg-dark)] rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-[var(--color-primary)]/10 disabled:opacity-50 disabled:cursor-not-allowed group text-[10px] flex-[2]"
                    >
                        {isSubmitting ? "Wait..." : "Confirm Entry"}
                        <span className="material-symbols-outlined text-[12px] group-hover:translate-x-0.5 transition-transform font-bold">send</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
