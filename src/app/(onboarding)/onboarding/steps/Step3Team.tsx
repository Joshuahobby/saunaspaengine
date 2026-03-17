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

export function Step3Team({ branch, onNext, onPrev }: StepProps) {
    const [loading, setLoading] = useState(false);
    const [team, setTeam] = useState([
        { id: 1, name: "Alice Umutoni", role: "Spa Manager", phone: "+250 781 234 567", status: "Active" },
        { id: 2, name: "Kevin Kayitaba", role: "Masseuse", phone: "+250 788 987 654", status: "Active" },
    ]);

    const removeMember = (id: number) => {
        setTeam(team.filter(t => t.id !== id));
    };

    async function handleContinue() {
        setLoading(true);
        try {
            await saveBranchTeamAction(branch.id, team);
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
                    Register the staff members who will work at your branch. Each person will receive their own login link.
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
                    <p className="text-2xl font-black text-[var(--color-primary)] mt-1">{team.filter(t => t.status === 'Active').length}</p>
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
            <section className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">person_add</span>
                    <h2 className="text-xl font-bold text-[var(--text-main)]">Add Staff Member</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div className="space-y-2">
                        <label htmlFor="staff-name" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Full Name</label>
                        <input id="staff-name" title="Full Name" type="text" placeholder="Beatrice Ingabire" className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="staff-role" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Staff Role</label>
                        <select id="staff-role" title="Staff Role" className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-4 font-bold text-sm text-[var(--text-main)] focus:border-[var(--color-primary)]/30 outline-none transition-all appearance-none cursor-pointer">
                            <option>Masseur</option>
                            <option>Manager</option>
                            <option>Receptionist</option>
                            <option>Therapist</option>
                        </select>
                    </div>
                    <button className="h-12 bg-[var(--text-main)] text-[var(--bg-app)] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Invite Staff
                    </button>
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
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-[var(--text-main)]">{member.name}</h4>
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">
                                            {member.role}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="size-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]"></span>
                                            <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-widest">{member.status}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => removeMember(member.id)}
                                className="size-10 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {/* Visual Placeholder for Scale */}
                <div className="border-2 border-dashed border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-2 opacity-30 select-none">
                    <span className="material-symbols-outlined text-4xl">infinite</span>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em]">Scalable Branch Structure</p>
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
                        Invites will be sent via SMS/Email once you finish the setup.
                    </p>
                    <button 
                        onClick={handleContinue}
                        disabled={loading}
                        className="h-14 px-12 bg-[var(--text-main)] text-[var(--bg-app)] rounded-2xl font-bold flex items-center gap-4 shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
                        {loading ? (
                            <span className="size-5 border-3 border-[var(--bg-app)] border-t-transparent rounded-full animate-spin"></span>
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
