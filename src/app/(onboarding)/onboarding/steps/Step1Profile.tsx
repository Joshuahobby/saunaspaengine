"use client";

import { useState } from "react";

import { saveBusinessProfileAction } from "../actions";

interface StepProps {
    business: {
        id: string;
        name: string | null;
        email: string | null;
        phone: string | null;
    };
    onNext: () => void;
    onPrev: () => void;
}

export function Step1Profile({ business, onNext, onPrev }: StepProps) {
    const [loading, setLoading] = useState(false);
    
    // Form state
    const [name, setName] = useState(business.name || "");
    const [email, setEmail] = useState(business.email || "");
    const [phone, setPhone] = useState(business.phone || "");

    const days = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await saveBusinessProfileAction(business.id, { name, email, phone });
            onNext();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSave} className="max-w-3xl mx-auto space-y-12 py-8">
            {/* Stage Header */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-[0.2em]">
                    <span className="material-symbols-outlined !text-sm">analytics</span>
                    Step 1 of 4
                </div>
                <h1 className="text-4xl font-display font-black text-[var(--text-main)] tracking-tight">Business Profile</h1>
                <p className="text-lg text-[var(--text-muted)] leading-relaxed">
                    Set up your business&apos;s public profile. This information helps customers find and contact you on our platform.
                </p>
            </div>

            {/* Branding Section */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">branding_watermark</span>
                    <h2 className="text-xl font-bold text-[var(--text-main)]">Business Branding</h2>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="size-32 rounded-[2rem] border-2 border-dashed border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 flex flex-col items-center justify-center text-[var(--color-primary)] cursor-pointer hover:bg-[var(--color-primary)]/10 transition-all group shrink-0">
                        <span className="material-symbols-outlined !text-4xl transition-transform group-hover:scale-110">add_photo_alternate</span>
                        <span className="text-[10px] font-black mt-2 tracking-widest uppercase">UPLOAD LOGO</span>
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                        <h4 className="font-bold text-[var(--text-main)]">Business Logo</h4>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                            Recommended: 400x400px. High-contrast SVG or transparent PNG preferred for optimal visibility.
                        </p>
                    </div>
                </div>
            </section>

            {/* General Info */}
            <section className="space-y-8">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">info</span>
                    <h2 className="text-xl font-bold text-[var(--text-main)]">General Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                        <label htmlFor="business-name" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Business Name</label>
                        <input 
                            id="business-name"
                            title="Business Name"
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Nordic Calm Wellness Center"
                            className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 font-bold text-base text-[var(--text-main)] focus:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="business-email" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Business Email</label>
                        <input 
                            id="business-email"
                            title="Business Email"
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="hello@yourspa.com"
                            className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 font-bold text-base text-[var(--text-main)] focus:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="business-phone" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Phone Number</label>
                        <input 
                            id="business-phone"
                            title="Phone Number"
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+250 000 000 000"
                            className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 font-bold text-base text-[var(--text-main)] focus:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all outline-none"
                        />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label htmlFor="business-address" className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Business Address</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] opacity-30">location_on</span>
                            <input 
                                id="business-address"
                                title="Business Address"
                                type="text" 
                                placeholder="Street 123, Kigali, Rwanda"
                                className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 font-bold text-base text-[var(--text-main)] focus:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Operating Hours */}
            <section className="space-y-8">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">schedule</span>
                    <h2 className="text-xl font-bold text-[var(--text-main)]">Business Hours</h2>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-[2.5rem] overflow-hidden">
                    <div className="hidden md:grid grid-cols-6 gap-4 px-8 py-4 border-b border-white/5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">
                        <div className="col-span-1">Day</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-2">Opens At</div>
                        <div className="col-span-2">Closes At</div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {days.map((day) => (
                            <div key={day} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center px-8 py-5 hover:bg-white/[0.02] transition-colors group/row">
                                <div className="font-bold text-sm text-[var(--text-main)]">{day}</div>
                                <div>
                                    <label htmlFor={`day-status-${day}`} className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            id={`day-status-${day}`} 
                                            title={`${day} Status`} 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            defaultChecked={day !== "Sunday"} 
                                        />
                                        <div className="w-10 h-6 bg-white/10 rounded-full peer peer-checked:bg-[var(--color-primary)] transition-all after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white/40 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4 peer-checked:after:bg-white"></div>
                                        <span className="sr-only">Toggle {day} Status</span>
                                    </label>
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <input id={`opens-${day}`} title={`${day} Opening Time`} type="time" defaultValue="09:00" className="bg-white/5 border border-white/5 rounded-xl px-3 h-10 w-full text-sm font-bold text-[var(--text-main)] outline-none focus:border-[var(--color-primary)]/30 transition-all" />
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <input id={`closes-${day}`} title={`${day} Closing Time`} type="time" defaultValue="21:00" className="bg-white/5 border border-white/5 rounded-xl px-3 h-10 w-full text-sm font-bold text-[var(--text-main)] outline-none focus:border-[var(--color-primary)]/30 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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
                <button 
                    type="submit" 
                    disabled={loading}
                    className="h-14 px-12 bg-[var(--text-main)] text-[var(--bg-app)] rounded-2xl font-bold flex items-center gap-4 shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
                    {loading ? (
                        <span className="size-5 border-3 border-[var(--bg-app)] border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        <>
                            Save & Continue
                            <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
