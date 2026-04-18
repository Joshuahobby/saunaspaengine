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
        <div className="max-w-4xl mx-auto space-y-12 py-8">
            {/* Stage Header */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-[0.2em]">
                    <span className="material-symbols-outlined !text-sm">content_cut</span>
                    Step 2 of 4
                </div>
                <h1 className="text-4xl font-display font-black text-[var(--text-main)] tracking-tight">Service Catalog</h1>
                <p className="text-lg text-[var(--text-muted)] leading-relaxed">
                    Define the services and treatments your branch offers. A clear service menu helps customers book the right experience.
                </p>
            </div>

            {/* Quick Stats / Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-1">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">Total Treatments</p>
                    <p className="text-2xl font-black text-[var(--text-main)]">{services.length}</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-1">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">Categories</p>
                    <p className="text-2xl font-black text-[var(--text-main)]">
                        {new Set(services.map(s => s.category)).size || 0}
                    </p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-1">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">Setup Status</p>
                    <p className="text-2xl font-black text-[var(--color-primary)]">
                        {services.length > 0 ? "Configured" : "Pending"}
                    </p>
                </div>
            </div>

            {/* Add Service Section */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">add_circle</span>
                    <h2 className="text-xl font-bold text-[var(--text-main)]">Add New Service</h2>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="treatment-name" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Treatment Name</label>
                            <input
                                id="treatment-name"
                                title="Treatment Name"
                                type="text"
                                placeholder="e.g. Hot Stone Massage"
                                value={nameInput}
                                onChange={e => setNameInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && addService()}
                                className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="treatment-category" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Category</label>
                            <select
                                id="treatment-category"
                                title="Service Category"
                                value={categoryInput}
                                onChange={e => setCategoryInput(e.target.value)}
                                className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="General">General</option>
                                <option value="Masseuse">Masseuse</option>
                                <option value="Therapist">Therapist</option>
                                <option value="Sauna">Sauna</option>
                                <option value="Beauty">Beauty</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                            <label htmlFor="treatment-price" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Price (RWF)</label>
                            <input
                                id="treatment-price"
                                title="Treatment Price"
                                type="number"
                                min="0"
                                placeholder="15000"
                                value={priceInput}
                                onChange={e => setPriceInput(e.target.value)}
                                className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="treatment-duration" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Duration (min)</label>
                            <input
                                id="treatment-duration"
                                title="Treatment Duration"
                                type="number"
                                min="5"
                                placeholder="60"
                                value={durationInput}
                                onChange={e => setDurationInput(e.target.value)}
                                className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={addService}
                            className="h-12 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[var(--color-primary)] hover:text-[var(--bg-app)] transition-all"
                        >
                            Add Service
                        </button>
                    </div>
                    {formError && (
                        <p className="text-red-400 text-xs font-bold">{formError}</p>
                    )}
                </div>
            </section>

            {/* Services Table */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">Service Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">Category</th>
                                <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40 text-right">Price (RWF)</th>
                                <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">Duration</th>
                                <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {services.map((s) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        key={s.id}
                                        className="hover:bg-white/[0.02] transition-colors group/row"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                                                    <span className="material-symbols-outlined text-xl">self_care</span>
                                                </div>
                                                <span className="font-bold text-[var(--text-main)]">{s.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">
                                                {s.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-[var(--text-main)]">
                                            {s.price.toLocaleString()} RWF
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                                <span className="material-symbols-outlined text-sm opacity-30">timer</span>
                                                <span className="text-sm font-bold">{s.duration} min</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => removeService(s.id)}
                                                    className="size-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {services.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <span className="material-symbols-outlined text-4xl">inventory_2</span>
                                            <p className="text-sm font-bold">Add your first service above</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-12 border-t border-white/5">
                <button
                    type="button"
                    onClick={onPrev}
                    className="h-14 px-8 rounded-2xl border border-white/5 font-bold text-sm text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-main)] transition-all flex items-center gap-3"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Previous
                </button>
                <div className="flex items-center gap-6">
                    <p className="text-xs text-[var(--text-muted)] font-bold opacity-40 hidden md:block">
                        Recommended: At least 3 treatments for initial launch.
                    </p>
                    <button
                        type="button"
                        onClick={handleContinue}
                        disabled={loading}
                        className="h-14 px-12 bg-[var(--text-main)] text-[var(--bg-app)] rounded-2xl font-bold flex items-center gap-4 shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
                        {loading ? (
                            <span className="size-5 border-3 border-[var(--bg-app)] border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                Save Services
                                <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
