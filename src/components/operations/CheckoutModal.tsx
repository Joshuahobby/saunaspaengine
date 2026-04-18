import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { initiateServiceCheckoutAction, completeVisitAction } from "@/app/(dashboard)/operations/checkout-actions";
import { QRScanner } from "./QRScanner";
import { toast } from "react-hot-toast";
import { 
    X, 
    Smartphone, 
    Banknote, 
    CreditCard, 
    Contact2, 
    CheckCircle2, 
    AlertCircle,
    ArrowRight,
    QrCode,
    Loader2
} from "lucide-react";

interface CheckoutModalProps {
    recordId: string;
    clientName: string;
    amount: number;
    defaultPhone?: string;
    onClose: () => void;
    onSuccess: () => void;
}

type PaymentMode = "CASH" | "MOMO" | "POS" | "MEMBERSHIP";
type CheckoutStatus = "IDLE" | "PENDING_MOMO" | "PENDING_COMPLETION" | "SUCCESS" | "ERROR";

export default function CheckoutModal({
    recordId,
    clientName,
    amount,
    defaultPhone = "",
    onClose,
    onSuccess
}: CheckoutModalProps) {
    const [mode, setMode] = useState<PaymentMode>("CASH");
    const [phone, setPhone] = useState(defaultPhone);
    const [status, setStatus] = useState<CheckoutStatus>("IDLE");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // Membership state
    const [membershipVerified, setMembershipVerified] = useState(false);

    const handleInitialPay = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            if (mode === "MOMO") {
                await initiateServiceCheckoutAction(recordId, phone);
                setStatus("PENDING_MOMO");
            } else {
                // CASH, POS, or MEMBERSHIP (if already verified or if we just want to force complete)
                await completeVisitAction(recordId, mode);
                setStatus("SUCCESS");
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Payment failed");
            setStatus("ERROR");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMembershipScan = useCallback(async (qrCode: string) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError(null);
        
        try {
            const res = await fetch(`/api/clients/search?query=${encodeURIComponent(qrCode)}`);
            if (!res.ok) throw new Error("Membership card not found or invalid");
            
            const client = await res.json();
            // In a real scenario, we'd verify this client matches the one in the record
            // or just allow any valid membership if the business allows.
            setMembershipVerified(true);
            toast.success("Membership Card Verified!");
        } catch (err) {
            setError((err as Error).message);
            toast.error((err as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting]);

    const paymentModes = [
        { id: "CASH", label: "Cash", icon: Banknote, color: "emerald" },
        { id: "MOMO", label: "MoMo", icon: Smartphone, color: "yellow" },
        { id: "POS", label: "Card/POS", icon: CreditCard, color: "blue" },
        { id: "MEMBERSHIP", label: "Member", icon: Contact2, color: "purple" }
    ] as const;

    if (!mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-xl animate-in fade-in duration-300">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose} />
            
            <div className="bg-[var(--bg-card)] border-t sm:border border-[var(--border-muted)] w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[4rem] shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 flex flex-col max-h-[96vh] sm:max-h-[90vh]">
                
                {/* Mobile Handle Indicator */}
                <div className="flex justify-center pt-4 sm:hidden">
                    <div className="w-12 h-1.5 bg-[var(--border-muted)]/40 rounded-full" />
                </div>

                {/* Header */}
                <div className="p-5 pb-1 sm:p-8 sm:pb-4 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-lg sm:text-2xl font-black tracking-tight text-[var(--text-main)]">Checkout</h2>
                        <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] mt-1">Finalize Guest Session</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="size-9 sm:size-12 rounded-xl sm:rounded-2xl bg-[var(--bg-surface-muted)] flex items-center justify-center text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-all active:scale-95"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 font-black" />
                    </button>
                </div>

                <div className="p-4 pt-0 sm:p-8 sm:pt-2 space-y-3 sm:space-y-5 overflow-y-auto custom-scrollbar">
                    {/* Summary Card */}
                    {/* Summary Card - Ultra Compact */}
                    <div className="bg-[var(--bg-surface-muted)]/20 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-[var(--border-muted)]/20 relative overflow-hidden shrink-0">
                        <div className="flex flex-row justify-between items-center">
                            <div className="space-y-0.5">
                                <span className="text-[7px] font-black uppercase tracking-widest opacity-30">Client</span>
                                <p className="font-black text-xs sm:text-2xl tracking-tight truncate max-w-[120px] sm:max-w-none uppercase text-[var(--text-main)]">{clientName}</p>
                            </div>
                            <div className="text-right space-y-0.5">
                                <span className="text-[7px] font-black uppercase tracking-widest opacity-30">Total</span>
                                <p className="text-xl sm:text-4xl font-black text-[var(--color-primary)] tracking-tighter">RWF {amount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {status === "IDLE" || status === "ERROR" ? (
                        <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-2">
                            {/* Payment Selector - Single Row on Mobile */}
                            <div className="grid grid-cols-4 gap-2">
                                {paymentModes.map((pm) => {
                                    const Icon = pm.icon;
                                    const isActive = mode === pm.id;
                                    return (
                                        <button
                                            key={pm.id}
                                            onClick={() => {
                                                setMode(pm.id);
                                                setError(null);
                                            }}
                                            className={`flex flex-col items-center justify-center gap-1.5 p-2 py-2.5 sm:p-3 sm:py-5 rounded-xl sm:rounded-2xl border-2 transition-all active:scale-95 ${
                                                isActive 
                                                ? `bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-bg-dark)] shadow-md shadow-[var(--color-primary)]/10` 
                                                : "bg-[var(--bg-surface-muted)]/10 border-[var(--border-muted)]/10 hover:border-[var(--border-muted)]/30 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                                            }`}
                                        >
                                            <Icon className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${isActive ? "font-black" : "opacity-50"}`} />
                                            <span className="text-[6px] sm:text-[8px] font-black uppercase tracking-tighter sm:tracking-widest text-center">{pm.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Payment Method UI */}
                            <div className="min-h-[80px] sm:min-h-[120px] flex flex-col justify-center animate-in fade-in zoom-in-95 duration-300">
                                {mode === "MOMO" && (
                                    <div className="space-y-1.5 sm:space-y-3">
                                        <label className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2 opacity-50">MoMo Number</label>
                                        <div className="relative group">
                                            <input 
                                                type="tel"
                                                placeholder="078... or 079..."
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full bg-[var(--bg-surface-muted)]/20 border-2 border-[var(--border-muted)]/30 rounded-lg sm:rounded-xl px-4 py-3 sm:py-4 text-sm sm:text-lg font-black tracking-widest placeholder:opacity-5 outline-none focus:border-[var(--color-primary)] transition-all text-center"
                                            />
                                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-[var(--text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" />
                                        </div>
                                    </div>
                                )}

                                {mode === "MEMBERSHIP" && (
                                    <div className="space-y-1.5 sm:space-y-3">
                                        {!membershipVerified ? (
                                            <div className="space-y-1.5 sm:space-y-3">
                                                <div className="flex items-center justify-between px-2">
                                                    <label className="text-[7px] sm:text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-50">Scan Membership</label>
                                                    <span className="text-[6px] sm:text-[8px] font-bold text-[var(--color-primary)] animate-pulse">Awaiting...</span>
                                                </div>
                                                <div className="h-56 sm:h-80 relative rounded-xl sm:rounded-2xl overflow-hidden border-2 border-[var(--border-muted)]/30 bg-black/20">
                                                    <QRScanner onScanSuccess={handleMembershipScan} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex items-center justify-center gap-3 animate-in zoom-in duration-300">
                                                <div className="size-7 sm:size-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                                                </div>
                                                <div className="ml-2 sm:ml-4">
                                                    <p className="text-emerald-500 font-black text-[10px] sm:text-xs uppercase tracking-tight">Verified</p>
                                                    <p className="text-[6px] sm:text-[8px] font-bold text-emerald-500/60 uppercase tracking-widest hidden sm:block">Valid Membership</p>
                                                </div>
                                                <button 
                                                    onClick={() => setMembershipVerified(false)}
                                                    className="ml-auto text-[6px] sm:text-[8px] font-black uppercase tracking-widest text-emerald-500/40 hover:text-emerald-500 px-2"
                                                >
                                                    Rescan
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(mode === "CASH" || mode === "POS") && (
                                    <div className="text-center py-2 sm:py-4 space-y-1 sm:space-y-2 opacity-60 px-4">
                                        <p className="text-sm font-bold text-[var(--text-main)] uppercase tracking-tight">Confirm {mode}</p>
                                        <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">Collect RWF {amount.toLocaleString()} to complete.</p>
                                    </div>
                                )}
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-3 animate-in shake-in duration-300">
                                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 shrink-0" />
                                    <p className="text-[9px] font-bold text-rose-500 uppercase tracking-wider leading-relaxed">{error}</p>
                                </div>
                            )}

                            {/* Primary Action */}
                            <button
                                onClick={handleInitialPay}
                                disabled={isSubmitting || (mode === "MOMO" && !phone) || (mode === "MEMBERSHIP" && !membershipVerified)}
                                className="w-full py-3 sm:py-4.5 bg-[var(--color-primary)] text-[var(--color-bg-dark)] rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] sm:text-xs hover:opacity-95 active:scale-[0.98] disabled:opacity-30 transition-all shadow-lg shadow-[var(--color-primary)]/10 flex items-center justify-center gap-2 group"
                            >
                                {isSubmitting ? (
                                    <div className="size-3.5 sm:size-5 border-2 sm:border-3 border-[var(--color-bg-dark)] border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        {mode === "MOMO" ? "Send MOMO Prompt" : "Success & Complete"}
                                        <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    ) : status === "PENDING_MOMO" ? (
                        <div className="py-8 sm:py-12 text-center space-y-5 sm:space-y-8 animate-in zoom-in duration-500">
                            <div className="relative mx-auto size-20 sm:size-32">
                                <div className="absolute inset-0 bg-[var(--color-primary)]/20 rounded-full animate-ping"></div>
                                <div className="relative size-full bg-[var(--color-primary)]/10 border-4 border-[var(--color-primary)] rounded-full flex items-center justify-center text-[var(--color-primary)]">
                                    <Smartphone className="w-8 h-8 sm:w-12 sm:h-12 font-black animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-2 px-6">
                                <h3 className="text-lg sm:text-2xl font-black tracking-tight">Processing MoMo...</h3>
                                <p className="text-[10px] sm:text-xs font-bold text-[var(--text-muted)] leading-relaxed">
                                    Prompt sent to <span className="text-[var(--text-main)] font-black">{phone}</span>. 
                                </p>
                            </div>
                            <div className="pt-2 flex flex-col gap-3 max-w-[180px] mx-auto">
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 bg-[var(--bg-surface-muted)] text-[var(--text-main)] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[var(--border-muted)] transition-all"
                                >
                                    Dismiss
                                </button>
                                <p className="text-[7px] font-bold text-[var(--text-muted)] opacity-40 uppercase tracking-widest">Updating automatically...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 sm:py-12 text-center space-y-5 sm:space-y-8 animate-in zoom-in duration-500">
                            <div className="mx-auto size-20 sm:size-32 bg-emerald-500/10 border-4 border-emerald-500 rounded-full flex items-center justify-center text-emerald-500">
                                <CheckCircle2 className="w-10 h-10 sm:w-16 sm:h-16 font-black" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg sm:text-2xl font-black tracking-tight text-emerald-500 uppercase">Success!</h3>
                                <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">Session Closed</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
