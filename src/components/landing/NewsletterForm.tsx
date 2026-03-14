"use client";

import { useState } from "react";

export function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) return;

        setStatus("loading");
        
        // Simulate an API call
        setTimeout(() => {
            setStatus("success");
            setEmail("");
            
            // Reset after 5 seconds
            setTimeout(() => {
                setStatus("idle");
            }, 5000);
        }, 1200);
    };

    return (
        <div className="md:w-1/2 w-full">
            {status === "success" ? (
                <div className="bg-[var(--color-primary-muted)] border border-[var(--color-primary)]/30 rounded-xl p-6 flex flex-col items-center justify-center gap-3 animate-fade-in">
                    <div className="size-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-teal-900)]">
                        <span className="material-symbols-outlined text-2xl">check</span>
                    </div>
                    <p className="text-white font-bold text-center">Thank you for subscribing!</p>
                    <p className="text-white/70 text-sm text-center">You&apos;ll receive our next insights newsletter soon.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 rounded-xl h-14 px-6 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] border transition-all outline-none"
                            placeholder="Your work email"
                            type="email"
                            required
                            disabled={status === "loading"}
                        />
                        <button 
                            disabled={status === "loading"}
                            className="bg-[var(--color-primary)] text-[var(--bg-app)] h-14 px-8 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center min-w-[140px]" 
                            type="submit"
                        >
                            {status === "loading" ? (
                                <span className="material-symbols-outlined animate-spin">refresh</span>
                            ) : (
                                "Subscribe"
                            )}
                        </button>
                    </div>
                    <p className="text-white/50 text-xs sm:ml-2">We respect your privacy. Unsubscribe at any time.</p>
                </form>
            )}
        </div>
    );
}
