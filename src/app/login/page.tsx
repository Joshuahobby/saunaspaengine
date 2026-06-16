export const dynamic = "force-dynamic";

import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In — Sauna SPA Engine",
    description: "Sign in to your Sauna SPA Engine account and manage your spa operations.",
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left Brand Panel */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col relative overflow-hidden"
                style={{ background: "linear-gradient(160deg, #1a3a1a 0%, #0f2410 50%, #0a1a0a 100%)" }}>
                
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
                
                {/* Glow orb */}
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, #4a8c43 0%, transparent 70%)" }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #2d5a27 0%, transparent 70%)" }} />

                <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group w-fit">
                        <div className="size-10 rounded-xl flex items-center justify-center border border-white/20 bg-white/10 backdrop-blur-sm group-hover:bg-white/15 transition-colors">
                            <span className="material-symbols-outlined text-white text-xl">spa</span>
                        </div>
                        <div>
                            <p className="text-white font-black text-sm tracking-tight leading-none">Sauna SPA</p>
                            <p className="text-green-400/80 text-[10px] font-bold tracking-widest uppercase">Engine</p>
                        </div>
                    </Link>

                    {/* Main copy */}
                    <div className="flex-1 flex flex-col justify-center mt-16">
                        <h1 className="text-white text-3xl xl:text-4xl font-black leading-tight tracking-tight">
                            Run your spa<br />
                            <span className="text-green-400">like a business.</span>
                        </h1>
                        <p className="text-white/50 text-sm font-medium mt-4 leading-relaxed max-w-xs">
                            Everything you need to manage check-ins, staff, branches and revenue — all in one place.
                        </p>

                        {/* Stats */}
                        <div className="mt-10 grid grid-cols-2 gap-4">
                            {[
                                { num: "500+", label: "Active Spas" },
                                { num: "98%", label: "Uptime SLA" },
                                { num: "120K+", label: "Check-ins/month" },
                                { num: "24/7", label: "Support" },
                            ].map(s => (
                                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                                    <p className="text-green-400 text-xl font-black">{s.num}</p>
                                    <p className="text-white/50 text-[11px] font-bold mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Testimonial */}
                        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-5">
                            <p className="text-white/70 text-sm leading-relaxed font-medium italic">
                                &ldquo;Sauna SPA Engine completely transformed how we manage our 3 branches. Everything is instant.&rdquo;
                            </p>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="size-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <span className="text-green-400 text-xs font-black">AM</span>
                                </div>
                                <div>
                                    <p className="text-white text-xs font-bold">Amani Mutesi</p>
                                    <p className="text-white/40 text-[10px] font-medium">Owner, Nordic Calm Wellness</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <p className="text-white/20 text-[10px] font-medium">© 2026 Sauna SPA Engine. All rights reserved.</p>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg flex items-center justify-center bg-[#1a3a1a]">
                            <span className="material-symbols-outlined text-white text-sm">spa</span>
                        </div>
                        <span className="text-gray-900 font-black text-sm tracking-tight">Sauna SPA Engine</span>
                    </Link>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-10">
                    <div className="w-full max-w-[400px]">
                        <Suspense fallback={
                            <div className="flex items-center justify-center py-20">
                                <span className="material-symbols-outlined animate-spin text-gray-300 text-3xl">progress_activity</span>
                            </div>
                        }>
                            <LoginForm />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
