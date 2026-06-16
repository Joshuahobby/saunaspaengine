"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { saveBranchServicesAction } from "../actions";

interface StepProps {
    branch: {
        id: string;
        name: string | null;
    };
    onNext: () => void;
    onPrev: () => void;
}

interface ServiceEntry {
    id: number;
    name: string;
    price: number;
    duration: number;
    category: string;
    status: string;
}

export function Step2Services({ branch, onNext, onPrev }: StepProps) {
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<ServiceEntry[]>([]);

    // Form inputs
    const [nameInput, setNameInput] = useState("");
    const [categoryInput, setCategoryInput] = useState("General");
    const [priceInput, setPriceInput] = useState("");
    const [durationInput, setDurationInput] = useState("60");
    const [formError, setFormError] = useState("");

    const addService = () => {
        if (!nameInput.trim()) { setFormError("Service name is required."); return; }
        if (!priceInput || Number(priceInput) <= 0) { setFormError("Enter a valid price."); return; }
        setFormError("");
        setServices(prev => [...prev, {
            id: Date.now(),
            name: nameInput.trim(),
            price: Number(priceInput),
            duration: Number(durationInput) || 60,
            category: categoryInput || "General",
            status: "Active",
        }]);
        setNameInput("");
        setPriceInput("");
        setDurationInput("60");
    };

    const removeService = (id: number) => {
        setServices(services.filter(s => s.id !== id));
    };

    async function handleContinue() {
        setLoading(true);
        try {
            await saveBranchServicesAction(branch.id, services);
            onNext();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 py-2">
            {/* Stage Header */}
            <div className="space-y-1">
                <h1 className="text-xl font-display font-black text-[var(--text-main)] tracking-tight">Service Catalog</h1>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed opacity-80">
                    Define the services and treatments your branch offers.
                </p>
            </div>

            {/* Quick Stats / Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[var(--bg-card)]/5 border border-white/5 rounded-xl p-3 flex justify-between items-center">
                    <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">Treatments</p>
                    <p className="text-sm font-black text-[var(--text-main)]">{services.length}</p>
                </div>
                <div className="bg-[var(--bg-card)]/5 border border-white/5 rounded-xl p-3 flex justify-between items-center">
                    <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">Categories</p>
                    <p className="text-sm font-black text-[var(--text-main)]">
                        {new Set(services.map(s => s.category)).size || 0}
                    </p>
                </div>
                <div className="bg-[var(--bg-card)]/5 border border-white/5 rounded-xl p-3 flex justify-between items-center">
                    <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">Status</p>
                    <p className="text-sm font-black text-[var(--color-primary)]">
                        {services.length > 0 ? "Ready" : "Pending"}
                    </p>
                </div>
            </div>

            {/* Add Service Section */}
            <section className="bg-[var(--bg-card)]/5 backdrop-blur-sm border border-white/5 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <span className="material-symbols-outlined text-[var(--color-primary)] !text-base">add_circle</span>
                    <h2 className="text-sm font-bold text-[var(--text-main)]">Add New Service</h2>
                </div>

                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label htmlFor="treatment-name" className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Treatment Name</label>
                            <input
                                id="treatment-name"
                                title="Treatment Name"
                                type="text"
                                placeholder="e.g. Hot Stone Massage"
                                value={nameInput}
                                onChange={e => setNameInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && addService()}
                                className="w-full h-9 bg-[var(--bg-card)]/5 border border-white/5 rounded-lg px-3 font-bold text-xs text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="treatment-category" className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Category</label>
                            <select
                                id="treatment-category"
                                title="Service Category"
                                value={categoryInput}
                                onChange={e => setCategoryInput(e.target.value)}
                                className="w-full h-9 bg-[var(--bg-card)]/5 border border-white/5 rounded-lg px-3 font-bold text-xs text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="General">General</option>
                                <option value="Masseuse">Masseuse</option>
                                <option value="Therapist">Therapist</option>
                                <option value="Sauna">Sauna</option>
                                <option value="Beauty">Beauty</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                        <div className="space-y-1">
                            <label htmlFor="treatment-price" className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Price (RWF)</label>
                            <input
                                id="treatment-price"
                                title="Treatment Price"
                                type="number"
                                min="0"
                                placeholder="15000"
                                value={priceInput}
                                onChange={e => setPriceInput(e.target.value)}
                                className="w-full h-9 bg-[var(--bg-card)]/5 border border-white/5 rounded-lg px-3 font-bold text-xs text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="treatment-duration" className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Duration (min)</label>
                            <input
                                id="treatment-duration"
                                title="Treatment Duration"
                                type="number"
                                min="5"
                                placeholder="60"
                                value={durationInput}
                                onChange={e => setDurationInput(e.target.value)}
                                className="w-full h-9 bg-[var(--bg-card)]/5 border border-white/5 rounded-lg px-3 font-bold text-xs text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={addService}
                            className="h-9 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-[var(--color-primary)] hover:text-[var(--bg-app)] transition-all"
                        >
                            Add Service
                        </button>
                    </div>
                    {formError && (
                        <p className="text-red-400 text-[10px] font-bold">{formError}</p>
                    )}
                </div>
            </section>

            {/* Services Table */}
            <div className="bg-[var(--bg-card)]/5 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[var(--bg-card)]/5 border-b border-white/5">
                                <th className="px-4 py-3 text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">Service</th>
                                <th className="px-4 py-3 text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">Category</th>
                                <th className="px-4 py-3 text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40 text-right">Price</th>
                                <th className="px-4 py-3 text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">Time</th>
                                <th className="px-4 py-3 text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40 text-center">Act</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {services.map((s) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        key={s.id}
                                        className="hover:bg-[var(--bg-card)]/[0.02] transition-colors group/row"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="size-6 rounded-md bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                                                    <span className="material-symbols-outlined !text-[12px]">self_care</span>
                                                </div>
                                                <span className="font-bold text-xs text-[var(--text-main)]">{s.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 rounded border border-white/10 text-[8px] font-black text-[var(--text-muted)] uppercase tracking-wider">
                                                {s.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-black text-xs text-[var(--text-main)]">
                                            {s.price.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-[var(--text-muted)]">
                                                <span className="material-symbols-outlined !text-[10px] opacity-30">timer</span>
                                                <span className="text-[10px] font-bold">{s.duration}m</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => removeService(s.id)}
                                                    className="size-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                >
                                                    <span className="material-symbols-outlined !text-sm">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {services.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-30">
                                            <span className="material-symbols-outlined text-2xl">inventory_2</span>
                                            <p className="text-[10px] font-bold">No services yet</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <button
                    type="button"
                    onClick={onPrev}
                    className="h-9 px-4 rounded-lg border border-white/5 font-bold text-[10px] text-[var(--text-muted)] hover:bg-[var(--bg-card)]/5 hover:text-[var(--text-main)] transition-all flex items-center gap-2 uppercase tracking-widest"
                >
                    <span className="material-symbols-outlined !text-sm">arrow_back</span>
                    Prev
                </button>
                <button
                    type="submit"
                    onClick={handleContinue}
                    disabled={loading}
                    className="h-9 px-5 bg-[var(--color-primary)] text-white rounded-lg font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-sm hover:opacity-90 active:scale-[0.98] transition-all group"
                >
                    {loading ? (
                        <span className="size-3 border-2 border-[var(--bg-app)] border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        <>
                            Continue
                            <span className="material-symbols-outlined font-bold group-hover:translate-x-0.5 transition-transform !text-xs">arrow_forward</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
