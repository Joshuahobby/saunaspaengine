export const dynamic = "force-dynamic";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NavProvider } from "../../components/providers/NavProvider";
import { getActiveBranchContext } from "@/lib/branch-context";
import { getEffectiveSettings, getGlobalBusinessSettings } from "@/lib/settings-utils";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    // 1. Resolve Branch Context (via URL or Cookie)
    const context = await getActiveBranchContext(session, {});
    
    // 2. Fetch Effective Branding Settings
    let branding = null;
    if (context.activeBranchId) {
        branding = await getEffectiveSettings(context.activeBranchId);
    } else if (session.user.businessId) {
        branding = await getGlobalBusinessSettings(session.user.businessId);
    }

    const branchName = branding?.branchName || branding?.name || "Sauna SPA Engine";
    const businessName = (branding as unknown as Record<string, unknown>)?.businessName as string | undefined || branding?.name || "Sauna SPA";
    const primaryColor = sanitizeHexColor(branding?.primaryColor);
    const logo = branding?.logo || null;

    // 3. Handle Onboarding Redirect
    if (session.user.role === "MANAGER" && session.user.branchId) {
        const branchShort = await prisma.branch.findUnique({
            where: { id: session.user.branchId },
            select: { onboardingCompleted: true }
        });
        if (branchShort && !branchShort.onboardingCompleted) {
            redirect("/onboarding");
        }
    }

    return (
        <NavProvider>
            {/* Dynamic Branding Injection */}
            <style dangerouslySetInnerHTML={{ __html: `
                :root {
                    --color-primary: ${primaryColor};
                    --color-primary-rgb: ${hexToRgb(primaryColor)};
                }
            `}} />
            
            <div className="flex h-screen overflow-hidden bg-[var(--bg-app)] text-[var(--text-main)] transition-colors duration-500">
                <Sidebar
                    userRole={session.user.role as "ADMIN" | "OWNER" | "MANAGER" | "EMPLOYEE"}
                    businessName={businessName}
                    branchName={branchName}
                    logo={logo}
                />
                <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 relative">
                    <Header />
                    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
                <MobileNav />
            </div>
        </NavProvider>
    );
}

/**
 * Validates that the value is a safe 6-digit hex color.
 * Prevents CSS injection via malicious primaryColor values stored in the DB.
 */
function sanitizeHexColor(color: string | null | undefined): string {
    const DEFAULT = "#fbbf24";
    if (!color) return DEFAULT;
    return /^#[0-9a-fA-F]{6}$/.test(color.trim()) ? color.trim() : DEFAULT;
}

/**
 * Utility to convert hex to RGB string for CSS variable usage with opacity.
 * Assumes input has already been sanitized by sanitizeHexColor().
 */
function hexToRgb(hex: string) {
    const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : "251, 191, 36";
}
