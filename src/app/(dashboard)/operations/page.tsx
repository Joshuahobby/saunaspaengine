export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import OperationsClient from "./client-page";

export default async function OperationsPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");
    if (!session.user.branchId && session.user.role !== 'OWNER') redirect("/login");

    const branchIds = session.user.role === 'OWNER'
        ? (await prisma.branch.findMany({ where: { businessId: session.user.businessId as string }, select: { id: true } })).map(b => b.id)
        : [session.user.branchId as string];

    const branchWhere = { in: branchIds };

    const [records, todayRevenue, activeCount, completedCount] = await Promise.all([
        prisma.serviceRecord.findMany({
            where: { branchId: branchWhere },
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
                branchId: branchWhere,
                status: "COMPLETED",
                createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            },
            _sum: { amount: true },
        }),
        prisma.serviceRecord.count({
            where: { branchId: branchWhere, status: { in: ["CREATED", "IN_PROGRESS"] } },
        }),
        prisma.serviceRecord.count({
            where: { branchId: branchWhere, status: "COMPLETED" },
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
