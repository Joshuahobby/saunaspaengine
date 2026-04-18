"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNav } from "@/components/providers/NavProvider";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
    label: string;
    href?: string;
    icon?: string;
    isHeader?: boolean;
}

const managerNavItems: NavItem[] = [
    { label: "Overview", isHeader: true },
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "Reception", href: "/check-in", icon: "qr_code_scanner" },
    
    { label: "Core Business", isHeader: true },
    { label: "Work & Tasks", href: "/operations", icon: "sensors" },
    { label: "Clients & Sales", href: "/growth", icon: "chronic" },
    { label: "Our Team", href: "/staff", icon: "groups_3" },
    { label: "Register Staff", href: "/employees/new", icon: "person_add" },
    { label: "Staff Roles", href: "/employees/roles", icon: "badge" },
    { label: "View Schedule", href: "/employees/schedule", icon: "calendar_month" },
    
    { label: "Company", isHeader: true },
    { label: "Corporate Setup", href: "/settings/corporate", icon: "settings" },
    { label: "Activity Logs", href: "/audit", icon: "history" },
];

const adminNavItems: NavItem[] = [
    { label: "Platform Control", isHeader: true },
    { label: "Admin Panel", href: "/dashboard", icon: "admin_panel_settings" },
    { label: "Analytics", href: "/analytics", icon: "insights" },
    { label: "Subscriptions", href: "/subscriptions", icon: "payments" },
    { label: "Platform Plans", href: "/subscriptions/platform", icon: "layers" },
    { label: "Payments", href: "/payments", icon: "mobile_friendly" },
    
    { label: "Treasury Hub", href: "/finance/settlements", icon: "account_balance" },
    { label: "Staff Leaderboard", href: "/employees/gamification", icon: "emoji_events" },
    
    { label: "Ecosystem", isHeader: true },
    { label: "Businesses", href: "/businesses", icon: "domain" },
    { label: "Branches", href: "/branches", icon: "storefront" },
    { label: "Universal Registry", href: "/clients/universal", icon: "public" },
    
    { label: "Governance", isHeader: true },
    { label: "Broadcasts", href: "/broadcasts", icon: "campaign" },
    { label: "System Health", href: "/monitoring", icon: "monitor_heart" },
    { label: "Audit Logs", href: "/audit", icon: "history" },
    { label: "Governance Hub", href: "/settings", icon: "rule" },
];

const businessNavItems: NavItem[] = [
    { label: "Executive Control", isHeader: true },
    { label: "Business Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "Branch Locations", href: "/branches", icon: "corporate_fare" },
    
    { label: "The Hubs", isHeader: true },
    { label: "Work Tracking", href: "/operations", icon: "sensors" },
    { label: "Clients & Sales", href: "/growth", icon: "chronic" },
    { label: "Our Team", href: "/staff", icon: "groups_3" },
    { label: "Register Staff", href: "/employees/new", icon: "person_add" },
    { label: "Staff Roles", href: "/employees/roles", icon: "badge" },
    
    { label: "Finance & Safety", isHeader: true },
    { label: "Settlements", href: "/finance/settlements", icon: "account_balance_wallet" },
    { label: "Performance Reports", href: "/reports/revenue", icon: "trending_up" },
    { label: "Corporate Setup", href: "/settings/corporate", icon: "settings" },
    { label: "Activity Audit", href: "/audit", icon: "history" },
];

const employeeNavItems: NavItem[] = [
    { label: "My Workspace", isHeader: true },
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "Reception", href: "/check-in", icon: "qr_code_scanner" },
    
    { label: "The Hubs", isHeader: true },
    { label: "Daily Work", href: "/operations", icon: "sensors" },
    { label: "Our Team", href: "/staff", icon: "groups_3" },
    
    { label: "Personal", isHeader: true },
    { label: "My Earnings", href: "/employees/my-earnings", icon: "payments" },
    { label: "My Schedule", href: "/employees/schedule", icon: "calendar_month" },
    { label: "Leaderboard", href: "/employees/gamification", icon: "emoji_events" },
];

interface SidebarProps {
    userRole?: "ADMIN" | "OWNER" | "MANAGER" | "RECEPTIONIST" | "EMPLOYEE";
    businessName?: string;
    branchName?: string;
    logo?: string | null;
}

export default function Sidebar({
    userRole,
    businessName,
    branchName,
    logo,
}: SidebarProps) {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar, isMobileOpen, closeMobileNav } = useNav();

    const navItems = userRole === "ADMIN"
        ? adminNavItems
        : userRole === "OWNER"
            ? businessNavItems
            : userRole === "EMPLOYEE" || userRole === "RECEPTIONIST"
                ? employeeNavItems // Receptionists start with employee view, augmented by permissions
                : managerNavItems;

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeMobileNav}
                        className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 256 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ width: isCollapsed ? 80 : 256 }}
                className={`bg-[var(--bg-card)] flex flex-col h-[100dvh] fixed top-0 left-0 lg:sticky lg:top-0 lg:relative border-r border-[var(--border-main)] z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="flex flex-col h-full w-full overflow-hidden">

                {/* Logo Section */}
                <div className={`p-6 flex items-center justify-between min-h-[88px]`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="shrink-0 size-10 bg-[var(--bg-surface-muted)] rounded-xl flex items-center justify-center text-[var(--color-primary)] shadow-sm overflow-hidden border border-[var(--border-muted)]">
                            {logo ? (
                                <img src={logo} alt="Brand" className="w-full h-full object-contain p-1" />
                            ) : (
                                <span className="material-symbols-outlined font-black">spa</span>
                            )}
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
                                    <h1 className="text-sm font-serif font-bold leading-tight tracking-tight text-[var(--text-main)] whitespace-nowrap overflow-hidden">
                                        {businessName || "Sauna SPA"}
                                    </h1>
                                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] truncate max-w-[140px]">
                                        {branchName}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <nav className="flex-1 px-3 space-y-1 mt-2 overflow-y-auto custom-scrollbar pb-10">
                    {navItems.map((item, idx) => {
                        if (item.isHeader) {
                            return !isCollapsed ? (
                                <div 
                                    key={`header-${idx}`} 
                                    className="px-4 pt-6 pb-2 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em]"
                                >
                                    {item.label}
                                </div>
                            ) : (
                                <div key={`header-sep-${idx}`} className="mx-4 my-4 h-[1px] bg-[var(--border-muted)] opacity-30" />
                            );
                        }

                        const isExactMatch = navItems.some(nav => nav.href === pathname);
                        const isActive = isExactMatch 
                            ? pathname === item.href 
                            : (item.href && item.href !== '/' && pathname.startsWith(item.href + "/"));
                        return (
                            <Link
                                key={item.href}
                                href={item.href || "#"}
                                className={`flex items-center min-h-[44px] rounded-xl text-sm transition-all duration-300 group relative ${isActive
                                    ? "bg-[var(--color-primary)] text-[var(--bg-app)] font-bold shadow-lg shadow-[var(--color-primary)]/15"
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

                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-3 py-1 bg-[var(--text-main)] text-[var(--bg-app)] text-[11px] rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl translate-x-1 group-hover:translate-x-0 font-bold uppercase tracking-wider border border-[var(--border-main)]">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-[var(--border-main)] space-y-2 bg-[var(--bg-card)]`}>
                    <Link
                        href="/help"
                        className={`w-full flex items-center min-h-[44px] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors font-bold uppercase tracking-widest text-[9px] group relative ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-2'}`}
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
                            <div className="absolute left-full ml-4 px-3 py-1 bg-[var(--text-main)] text-[var(--bg-app)] text-[11px] rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl font-bold uppercase tracking-wider border border-[var(--border-main)]">
                                Help & Support
                            </div>
                        )}
                    </Link>
                    
                    {userRole && ["MANAGER", "RECEPTIONIST", "EMPLOYEE"].includes(userRole) && (
                        <Link
                            href="/check-in"
                            className={`w-full bg-[var(--color-primary)] hover:brightness-110 text-[var(--bg-app)] font-bold rounded-xl flex items-center min-h-[44px] transition-all text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[var(--color-primary)]/10 ${isCollapsed ? 'justify-center px-0 py-0' : 'justify-center px-3 py-4 gap-2'}`}
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
                                        Reception
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-1 bg-[var(--text-main)] text-[var(--bg-app)] text-[11px] rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl font-bold uppercase tracking-wider border border-[var(--border-main)]">
                                    Reception
                                </div>
                            )}
                        </Link>
                    )}
                </div>
            </div>

            <button
                type="button"
                onClick={toggleSidebar}
                className="hidden lg:flex absolute -right-3 top-20 size-7 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-full items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-all shadow-md z-40 cursor-pointer"
            >
                <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                    chevron_left
                </span>
            </button>
        </motion.aside>
        </>
    );
}
