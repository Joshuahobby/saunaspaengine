"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { QRScanner } from "./QRScanner";
import { ClientCheckInResult } from "./ClientCheckInResult";
import CheckInForm from "./check-in-form";
import { toast } from "react-hot-toast";
import { QrCode, Keyboard, ArrowLeft } from "lucide-react";

interface ClientWithMemberships {
    id: string;
    fullName: string;
    phoneNumber: string | null;
    email: string | null;
    loyaltyPoints?: Array<{ id: string; points: number; tier: string }>;
    healthNotes?: string | null;
    preferences?: string | null;
    memberships: Array<{
        id: string;
        type: string;
        category: {
            name: string;
            isGlobal: boolean;
        };
        status: string;
        endDate?: string | null;
        balance?: number | null;
    }>;
}

interface CheckInContainerProps {
    services: Array<{
        id: string;
        name: string;
        price: number;
        category: string | null;
        duration: number;
    }>;
    employees: Array<{
        id: string;
        fullName: string;
    }>;
    clients: Array<{
        id: string;
        fullName: string;
        phone: string | null;
    }>;
    stats: [number, number];
}

export function CheckInContainer({ services, employees, clients }: CheckInContainerProps) {
    const searchParams = useSearchParams();

    const [mode, setMode] = useState<'SCANNING' | 'RESULT' | 'MANUAL'>('SCANNING');
    const [selectedClient, setSelectedClient] = useState<ClientWithMemberships | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Locker is lifted here so it persists when switching between QR and Manual modes
    const [lockerNumber, setLockerNumber] = useState<string>(searchParams.get("lockerNumber") ?? "");

    const handleScanSuccess = useCallback(async (qrCode: string) => {
        if (isLoading) return;
        setIsLoading(true);
        
        try {
            const res = await fetch(`/api/clients/search?query=${encodeURIComponent(qrCode)}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Client not found");
            }
            const client = await res.json();
            setSelectedClient(client);
            setMode('RESULT');
            toast.success("Membership Verified!");
        } catch (err: unknown) {
            const error = err as Error;
            console.error("Scan identification error:", error);
            toast.error(error.message || "Could not find client by this QR code.");
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const handleCompleteCheckIn = useCallback(async (serviceId: string, locker?: string) => {
        setIsLoading(true);
        const effectiveLocker = locker ?? lockerNumber ?? null;

        try {
            const res = await fetch("/api/operations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientId: selectedClient?.id,
                    serviceId: serviceId,
                    paymentMode: "MEMBERSHIP",
                    status: "CREATED",
                    lockerNumber: effectiveLocker,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to complete check-in");
            }

            toast.success(`Check-in complete${effectiveLocker ? ` · Locker ${effectiveLocker}` : ""}!`);
            setMode('SCANNING');
            setSelectedClient(null);
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || "An error occurred during check-in");
        } finally {
            setIsLoading(false);
        }
    }, [selectedClient, lockerNumber]);

    // --- USB Scanner Listener Logic ---
    useEffect(() => {
        let buffer = "";
        let lastKeyTime = 0;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Only intercept if we are in SCANNING mode
            if (mode !== 'SCANNING') return;

            // If the focus is in an input field, we might be typing manually
            const target = e.target as HTMLElement;
            
            const currentTime = Date.now();
            const diff = currentTime - lastKeyTime;

            // HID scanners typically emit events 5-20ms apart.
            if (diff > 50) {
                buffer = "";
            }

            lastKeyTime = currentTime;

            if (e.key === "Enter") {
                if (buffer.length >= 8) { // Our QR codes like 'spa-client:id' are long
                    e.preventDefault();
                    handleScanSuccess(buffer);
                    buffer = "";
                }
            } else if (e.key.length === 1) {
                buffer += e.key;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [mode, handleScanSuccess]);
    // ----------------------------------

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left/Main Column - Step 1: Verification */}
                <div className="lg:col-span-7 flex flex-col gap-8 order-1 h-full">
                    {mode === 'SCANNING' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="glass-card p-0 overflow-hidden rounded-[2.5rem] border-[var(--border-main)] shadow-sm">
                                <div className="p-5 border-b border-[var(--border-muted)] flex justify-between items-center bg-[var(--bg-surface-muted)]">
                                    <h3 className="font-bold text-[var(--text-main)] flex items-center gap-2 text-sm">
                                        <QrCode className="w-5 h-5 text-[var(--color-primary)]" />
                                        Guest <span className="text-[var(--color-primary)]">Verification</span>
                                    </h3>
                                    <button 
                                        onClick={() => setMode('MANUAL')}
                                        className="px-4 py-1.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-app)] text-[var(--text-muted)] border border-[var(--border-muted)] text-[9px] font-bold rounded-lg uppercase tracking-widest transition-all opacity-70 hover:opacity-100"
                                    >
                                        Manual Search
                                    </button>
                                </div>
                                <div className="p-6">
                                    <QRScanner onScanSuccess={handleScanSuccess} />
                                    <div className="mt-6 text-center p-4 bg-[var(--bg-surface-muted)] rounded-2xl border border-[var(--border-muted)]">
                                        <p className="text-[var(--text-muted)] text-[10px] font-medium opacity-60">
                                            Scan QR code to automatically verify membership.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {mode === 'RESULT' && selectedClient && (
                        <ClientCheckInResult 
                            client={selectedClient} 
                            onBack={() => setMode('SCANNING')}
                            onComplete={handleCompleteCheckIn}
                            services={services}
                            lockerNumber={lockerNumber}
                            onLockerChange={setLockerNumber}
                        />
                    )}

                    {mode === 'MANUAL' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <button 
                                    onClick={() => setMode('SCANNING')}
                                    className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors group"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Return to QR Reader
                                </button>
                            </div>
                            <CheckInForm 
                                clients={clients.map(c => ({ ...c, phoneNumber: c.phone }))} 
                                services={services.map(s => ({ ...s, category: s.category || "Uncategorized" }))} 
                                employees={employees}
                                lockerNumber={lockerNumber}
                                onLockerChange={setLockerNumber}
                            />
                        </div>
                    )}
                </div>

                {/* Right Column - Step 2: Service Details */}
                <div className="lg:col-span-5 order-2 flex flex-col gap-8 h-full">
                    {mode === 'SCANNING' ? (
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)]/20 to-transparent rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative">
                                <CheckInForm 
                                    clients={clients.map(c => ({ ...c, phoneNumber: c.phone }))} 
                                    services={services.map(s => ({ ...s, category: s.category || "Uncategorized" }))} 
                                    employees={employees}
                                    lockerNumber={lockerNumber}
                                    onLockerChange={setLockerNumber}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-10 border-[var(--border-main)] flex flex-col items-center text-center gap-6 bg-[var(--bg-surface-muted)] h-fit">
                            <div className="size-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                                <Keyboard className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-[var(--text-main)] text-base">Verification Active</h4>
                            <p className="text-[var(--text-muted)] text-[10px] leading-relaxed opacity-60">
                                Complete verification or reset for a new guest.
                            </p>
                            <button 
                                onClick={() => {
                                    setMode('SCANNING');
                                    setSelectedClient(null);
                                }}
                                className="bg-[var(--bg-surface)] border border-[var(--border-muted)] px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[var(--bg-app)] transition-colors"
                            >
                                New Check-In
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
