"use client";

import React, { useState, useRef } from "react";
import { updateBranchSettingsAction, updateBusinessBrandingAction } from "@/lib/settings-actions";
import { uploadLogoAction } from "@/lib/upload-actions";
import { toast } from "react-hot-toast";

interface BrandingSettingsFormProps {
    businessId: string;
    branchId: string | null;
    initialData: {
        logo: string | null;
        primaryColor: string;
        corporateLogo: string | null;
        corporateColor: string;
        isGlobal: boolean;
    };
}

export function BrandingSettingsForm({ businessId, branchId, initialData }: BrandingSettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [logo, setLogo] = useState(initialData.logo || "");
    const [color, setColor] = useState(initialData.primaryColor || "#fbbf24");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isOverride, setIsOverride] = useState(!initialData.isGlobal && (!!initialData.logo || !!initialData.primaryColor));

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await uploadLogoAction(formData);
            if (res.success && res.url) {
                setLogo(res.url);
                toast.success("Logo uploaded successfully.");
            } else {
                toast.error(res.error || "Upload failed.");
            }
        } catch (err) {
            toast.error("An error occurred during upload.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    async function handleSave() {
        setLoading(true);
        try {
            let res;
            if (initialData.isGlobal) {
                // Global update
                res = await updateBusinessBrandingAction(businessId, { logo, primaryColor: color });
            } else {
                // Branch override update
                res = await updateBranchSettingsAction(branchId!, {
                    logo: isOverride ? logo : null,
                    primaryColor: isOverride ? color : null,
                });
            }

            if (res.success) {
                toast.success("Branding updated successfully.");
            } else {
                toast.error(res.error || "Update failed.");
            }
        } catch (err) {
            toast.error("An error occurred.");
        } finally {
            setLoading(false);
        }
    }

    const effectiveLogo = isOverride ? logo : initialData.corporateLogo;
    const effectiveColor = isOverride ? color : initialData.corporateColor;

    return (
        <section className="glass-card rounded-3xl p-6 md:p-8 border border-[var(--border-main)] shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-6">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">palette</span>
                    <h2 className="text-xl font-bold font-serif text-[var(--text-main)]">
                        {initialData.isGlobal ? "Global Branding" : "Branch Identity"}
                    </h2>
                </div>
                {!initialData.isGlobal && (
                    <div className="flex items-center gap-3 bg-[var(--bg-app)] px-4 py-2 rounded-2xl border border-[var(--border-muted)]">
                        <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Override Defaults</span>
                        <button 
                            onClick={() => setIsOverride(!isOverride)}
                            className={`w-10 h-5 rounded-full relative transition-all ${isOverride ? 'bg-[var(--color-primary)]' : 'bg-gray-400/20'}`}
                        >
                            <div className={`absolute top-0.5 size-4 bg-white rounded-full transition-all ${isOverride ? 'right-0.5' : 'left-0.5'}`}></div>
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Logo Section */}
                <div className="space-y-4">
                    <label className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)]">Brand Logo</label>
                    <div className="flex items-start gap-4">
                        <div className="size-24 rounded-2xl bg-[var(--bg-app)] border-2 border-dashed border-[var(--border-muted)] flex items-center justify-center overflow-hidden">
                            {effectiveLogo ? (
                                <img src={effectiveLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                            ) : (
                                <span className="material-symbols-outlined text-[var(--text-muted)] text-3xl">add_photo_alternate</span>
                            )}
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="flex gap-2">
                                <input 
                                    className="flex-1 rounded-xl border-[var(--border-muted)] bg-[var(--bg-app)] px-4 py-2 text-sm disabled:opacity-50"
                                    placeholder="https://example.com/logo.png"
                                    value={logo}
                                    onChange={(e) => setLogo(e.target.value)}
                                    disabled={!initialData.isGlobal && !isOverride}
                                />
                                <input 
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading || (!initialData.isGlobal && !isOverride)}
                                    className="px-4 py-2 rounded-xl bg-[var(--bg-app)] border border-[var(--border-muted)] text-[10px] font-black uppercase tracking-wider hover:bg-[var(--border-muted)] transition-all flex items-center gap-2 disabled:opacity-30"
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        {uploading ? "sync" : "upload"}
                                    </span>
                                    {uploading ? "Uploading..." : "Local File"}
                                </button>
                            </div>
                            <p className="text-[10px] text-[var(--text-muted)] font-medium italic">
                                {!isOverride && !initialData.isGlobal 
                                    ? "Currently inheriting from Business Headquarters" 
                                    : "Upload a local image or paste a logo URL."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Color Section */}
                <div className="space-y-4">
                    <label className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)]">Brand Accent Color</label>
                    <div className="flex items-center gap-4">
                        <div 
                            className="size-12 rounded-xl border-4 border-white shadow-lg" 
                            style={{ backgroundColor: effectiveColor }}
                        ></div>
                        <div className="flex-1">
                            <input 
                                type="color"
                                className="w-full h-10 rounded-xl bg-transparent border-none cursor-pointer disabled:opacity-30"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                disabled={!initialData.isGlobal && !isOverride}
                            />
                            <p className="text-[10px] text-[var(--text-muted)] mt-1 font-bold uppercase tracking-wider">Accent: {effectiveColor}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleSave}
                    disabled={loading || (!initialData.isGlobal && !isOverride)}
                    className="px-8 py-3 rounded-2xl bg-[var(--text-main)] text-[var(--bg-app)] font-black uppercase tracking-[0.15em] text-xs hover:scale-105 transition-all shadow-xl shadow-black/10 disabled:opacity-30 disabled:scale-100"
                >
                    {loading ? "Syncing..." : "Publish Identity"}
                </button>
            </div>
        </section>
    );
}
