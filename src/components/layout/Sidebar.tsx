"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
    label: string;
    href: string;
    icon: string;
}

const ownerNavItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "Check-in", href: "/check-in", icon: "qr_code_scanner" },
    { label: "Employees", href: "/employees", icon: "badge" },
    { label: "Clients", href: "/clients", icon: "group" },
    { label: "Services", href: "/services", icon: "auto_awesome" },
    { label: "Memberships", href: "/memberships", icon: "card_membership" },
    { label: "Operations", href: "/operations", icon: "receipt_long" },
    { label: "Loyalty", href: "/loyalty/performance", icon: "loyalty" },
    { label: "Inventory", href: "/inventory", icon: "inventory_2" },
    { label: "Floor Manager", href: "/floor-manager", icon: "dashboard_customize" },
    { label: "QR Scanner", href: "/qr-scanner", icon: "qr_code_scanner" },
    { label: "Safety Hub", href: "/safety", icon: "shield_with_heart" },
    { label: "My Card", href: "/membership-card", icon: "credit_card" },
    { label: "Reports", href: "/reports/revenue", icon: "analytics" },
    { label: "Feedback", href: "/settings/feedback", icon: "reviews" },
    { label: "Audit Log", href: "/audit", icon: "history" },
];

const adminNavItems: NavItem[] = [
    { label: "Admin Panel", href: "/admin", icon: "admin_panel_settings" },
    { label: "Analytics", href: "/admin/analytics", icon: "insights" },
    { label: "Businesses", href: "/admin", icon: "store" },
    { label: "Branches", href: "/admin/branches", icon: "corporate_fare" }, // Added Branches link
    { label: "Subscriptions", href: "/admin/subscriptions", icon: "payments" },
    { label: "Settings", href: "/settings/roles", icon: "settings" },
    { label: "System Health", href: "/admin/health", icon: "monitor_heart" },
    { label: "Broadcasts", href: "/admin/broadcasts", icon: "campaign" },
    { label: "Settings", href: "/admin/settings", icon: "settings" },
];

interface SidebarProps {
    userRole?: "ADMIN" | "OWNER" | "EMPLOYEE";
    businessName?: string;
}

export default function Sidebar({
    userRole,
    businessName,
}: SidebarProps) {
    const pathname = usePathname();
    const navItems = userRole === "ADMIN" ? adminNavItems : ownerNavItems;

    return (
        <aside className="w-64 border-r border-[var(--color-border-light)] bg-[var(--color-surface-light)] flex flex-col h-screen sticky top-0 hidden lg:flex">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="size-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-[var(--color-bg-dark)]">
                    <span className="material-symbols-outlined font-bold">spa</span>
                </div>
                <div>
                    <h1 className="text-sm font-bold leading-tight">Sauna SPA Engine</h1>
                    <p className="text-xs text-slate-500 truncate max-w-[140px]">
                        {businessName}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${isActive
                                ? "bg-[rgba(19,236,164,0.1)] text-[var(--color-primary)] font-semibold"
                                : "text-slate-600 hover:bg-slate-100 font-medium"
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[var(--color-border-light)] space-y-2">
                <Link
                    href="/help"
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">help</span>
                    <span>Help & Support</span>
                </Link>
                <Link
                    href="/check-in"
                    className="w-full bg-[var(--color-primary)] hover:opacity-90 text-[var(--color-bg-dark)] font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all text-sm"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        add_circle
                    </span>
                    <span>New Check-in</span>
                </Link>
            </div>
        </aside>
    );
}
