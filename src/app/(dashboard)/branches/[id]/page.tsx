import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { startOfMonth, subMonths, differenceInMonths } from "date-fns";
import BranchUI from "./branch-ui";

export default async function BranchProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user) redirect("/login");
    const role = session.user.role;
    
    // Authorization check
    if (role !== "ADMIN" && role !== "OWNER") {
        // Managers can only see their own branch
        if (role === "MANAGER" && session.user.branchId !== id) {
             redirect("/dashboard");
        }
    }

    // 1. Core Fetching
    const branch = await prisma.branch.findUnique({
        where: { id },
        include: {
            business: true,
            _count: {
                select: {
                    employees: true,
                    services: true,
                    clients: true,
                }
            }
        }
    });

    if (!branch) notFound();

    // 2. Intelligence Gathering: Revenue Trend (Last 12 Months)
    const twelveMonthsAgo = subMonths(new Date(), 12);
    const serviceRecords = await prisma.serviceRecord.findMany({
        where: { 
            branchId: id,
            status: "COMPLETED",
            completedAt: { gte: twelveMonthsAgo }
        },
        include: { employee: true, review: true },
        orderBy: { completedAt: 'desc' }
    });

    // 3. Performance Metrics
    const totalYield = serviceRecords.reduce((acc, r) => acc + (r.amount || 0), 0);
    const totalServices = serviceRecords.length;
    
    // Quality Index (Reviews)
    const ratedRecords = serviceRecords.filter(r => r.review);
    const avgRating = ratedRecords.length > 0 
        ? ratedRecords.reduce((acc, r) => acc + (r.review?.rating || 0), 0) / ratedRecords.length
        : 0;

    // Staff Leaderboard (Top Earners/Performers)
    const staffPerformance: Record<string, { name: string, yield: number, count: number, rating: number, rCount: number }> = {};
    serviceRecords.forEach(r => {
        if (!r.employeeId) return;
        if (!staffPerformance[r.employeeId]) {
            staffPerformance[r.employeeId] = { 
                name: r.employee?.fullName || "Unknown Staff", 
                yield: 0, 
                count: 0,
                rating: 0,
                rCount: 0
            };
        }
        staffPerformance[r.employeeId].yield += r.amount;
        staffPerformance[r.employeeId].count += 1;
        if (r.review) {
            staffPerformance[r.employeeId].rating += r.review.rating;
            staffPerformance[r.employeeId].rCount += 1;
        }
    });

    const leaderboard = Object.values(staffPerformance)
        .map(s => ({
            ...s,
            avgRating: s.rCount > 0 ? s.rating / s.rCount : 0
        }))
        .sort((a, b) => b.yield - a.yield)
        .slice(0, 5); // Top 5 staff

    // Revenue Velocity Map (Last 12 Months)
    const velocityData = new Array(12).fill(0);
    serviceRecords.forEach(r => {
        const monthsAgo = differenceInMonths(new Date(), r.completedAt!);
        const index = 11 - monthsAgo;
        if (index >= 0 && index < 12) {
            velocityData[index] += r.amount;
        }
    });

    const intelligence = {
        totalYield,
        totalServices,
        avgRating,
        leaderboard,
        velocityData,
        lastActive: serviceRecords[0]?.completedAt || branch.createdAt,
        occupancyRate: totalServices > 0 ? Math.min((totalServices / (30 * 10)) * 100, 100) : 0 // Rough estimation vs capacity
    };

    return (
        <BranchUI 
            branch={{
                ...branch,
                serviceRecords: serviceRecords.slice(0, 20)
            } as Parameters<typeof BranchUI>[0]["branch"]}
            intelligence={intelligence}
            isOwner={role === "OWNER" || role === "ADMIN"}
        />
    );
}
