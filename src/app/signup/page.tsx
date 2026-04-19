export const dynamic = "force-dynamic";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SignupForm } from "./signup-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Your Business Account — Sauna SPA Engine",
    description: "Register your spa or sauna business and start managing operations in minutes.",
};

// Default plans — seeded into DB on first load if missing
const DEFAULT_PLANS = [
    {
        name: "Essential",
        priceMonthly: 50000,
        priceYearly: 500000,
        branchLimit: 1,
        features: ["Up to 500 Check-ins/mo", "QR Code Scanner", "Mobile Money Payments", "Standard Support"],
        description: "Core operations for single-location boutique spas.",
        isCustom: false,
    },
    {
        name: "Premium",
        priceMonthly: 150000,
        priceYearly: 1500000,
        branchLimit: 3,
        features: ["Unlimited Check-ins", "Advanced Analytics", "Up to 3 Branches", "Staff Scheduling", "Priority WhatsApp Support"],
        description: "Advanced features for growing wellness centers.",
        isCustom: false,
    },
    {
        name: "Elite",
        priceMonthly: 350000,
        priceYearly: 3500000,
        branchLimit: 50,
        features: ["White-labeled Platform", "Custom API Integration", "Dedicated Manager", "On-site Staff Training", "Unlimited Branches"],
        description: "Unlimited potential for large luxury resorts & chains.",
        isCustom: true,
    },
];

export default async function SignupPage() {
    const session = await auth();
    if (session) redirect("/dashboard");

    let dbPlans = await prisma.platformPackage.findMany({
        where: { isCustom: false },
        orderBy: { priceMonthly: "asc" },
    });

    // If no plans exist yet, seed them so registration can proceed
    if (dbPlans.length === 0) {
        for (const plan of DEFAULT_PLANS) {
            await prisma.platformPackage.upsert({
                where: { name: plan.name },
                update: {},
                create: plan,
            });
        }
        dbPlans = await prisma.platformPackage.findMany({
            where: { isCustom: false },
            orderBy: { priceMonthly: "asc" },
        });
    }

    const elitePlan = await prisma.platformPackage.findFirst({
        where: { isCustom: true },
        orderBy: { priceMonthly: "asc" },
    });

    const plans = [...dbPlans, ...(elitePlan ? [elitePlan] : [])];

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
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/help"
                            className="text-[var(--text-muted)] text-xs font-black uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors"
                        >
                            Help Center
                        </Link>
                    </div>
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
                <div className="w-full max-w-[1240px] flex flex-col gap-6">
                    <SignupForm plans={plans} />

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
