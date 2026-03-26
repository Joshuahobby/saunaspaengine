import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PerformanceIndexClient from "./client-page";

export default async function PerformanceIndexPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");
    
    // Only Owners and Admins can see the network-wide Performance Index
    const isExecutive = session.user.role === 'OWNER' || session.user.role === 'ADMIN';
    if (!isExecutive) redirect("/dashboard");

    const businessId = session.user.businessId;
    if (!businessId && session.user.role === 'OWNER') {
        return <div>Error: Business context not found.</div>;
    }

    // Fetch all employees in the business network with their service and commission data
    const employees = await prisma.employee.findMany({
        where: {
            branch: { businessId: businessId as string },
            status: "ACTIVE"
        },
        include: {
            branch: { select: { name: true } },
            category: { select: { name: true } },
            _count: {
                select: { serviceRecords: true }
            },
            commissionLogs: {
                select: { amount: true }
            }
        }
    });

    // Aggregate data for the overview
    const stats = {
        totalStaff: employees.length,
        totalServices: employees.reduce((acc, emp) => acc + (emp._count?.serviceRecords || 0), 0),
        totalCommissions: employees.reduce((acc, emp) => acc + (emp.commissionLogs?.reduce((sum: number, log: { amount: number }) => sum + log.amount, 0) || 0), 0),
    };

    // Find the max service count for relative scoring
    const maxServiceCount = Math.max(...employees.map(emp => emp._count?.serviceRecords || 0), 1);

    // Calculate rankings based on service volume and commissions
    const rankings = employees.map((emp) => {
        const totalEarned = emp.commissionLogs?.reduce((sum: number, log: { amount: number }) => sum + log.amount, 0) || 0;
        const serviceCount = emp._count?.serviceRecords || 0;
        
        // Performance Score: weighted combination of volume (relative to top performer) and consistency
        const volumeScore = (serviceCount / maxServiceCount) * 60; // Up to 60 points for volume
        const earningsScore = Math.min(totalEarned / 50000, 1) * 25; // Up to 25 points for earnings
        const baseScore = 15; // 15 base points for being active
        const score = Math.min(baseScore + volumeScore + earningsScore, 99);

        return {
            id: emp.id,
            fullName: emp.fullName,
            branchName: emp.branch.name,
            category: emp.category.name,
            serviceCount,
            totalEarned,
            score
        };
    }).sort((a, b) => b.score - a.score);

    return (
        <PerformanceIndexClient 
            stats={stats}
            rankings={rankings}
        />
    );
}
