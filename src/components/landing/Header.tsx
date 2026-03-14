"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header() {
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
        <header
            className={`flex items-center justify-between whitespace-nowrap border-b border-solid border-[var(--border-main)] px-6 md:px-10 transition-all duration-300 sticky top-0 z-50 ${isScrolled
                ? "py-3 bg-[var(--bg-app)]/90 backdrop-blur-xl shadow-sm"
                : "py-5 bg-[var(--bg-app)]/50 backdrop-blur-md"
                }`}
        >
            <div className="flex items-center gap-4 text-[var(--text-main)] z-50">
                <div className="size-8 flex items-center justify-center bg-[var(--color-primary)] rounded-lg text-white">
                    <span className="material-symbols-outlined">spa</span>
                </div>
                <h2 className="text-[var(--text-main)] text-xl font-bold font-serif leading-tight tracking-tight">
                    Sauna SPA Engine
                </h2>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                <nav className="flex items-center gap-9">
                    <a className="text-[var(--text-muted)] text-xs font-black uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors" href="#features">Features</a>
                    <a className="text-[var(--text-muted)] text-xs font-black uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors" href="#pricing">Pricing</a>
                    <a className="text-[var(--text-muted)] text-xs font-black uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors" href="/help">Support</a>
                </nav>
                <div className="flex gap-4 items-center">
                    <ThemeToggle />
                    <Link
                        href="/login"
                        className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-6 bg-[var(--bg-surface-muted)] text-[var(--text-main)] text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[var(--border-muted)] border border-[var(--border-main)]"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/login"
                        className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-8 bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-90 shadow-xl shadow-[var(--color-primary)]/20"
                    >
                        Get Started
                    </Link>
                </div>
            </div>

            {/* Mobile Nav Controls */}
            <div className="flex md:hidden items-center gap-4 z-50">
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

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-[var(--bg-app)]/95 backdrop-blur-2xl z-40 transition-all duration-300 md:hidden flex flex-col pt-24 px-6 gap-8 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                <nav className="flex flex-col gap-6 text-center">
                    <a onClick={closeMenu} className="text-[var(--text-main)] text-xl font-bold font-serif hover:text-[var(--color-primary)] transition-colors" href="#features">Features</a>
                    <a onClick={closeMenu} className="text-[var(--text-main)] text-xl font-bold font-serif hover:text-[var(--color-primary)] transition-colors" href="#pricing">Pricing</a>
                    <a onClick={closeMenu} className="text-[var(--text-main)] text-xl font-bold font-serif hover:text-[var(--color-primary)] transition-colors" href="/help">Support</a>
                </nav>

                <div className="flex flex-col gap-4 mt-8 w-full">
                    <Link
                        onClick={closeMenu}
                        href="/login"
                        className="flex w-full cursor-pointer items-center justify-center rounded-xl h-14 bg-[var(--bg-surface-muted)] text-[var(--text-main)] text-sm font-black uppercase tracking-widest border border-[var(--border-main)]"
                    >
                        Sign In
                    </Link>
                    <Link
                        onClick={closeMenu}
                        href="/login"
                        className="flex w-full cursor-pointer items-center justify-center rounded-xl h-14 bg-[var(--color-primary)] text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-[var(--color-primary)]/20"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}
