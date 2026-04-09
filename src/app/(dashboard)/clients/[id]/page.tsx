import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { startOfMonth, endOfMonth } from "date-fns";
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

    // 1. Core Data Fetching (Parallel)
    const [client, visitsThisMonth, loyaltyInfo, totalSpendAggr, favoriteServiceAggr, auditLogs] = await Promise.all([
        prisma.client.findFirst({
            where: { id },
            include: {
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
        // Phase 4: Lifetime Value
        prisma.serviceRecord.aggregate({
            where: { clientId: id, status: "COMPLETED" },
            _sum: { amount: true },
            _count: { id: true }
        }),
        // Phase 4: Favorite Service
        prisma.serviceRecord.groupBy({
            by: ['serviceId'],
            where: { clientId: id, status: "COMPLETED" },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 1
        }),
        // Phase 4: Audit Logs (Governance)
        prisma.auditLog.findMany({
            where: { entity: "Client", entityId: id },
            include: { user: { select: { fullName: true } } },
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

    // Secondary data fetching: service records and favorite service name
    const [serviceRecords, favoriteService] = await Promise.all([
        prisma.serviceRecord.findMany({
            where: { clientId: client.id },
            include: { service: true, employee: true },
            orderBy: { createdAt: 'desc' },
            take: 20 // increased for better history view
        }),
        favoriteServiceAggr.length > 0 
            ? prisma.service.findUnique({ 
                where: { id: favoriteServiceAggr[0].serviceId },
                select: { name: true }
              })
            : Promise.resolve(null)
    ]);

    const ltv = totalSpendAggr._sum.amount || 0;
    const avgTicket = totalSpendAggr._count.id > 0 ? ltv / totalSpendAggr._count.id : 0;
    
    // Package intelligence data
    const intelligence = {
        ltv,
        avgTicket,
        favoriteService: favoriteService?.name || "N/A",
        totalVisits: totalSpendAggr._count.id,
        auditLogs
    };

    const activeMembership = client.memberships[0];
    const tier = loyaltyInfo?.tier || "BRONZE";
    const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.BRONZE;

    return (
        <ClientProfile 
            client={{ ...client, serviceRecords } as any}
            activeMembership={activeMembership}
            loyaltyInfo={loyaltyInfo}
            tierConfig={tierConfig}
            visitsThisMonth={visitsThisMonth}
            intelligence={intelligence}
        />
    );
}
