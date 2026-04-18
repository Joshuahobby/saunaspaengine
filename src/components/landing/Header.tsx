"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header({ isLoggedIn }: { isLoggedIn?: boolean }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change or click outside would go here ideally
    // For now we'll close it when a link is clicked
    const closeMenu = () => setMobileMenuOpen(false);

    return (
        <>
            {/* eslint-disable-next-line react/forbid-dom-props */}
            <header
                className={`flex items-center justify-between whitespace-nowrap border-b border-solid border-[var(--border-main)] px-6 md:px-10 transition-all duration-300 sticky top-0 z-50 ${isScrolled
                    ? "py-3 bg-app-90 backdrop-blur-xl shadow-sm"
                    : "py-5 bg-app-50 backdrop-blur-md"
                    }`}
            >
                {/* Logo */}
                <div className="flex flex-1 items-center gap-4 text-[var(--text-main)] z-50">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="size-8 flex items-center justify-center bg-[var(--color-primary)] rounded-lg text-white group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined">spa</span>
                        </div>
                        <h2 className="hidden sm:block text-[var(--text-main)] text-xl font-bold font-serif leading-tight tracking-tight group-hover:text-[var(--color-primary)] transition-colors max-w-[200px] truncate">
                            Sauna SPA Engine
                        </h2>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-9 justify-center">
                    {[
                        { name: "Features", href: "/#features" },
                        { name: "Pricing", href: "/#pricing" },
                        { name: "Case Studies", href: "/case-studies" },
                        { name: "Support", href: "/support" },
                        { name: "Contact", href: "/contact" },
                    ].map((item) => (
                        <Link 
                            key={item.name} 
                            href={item.href} 
                            className="relative text-[var(--text-muted)] text-[11px] font-black uppercase tracking-[0.2em] hover:text-[var(--color-primary)] transition-colors group py-1"
                        >
                            {item.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Desktop Controls */}
                <div className="hidden lg:flex flex-1 justify-end gap-3 items-center">
                    <ThemeToggle />
                    {isLoggedIn ? (
                        <Link
                            href="/dashboard"
                            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-6 sm:px-8 bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-90 shadow-xl shadow-[var(--color-primary)]/20"
                        >
                            <span className="material-symbols-outlined text-[16px] mr-2">dashboard</span>
                            Dashboard
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="flex cursor-pointer items-center justify-center rounded-xl h-10 px-4 text-[var(--text-main)] text-[10px] font-black uppercase tracking-widest transition-all hover:text-[var(--color-primary)]"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-6 sm:px-8 bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-90 shadow-xl shadow-[var(--color-primary)]/20"
                            >
                                Register Spa
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Nav Controls */}
                <div className="flex lg:hidden flex-1 justify-end items-center gap-4 z-50">
                    <ThemeToggle />
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-[var(--text-main)]"
                        aria-label="Toggle mobile menu"
                    >
                        <span className="material-symbols-outlined text-3xl">
                            {mobileMenuOpen ? "close" : "menu"}
                        </span>
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {/* eslint-disable-next-line react/forbid-dom-props */}
            <div
                className={`fixed inset-0 bg-app-95 backdrop-blur-2xl z-40 transition-all duration-300 lg:hidden flex flex-col pt-36 px-6 gap-10 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                <nav className="flex flex-col gap-6 text-center">
                    <a onClick={closeMenu} className="text-[var(--text-main)] text-xl font-bold font-serif hover:text-[var(--color-primary)] transition-colors" href="#features">Features</a>
                    <a onClick={closeMenu} className="text-[var(--text-main)] text-xl font-bold font-serif hover:text-[var(--color-primary)] transition-colors" href="#pricing">Pricing</a>
                    <a onClick={closeMenu} className="text-[var(--text-main)] text-xl font-bold font-serif hover:text-[var(--color-primary)] transition-colors" href="/case-studies">Case Studies</a>
                    <a onClick={closeMenu} className="text-[var(--text-main)] text-xl font-bold font-serif hover:text-[var(--color-primary)] transition-colors" href="/help">Support</a>
                    <a onClick={closeMenu} className="text-[var(--text-main)] text-xl font-bold font-serif hover:text-[var(--color-primary)] transition-colors" href="/contact">Contact</a>
                </nav>

                <div className="flex flex-col gap-4 mt-8 w-full">
                    {isLoggedIn ? (
                        <Link
                            onClick={closeMenu}
                            href="/dashboard"
                            className="flex w-full cursor-pointer items-center justify-center rounded-xl h-14 bg-[var(--color-primary)] text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-[var(--color-primary)]/20"
                        >
                            <span className="material-symbols-outlined mr-2">dashboard</span>
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                onClick={closeMenu}
                                href="/login"
                                className="flex w-full cursor-pointer items-center justify-center rounded-xl h-14 bg-[var(--bg-surface)] border border-[var(--border-main)] text-[var(--text-main)] text-sm font-black uppercase tracking-widest shadow-sm"
                            >
                                Log In
                            </Link>
                            <Link
                                onClick={closeMenu}
                                href="/signup"
                                className="flex w-full cursor-pointer items-center justify-center rounded-xl h-14 bg-[var(--color-primary)] text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-[var(--color-primary)]/20"
                            >
                                Register Spa
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
