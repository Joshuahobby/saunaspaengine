import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import OperationsClient from "./client-page";

export default async function OperationsPage() {
    const session = await auth();
    if (!session?.user?.branchId) redirect("/login");

    const [records, todayRevenue, activeCount, completedCount] = await Promise.all([
        prisma.serviceRecord.findMany({
            where: { branchId: session.user.branchId },
            include: {
                client: { select: { fullName: true } },
                service: { select: { name: true, category: true, price: true } },
                employee: { select: { fullName: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 50,
        }),
        prisma.serviceRecord.aggregate({
            where: {
                branchId: session.user.branchId,
                status: "COMPLETED",
                createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            },
            _sum: { amount: true },
        }),
        prisma.serviceRecord.count({
            where: { branchId: session.user.branchId, status: { in: ["CREATED", "IN_PROGRESS"] } },
        }),
        prisma.serviceRecord.count({
            where: { branchId: session.user.branchId, status: "COMPLETED" },
        }),
    ]);

    const recordData = records.map(r => ({
        id: r.id,
        status: r.status,
        amount: r.amount,
        boxNumber: r.boxNumber,
        createdAt: r.createdAt.toISOString(),
        clientName: r.client.fullName,
        serviceName: r.service.name,
        serviceCategory: r.service.category,
        employeeName: r.employee?.fullName || null,
    }));

    return (
        <OperationsClient
            records={recordData}
            todayRevenueAmount={todayRevenue._sum.amount || 0}
            activeCount={activeCount}
            completedCount={completedCount}
        />
    );
}
