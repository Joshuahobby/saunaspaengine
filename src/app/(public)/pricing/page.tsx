import React from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PricingContent } from "@/components/pricing/PricingContent";

const FAQS = [
    { q: "Can I upgrade or downgrade my plan?", a: "Yes, you can change your plan at any time. If you upgrade, the new pricing is prorated. If you downgrade, your new rate starts at the next billing cycle." },
    { q: "What happens after my 14-day free trial?", a: "At the end of your trial, you'll be prompted to select a plan and provide payment details. Your data will be preserved so you can pick up where you left off." },
    { q: "What payment methods do you accept?", a: "We accept MTN MoMo, Airtel Money, bank transfers, and cash payments for annual plans." },
];

export default function PricingPage() {
    return (
        <PublicLayout>
            <main className="flex flex-1 flex-col items-center py-12 px-4 md:px-20 lg:px-40">
                {/* Header Section */}
                <div className="max-w-[960px] w-full text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">Choose the plan that&apos;s right for your sauna or spa branch operations. All prices in RWF.</p>
                </div>

                {/* Main Content (Client Island) */}
                <PricingContent />

                {/* FAQ */}
                <div className="w-full max-w-[800px] mb-20">
                    <h2 className="text-2xl font-black mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {FAQS.map((faq) => (
                            <div key={faq.q} className="p-6 rounded-lg bg-[var(--bg-card)] border border-[var(--border-muted)]">
                                <h4 className="font-bold mb-2">{faq.q}</h4>
                                <p className="text-sm text-[var(--text-muted)]">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="w-full max-w-[960px] bg-[var(--color-primary)] rounded-2xl p-10 md:p-16 text-center text-[var(--bg-app)] overflow-hidden relative">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to fuel your spa engine?</h2>
                        <p className="text-lg mb-8 opacity-80 font-medium">Join wellness branches across Rwanda optimizing their operations daily.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/login" className="bg-[var(--bg-app)] text-[var(--text-main)] px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all">Get Started Now</Link>
                            <Link href="/demo" className="bg-white/30 backdrop-blur-md px-8 py-4 rounded-xl font-bold border border-[var(--bg-app)]/10 hover:bg-white/50 transition-all">Schedule a Demo</Link>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--bg-app)]/5 rounded-full -ml-20 -mb-20 blur-3xl"></div>
                </div>
            </main>
        </PublicLayout>
    );
}
