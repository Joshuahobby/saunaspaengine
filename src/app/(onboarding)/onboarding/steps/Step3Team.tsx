"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { saveBranchTeamAction } from "../actions";

interface StepProps {
    branch: {
        id: string;
        name: string | null;
    };
    onNext: () => void;
    onPrev: () => void;
}

interface TeamMember {
    id: number;
    name: string;
    role: string;
    phone: string;
    status: string;
}

export function Step3Team({ branch, onNext, onPrev }: StepProps) {
    const [loading, setLoading] = useState(false);
    const [team, setTeam] = useState<TeamMember[]>([]);

    // Form inputs
    const [nameInput, setNameInput] = useState("");
    const [roleInput, setRoleInput] = useState("Masseuse");
    const [phoneInput, setPhoneInput] = useState("");
    const [formError, setFormError] = useState("");

    const addMember = () => {
        if (!nameInput.trim()) { setFormError("Full name is required."); return; }
        setFormError("");
        setTeam(prev => [...prev, {
            id: Date.now(),
            name: nameInput.trim(),
            role: roleInput,
            phone: phoneInput.trim(),
            status: "Active",
        }]);
        setNameInput("");
        setPhoneInput("");
    };

    const removeMember = (id: number) => {
        setTeam(team.filter(t => t.id !== id));
    };

    async function handleContinue() {
        setLoading(true);
        try {
            await saveBranchTeamAction(branch.id, team.map((t) => ({ ...t, fullName: t.name })));
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
                    <span className="material-symbols-outlined !text-sm">group</span>
                    Step 3 of 4
                </div>
                <h1 className="text-4xl font-display font-black text-[var(--text-main)] tracking-tight">Add Your Team</h1>
                <p className="text-lg text-[var(--text-muted)] leading-relaxed">
                    Register the staff members who will work at your branch. You can always add more from the Staff directory later.
                </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">Employees</p>
                    <p className="text-2xl font-black text-[var(--text-main)] mt-1">{team.length}</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">Active Staff</p>
                    <p className="text-2xl font-black text-[var(--color-primary)] mt-1">{team.filter(t => t.status === "Active").length}</p>
                </div>
                <div className="col-span-2 bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">Access Level</p>
                        <p className="text-sm font-bold text-[var(--text-main)] mt-1">Role-Based Protocols</p>
                    </div>
                    <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl opacity-20">shield_person</span>
                </div>
            </div>

            {/* Quick Add Section */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">person_add</span>
                    <h2 className="text-xl font-bold text-[var(--text-main)]">Add Staff Member</h2>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="staff-name" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Full Name</label>
                            <input
                                id="staff-name"
                                title="Full Name"
                                type="text"
                                placeholder="Beatrice Ingabire"
                                value={nameInput}
                                onChange={e => setNameInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && addMember()}
                                className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="staff-phone" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Phone (optional)</label>
                            <input
                                id="staff-phone"
                                title="Phone Number"
                                type="tel"
                                placeholder="+250 78X XXX XXX"
                                value={phoneInput}
                                onChange={e => setPhoneInput(e.target.value)}
                                className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2 md:col-span-2">
                            <label htmlFor="staff-role" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Staff Role</label>
                            <select
                                id="staff-role"
                                title="Staff Role"
                                value={roleInput}
                                onChange={e => setRoleInput(e.target.value)}
                                className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option>Masseuse</option>
                                <option>Therapist</option>
                                <option>Receptionist</option>
                                <option>Manager</option>
                                <option>General Staff</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={addMember}
                            className="h-12 bg-[var(--text-main)] text-[var(--bg-app)] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Add Member
                        </button>
                    </div>
                    {formError && (
                        <p className="text-red-400 text-xs font-bold">{formError}</p>
                    )}
                </div>
            </section>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {team.map((member) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={member.id}
                            className="bg-white/5 backdrop-blur-sm border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:border-[var(--color-primary)]/30 transition-all shadow-lg"
                        >
                            <div className="flex items-center gap-5">
                                <div className="size-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-display font-black text-xl border border-[var(--color-primary)]/20 shadow-inner group-hover:scale-110 transition-transform">
                                    {member.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-[var(--text-main)]">{member.name}</h4>
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">
                                            {member.role}
                                        </span>
                                        {member.phone && (
                                            <span className="text-[9px] text-[var(--text-muted)] opacity-60">{member.phone}</span>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <span className="size-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]" />
                                            <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-widest">{member.status}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeMember(member.id)}
                                className="size-10 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {team.length === 0 && (
                    <div className="md:col-span-2 border-2 border-dashed border-white/5 p-10 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-2 opacity-30 select-none">
                        <span className="material-symbols-outlined text-4xl">group_add</span>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em]">Add your first team member above</p>
                    </div>
                )}

                {team.length > 0 && (
                    <div className="border-2 border-dashed border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-2 opacity-30 select-none">
                        <span className="material-symbols-outlined text-4xl">infinite</span>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em]">Scalable Branch Structure</p>
                    </div>
                )}
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
                        You can add more staff from the Staff directory after launch.
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
                                Save Team
                                <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
