"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Loader2, RefreshCw, XCircle } from "lucide-react";

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onClose?: () => void;
}

export function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
    const [isScannerStarted, setIsScannerStarted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isTransitioning = useRef(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const containerId = "qr-reader";

    useEffect(() => {
        // Initialize HTML5 QR Code instance
        scannerRef.current = new Html5Qrcode(containerId);

        const startScanner = async () => {
            if (isTransitioning.current) return;
            isTransitioning.current = true;

            try {
                const cameras = await Html5Qrcode.getCameras();
                if (cameras && cameras.length > 0) {
                    const config = {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
                    };

                    // Check if already scanning to avoid transition errors
                    if (!scannerRef.current?.isScanning) {
                        await scannerRef.current?.start(
                            { facingMode: "environment" },
                            config,
                            (decodedText) => {
                                setIsSuccess(true);
                                setTimeout(() => setIsSuccess(false), 500);
                                onScanSuccess(decodedText);
                            },
                            () => {} // Silent error for frames
                        );
                        setIsScannerStarted(true);
                    }
                } else {
                    setError("No cameras found on this device.");
                }
            } catch (err) {
                const error = err as Error;
                // If it's already under transition, we just ignore it for this tick
                if (!error.message?.includes("already under transition")) {
                    console.error("Scanner Error:", error);
                    setError(error.message || "Failed to start camera.");
                }
            } finally {
                isTransitioning.current = false;
            }
        };

        startScanner();

        return () => {
            const stopScanner = async () => {
                if (scannerRef.current && scannerRef.current.isScanning && !isTransitioning.current) {
                    isTransitioning.current = true;
                    try {
                        await scannerRef.current.stop();
                    } catch (e) {
                        console.error("Failed to stop scanner", e);
                    } finally {
                        isTransitioning.current = false;
                    }
                }
            };
            stopScanner();
        };
    }, [onScanSuccess]);

    return (
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-[var(--border-main)] bg-black aspect-video group">
            <div id={containerId} className="w-full h-full object-cover brightness-[0.85] group-hover:brightness-110 transition-all duration-700"></div>
            
            {/* Design Overlays inspired by the HTML Screen */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[250px] h-[250px] scanner-overlay rounded-2xl relative">
                    <div className="scan-line"></div>
                    
                    {/* Corners */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-[var(--color-primary)] rounded-tl-lg"></div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-[var(--color-primary)] rounded-tr-lg"></div>
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-[var(--color-primary)] rounded-bl-lg"></div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-[var(--color-primary)] rounded-br-lg"></div>
                </div>
            </div>

            {/* Success Flash Overlay */}
            {isSuccess && (
                <div className="absolute inset-0 bg-[var(--color-primary)] opacity-30 animate-pulse z-50"></div>
            )}

            {/* Status Badges */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-[var(--color-primary)]/30 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
                </span>
                <span className="text-[var(--color-primary)] font-bold tracking-widest text-[10px] uppercase">
                    {isScannerStarted ? "Active Scanner" : "Initializing..."}
                </span>
            </div>

            {/* Error State */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-8 text-center backdrop-blur-sm">
                    <XCircle className="w-12 h-12 text-rose-500 mb-4" />
                    <p className="text-white font-medium mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg font-bold"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                    </button>
                </div>
            )}

            {!isScannerStarted && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin mb-3" />
                    <p className="text-white font-medium tracking-wide">Starting Camera...</p>
                </div>
            )}

            {/* Controls */}
            {onClose && (
                    <button 
                        onClick={onClose}
                        title="Close Scanner"
                        className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-lg transition-all"
                    >
                    <XCircle className="w-6 h-6" />
                </button>
            )}
        </div>
    );
}
