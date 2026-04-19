"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { usePathname } from "next/navigation";

export function Header({ isLoggedIn }: { isLoggedIn?: boolean }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -70% 0px",
            threshold: 0,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = ["features", "how-it-works", "pricing"];
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, []);

    const closeMenu = () => setMobileMenuOpen(false);

    const navItems = [
        { name: "Features", href: "/#features", id: "features" },
        { name: "How It Works", href: "/#how-it-works", id: "how-it-works" },
        { name: "Pricing", href: "/#pricing", id: "pricing" },
        { name: "Support", href: "/support", id: "support" },
        { name: "Contact", href: "/contact", id: "contact" },
    ];

    return (
        <>
            <header
                className={`flex items-center justify-between whitespace-nowrap border-b border-solid border-[var(--border-main)] px-6 md:px-10 transition-all duration-500 sticky top-0 z-50 ${isScrolled
                    ? "py-3 bg-[var(--bg-app)]/80 backdrop-blur-xl shadow-lg shadow-black/5"
                    : "py-6 bg-transparent"
                    }`}
            >
                {/* Logo */}
                <div className="flex flex-1 items-center gap-4 text-[var(--text-main)] z-50">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="size-9 flex items-center justify-center bg-[var(--color-primary)] rounded-xl text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-[var(--color-primary)]/20">
                            <span className="material-symbols-outlined !text-xl">spa</span>
                        </div>
                        <h2 className="hidden sm:block text-[var(--text-main)] text-xl font-black font-serif leading-none tracking-tight group-hover:text-[var(--color-primary)] transition-colors">
                            Sauna SPA <span className="text-[var(--color-primary)] italic">Engine</span>
                        </h2>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-2 justify-center bg-[var(--bg-surface-muted)]/50 p-1.5 rounded-2xl border border-[var(--border-main)]/50 backdrop-blur-md">
                    {navItems.map((item) => {
                        const isActive = (pathname === "/" && activeSection === item.id) || (pathname === item.href);
                        return (
                            <Link 
                                key={item.name} 
                                href={item.href} 
                                className={`relative px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-xl hover:text-[var(--color-primary)] ${
                                    isActive 
                                    ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20" 
                                    : "text-[var(--text-muted)] hover:bg-[var(--bg-app)]"
                                }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop Controls */}
                <div className="hidden lg:flex flex-1 justify-end gap-4 items-center">
                    <ThemeToggle />
                    {isLoggedIn ? (
                        <Link
                            href="/dashboard"
                            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 px-8 bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[var(--color-primary)]/20"
                        >
                            <span className="material-symbols-outlined text-[18px] mr-2">dashboard</span>
                            Dashboard
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="flex cursor-pointer items-center justify-center rounded-xl h-11 px-6 text-[var(--text-main)] text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[var(--bg-surface-muted)] border border-transparent hover:border-[var(--border-muted)]"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 px-8 bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[var(--color-primary)]/20"
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
                        className={`size-11 rounded-xl flex items-center justify-center transition-all ${mobileMenuOpen ? "bg-[var(--color-primary)] text-white" : "bg-[var(--bg-surface-muted)] text-[var(--text-main)]"}`}
                        aria-label="Toggle mobile menu"
                    >
                        <span className="material-symbols-outlined !text-2xl">
                            {mobileMenuOpen ? "close" : "menu"}
                        </span>
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-[var(--bg-app)]/95 backdrop-blur-2xl z-40 transition-all duration-500 lg:hidden flex flex-col pt-32 px-6 gap-10 ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"
                    }`}
            >
                <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            onClick={closeMenu}
                            href={item.href}
                            className="flex items-center justify-between p-5 rounded-2xl bg-[var(--bg-surface-muted)]/50 border border-[var(--border-main)]/50 text-[var(--text-main)] text-sm font-black uppercase tracking-widest transition-all hover:bg-[var(--color-primary)] hover:text-white"
                        >
                            {item.name}
                            <span className="material-symbols-outlined opacity-50">arrow_forward_ios</span>
                        </Link>
                    ))}
                </nav>

                <div className="flex flex-col gap-4 mt-auto mb-12">
                    {isLoggedIn ? (
                        <Link
                            onClick={closeMenu}
                            href="/dashboard"
                            className="flex w-full cursor-pointer items-center justify-center rounded-2xl h-16 bg-[var(--color-primary)] text-white text-sm font-black uppercase tracking-widest shadow-2xl shadow-[var(--color-primary)]/20 transition-all active:scale-[0.98]"
                        >
                            <span className="material-symbols-outlined mr-2">dashboard</span>
                            Go to Dashboard
                        </Link>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <Link
                                onClick={closeMenu}
                                href="/login"
                                className="flex cursor-pointer items-center justify-center rounded-2xl h-16 bg-[var(--bg-surface-muted)] border border-[var(--border-main)] text-[var(--text-main)] text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
                            >
                                Log In
                            </Link>
                            <Link
                                onClick={closeMenu}
                                href="/signup"
                                className="flex cursor-pointer items-center justify-center rounded-2xl h-16 bg-[var(--color-primary)] text-white text-xs font-black uppercase tracking-widest border border-[var(--color-primary)] shadow-2xl shadow-[var(--color-primary)]/20 transition-all active:scale-[0.98]"
                            >
                                Register Spa
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
