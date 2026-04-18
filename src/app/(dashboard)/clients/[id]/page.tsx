import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { startOfMonth, endOfMonth, differenceInDays, subMonths } from "date-fns";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import ClientProfile from "./client-profile";

const TIER_CONFIG: Record<string, { color: string; bg: string; border: string; icon: string }> = {
    BRONZE: { color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30", border: "border-amber-200 dark:border-amber-800/40", icon: "⭐" },
    SILVER: { color: "text-slate-600 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-700/30", border: "border-slate-200 dark:border-slate-600/40", icon: "🥈" },
    GOLD: { color: "text-yellow-700 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30", border: "border-yellow-200 dark:border-yellow-800/40", icon: "🥇" },
    PLATINUM: { color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-900/30", border: "border-violet-200 dark:border-violet-800/40", icon: "💎" },
};

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user) {
        redirect("/login");
    }

    // 1. Initial Core Fetching
    const [client, visitsThisMonth, loyaltyInfo, totalSpendAggr, favoriteServiceAggr, auditLogs, allReviews] = await Promise.all([
        prisma.client.findFirst({
            where: { id },
            include: {
                branch: {
                    include: { business: true }
                },
                memberships: {
                    where: { status: "ACTIVE" },
                    include: { category: true },
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        }),
        prisma.serviceRecord.count({
            where: {
                clientId: id,
                completedAt: {
                    gte: startOfMonth(new Date()),
                    lte: endOfMonth(new Date())
                },
                status: "COMPLETED"
            }
        }),
        prisma.loyaltyPoint.findFirst({
            where: { clientId: id }
        }),
        prisma.serviceRecord.aggregate({
            where: { clientId: id, status: "COMPLETED" },
            _sum: { amount: true },
            _count: { id: true }
        }),
        prisma.serviceRecord.groupBy({
            by: ['serviceId'],
            where: { clientId: id, status: "COMPLETED" },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 1
        }),
        prisma.auditLog.findMany({
            where: { entity: "Client", entityId: id },
            include: { user: { select: { fullName: true } } },
            orderBy: { createdAt: 'desc' },
            take: 10
        }),
        prisma.review.findMany({
            where: { clientId: id },
            orderBy: { createdAt: 'desc' },
            take: 5
        })
    ]);

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
                <div className="size-20 bg-[var(--bg-surface-muted)] rounded-full flex items-center justify-center text-[var(--text-muted)] mb-4">
                    <ShieldAlert className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-[var(--text-main)]">Client Not Found</h2>
                <p className="text-[var(--text-muted)] mb-6">The client you are looking for does not exist or has been removed.</p>
                <Link href="/clients" className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-all">
                    Back to Records
                </Link>
            </div>
        );
    }

    // Secondary data fetching for intelligence
    const sixMonthsAgo = subMonths(new Date(), 6);
    const [serviceRecords, favoriteService, spendByMonth, branchServices] = await Promise.all([
        prisma.serviceRecord.findMany({
            where: { clientId: client.id },
            include: { service: true, employee: true },
            orderBy: { createdAt: 'desc' },
            take: 50
        }),
        favoriteServiceAggr.length > 0 
            ? prisma.service.findUnique({ 
                where: { id: favoriteServiceAggr[0].serviceId },
                select: { name: true, category: true }
              })
            : Promise.resolve(null),
        // Expenditure Velocity Trend
        prisma.serviceRecord.findMany({
            where: {
                clientId: id,
                status: "COMPLETED",
                completedAt: { gte: sixMonthsAgo }
            },
            select: { amount: true, completedAt: true },
            orderBy: { completedAt: 'asc' }
        }),
        // For Next Suggested Service logic
        prisma.service.findMany({
            where: { branchId: client.branchId, status: "ACTIVE" },
            select: { id: true, name: true, category: true },
            take: 10
        })
    ]);

    // Intelligence Calculations
    const ltv = totalSpendAggr._sum.amount || 0;
    const avgTicket = totalSpendAggr._count.id > 0 ? ltv / totalSpendAggr._count.id : 0;
    
    // Relationship Health Metrics
    const completedRecords = serviceRecords.filter(r => r.status === "COMPLETED" && r.completedAt);
    let avgFrequency = 0;
    let daysSinceLastVisit = 0;
    let relationshipHealth: 'ACTIVE' | 'DRIFTING' | 'AT_RISK' = 'ACTIVE';

    if (completedRecords.length >= 2) {
        const firstVisit = completedRecords[completedRecords.length - 1].completedAt!;
        const lastVisit = completedRecords[0].completedAt!;
        const span = differenceInDays(lastVisit, firstVisit);
        avgFrequency = Math.round(span / (completedRecords.length - 1));
        daysSinceLastVisit = differenceInDays(new Date(), lastVisit);
        
        if (daysSinceLastVisit > avgFrequency * 2.5) relationshipHealth = 'AT_RISK';
        else if (daysSinceLastVisit > avgFrequency * 1.5) relationshipHealth = 'DRIFTING';
    }

    // Sentiment Calculation
    const avgRating = allReviews.length > 0 
        ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length 
        : 0;

    // Expenditure Velocity Map (Last 6 Months)
    const velocityMap = new Array(6).fill(0);
    spendByMonth.forEach(record => {
        const monthsAgo = differenceInDays(new Date(), record.completedAt!) / 30;
        const index = 5 - Math.floor(monthsAgo);
        if (index >= 0 && index < 6) {
            velocityMap[index] += record.amount;
        }
    });

    // Next Suggested Service (Logic: popular but not their favorite)
    const suggestedService = branchServices.find(s => 
        s.name !== favoriteService?.name && 
        !completedRecords.some(r => r.serviceId === s.id)
    ) || branchServices[0];

    const intelligence = {
        ltv,
        avgTicket,
        favoriteService: favoriteService?.name || "N/A",
        totalVisits: totalSpendAggr._count.id,
        auditLogs,
        avgFrequency,
        daysSinceLastVisit,
        relationshipHealth,
        lastSeen: completedRecords[0]?.completedAt || null,
        avgRating,
        recentReviews: allReviews,
        velocityData: velocityMap,
        suggestedService: suggestedService?.name || "Premium Aromatherapy"
    };

    const activeMembership = client.memberships[0];
    const tier = loyaltyInfo?.tier || "BRONZE";
    const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.BRONZE;

    return (
        <ClientProfile 
            client={{ ...client, serviceRecords, notes: client.notes || "" } as Parameters<typeof ClientProfile>[0]["client"]}
            activeMembership={activeMembership}
            loyaltyInfo={loyaltyInfo}
            tierConfig={tierConfig}
            visitsThisMonth={visitsThisMonth}
            intelligence={intelligence}
        />
    );
}
