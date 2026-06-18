"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type UserRole = "ADMIN" | "OWNER" | "MANAGER" | "RECEPTIONIST" | "EMPLOYEE";

const navByRole: Record<UserRole, { label: string; href: string; icon: string }[]> = {
    ADMIN: [
        { label: "Dashboard", href: "/dashboard", icon: "admin_panel_settings" },
        { label: "Businesses", href: "/businesses", icon: "domain" },
        { label: "Analytics", href: "/analytics", icon: "insights" },
        { label: "Payments", href: "/payments", icon: "mobile_friendly" },
        { label: "Health", href: "/monitoring", icon: "monitor_heart" },
    ],
    OWNER: [
        { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
        { label: "Branches", href: "/branches", icon: "corporate_fare" },
        { label: "Growth", href: "/growth", icon: "chronic" },
        { label: "Team", href: "/staff", icon: "groups_3" },
        { label: "Reports", href: "/reports/revenue", icon: "trending_up" },
    ],
    MANAGER: [
        { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
        { label: "Check-in", href: "/check-in", icon: "qr_code_scanner" },
        { label: "Work", href: "/operations", icon: "sensors" },
        { label: "Team", href: "/staff", icon: "groups_3" },
        { label: "Schedule", href: "/employees/schedule", icon: "calendar_month" },
    ],
    RECEPTIONIST: [
        { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
        { label: "Check-in", href: "/check-in", icon: "qr_code_scanner" },
        { label: "Work", href: "/operations", icon: "sensors" },
        { label: "Team", href: "/staff", icon: "groups_3" },
        { label: "Earnings", href: "/employees/my-earnings", icon: "payments" },
    ],
    EMPLOYEE: [
        { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
        { label: "Check-in", href: "/check-in", icon: "qr_code_scanner" },
        { label: "Work", href: "/operations", icon: "sensors" },
        { label: "Earnings", href: "/employees/my-earnings", icon: "payments" },
        { label: "Rankings", href: "/employees/gamification", icon: "emoji_events" },
    ],
};

interface MobileNavProps {
    userRole?: UserRole;
}

export default function MobileNav({ userRole }: MobileNavProps) {
    const pathname = usePathname();
    const navItems = navByRole[userRole ?? "EMPLOYEE"];

    return (
        <nav
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-card)] border-t border-[var(--border-main)] px-2 pb-[env(safe-area-inset-bottom)]"
            aria-label="Mobile navigation"
        >
            <div className="flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex flex-col items-center gap-0.5 py-2 px-3 text-[10px] font-bold transition-colors min-h-[44px] justify-center ${
                                isActive
                                    ? "text-[var(--color-primary)]"
                                    : "text-[var(--text-muted)]"
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
