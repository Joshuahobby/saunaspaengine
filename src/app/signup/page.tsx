export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { SignupForm } from "./signup-form";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Account — Sauna SPA Engine",
    description: "Register your spa or sauna business and start managing operations in minutes.",
};

export default async function SignupPage() {
    const session = await auth();
    if (session) redirect("/dashboard");

    return (
        <div className="min-h-screen flex">
            {/* Left Brand Panel */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col relative overflow-hidden"
                style={{ background: "linear-gradient(160deg, #1a3a1a 0%, #0f2410 50%, #0a1a0a 100%)" }}>

                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, #4a8c43 0%, transparent 70%)" }} />

                <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
                    <Link href="/" className="flex items-center gap-3 group w-fit">
                        <div className="size-10 rounded-xl flex items-center justify-center border border-white/20 bg-white/10 backdrop-blur-sm group-hover:bg-white/15 transition-colors">
                            <span className="material-symbols-outlined text-white text-xl">spa</span>
                        </div>
                        <div>
                            <p className="text-white font-black text-sm tracking-tight leading-none">Sauna SPA</p>
                            <p className="text-green-400/80 text-[10px] font-bold tracking-widest uppercase">Engine</p>
                        </div>
                    </Link>

                    <div className="flex-1 flex flex-col justify-center mt-16">
                        <h1 className="text-white text-3xl xl:text-4xl font-black leading-tight tracking-tight">
                            Start managing<br />
                            <span className="text-green-400">smarter today.</span>
                        </h1>
                        <p className="text-white/50 text-sm font-medium mt-4 leading-relaxed max-w-xs">
                            Join 500+ spas and wellness centers already running their operations on Sauna SPA Engine.
                        </p>

                        {/* Feature list */}
                        <ul className="mt-10 space-y-4">
                            {[
                                { icon: "qr_code_scanner", text: "QR-powered check-ins in seconds" },
                                { icon: "analytics", text: "Real-time revenue & occupancy analytics" },
                                { icon: "people", text: "Staff scheduling & role management" },
                                { icon: "payments", text: "Mobile Money & card payments built-in" },
                                { icon: "corporate_fare", text: "Multi-branch management from one dashboard" },
                            ].map(f => (
                                <li key={f.icon} className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-green-500/15 border border-green-500/20 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-green-400 text-base">{f.icon}</span>
                                    </div>
                                    <span className="text-white/70 text-sm font-medium">{f.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="text-white/20 text-[10px] font-medium">© 2026 Sauna SPA Engine. All rights reserved.</p>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex-1 flex flex-col bg-white">
                <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg flex items-center justify-center bg-[#1a3a1a]">
                            <span className="material-symbols-outlined text-white text-sm">spa</span>
                        </div>
                        <span className="text-gray-900 font-black text-sm tracking-tight">Sauna SPA Engine</span>
                    </Link>
                    <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                        Sign In
                    </Link>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-10 overflow-y-auto">
                    <div className="w-full max-w-[400px]">
                        <Suspense fallback={
                            <div className="flex items-center justify-center py-20">
                                <span className="material-symbols-outlined animate-spin text-gray-300 text-3xl">progress_activity</span>
                            </div>
                        }>
                            <SignupForm />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
