"use client";

import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

interface UserMenuProps {
    user: {
        fullName: string;
        role: string;
    };
}

export default function UserMenu({ user }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const roleLabel = user.role === "MANAGER" ? "Branch Manager" :
        user.role === "ADMIN" ? "Administrator" : "Staff";

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-4 border-l border-[var(--color-border-light)] pl-6 ml-4 group"
            >
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-bold font-serif leading-tight group-hover:text-[var(--color-primary)] transition-colors text-[var(--text-main)]">
                        {user.fullName}
                    </span>
                    <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] leading-none mt-1 opacity-60">
                        {roleLabel}
                    </span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-forest-400)] flex items-center justify-center text-white font-black shadow-lg shadow-[var(--color-primary)]/20 group-hover:ring-4 group-hover:ring-[var(--color-primary)]/10 transition-all">
                    {user.fullName.charAt(0)}
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-card border border-[var(--border-muted)] py-2 z-50 animate-fade-in shadow-xl">
                    <div className="px-4 py-3 border-b border-[var(--border-muted)] md:hidden">
                        <p className="text-sm font-bold font-serif text-[var(--text-main)] italic">{user.fullName}</p>
                        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest opacity-60">{roleLabel}</p>
                    </div>

                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-forest-700)] dark:text-[var(--color-forest-100)] hover:bg-[var(--color-forest-50)] dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-lg">person</span>
                        My Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-forest-700)] dark:text-[var(--color-forest-100)] hover:bg-[var(--color-forest-50)] dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-lg">notifications</span>
                        Notification Settings
                    </button>

                    <div className="h-[1px] bg-[var(--color-border-light)] dark:bg-[var(--color-border-dark)] my-1"></div>

                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}
