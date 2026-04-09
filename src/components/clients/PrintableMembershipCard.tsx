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
        bgClass: "bg-zinc-950 bg-gradient-to-br from-[#09090b] via-[#121214] to-black",
        accentClass: "bg-white/10 text-white",
        textClass: "text-white",
        hex: "#09090b",
        icon: Shield
    },
    {
        id: "gold-elite",
        label: "Gold Elite",
        bgClass: "bg-amber-500 bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600",
        accentClass: "bg-black/10 text-black",
        textClass: "text-[#1a1a1a]",
        hex: "#f59e0b",
        icon: Crown
    },
    {
        id: "emerald-oasis",
        label: "Emerald Oasis",
        bgClass: "bg-emerald-900 bg-gradient-to-br from-emerald-700 via-emerald-900 to-teal-950",
        accentClass: "bg-white/10 text-white",
        textClass: "text-emerald-50",
        hex: "#064e3b",
        icon: Leaf
    }
];

interface PrintableMembershipCardProps {
    clientName: string;
    qrCodeString: string;
    tier?: string;
    theme?: MembershipCardTheme;
}

export default function PrintableMembershipCard({
    clientName = "Client Name",
    qrCodeString = "",
    tier = "BRONZE",
    theme = PremiumCardThemes[0]
}: PrintableMembershipCardProps) {
    const [shinePos, setShinePos] = useState({ x: 0, y: 0 });
    const [qrDataUrl, setQrDataUrl] = useState<string>("");
    
    useEffect(() => {
        if (qrCodeString) {
            QRCode.toDataURL(qrCodeString, {
                margin: 0,
                width: 128,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            })
            .then(url => setQrDataUrl(url))
            .catch(err => console.error("QR Code Error:", err));
        }
    }, [qrCodeString]);
    const memberSince = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
            className={`print:block relative rounded-2xl overflow-hidden shadow-2xl ${theme.bgClass} ${theme.textClass} border border-white/10 print:w-[86mm] print:h-[54mm] print:rounded-none print:border-none group transition-all duration-300 w-[325px] h-[204px]`}
        >
            {/* Holographic ShineOverlay */}
            <div className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300 print:hidden holographic-shine"></div>

            {/* Security Pattern Layer */}
            <div className="absolute inset-0 opacity-20 z-0 print:opacity-40 security-pattern"></div>

            {/* Content Layer */}
            <div className="absolute inset-0 p-3.5 flex flex-col justify-between h-full w-full relative z-20 print:relative print:inset-auto print:p-2.5">
                
                {/* Header */}
                <div className="flex justify-between items-start pb-1 relative z-10 print:mb-auto">
                    <div className="flex items-center gap-2">
                        <div className={`size-8 rounded-xl flex items-center justify-center ${theme.accentClass} shadow-lg border border-white/10`}>
                            <Droplets className="w-4.5 h-4.5" />
                        </div>
                        <div>
                            <span className="font-black tracking-[0.2em] text-[10px] leading-tight uppercase block">KIZERE</span>
                            <span className="font-extrabold tracking-tighter text-sm leading-tight uppercase block -mt-1 opacity-90">SAUNA SPA</span>
                        </div>
                    </div>
                    {tier && (
                        <div className="flex items-center gap-1.5 border border-white/20 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest leading-none shadow-sm">
                            <TierIcon className="w-3 h-3" />
                            {tier}
                        </div>
                    )}
                </div>

                {/* QR Code Section */}
                <div className="flex flex-col items-center justify-center py-1 flex-1">
                    <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-[1.5rem] shadow-2xl border border-white/20 relative group-hover:scale-105 transition-transform duration-500">
                        <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-[1.6rem] z-0 blur-sm"></div>
                        <div className="relative z-10 bg-white p-2 rounded-[1.2rem] shadow-inner">
                            {qrDataUrl ? (
                                <div className="w-16 h-16 flex items-center justify-center bg-white rounded-md">
                                    <img 
                                        src={qrDataUrl} 
                                        alt="Client QR Code"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 flex items-center justify-center text-slate-200">
                                    <Sparkle className="w-8 h-8 animate-pulse" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="flex justify-between items-end pb-1 w-full relative z-10 border-t border-white/10 pt-1.5 print:border-current print:border-t-2 print:mt-auto print:pt-1 print:pb-0">
                    <div className="flex-1 relative z-30">
                        <p className="text-[6px] lg:text-[7px] uppercase font-black tracking-[0.3em] mb-0.5 italic leading-none opacity-70">Signature Membership Pass</p>
                        <h4 className="text-lg lg:text-xl font-black tracking-tighter uppercase truncate leading-none italic">{clientName}</h4>
                    </div>
                    <div className="text-right pb-0.5">
                        <p className="text-[5.5px] uppercase font-black tracking-widest opacity-60 leading-none mb-0.5">Member Since</p>
                        <p className="text-[10px] font-black tracking-tighter leading-none italic uppercase">{memberSince}</p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                #print-card-container {
                    background-color: ${theme.hex} !important;
                    box-shadow: inset 0 0 0 1000px ${theme.hex} !important;
                }
                .holographic-shine {
                    background: radial-gradient(circle at ${shinePos.x}px ${shinePos.y}px, rgba(255,255,255,0.4) 0%, transparent 60%);
                }
                .security-pattern {
                    background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40 L40 0 M10 40 L40 10 M20 40 L40 20 M30 40 L40 30 M0 30 L30 0 M0 20 L20 0 M0 10 L10 0' fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.5'/%3E%3C/svg%3E");
                }
                @media print {
                    @page { 
                        margin: 0; 
                        size: 86mm 54mm landscape; 
                    }
                    #print-card-container {
                        visibility: visible !important;
                        display: block !important;
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 325px !important;
                        height: 204px !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        background-color: ${theme.hex} !important;
                        box-shadow: inset 0 0 0 1000px ${theme.hex} !important;
                    }
                    #print-card-container * {
                        visibility: visible !important;
                    }
                }
            `}</style>
        </div>
    );
}
