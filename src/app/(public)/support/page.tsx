import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SupportContent } from "@/components/support/SupportContent";

export default function SupportPage() {
    return (
        <PublicLayout>
            <main className="flex-1 flex flex-col items-center">
                {/* Hero Search */}
                <div className="w-full bg-[var(--bg-card)] border-b border-[var(--border-muted)] py-12 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl font-extrabold leading-tight mb-6">How can we help?</h1>
                        <div className="relative max-w-2xl mx-auto">
                            <div className="flex w-full items-stretch rounded-xl h-14 shadow-sm ring-1 ring-[var(--border-muted)] bg-[var(--bg-app)]">
                                <div className="text-[var(--text-muted)] flex items-center justify-center pl-5">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-0 focus:ring-0 px-4 text-lg font-normal placeholder:text-[var(--text-muted)]" placeholder="Search for articles, guides, and FAQs..." />
                            </div>
                            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
                                <span className="text-[var(--text-muted)]">Popular:</span>
                                <span className="text-[var(--color-primary)] hover:underline cursor-pointer">Reset QR Code</span>
                                <span className="text-[var(--color-primary)] hover:underline cursor-pointer">Billing</span>
                                <span className="text-[var(--color-primary)] hover:underline cursor-pointer">Staff Permissions</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content (Client Island) */}
                <SupportContent />
            </main>
        </PublicLayout>
    );
}
