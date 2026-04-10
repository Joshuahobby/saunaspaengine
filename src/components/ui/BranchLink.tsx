"use client";

import Link, { LinkProps } from "next/link";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

interface BranchLinkProps extends LinkProps {
    children: ReactNode;
    className?: string;
}

/**
 * A specialized Link component that automatically persists the current 'branchId' 
 * search parameter if one is active. Use this for dashboard navigation that should 
 * stay within the same 'Location Context'.
 */
export function BranchLink({ children, href, ...props }: BranchLinkProps) {
    const searchParams = useSearchParams();
    const branchId = searchParams.get("branchId");

    let finalHref = href.toString();
    
    // If we have a branch context, append it to the link
    if (branchId) {
        const url = new URL(finalHref, "http://localhost"); // Base is ignored for relative paths
        url.searchParams.set("branchId", branchId);
        // Remove the origin/protocol since next/link expects a relative or external path
        finalHref = url.toString().replace("http://localhost", "");
    }

    return (
        <Link href={finalHref} {...props}>
            {children}
        </Link>
    );
}
