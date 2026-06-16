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
        <div className="max-w-2xl mx-auto space-y-6 py-2">
            <div className="space-y-1">
                <h1 className="text-xl font-display font-black text-[var(--text-main)] tracking-tight">Add Your Team</h1>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed opacity-80">
                    Register the staff members who will work at your branch.
                </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[var(--bg-card)]/5 border border-white/5 rounded-xl p-3 flex justify-between items-center">
                    <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">Employees</p>
                    <p className="text-sm font-black text-[var(--text-main)]">{team.length}</p>
                </div>
                <div className="bg-[var(--bg-card)]/5 border border-white/5 rounded-xl p-3 flex justify-between items-center">
                    <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">Active</p>
                    <p className="text-sm font-black text-[var(--color-primary)]">{team.filter(t => t.status === "Active").length}</p>
                </div>
                <div className="bg-[var(--bg-card)]/5 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                    <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">Security</p>
                    <span className="material-symbols-outlined text-[var(--color-primary)] text-sm opacity-50">shield_person</span>
                </div>
            </div>

            {/* Quick Add Section */}
            <section className="bg-[var(--bg-card)]/5 backdrop-blur-sm border border-white/5 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <span className="material-symbols-outlined text-[var(--color-primary)] !text-base">person_add</span>
                    <h2 className="text-sm font-bold text-[var(--text-main)]">Add Staff</h2>
                </div>

                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label htmlFor="staff-name" className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Full Name</label>
                            <input
                                id="staff-name"
                                title="Full Name"
                                type="text"
                                placeholder="Beatrice Ingabire"
                                value={nameInput}
                                onChange={e => setNameInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && addMember()}
                                className="w-full h-9 bg-[var(--bg-card)]/5 border border-white/5 rounded-lg px-3 font-bold text-xs text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="staff-phone" className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Phone</label>
                            <input
                                id="staff-phone"
                                title="Phone Number"
                                type="tel"
                                placeholder="+250..."
                                value={phoneInput}
                                onChange={e => setPhoneInput(e.target.value)}
                                className="w-full h-9 bg-[var(--bg-card)]/5 border border-white/5 rounded-lg px-3 font-bold text-xs text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                        <div className="space-y-1 md:col-span-2">
                            <label htmlFor="staff-role" className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Staff Role</label>
                            <select
                                id="staff-role"
                                title="Staff Role"
                                value={roleInput}
                                onChange={e => setRoleInput(e.target.value)}
                                className="w-full h-9 bg-[var(--bg-card)]/5 border border-white/5 rounded-lg px-3 font-bold text-xs text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all appearance-none cursor-pointer"
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
                            className="h-9 bg-[var(--text-main)] text-[var(--bg-app)] rounded-lg font-black text-[9px] uppercase tracking-[0.2em] shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
                        >
                            Add Member
                        </button>
                    </div>
                    {formError && (
                        <p className="text-red-400 text-[10px] font-bold">{formError}</p>
                    )}
                </div>
            </section>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AnimatePresence mode="popLayout">
                    {team.map((member) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={member.id}
                            className="bg-[var(--bg-card)]/5 backdrop-blur-sm border border-white/5 p-3 rounded-xl flex items-center justify-between group hover:border-[var(--color-primary)]/30 transition-all shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-display font-black text-xs border border-[var(--color-primary)]/20 shadow-inner group-hover:scale-110 transition-transform">
                                    {member.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="font-bold text-xs text-[var(--text-main)]">{member.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black text-[var(--text-muted)] uppercase tracking-wider border border-white/5">
                                            {member.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeMember(member.id)}
                                className="size-6 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <span className="material-symbols-outlined !text-[12px]">close</span>
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {team.length === 0 && (
                    <div className="md:col-span-2 border border-dashed border-white/10 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-1 opacity-30 select-none">
                        <span className="material-symbols-outlined text-lg">group_add</span>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em]">Add your first team member</p>
                    </div>
                )}
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
