import { cookies } from "next/headers";
import { prisma } from "./prisma";

interface BranchContext {
    authorizedBranchIds: string[];
    isFiltered: boolean;
    activeBranchId: string | null;
}

/**
 * Resolves the "Effective Branch Context" for the current request.
 * Strictly enforces multitenancy by verifying branch ownership.
 */
export async function getActiveBranchContext(
    session: any, 
    searchParams: { branchId?: string }
): Promise<BranchContext> {
    const user = session?.user;
    if (!user) return { authorizedBranchIds: [], isFiltered: false, activeBranchId: null };

    // 1. STAFF LOCKDOWN: Staff can ONLY see their assigned branch. No exceptions.
    if (user.role === 'EMPLOYEE' || user.role === 'RECEPTIONIST') {
        const staffBranchId = user.branchId;
        return { 
            authorizedBranchIds: staffBranchId ? [staffBranchId] : [], 
            isFiltered: true,
            activeBranchId: staffBranchId || null
        };
    }

    // 2. OWNER/ADMIN PREROGATIVE: 
    // They can switch between branches within their business.
    const businessId = user.businessId;
    if (!businessId) return { authorizedBranchIds: [], isFiltered: false, activeBranchId: null };

    // Get the requested branch from URL or Cookie PERSISTENCE
    const cookieStore = await cookies();
    const cookieBranchId = cookieStore.get("sauna_active_branch")?.value;
    const requestedBranchId = searchParams.branchId || cookieBranchId;

    // If "All Branches" is explicitly selected or no branch context exists
    if (!requestedBranchId || requestedBranchId === "all") {
        const allBusinessBranches = await prisma.branch.findMany({
            where: { businessId: businessId, status: "ACTIVE" },
            select: { id: true }
        });
        return { 
            authorizedBranchIds: allBusinessBranches.map(b => b.id),
            isFiltered: false,
            activeBranchId: null
        };
    }

    // SECURITY CHECK: Verify the requested branch belongs to THIS business
    const verifiedBranch = await prisma.branch.findFirst({
        where: { id: requestedBranchId, businessId: businessId },
        select: { id: true }
    });

    // If the branch is valid for this owner
    if (verifiedBranch) {
        return {
            authorizedBranchIds: [verifiedBranch.id],
            isFiltered: true,
            activeBranchId: verifiedBranch.id
        };
    }

    // FALLBACK: If they tried to access a branch they don't own, 
    // reset to All Branches (Safety First)
    const fallbackBranches = await prisma.branch.findMany({
        where: { businessId: businessId, status: "ACTIVE" },
        select: { id: true }
    });
    
    return {
        authorizedBranchIds: fallbackBranches.map(b => b.id),
        isFiltered: false,
        activeBranchId: null
    };
}
