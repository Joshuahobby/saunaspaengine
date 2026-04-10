"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { 
    Droplets, 
    Crown, 
    Leaf, 
    Shield, 
    Sparkle
} from "lucide-react";

export interface MembershipCardTheme {
    id: string;
    label: string;
    bgClass: string;
    accentClass: string;
    textClass: string;
    hex: string;
    icon: React.ElementType;
}

export const PremiumCardThemes: MembershipCardTheme[] = [
    {
        id: "dark-premium",
        label: "Dark Premium",
        bgClass: "bg-zinc-950 bg-[radial-gradient(ellipse_at_top_left,rgba(50,50,50,1)_0%,rgba(15,15,15,1)_60%,rgba(0,0,0,1)_100%)]",
        accentClass: "bg-white/10 text-white",
        textClass: "text-white",
        hex: "#09090b",
        icon: Shield
    },
    {
        id: "gold-elite",
        label: "Gold Elite",
        bgClass: "bg-amber-500 bg-[linear-gradient(135deg,#fcd34d_0%,#f59e0b_50%,#b45309_100%)]",
        accentClass: "bg-black/10 text-black",
        textClass: "text-[#1a1a1a]",
        hex: "#f59e0b",
        icon: Crown
    },
    {
        id: "emerald-oasis",
        label: "Emerald Oasis",
        bgClass: "bg-emerald-900 bg-[radial-gradient(circle_at_top_right,#10b981_0%,#065f46_45%,#022c22_100%)]",
        accentClass: "bg-white/10 text-white",
        textClass: "text-emerald-50",
        hex: "#064e3b",
        icon: Leaf
    },
    {
        id: "classic-pearl",
        label: "Classic Pearl",
        bgClass: "bg-[#fdfcf9] bg-[linear-gradient(135deg,#ffffff_0%,#fdfcf9_50%,#f1f0e8_100%)]",
        accentClass: "bg-[#2d5a27]/10 text-[#2d5a27]",
        textClass: "text-[#15241f]",
        hex: "#fdfcf9",
        icon: Sparkle
    },
    {
        id: "noir-stealth",
        label: "Noir Stealth",
        bgClass: "bg-[#050505] bg-[radial-gradient(circle_at_50%_40%,#1a1a1c_0%,#09090a_60%,#000000_100%)]",
        accentClass: "bg-white/5 text-white border-white/10",
        textClass: "text-zinc-100",
        hex: "#0f0f11",
        icon: Shield
    }
];

interface PrintableMembershipCardProps {
    clientName: string;
    qrCodeString: string;
    tier?: string;
    theme?: MembershipCardTheme;
    businessName?: string;
    branchName?: string;
    isExporting?: boolean;
}

export default function PrintableMembershipCard({
    clientName = "Client Name",
    qrCodeString = "",
    tier = "BRONZE",
    theme = PremiumCardThemes[0],
    businessName = "KIZERE",
    branchName = "SAUNA SPA",
    isExporting = false
}: PrintableMembershipCardProps) {
    const [shinePos, setShinePos] = useState({ x: 0, y: 0 });
    const [localQr, setLocalQr] = useState<string>("");
    
    // Generate QR locally to avoid CORS and ensure high fidelity during PDF capture
    useEffect(() => {
        if (!qrCodeString) return;
        
        QRCode.toDataURL(qrCodeString, {
            margin: 2, // Standard quiet zone to prevent bleed
            width: 512, // High res for export
            color: {
                dark: "#000000",
                light: "#FFFFFF"
            }
        }).then(url => setLocalQr(url))
          .catch(err => console.error("QR Gen Error:", err));
    }, [qrCodeString]);
    
    const memberSince = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isExporting) return; // Disable interactive shine during export
        const rect = e.currentTarget.getBoundingClientRect();
        setShinePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const TierIcon = theme.icon;

    return (
        <div 
            id="print-card-container" 
            onMouseMove={handleMouseMove}
            className={`print:block relative rounded-2xl overflow-hidden shadow-2xl ${theme.bgClass} ${theme.textClass} border border-[var(--border-muted)] print:w-[86mm] print:h-[54mm] print:rounded-none print:border-none group transition-all duration-300 w-[325px] h-[204px] ${theme.id === "noir-stealth" ? "ring-1 ring-inset ring-white/10" : ""}`}
        >
            {/* Holographic ShineOverlay */}
            <div className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300 print:hidden holographic-shine"></div>

            {/* Security Pattern Layer */}
            <div className="absolute inset-0 opacity-20 z-0 print:opacity-40 security-pattern"></div>

            {/* Premium Spotlight Effect (Noir Stealth Only) */}
            {theme.id === "noir-stealth" && (
                <div className="absolute inset-0 z-[2] opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.05)_0%,transparent_50%)]"></div>
            )}

            {/* Grain Texture Layer (Noir Stealth Only) */}
            {theme.id === "noir-stealth" && (
                <div className="absolute inset-0 grain-texture z-[1] pointer-events-none"></div>
            )}

            {/* Content Layer */}
            <div className="absolute inset-0 p-3.5 flex flex-col justify-between h-full w-full z-20">
                
                {/* Header */}
                <div className="flex justify-between items-start pb-1 relative z-10 print:mb-auto">
                    <div className="flex items-center gap-2">
                        <div className={`size-8 rounded-xl flex items-center justify-center ${theme.accentClass} shadow-lg border border-white/10 ${isExporting ? 'brightness-125' : ''}`}>
                            <Droplets className="w-4.5 h-4.5" />
                        </div>
                        <div>
                            <span className={`font-bold tracking-widest text-[8px] leading-tight uppercase block ${isExporting ? 'font-black opacity-100' : ''}`}>{businessName}</span>
                            <span className={`font-medium tracking-tight text-[10px] leading-tight uppercase block -mt-0.5 opacity-90 ${isExporting ? 'font-bold opacity-100' : ''}`}>{branchName}</span>
                        </div>
                    </div>
                    {tier && (
                        <div className={`flex items-center gap-1.5 border border-white/20 bg-white/10 backdrop-blur-sm px-1.5 py-0.5 rounded-lg text-[6px] font-bold uppercase tracking-widest leading-none shadow-sm ${isExporting ? 'border-white/40 bg-white/20' : ''}`}>
                            <TierIcon className="w-2 h-2" />
                            {tier}
                        </div>
                    )}
                </div>

                {/* Center is now empty for all themes for a minimalist clean look */}
                <div className="flex-1"></div>

                {/* Right Middle QR for non-noir themes */}
                {theme.id !== "noir-stealth" && localQr && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
                         <div className={`p-1 rounded-2xl border ${theme.id === "classic-pearl" ? "bg-[#15241f]/5 border-[#15241f]/10" : "bg-white/10 border-white/20"} backdrop-blur-sm shadow-sm`}>
                            <div className="bg-white p-1.5 rounded-xl overflow-hidden shadow-inner">
                                <img 
                                    src={localQr} 
                                    alt="Smart QR"
                                    className="w-12 h-12 object-contain"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Section */}
                <div className={`flex justify-between items-end pb-1 w-full relative z-10 border-t ${theme.id === "classic-pearl" ? "border-[#2d5a27]/10" : theme.id === "noir-stealth" ? "border-transparent" : "border-white/10"} pt-1`}>
                    <div className="flex-1 relative z-30">
                        <p className={`text-[6px] uppercase font-bold tracking-widest mb-0.5 leading-none opacity-70 ${isExporting ? 'opacity-100 font-black' : ''}`}>
                            {theme.id === "noir-stealth" ? "VIP Membership Card" : "Membership Pass"}
                        </p>
                        <h4 className={`text-xs font-bold uppercase truncate leading-none ${isExporting ? 'text-white brightness-125 scale-[1.05] origin-bottom-left' : ''}`}>{clientName}</h4>
                    </div>
                    <div className="text-right pb-0.5 flex flex-col items-end gap-1">
                        {/* THEME LAYOUT SYNC: 
                            Noir Stealth: QR at Bottom Right (footer level)
                            Others: QR at Right Middle (sidebar level - see absolute div above)
                        */}
                        {theme.id === "noir-stealth" && localQr && (
                            <div className="bg-white/10 backdrop-blur-md p-0.5 rounded-lg border border-white/10 shadow-sm mb-1 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                <div className="bg-white p-1 rounded-md">
                                    <img 
                                        src={localQr} 
                                        alt="Bottom Right QR"
                                        className="w-7 h-7 object-contain"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="opacity-0 pointer-events-none">
                            {/* Joined section removed globally for a clean, premium aesthetic */}
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                #print-card-container {
                    background-color: ${theme.hex} !important;
                    box-shadow: inset 0 0 0 1000px ${theme.hex} !important;
                }
                .holographic-shine {
                    background: radial-gradient(circle at ${shinePos.x}px ${shinePos.y}px, rgba(255,255,255,0.4) 0%, transparent 60%);
                }
                .security-pattern {
                    background-image: ${theme.id === "noir-stealth" 
                        ? `url("data:image/svg+xml,%3Csvg width='300' height='60' viewBox='0 0 300 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 Q 75 10 150 30 T 300 30' fill='none' stroke='white' stroke-width='0.15' opacity='${isExporting ? "0.2" : "0.12"}'/%3E%3Cpath d='M0 20 Q 75 0 150 20 T 300 20' fill='none' stroke='white' stroke-width='0.15' opacity='${isExporting ? "0.15" : "0.08"}'/%3E%3Cpath d='M0 40 Q 75 20 150 40 T 300 40' fill='none' stroke='white' stroke-width='0.15' opacity='${isExporting ? "0.15" : "0.08"}'/%3E%3Cpath d='M0 10 Q 75 -10 150 10 T 300 10' fill='none' stroke='white' stroke-width='0.15' opacity='0.05'/%3E%3Cpath d='M0 50 Q 75 30 150 50 T 300 50' fill='none' stroke='white' stroke-width='0.15' opacity='0.05'/%3E%3Cpath d='M0 25 Q 75 45 150 25 T 300 25' fill='none' stroke='white' stroke-width='0.15' opacity='0.04'/%3E%3Cpath d='M0 35 Q 75 55 150 35 T 300 35' fill='none' stroke='white' stroke-width='0.15' opacity='0.04'/%3E%3C/svg%3E")`
                        : `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40 L40 0 M10 40 L40 10 M20 40 L40 20 M30 40 L40 30 M0 30 L30 0 M0 20 L20 0 M0 10 L10 0' fill='none' stroke='${theme.id === "classic-pearl" ? "%232d5a27" : "%23ffffff"}' stroke-width='0.5' opacity='${theme.id === "classic-pearl" ? "0.1" : "0.5"}'/%3E%3C/svg%3E")`
                    };
                }
                .grain-texture {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    opacity: ${isExporting ? "0.08" : "0.04"};
                    mix-blend-mode: overlay;
                }
                    @media print {
                        #print-card-container {
                            border-radius: 4mm !important;
                            overflow: hidden !important;
                        }
                    }
            `}} />
        </div>
    );
}
