"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface NavContextType {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    isMobileOpen: boolean;
    toggleMobileNav: () => void;
    closeMobileNav: () => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    // Persist state in localStorage after initial mount
    useEffect(() => {
        const saved = localStorage.getItem("sauna-sidebar-state");
        if (saved !== null) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsCollapsed(saved === "true");
        } else {
            // First time or key change: ensure it defaults to collapsed
            setIsCollapsed(true);
            localStorage.setItem("sauna-sidebar-state", "true");
        }
    }, []);

    // Close mobile nav on route change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMobileOpen(false);
    }, [pathname]);

    const toggleSidebar = () => {
        setIsCollapsed((prev) => {
            const newState = !prev;
            localStorage.setItem("sauna-sidebar-state", String(newState));
            return newState;
        });
    };

    const toggleMobileNav = () => {
        setIsMobileOpen((prev) => !prev);
    };

    const closeMobileNav = () => {
        setIsMobileOpen(false);
    };

    return (
        <NavContext.Provider value={{ 
            isCollapsed, 
            toggleSidebar, 
            isMobileOpen, 
            toggleMobileNav, 
            closeMobileNav 
        }}>
            {children}
        </NavContext.Provider>
    );
}

export function useNav() {
    const context = useContext(NavContext);
    if (context === undefined) {
        throw new Error("useNav must be used within a NavProvider");
    }
    return context;
}
