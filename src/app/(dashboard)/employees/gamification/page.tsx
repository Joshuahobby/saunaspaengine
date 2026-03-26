import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import GamificationClient from "./client-page";

export default async function GamificationPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");
    const isExecutive = session.user.role === 'OWNER' || session.user.role === 'ADMIN';

    // If not an executive and missing branchId, redirect
    if (!isExecutive && !session.user.branchId) redirect("/dashboard");

    // Determine scope: executives see the full business network, managers/employees see their branch
    const whereClause: any = { status: "ACTIVE" };
    if (isExecutive) {
        whereClause.branch = { businessId: session.user.businessId as string };
    } else {
        whereClause.branchId = session.user.branchId as string;
    }

    // Fetch employees with service counts and commission totals
    const employees = await prisma.employee.findMany({
        where: whereClause,
        include: {
            branch: { select: { name: true } },
            category: { select: { name: true } },
            _count: {
                select: { serviceRecords: true }
            },
            reviews: {
                select: { rating: true }
            },
            commissionLogs: {
                select: { amount: true }
            }
        },
        orderBy: { fullName: "asc" }
    });

    // Calculate leaderboard data
    const maxServiceCount = Math.max(...employees.map(emp => emp._count?.serviceRecords || 0), 1);

    const leaderboard = employees.map(emp => {
        const serviceCount = emp._count?.serviceRecords || 0;
        const totalEarned = emp.commissionLogs?.reduce((sum: number, log: { amount: number }) => sum + log.amount, 0) || 0;
        
        const reviewCount = emp.reviews?.length || 0;
        const averageRating = reviewCount > 0 
            ? emp.reviews.reduce((sum: number, val: { rating: number }) => sum + val.rating, 0) / reviewCount 
            : 0;

        // Composite score factoring in ratings
        const volumeScore = (serviceCount / maxServiceCount) * 40;
        const earningsBonus = Math.min(totalEarned / 50000, 1) * 20;
        const ratingBonus = averageRating > 0 ? (averageRating / 5) * 40 : 0;
        
        const score = Math.min(10 + volumeScore + earningsBonus + ratingBonus, 100);

        return {
            id: emp.id,
            fullName: emp.fullName,
            branchName: emp.branch.name,
            category: emp.category.name,
            serviceCount,
            totalEarned,
            averageRating,
            reviewCount,
            score: Math.round(score),
        };
    }).sort((a, b) => b.score - a.score);

    // Team goal: aggregate service target (e.g., aim for 100 services per active employee per quarter)
    const totalServices = leaderboard.reduce((acc, e) => acc + e.serviceCount, 0);
    const teamGoal = employees.length * 100; // 100 services per employee target
    const teamProgress = Math.min(Math.round((totalServices / Math.max(teamGoal, 1)) * 100), 100);

    return (
        <GamificationClient 
            leaderboard={leaderboard}
            teamProgress={teamProgress}
            totalServices={totalServices}
            teamGoal={teamGoal}
            scope={isExecutive ? "Network" : "Branch"}
        />
    );
}
