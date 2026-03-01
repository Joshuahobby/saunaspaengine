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

    const roleLabel = user.role === "OWNER" ? "Business Owner" :
        user.role === "ADMIN" ? "Administrator" : "Staff";

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 border-l border-[rgba(17,212,196,0.2)] pl-4 md:pl-6 ml-2 md:ml-4 group"
            >
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-bold leading-tight group-hover:text-[#11d4c4] transition-colors">
                        {user.fullName}
                    </span>
                    <span className="text-xs text-[#11d4c4] font-semibold">
                        {roleLabel}
                    </span>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#11d4c4] to-emerald-300 flex items-center justify-center text-[#10221c] font-black shadow-sm group-hover:scale-105 transition-transform">
                    {user.fullName.charAt(0)}
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 md:hidden">
                        <p className="text-sm font-bold truncate">{user.fullName}</p>
                        <p className="text-xs text-[#11d4c4] font-semibold">{roleLabel}</p>
                    </div>

                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-lg">person</span>
                        My Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-lg">notifications</span>
                        Notification Settings
                    </button>

                    <div className="h-[1px] bg-slate-100 dark:border-slate-800 my-1"></div>

                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
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
