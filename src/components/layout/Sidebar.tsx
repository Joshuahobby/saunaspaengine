"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNav } from "@/components/providers/NavProvider";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
    label: string;
    href: string;
    icon: string;
}

const managerNavItems: NavItem[] = [
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
    { label: "Admin Panel", href: "/admin/dashboard", icon: "admin_panel_settings" },
    { label: "Analytics", href: "/admin/analytics", icon: "insights" },
    { label: "Clients", href: "/admin/members", icon: "groups" },

    { label: "Branches", href: "/admin/branches", icon: "domain" },
    { label: "Branches", href: "/admin/branches", icon: "storefront" },
    { label: "Subscriptions", href: "/admin/subscriptions", icon: "payments" },
    { label: "System Health", href: "/admin/health", icon: "monitor_heart" },
    { label: "Broadcasts", href: "/admin/broadcasts", icon: "campaign" },
    { label: "Audit Logs", href: "/admin/audit", icon: "history" },
    { label: "Settings", href: "/admin/settings", icon: "settings" },
];

const businessNavItems: NavItem[] = [
    { label: "Business Dashboard", href: "/executive/dashboard", icon: "dashboard" },
    { label: "Branch Comparison", href: "/branches/compare", icon: "compare_arrows" },
    { label: "Aggregated Reports", href: "/reports/aggregated", icon: "analytics" },
    { label: "Branch Directory", href: "/admin/branches", icon: "business_fare" },
    { label: "Audit Log", href: "/audit", icon: "history" },
];

const employeeNavItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "Check-in", href: "/check-in", icon: "qr_code_scanner" },
    { label: "Operations", href: "/operations", icon: "receipt_long" },
    { label: "QR Scanner", href: "/qr-scanner", icon: "qr_code_scanner" },
    { label: "Floor Manager", href: "/floor-manager", icon: "dashboard_customize" },
    { label: "Safety Hub", href: "/safety", icon: "shield_with_heart" },
];

interface SidebarProps {
    userRole?: "ADMIN" | "OWNER" | "MANAGER" | "EMPLOYEE";
    branchName?: string;
}

export default function Sidebar({
    userRole,
    branchName,
}: SidebarProps) {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar } = useNav();

    const navItems = userRole === "ADMIN"
        ? adminNavItems
        : userRole === "OWNER"
            ? businessNavItems
            : userRole === "EMPLOYEE"
                ? employeeNavItems
                : managerNavItems;

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 256 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-[var(--bg-card)] flex flex-col h-screen sticky top-0 hidden lg:flex border-r border-[var(--border-main)] z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative"
        >
            {/* Wrap all content in an overflow-hidden container to prevent layout spill during transition */}
            <div className="flex flex-col h-full w-full overflow-hidden">
                {/* Logo Section */}
                <div className={`p-6 flex items-center justify-between min-h-[88px]`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="shrink-0 size-10 bg-[var(--bg-surface-muted)] rounded-xl flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                            <span className="material-symbols-outlined font-black">spa</span>
                        </div>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="whitespace-nowrap"
                                >
                                    <h1 className="text-sm font-serif font-bold leading-tight tracking-tight text-[var(--text-main)] italic">Sauna <span className="not-italic text-[var(--color-primary)]">SPA</span></h1>
                                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] truncate max-w-[140px] opacity-60">
                                        {branchName}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-1 mt-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center min-h-[44px] rounded-xl text-sm transition-all duration-300 group relative ${isActive
                                    ? "bg-[var(--color-primary)] text-white font-bold shadow-lg shadow-[var(--color-primary)]/15"
                                    : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] hover:text-[var(--text-main)] font-semibold"
                                    } ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'}`}
                            >
                                <span className="material-symbols-outlined text-[20px] shrink-0">
                                    {item.icon}
                                </span>
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -5 }}
                                            transition={{ duration: 0.15 }}
                                            className="whitespace-nowrap truncate"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-3 py-1 bg-gray-900 text-white text-[11px] rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl translate-x-1 group-hover:translate-x-0 font-bold uppercase tracking-wider">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-[var(--border-main)] space-y-2`}>
                    <Link
                        href="/help"
                        className={`w-full flex items-center min-h-[44px] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors font-bold uppercase tracking-widest text-[9px] opacity-60 group relative ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-2'}`}
                    >
                        <span className="material-symbols-outlined text-[18px] shrink-0">help</span>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="whitespace-nowrap"
                                >
                                    Help & Support
                                </motion.span>
                            )}
                        </AnimatePresence>
                        {isCollapsed && (
                            <div className="absolute left-full ml-4 px-3 py-1 bg-gray-900 text-white text-[11px] rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl font-bold uppercase tracking-wider">
                                Help & Support
                            </div>
                        )}
                    </Link>
                    
                    <Link
                        href="/check-in"
                        className={`w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl flex items-center min-h-[44px] transition-all text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[var(--color-primary)]/10 ${isCollapsed ? 'justify-center px-0 py-0' : 'justify-center px-3 py-4 gap-2'}`}
                    >
                        <span className="material-symbols-outlined text-[20px] font-bold shrink-0">
                            add_circle
                        </span>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="whitespace-nowrap"
                                >
                                    New Check-in
                                </motion.span>
                            )}
                        </AnimatePresence>
                        {isCollapsed && (
                            <div className="absolute left-full ml-4 px-3 py-1 bg-gray-900 text-white text-[11px] rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl font-bold uppercase tracking-wider">
                                New Check-in
                            </div>
                        )}
                    </Link>
                </div>
            </div>

            {/* Toggle Button - Floating outside the inner restricted container but inside the aside */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-20 size-7 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-all shadow-md z-40 cursor-pointer"
            >
                <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                    chevron_left
                </span>
            </button>
        </motion.aside>
    );
}
