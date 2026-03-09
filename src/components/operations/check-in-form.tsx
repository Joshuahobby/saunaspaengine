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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full">
            <div className="p-5 border-b border-slate-200">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">edit_note</span>
                    2. Service & Assignment Details
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 font-medium">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Client */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Select Client</label>
                        <select
                            name="clientId"
                            required
                            aria-label="Select Client"
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                        >
                            <option value="" disabled>Choose a client...</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.fullName}</option>
                            ))}
                            {clients.length === 0 && <option disabled>No clients yet — add one first</option>}
                        </select>
                    </div>

                    {/* Service */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Select Service</label>
                        <select
                            name="serviceId"
                            required
                            aria-label="Select Service"
                            value={selectedService}
                            onChange={e => setSelectedService(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                        >
                            <option value="" disabled>Choose a service...</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.duration}min)</option>
                            ))}
                        </select>
                        {serviceInfo && (
                            <p className="text-xs text-[var(--color-primary)] font-semibold">
                                RWF {serviceInfo.price.toLocaleString()} · {serviceInfo.category}
                            </p>
                        )}
                    </div>

                    {/* Employee */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Assign Staff</label>
                        <select
                            name="employeeId"
                            aria-label="Assign Staff"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                        >
                            <option value="">Select staff member (optional)...</option>
                            {employees.map(e => (
                                <option key={e.id} value={e.id}>{e.fullName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Box / Room */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Box / Cabin Number</label>
                        <input
                            name="boxNumber"
                            type="text"
                            placeholder="e.g. B-104"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
                        />
                    </div>
                </div>

                {/* Payment Mode */}
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-slate-700">Payment Mode</label>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { value: "CASH", icon: "payments", label: "Cash" },
                            { value: "MOBILE_MONEY", icon: "smartphone", label: "MoMo" },
                            { value: "CARD", icon: "point_of_sale", label: "POS / Card" },
                        ].map(pm => (
                            <label key={pm.value} className="cursor-pointer">
                                <input type="radio" name="paymentMode" value={pm.value} defaultChecked={pm.value === "CASH"} className="sr-only peer" />
                                <div className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl bg-slate-50 peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]/5 peer-checked:ring-1 peer-checked:ring-[var(--color-primary)] transition-all">
                                    <span className="material-symbols-outlined text-slate-400 peer-checked:text-[var(--color-primary)] mb-2">{pm.icon}</span>
                                    <span className="text-sm font-bold">{pm.label}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Special Notes (Optional)</label>
                    <textarea
                        name="comment"
                        rows={2}
                        placeholder="e.g. Skin sensitivity, preferred temperature..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all resize-none"
                    />
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
                    <button type="reset" className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700 transition-colors">
                        Clear Form
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-10 py-3 bg-[var(--color-primary)] text-[var(--color-bg-dark)] rounded-lg font-extrabold flex items-center gap-2 hover:shadow-lg hover:shadow-[var(--color-primary)]/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Processing..." : "Confirm Check-in"}
                        <span className="material-symbols-outlined">check_circle</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
