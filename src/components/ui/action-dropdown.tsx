"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export interface DropdownAction {
    label: string;
    icon: string;
    onClick?: () => void;
    href?: string;
    variant?: "default" | "danger";
}

export function ActionDropdown({ actions }: { actions: DropdownAction[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`p-2 rounded-lg border transition-all flex items-center justify-center ${
                    isOpen 
                    ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20 text-[var(--color-primary)]" 
                    : "bg-[var(--bg-card)] border-[var(--border-muted)] text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)]/50 hover:text-[var(--text-main)]"
                }`}
                title="Manage Actions"
            >
                <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-48 rounded-xl bg-[var(--bg-card)] border border-[var(--border-muted)] shadow-2xl overflow-hidden z-[50]"
                    >
                        <div className="p-1 flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
                            {actions.map((act, i) => {
                                const content = (
                                    <>
                                        <span className={`material-symbols-outlined text-[16px] ${act.variant === 'danger' ? 'text-rose-500' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'} transition-colors`}>
                                            {act.icon}
                                        </span>
                                        <span className={`text-[11px] font-bold tracking-wide ${act.variant === 'danger' ? 'text-rose-500' : 'text-[var(--text-main)]'} transition-colors`}>
                                            {act.label}
                                        </span>
                                    </>
                                );

                                const className = `flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                                    act.variant === 'danger' 
                                    ? 'hover:bg-rose-500/10' 
                                    : 'hover:bg-[var(--bg-surface-muted)]/20 hover:text-[var(--text-main)]'
                                }`;

                                if (act.href) {
                                    return (
                                        <Link key={i} href={act.href} className={className} onClick={() => setIsOpen(false)}>
                                            {content}
                                        </Link>
                                    );
                                }

                                return (
                                    <button 
                                        key={i} 
                                        onClick={() => {
                                            if (act.onClick) act.onClick();
                                            setIsOpen(false);
                                        }} 
                                        className={className}
                                    >
                                        {content}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

