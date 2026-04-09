"use client";

import { useState } from "react";
import PrintableMembershipCard, { PremiumCardThemes, MembershipCardTheme } from "./PrintableMembershipCard";
import { X, Printer, Check, Palette, LayoutGrid, CreditCard } from "lucide-react";

interface MembershipCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientName: string;
    clientId: string;
    qrCodeString: string;
    tier?: string;
}

export default function MembershipCardModal({
    isOpen,
    onClose,
    clientName,
    clientId,
    qrCodeString,
    tier = "BRONZE"
}: MembershipCardModalProps) {
    const [selectedTheme, setSelectedTheme] = useState<MembershipCardTheme>(PremiumCardThemes[0]);
    const [isSheetMode, setIsSheetMode] = useState(false);

    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="p-6 border-b border-[var(--border-muted)]/30 flex items-center justify-between bg-[var(--bg-surface-muted)]/50">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                            <Palette className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black italic tracking-tighter text-[var(--text-main)]">Membership Card</h3>
                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">PVC (86mm x 54mm) Official Pass</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        title="Close Modal"
                        className="size-10 rounded-full hover:bg-slate-500/10 flex items-center justify-center text-[var(--text-muted)] transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 space-y-8 flex flex-col items-center">
                    
                    {/* Card Preview Container */}
                    <div className="w-full max-w-[420px] py-12 flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100/50 shadow-inner print:p-0 print:m-0 print:border-none print:shadow-none">
                        <div className="w-full px-4 transform scale-110 md:scale-100 print:transform-none print:p-0 print:m-0">
                            <PrintableMembershipCard 
                                clientName={clientName}
                                qrCodeString={qrCodeString}
                                tier={tier}
                                theme={selectedTheme}
                            />
                        </div>
                    </div>

                    {/* Theme and Mode Selector */}
                    <div className="w-full space-y-6">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-2 opacity-60">
                                <div className="size-1 bg-[var(--color-primary)] rounded-full"></div>
                                Select Card Aesthetic
                            </label>
                            
                            <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
                                <button 
                                    onClick={() => setIsSheetMode(false)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all flex items-center gap-1.5 ${!isSheetMode ? 'bg-white shadow-sm text-[#2d5a27]' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <CreditCard className="w-3 h-3" />
                                    Single
                                </button>
                                <button 
                                    onClick={() => setIsSheetMode(true)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all flex items-center gap-1.5 ${isSheetMode ? 'bg-white shadow-sm text-[#2d5a27]' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <LayoutGrid className="w-3 h-3" />
                                    8-Card Sheet
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {PremiumCardThemes.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => setSelectedTheme(theme)}
                                    className={`relative flex flex-col items-center gap-2 p-1.5 rounded-2xl border-2 transition-all ${selectedTheme.id === theme.id ? 'border-[#2d5a27] bg-[#2d5a27]/5 shadow-sm' : 'border-slate-50 bg-slate-50/50 hover:bg-white'}`}
                                >
                                    <div className={`w-full h-11 rounded-xl ${theme.bgClass} border border-white/10 shadow-inner flex items-center justify-center`}>
                                        {selectedTheme.id === theme.id && <Check className="w-5 h-5 text-white" />}
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-tighter mt-1 ${selectedTheme.id === theme.id ? 'text-[#2d5a27]' : 'text-slate-400'}`}>
                                        {theme.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bulk Print Grid (Only visible during print when isSheetMode is true) */}
                {isSheetMode && (
                    <div className="hidden print:grid print:grid-cols-2 print:gap-4 print:p-8 print:w-full print:h-full print:fixed print:inset-0 print:bg-white print:z-[9999]">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-center">
                                <PrintableMembershipCard 
                                    clientName={clientName}
                                    qrCodeString={qrCodeString}
                                    tier={tier}
                                    theme={selectedTheme}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <style jsx global>{`
                    @media print {
                        @page {
                            size: ${isSheetMode ? 'A4 portrait' : '86mm 54mm landscape'};
                            margin: 0;
                        }
                        ${isSheetMode ? `
                            body * { visibility: hidden; }
                            .print\\:grid, .print\\:grid * { visibility: visible; }
                            .print\\:grid { position: fixed; left: 0; top: 0; width: 210mm; height: 297mm; }
                        ` : ''}
                    }
                `}</style>

                {/* Footer Actions */}
                <div className="p-6 border-t border-[var(--border-muted)]/30 flex gap-4 bg-[var(--bg-surface-muted)]/50">
                    <button 
                        onClick={handlePrint}
                        className="flex-1 bg-[#2d5a27] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 italic"
                    >
                        <Printer className="w-4 h-4" />
                        Print with Browser
                    </button>
                    <button 
                        onClick={onClose}
                        className="px-8 border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-white transition-all italic"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
