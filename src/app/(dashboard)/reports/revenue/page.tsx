import { requireRole } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ReportsRevenueClientPage from "./client-page";

export const dynamic = "force-dynamic";

import { getActiveBranchContext } from "@/lib/branch-context";

export default async function ReportsRevenuePage(props: { searchParams: Promise<{ branchId?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await requireRole(["MANAGER", "ADMIN", "OWNER"]);
    if (!session?.user) redirect("/login");

    // Unified & Secure Branch Context Resolution
    const { authorizedBranchIds } = await getActiveBranchContext(session, searchParams);

    if (authorizedBranchIds.length === 0) {
        return (
            <div className="flex h-[70vh] items-center justify-center bg-black/20 rounded-[40px] border border-white/5 text-white/50 p-10 font-serif italic text-lg text-center">
                Access to financial records in this context is restricted or unavailable.<br/>
                Please select an authorized branch.
            </div>
        );
    }

    const branchWhere = { in: authorizedBranchIds };

    // Fetch total revenue components
    const completedRecords = await prisma.serviceRecord.findMany({
        where: {
            branchId: branchWhere,
            status: 'COMPLETED'
        },
        include: {
            service: {
                select: { name: true, category: true }
            }
        }
    });

    const totalRevenue = completedRecords.reduce((sum: number, r) => sum + r.amount, 0);
    const totalTax = completedRecords.reduce((sum: number, r: any) => sum + (r.taxAmount || 0), 0);
    const totalCommission = completedRecords.reduce((sum: number, r: any) => sum + (r.platformFee || 0), 0);
    const totalNet = completedRecords.reduce((sum: number, r: any) => sum + (r.netAmount || 0), 0);
    const avgTransactionValue = completedRecords.length > 0 ? totalRevenue / completedRecords.length : 0;

    const activeMembersCount = await prisma.membership.count({
        where: {
            status: 'ACTIVE',
            category: { branchId: branchWhere }
        }
    });

    // Payment Mode Distribution
    const paymentDistribution = completedRecords.reduce((acc: Record<string, number>, r) => {
        acc[r.paymentMode] = (acc[r.paymentMode] || 0) + r.amount;
        return acc;
    }, {});

    // Top Services
    const serviceStats = completedRecords.reduce((acc: Record<string, any>, r) => {
        const key = r.serviceId;
        if (!acc[key]) {
            acc[key] = {
                name: r.service.name,
                category: r.service.category || 'Other',
                bookings: 0,
                revenue: 0
            };
        }
        acc[key].bookings += 1;
        acc[key].revenue += r.amount;
        return acc;
    }, {});

    const topServices = Object.values(serviceStats)
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 5);

    const metrics = {
        totalRevenue,
        totalTax,
        totalCommission,
        totalNet,
        avgTransactionValue,
        activeMembersCount,
        paymentDistribution,
        topServices,
        totalBookings: completedRecords.length
    };

    return <ReportsRevenueClientPage metrics={metrics} />;
}

