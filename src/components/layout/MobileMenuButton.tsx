"use client";

import { useNav } from "@/components/providers/NavProvider";

export default function MobileMenuButton() {
    const { toggleMobileNav } = useNav();

    return (
        <button 
            onClick={toggleMobileNav}
            className="lg:hidden p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:outline-none rounded-lg z-50 relative"
            aria-label="Toggle mobile menu"
            type="button"
        >
            <span className="material-symbols-outlined">menu</span>
        </button>
    );
}
