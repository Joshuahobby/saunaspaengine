"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mobileNavItems = [
    { label: "Home", href: "/dashboard", icon: "dashboard" },
    { label: "Check-in", href: "/check-in", icon: "qr_code_scanner" },
    { label: "Clients", href: "/clients", icon: "group" },
    { label: "Operations", href: "/operations", icon: "receipt_long" },
    { label: "More", href: "/services", icon: "more_horiz" },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--color-border-light)] px-2 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-around">
                {mobileNavItems.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-0.5 py-2 px-3 text-[10px] font-bold transition-colors ${isActive
                                    ? "text-[var(--color-primary)]"
                                    : "text-slate-400"
                                }`}
                        >
                            <span className="material-symbols-outlined text-[22px]">
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
