"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutModal from "./CheckoutModal";
import { CheckCircle2 } from "lucide-react";

interface CheckoutButtonProps {
    recordId: string;
    currentStatus: string;
    clientName: string;
    amount: number;
    phone?: string;
}

export default function CheckoutButton({ 
    recordId, 
    currentStatus, 
    clientName, 
    amount, 
    phone 
}: CheckoutButtonProps) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    if (currentStatus === "COMPLETED" || currentStatus === "CANCELLED") {
        return (
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                currentStatus === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : 
                "bg-red-500/10 text-red-500 border-red-500/20"
            }`}>
                {currentStatus}
            </span>
        );
    }

    return (
        <>
            {showModal && (
                <CheckoutModal 
                    recordId={recordId}
                    clientName={clientName}
                    amount={amount}
                    defaultPhone={phone}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        router.refresh();
                    }}
                />
            )}

            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-dark)] transition-all active:scale-95 group ml-auto shadow-sm"
            >
                <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform font-black" />
                Done
            </button>
        </>
    );
}
