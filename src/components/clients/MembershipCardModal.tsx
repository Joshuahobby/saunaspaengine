"use client";

import { useState, useRef } from "react";
import PrintableMembershipCard, { PremiumCardThemes, MembershipCardTheme } from "./PrintableMembershipCard";
import { X, Printer, Check, Palette, Download, FileDown, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import { saveMembershipCardAction } from "@/lib/membership-actions";

interface MembershipCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientName: string;
    clientId: string;
    qrCodeString: string;
    tier?: string;
    businessName: string;
    branchName: string;
}

export default function MembershipCardModal({
    isOpen,
    onClose,
    clientName,
    clientId,
    qrCodeString,
    tier = "BRONZE",
    businessName,
    branchName
}: MembershipCardModalProps) {
    const [selectedTheme, setSelectedTheme] = useState<MembershipCardTheme>(PremiumCardThemes[0]);
    const [isExporting, setIsExporting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handlePrintImproved = async () => {
        const tid = toast.loading("Preparing high-fidelity print window...");
        try {
            const dataUrl = await captureCardAsImage();
            if (!dataUrl) throw new Error("Capture failed");

            // Open a precise print window
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            if (!printWindow) {
                toast.error("Popup blocked! Please allow popups for printing.", { id: tid });
                return;
            }

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Membership Card</title>
                        <style>
                            @page { size: 86mm 54mm landscape; margin: 0; }
                            body { margin: 0; padding: 0; background: white; width: 86mm; height: 54mm; overflow: hidden; }
                            img { width: 86mm; height: 54mm; object-fit: contain; image-rendering: -webkit-optimize-contrast; }
                        </style>
                    </head>
                    <body>
                        <img src="${dataUrl}" onload="window.print(); window.close();" />
                    </body>
                </html>
            `);
            printWindow.document.close();
            toast.success("Print dialog opened", { id: tid });
        } catch (err) {
            console.error("Print Error:", err);
            toast.error("Fail to prepare card for print", { id: tid });
        }
    };

    const captureCardAsImage = async () => {
        if (!cardRef.current) return null;
        
        // Surgical Fix for SecurityError: Temporarily disable external stylesheets that don't allow rule access
        const disabledSheets: (HTMLStyleElement | HTMLLinkElement)[] = [];
        Array.from(document.styleSheets).forEach(sheet => {
            try {
                // Test if we can access rules
                const rules = sheet.cssRules; 
            } catch (e) {
                // If we can't, this sheet will cause html-to-image to crash
                if (sheet.ownerNode instanceof HTMLStyleElement || sheet.ownerNode instanceof HTMLLinkElement) {
                    (sheet.ownerNode as HTMLLinkElement).disabled = true;
                    disabledSheets.push(sheet.ownerNode);
                }
            }
        });

        try {
            // Give time for high-fidelity styles and QR to settle
            await new Promise(resolve => setTimeout(resolve, 600));

            return await toPng(cardRef.current, {
                pixelRatio: 4, // 400 DPI standard (96 * 4 approx 384)
                skipFonts: false,
                cacheBust: true,
                style: {
                    transform: 'none',
                    margin: '0',
                },
                filter: (node: HTMLElement) => {
                    const tagName = node.tagName?.toLowerCase();
                    if (tagName === 'script' || tagName === 'noscript') return false;
                    return true;
                }
            });
        } finally {
            // Restore stylesheets
            disabledSheets.forEach(s => { (s as HTMLLinkElement).disabled = false; });
        }
    };

    const handleDownload = async (format: 'png' | 'pdf' = 'png') => {
        const tid = toast.loading(`Baking ${format.toUpperCase()}...`);
        setIsExporting(true);
        
        try {
            const dataUrl = await captureCardAsImage();
            if (!dataUrl) throw new Error("Capture failed");

            if (format === 'pdf') {
                // Create PDF at exact CR80 size (86mm x 54mm)
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: [86, 54],
                    compress: true
                });

                const img = new Image();
                img.src = dataUrl;
                await new Promise((resolve) => { img.onload = resolve; });

                const imgWidth = img.width;
                const imgHeight = img.height;
                const imgRatio = imgWidth / imgHeight;
                const pdfRatio = 86 / 54;

                let finalW = 86;
                let finalH = 54;
                let x = 0;
                let y = 0;

                if (imgRatio > pdfRatio) {
                    finalH = 86 / imgRatio;
                    y = (54 - finalH) / 2;
                } else if (imgRatio < pdfRatio) {
                    finalW = 54 * imgRatio;
                    x = (86 - finalW) / 2;
                }

                pdf.addImage(dataUrl, 'PNG', x, y, finalW, finalH, undefined, 'FAST');
                pdf.save(`MembershipCard_${clientName.replace(/\s+/g, '_')}_${selectedTheme.id}.pdf`);
            } else {
                const link = document.createElement('a');
                link.download = `MembershipCard_${clientName.replace(/\s+/g, '_')}_${selectedTheme.id}.png`;
                link.href = dataUrl;
                link.click();
            }
            
            toast.success("Ready!", { id: tid });
        } catch (err) {
            console.error("Export Error:", err);
            toast.error("Failed to generate file", { id: tid });
        } finally {
            setIsExporting(false);
        }
    };

    const handleSyncToDatabase = async () => {
        const tid = toast.loading("Baking & Syncing with Server...");
        setIsSaving(true);
        
        try {
            const dataUrl = await captureCardAsImage();
            if (!dataUrl) throw new Error("Processing failed");

            // Persist locally for now (can be base64 if Cloudinary is not ready)
            // But we call the server action to save the reference
            const res = await saveMembershipCardAction(clientId, dataUrl);
            
            if (res.error) {
                toast.error(res.error, { id: tid });
            } else {
                toast.success("Card persisted to database!", { id: tid });
            }
        } catch (err) {
            console.error("Sync Error:", err);
            toast.error("Failed to persist card", { id: tid });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[var(--bg-app)]/80 backdrop-blur-md"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="p-6 border-b border-[var(--border-muted)] flex items-center justify-between bg-[var(--bg-surface-muted)]">
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
                        className="size-10 rounded-full hover:bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--text-muted)] transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 space-y-8 flex flex-col items-center">
                    
                    <div className="w-full max-w-[420px] py-12 flex items-center justify-center bg-[var(--bg-surface-muted)]/30 rounded-2xl border border-[var(--border-muted)] shadow-inner print:p-0 print:m-0 print:border-none print:shadow-none print-target-visible">
                        <div 
                            ref={cardRef}
                            className="w-full px-4 transform scale-110 md:scale-100 print:transform-none print:p-0 print:m-0"
                        >
                            <PrintableMembershipCard 
                                clientName={clientName}
                                qrCodeString={qrCodeString}
                                tier={tier}
                                theme={selectedTheme}
                                businessName={businessName}
                                branchName={branchName}
                                isExporting={isExporting}
                            />
                        </div>
                    </div>

                    {/* Theme Selector */}
                    <div className="w-full space-y-6">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-2 opacity-60">
                                <div className="size-1 bg-[var(--color-primary)] rounded-full"></div>
                                Select Card Aesthetic
                            </label>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {PremiumCardThemes.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => setSelectedTheme(theme)}
                                    className={`relative flex flex-col items-center gap-2 p-1.5 rounded-2xl border-2 transition-all ${selectedTheme.id === theme.id ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)] shadow-sm' : 'border-[var(--bg-surface-muted)] bg-[var(--bg-surface-muted)]/50 hover:bg-[var(--bg-card)]'}`}
                                >
                                    <div className={`w-full h-11 rounded-xl ${theme.bgClass} border border-black/5 shadow-inner flex items-center justify-center`}>
                                        {selectedTheme.id === theme.id && <Check className={`w-5 h-5 ${theme.id === "classic-pearl" ? "text-[var(--color-primary)]" : "text-white"}`} />}
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-tighter mt-1 ${selectedTheme.id === theme.id ? 'text-[var(--color-primary)]' : 'text-[var(--text-muted)]'}`}>
                                        {theme.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Print Styles Injection (Standardized CR80 Landscape) */}
                <style dangerouslySetInnerHTML={{ __html: `@media print { 
                    @page { 
                        size: 86mm 54mm landscape; 
                        margin: 0; 
                    } 
                    html, body { 
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: visible !important;
                        background: white !important;
                    }
                    /* Surgical Visibility Strategy: Hide all content by default */
                    body * { 
                        visibility: hidden !important; 
                    }
                    /* Surgically reveal ONLY the card and its parents along the render branch */
                    .print-target-visible, .print-target-visible *, 
                    #print-card-container, #print-card-container * {
                        visibility: visible !important;
                    }
                    /* Force parents to display but remain transparent/invisible content-wise */
                    body, #__next, main, div[role="dialog"], .fixed.inset-0 {
                        visibility: visible !important;
                        background: none !important;
                        border: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        display: block !important;
                    }
                    /* The Modal Backdrop must be hidden */
                    .bg-\[var\(--bg-app\)\]\/80 {
                        display: none !important;
                    }
                    /* The Card Container - Absolute Page Origin */
                    #print-card-container { 
                        position: fixed !important; 
                        top: 0 !important;
                        left: 0 !important;
                        width: 86mm !important; 
                        height: 54mm !important; 
                        margin: 0 !important;
                        padding: 0 !important;
                        border-radius: 4mm !important;
                        overflow: hidden !important;
                        box-shadow: none !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        transform: none !important;
                        z-index: 999999 !important;
                    }
                }` }} />

                {/* Clean Footer Actions */}
                <div className="p-8 border-t border-[var(--border-muted)] bg-[var(--bg-surface-muted)]/50 space-y-6">
                    
                    {/* Secondary Actions Toolbar (Print & Export) */}
                    <div className="grid grid-cols-3 gap-3">
                        <button 
                            onClick={handlePrintImproved}
                            disabled={isExporting || isSaving}
                            className="bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-main)] py-3.5 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-[var(--bg-app)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 italic disabled:opacity-50"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            Print
                        </button>
                        <button 
                            onClick={() => handleDownload('png')}
                            disabled={isExporting || isSaving}
                            className="bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-main)] py-3.5 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-[var(--bg-app)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 italic disabled:opacity-50"
                        >
                            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                            PNG
                        </button>
                        <button 
                            onClick={() => handleDownload('pdf')}
                            disabled={isExporting || isSaving}
                            className="bg-black text-white/90 py-3.5 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:brightness-125 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm italic disabled:opacity-50"
                        >
                            <FileDown className="w-3.5 h-3.5" />
                            PDF
                        </button>
                    </div>

                    {/* Primary Action Bar (Sync & Close) */}
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleSyncToDatabase}
                            disabled={isSaving || isExporting}
                            className="flex-[2] bg-gradient-to-r from-amber-500 to-amber-600 text-black py-4.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 italic disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Check className="w-4.5 h-4.5" />}
                            Sync to Dashboard
                        </button>
                        <button 
                            onClick={onClose}
                            className="flex-1 px-8 py-4.5 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl font-black text-[10px] uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--bg-app)] transition-all italic"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
