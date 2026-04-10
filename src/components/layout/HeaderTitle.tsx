"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const titleMap: Record<string, string> = {
    "/dashboard": "Business Dashboard",
    "/check-in": "Reception Desk",
    "/operations": "Operations Hub",
    "/growth": "Sales & Clients",
    "/staff": "Team Management",
    "/settings/corporate": "Corporate Identity",
    "/audit": "System Logs",
    "/finance/settlements": "Finance & Treasury",
    "/branches": "Branch Network",
    "/reports/revenue": "Revenue Reports",
    "/staff/attendance": "Staff Attendance",
    "/staff/payroll": "Payroll Center",
    "/staff/performance": "Performance metrics",
};

export default function HeaderTitle() {
    const pathname = usePathname();

    // Find the best match or fallback to a formatted version of the path
    const getTitle = () => {
        if (titleMap[pathname]) return titleMap[pathname];
        
        // Handle dynamic routes (e.g., /branches/[id])
        const segments = pathname.split('/').filter(Boolean);
        const last = segments[segments.length - 1];
        
        if (last && last.length > 20) { // Likely an ID
            return segments[segments.length - 2]?.toUpperCase() || "Details";
        }

        return last ? last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ') : "Command Center";
    };

    const title = getTitle();
    const parts = title.split(' ');
    const firstPart = parts[0];
    const remainingParts = parts.slice(1).join(' ');

    return (
        <motion.h2 
            key={pathname}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-serif font-black leading-tight tracking-tight text-[var(--text-main)] whitespace-nowrap"
        >
            {firstPart}
            {remainingParts && (
                <span className="not-italic text-[var(--color-primary)] opacity-90">
                    {" "}{remainingParts}
                </span>
            )}
        </motion.h2>
    );
}
