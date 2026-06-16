"use client";

import { useState, useRef } from "react";
import { saveBranchProfileAction } from "../actions";
import { uploadLogoAction } from "@/lib/upload-actions";

interface DayHours {
    open: boolean;
    opensAt: string;
    closesAt: string;
}

interface StepProps {
    branch: {
        id: string;
        name: string | null;
        email: string | null;
        phone: string | null;
        logo: string | null;
        address: string | null;
        businessHours: any;
    };
    onNext: () => void;
    onPrev: () => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DEFAULT_HOURS: Record<string, DayHours> = Object.fromEntries(
    DAYS.map((day) => [day, { open: day !== "Sunday", opensAt: "09:00", closesAt: "21:00" }])
);

export function Step1Profile({ branch, onNext, onPrev }: StepProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState(branch.name || "");
    const [email, setEmail] = useState(branch.email || "");
    const [phone, setPhone] = useState(branch.phone || "");
    const [address, setAddress] = useState(branch.address || "");
    const [logoUrl, setLogoUrl] = useState<string | null>(branch.logo || null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hours, setHours] = useState<Record<string, DayHours>>(branch.businessHours || DEFAULT_HOURS);

    function updateHour(day: string, field: keyof DayHours, value: string | boolean) {
        setHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!name.trim()) {
            setError("Branch name is required.");
            return;
        }
        setLoading(true);
        try {
            const result = await saveBranchProfileAction(branch.id, { 
                name, 
                email, 
                phone, 
                address, 
                logoUrl,
                businessHours: hours 
            });
            if (result?.error) {
                setError(result.error);
                return;
            }
            onNext();
        } catch (err) {
            setError("Failed to save profile. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadLogoAction(formData);
            if (result.error) {
                setError(result.error);
            } else if (result.url) {
                setLogoUrl(result.url);
            }
        } catch (err) {
            setError("Failed to upload logo.");
            console.error(err);
        } finally {
            setUploading(false);
        }
    }

    return (
        <form onSubmit={handleSave} className="max-w-xl mx-auto space-y-6 py-2">
            <div className="space-y-1">
                <h1 className="text-xl font-display font-black text-[var(--text-main)] tracking-tight">Branch Profile</h1>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed opacity-80">
                    Set up your public profile to help customers find you.
                </p>
            </div>

            {/* Branding Section */}
            <section className="bg-[var(--bg-card)]/5 backdrop-blur-sm border border-white/5 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <span className="material-symbols-outlined text-[var(--color-primary)] !text-base">branding_watermark</span>
                    <h2 className="text-sm font-bold text-[var(--text-main)]">Branding</h2>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="size-20 rounded-xl border-2 border-dashed border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 flex flex-col items-center justify-center text-[var(--color-primary)] cursor-pointer hover:bg-[var(--color-primary)]/10 transition-all group shrink-0 relative overflow-hidden">
                        
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <>
                                <span className="material-symbols-outlined !text-2xl transition-transform group-hover:scale-110">add_photo_alternate</span>
                            </>
                        )}
                        
                        {uploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white animate-spin !text-sm">progress_activity</span>
                            </div>
                        )}
                        
                        <input 
                            hidden 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                        <h4 className="text-xs font-bold text-[var(--text-main)]">Branch Logo</h4>
                        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                            Recommended: 400x400px transparent PNG.
                        </p>
                    </div>
                </div>
            </section>

            {/* General Info */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <span className="material-symbols-outlined text-[var(--color-primary)] !text-base">info</span>
                    <h2 className="text-sm font-bold text-[var(--text-main)]">Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1">
                        <label htmlFor="branch-name" className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Branch Name *</label>
                        <input
                            id="branch-name"
                            title="Branch Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Nordic Calm Wellness Center"
                            required
                            className="w-full h-9 bg-[var(--bg-card)]/5 border border-white/5 rounded-lg px-3 font-bold text-xs text-[var(--text-main)] focus:border-[var(--color-primary)]/30 focus:ring-2 focus:ring-[var(--color-primary)]/5 transition-all outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="branch-email" className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Branch Email</label>
                        <input
                            id="branch-email"
                            title="Branch Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="hello@yourspa.com"
                            className="w-full h-9 bg-[var(--bg-card)]/5 border border-white/5 rounded-lg px-3 font-bold text-xs text-[var(--text-main)] focus:border-[var(--color-primary)]/30 focus:ring-2 focus:ring-[var(--color-primary)]/5 transition-all outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="branch-phone" className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Phone Number</label>
                        <input
                            id="branch-phone"
                            title="Phone Number"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+250 000 000 000"
                            className="w-full h-9 bg-[var(--bg-card)]/5 border border-white/5 rounded-lg px-3 font-bold text-xs text-[var(--text-main)] focus:border-[var(--color-primary)]/30 focus:ring-2 focus:ring-[var(--color-primary)]/5 transition-all outline-none"
                        />
                    </div>
                    <div className="col-span-2 space-y-1">
                        <label htmlFor="branch-address" className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 opacity-50">Branch Address</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] opacity-30 !text-sm">location_on</span>
                            <input
                                id="branch-address"
                                title="Branch Address"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Street 123, Kigali, Rwanda"
                                className="w-full h-9 bg-[var(--bg-card)]/5 border border-white/5 rounded-lg pl-9 pr-3 font-bold text-xs text-[var(--text-main)] focus:border-[var(--color-primary)]/30 focus:ring-2 focus:ring-[var(--color-primary)]/5 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Operating Hours */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <span className="material-symbols-outlined text-[var(--color-primary)] !text-base">schedule</span>
                    <h2 className="text-sm font-bold text-[var(--text-main)]">Branch Hours</h2>
                </div>

                <div className="bg-[var(--bg-card)]/5 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden">
                    <div className="hidden md:grid grid-cols-6 gap-2 px-4 py-2 border-b border-white/5 text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">
                        <div className="col-span-1">Day</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-2">Opens</div>
                        <div className="col-span-2">Closes</div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {DAYS.map((day) => (
                            <div key={day} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center px-4 py-3 hover:bg-[var(--bg-card)]/[0.02] transition-colors group/row">
                                <div className="font-bold text-xs text-[var(--text-main)]">{day.substring(0, 3)}</div>
                                <div>
                                    <label htmlFor={`day-status-${day}`} className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            id={`day-status-${day}`}
                                            title={`${day} Status`}
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={hours[day].open}
                                            onChange={(e) => updateHour(day, "open", e.target.checked)}
                                        />
                                        <div className="w-8 h-4 bg-[var(--bg-card)]/10 rounded-full peer peer-checked:bg-[var(--color-primary)] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--bg-card)]/40 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4 peer-checked:after:bg-[var(--bg-card)]"></div>
                                        <span className="sr-only">Toggle {day} Status</span>
                                    </label>
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <input
                                        id={`opens-${day}`}
                                        title={`${day} Opening Time`}
                                        type="time"
                                        value={hours[day].opensAt}
                                        onChange={(e) => updateHour(day, "opensAt", e.target.value)}
                                        disabled={!hours[day].open}
                                        className="bg-[var(--bg-card)]/5 border border-white/5 rounded-lg px-2 h-8 w-full text-xs font-bold text-[var(--text-main)] outline-none focus:border-[var(--color-primary)]/30 transition-all disabled:opacity-30"
                                    />
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <input
                                        id={`closes-${day}`}
                                        title={`${day} Closing Time`}
                                        type="time"
                                        value={hours[day].closesAt}
                                        onChange={(e) => updateHour(day, "closesAt", e.target.value)}
                                        disabled={!hours[day].open}
                                        className="bg-[var(--bg-card)]/5 border border-white/5 rounded-lg px-2 h-8 w-full text-xs font-bold text-[var(--text-main)] outline-none focus:border-[var(--color-primary)]/30 transition-all disabled:opacity-30"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Error */}
            {error && (
                <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                    <span className="material-symbols-outlined text-lg shrink-0">error</span>
                    <p className="font-bold">{error}</p>
                </div>
            )}

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
                    disabled={loading || uploading}
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
        </form>
    );
}
