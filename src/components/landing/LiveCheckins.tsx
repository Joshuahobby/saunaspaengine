"use client";

import { useState, useEffect } from "react";

export function LiveCheckins() {
    const [count, setCount] = useState(124);
    const [isPulsing, setIsPulsing] = useState(false);

    useEffect(() => {
        // Randomly "check in" a user every 5 to 15 seconds
        const interval = setInterval(() => {
            setCount((prev) => prev + 1);
            setIsPulsing(true);
            
            // Remove the pulse effect after 1s
            setTimeout(() => setIsPulsing(false), 1000);
        }, Math.random() * 10000 + 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute -bottom-6 -left-6 glass-card p-6 flex items-center gap-4 animate-fade-in shadow-xl">
            <div className={`size-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
                isPulsing 
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] scale-110 shadow-lg shadow-[var(--color-primary)]/50" 
                    : "bg-[var(--color-primary-muted)] text-[var(--color-primary)] border-[var(--color-primary-border)] scale-100"
            }`}>
                <span className="material-symbols-outlined text-3xl">qr_code_2</span>
            </div>
            <div>
                <p className="text-sm font-bold text-[var(--text-main)]">Live Check-ins</p>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
                    </span>
                    <p className="text-xs text-[var(--text-muted)] font-medium"><span className="font-bold text-[var(--color-primary)]">{count}</span> users today</p>
                </div>
            </div>
        </div>
    );
}
