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

    // Fetch all employees in the business network
    const employees = await prisma.employee.findMany({
        where: {
            branch: { businessId: businessId as string }
        },
        include: {
            branch: { select: { name: true } },
            category: { select: { name: true } },
            _count: {
                select: { serviceRecords: true }
            },
            // Note: commissionLogs won't be in the type until regeneration
            commissionLogs: {
                select: { amount: true }
            }
        } as any
    });

    // Aggregate data for the overview
    const stats = {
        totalStaff: employees.length,
        totalServices: employees.reduce((acc, emp) => acc + emp._count.serviceRecords, 0),
        totalCommissions: employees.reduce((acc, emp: any) => acc + (emp.commissionLogs?.reduce((sum: number, log: any) => sum + log.amount, 0) || 0), 0),
    };

    // Calculate rankings
    const rankings = employees.map((emp: any) => {
        const totalEarned = emp.commissionLogs?.reduce((sum: number, log: any) => sum + log.amount, 0) || 0;
        const serviceCount = emp._count.serviceRecords;
        
        // Performance Score logic: Weighted average of volume and earnings
        // Base 50 + (volume * 0.5) + (earnings_relative_to_network)
        const score = Math.min(60 + (serviceCount * 0.2), 99); 

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
