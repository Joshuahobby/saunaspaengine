export const dynamic = "force-dynamic";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Metadata } from "next";
import { PaymentForm } from "./PaymentForm";

export const metadata: Metadata = {
    title: "Complete Payment — Sauna SPA Engine",
    description: "Pay via Mobile Money to activate your Sauna SPA Engine account.",
};

interface PageProps {
    searchParams: Promise<{
        plan?: string;
        cycle?: string;
        amount?: string;
        email?: string;
    }>;
}

export default async function PaymentInstructionsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const plan = params.plan || "Essential";
    const cycle = params.cycle || "Monthly";
    const amount = Number(params.amount) || 50000;
    const email = params.email || "";

    return (
        <div className="layout-container flex h-full grow flex-col bg-[var(--bg-app)]">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[var(--border-main)] px-6 md:px-10 py-5 bg-[var(--bg-app)]/80 backdrop-blur-xl sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="size-10 text-white flex items-center justify-center bg-[var(--color-primary)] rounded-xl shadow-sm group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-2xl font-black">spa</span>
                    </div>
                    <div>
                        <h2 className="text-[var(--text-main)] text-lg font-black font-serif leading-tight tracking-tight italic group-hover:text-[var(--color-primary)] transition-colors">
                            Sauna <span className="not-italic text-[var(--color-primary)]">SPA</span> Engine
                        </h2>
                    </div>
                </Link>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link
                        href="/login"
                        className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-6 bg-[var(--bg-surface-muted)] text-[var(--text-main)] text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[var(--border-muted)] border border-[var(--border-main)]"
                    >
                        Sign In
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-[600px] flex flex-col gap-6">

                    {/* Success header */}
                    <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 rounded-[2.5rem] p-8 text-center space-y-3">
                        <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 mx-auto">
                            <span className="material-symbols-outlined text-3xl text-[var(--color-primary)]">check_circle</span>
                        </div>
                        <h1 className="text-[var(--text-main)] text-2xl font-black font-serif">
                            Account Created!
                        </h1>
                        <p className="text-[var(--text-muted)] text-sm font-medium">
                            One final step — pay your subscription via Mobile Money to activate your account instantly.
                        </p>
                    </div>

                    {/* PawaPay payment form */}
                    <PaymentForm
                        email={email}
                        amount={amount}
                        plan={plan}
                        cycle={cycle}
                    />

                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[var(--text-muted)] text-xs font-medium opacity-60">
                        <Link href="/privacy" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</Link>
                        <span className="hidden md:inline text-[var(--border-muted)]">•</span>
                        <p>© 2026 Sauna SPA Engine</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
