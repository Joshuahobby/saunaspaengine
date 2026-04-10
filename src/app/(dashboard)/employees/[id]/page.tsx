import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { startOfMonth, subMonths, differenceInMonths } from "date-fns";
import EmployeeUI from "./employee-ui";

export default async function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user) redirect("/login");
    const role = session.user.role;
    
    // Authorization check
    if (role !== "ADMIN" && role !== "OWNER" && role !== "MANAGER") {
        redirect("/dashboard");
    }

    // 1. Core Fetching
    const [employee, categories, branches] = await Promise.all([
        prisma.employee.findUnique({
            where: { id },
            include: {
                branch: true,
                category: true,
                user: { select: { email: true, username: true } },
            }
        }),
        prisma.employeeCategory.findMany({ orderBy: { name: 'asc' } }),
        (role === "OWNER" || role === "ADMIN")
            ? prisma.branch.findMany({
                where: { businessId: session.user.businessId as string },
                orderBy: { name: 'asc' }
            })
            : []
    ]);

    if (!employee) notFound();

    // Secondary security: Managers can only see staff in their branch
    if (role === "MANAGER" && employee.branchId !== session.user.branchId) {
        redirect("/employees");
    }

    // 2. Intelligence Gathering: Revenue Trend (Last 12 Months)
    const twelveMonthsAgo = subMonths(new Date(), 12);
    const serviceRecords = await prisma.serviceRecord.findMany({
        where: { 
            employeeId: id,
            status: "COMPLETED",
            completedAt: { gte: twelveMonthsAgo }
        },
        include: { service: true, client: true, review: true },
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

    // Customer Retention (Repeat Rate)
    const clientVisitCounts: Record<string, number> = {};
    serviceRecords.forEach(r => {
        clientVisitCounts[r.clientId] = (clientVisitCounts[r.clientId] || 0) + 1;
    });
    
    const uniqueClients = Object.keys(clientVisitCounts).length;
    const repeatClients = Object.values(clientVisitCounts).filter(count => count > 1).length;
    const retentionRate = uniqueClients > 0 ? (repeatClients / uniqueClients) * 100 : 0;

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
        retentionRate,
        uniqueClients,
        velocityData,
        lastActive: serviceRecords[0]?.completedAt || employee.createdAt,
        performanceStatus: totalServices > 10 ? (avgRating >= 4.5 ? 'ELITE' : 'STABLE') : 'PROBATION'
    };

    return (
        <EmployeeUI 
            employee={{
                ...employee,
                phone: employee.phone || null,
                commissionRate: employee.commissionRate,
                user: employee.user || null,
                serviceRecords: serviceRecords.slice(0, 20) // Limit list to recent
            } as any}
            categories={categories}
            branches={branches}
            isOwner={role === "OWNER" || role === "ADMIN"}
            intelligence={intelligence}
        />
    );
}
