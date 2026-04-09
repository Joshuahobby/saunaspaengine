export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import OperationsClient from "./client-page";
import { ExtraService, RecordData } from "@/types/operations";



export default async function OperationsPage(props: { searchParams: Promise<{ branchId?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await auth();
    if (!session?.user) redirect("/login");
    if (!session.user.branchId && session.user.role !== 'OWNER') redirect("/login");

    const branchIds = searchParams.branchId 
        ? [searchParams.branchId]
        : (session.user.role === 'OWNER'
            ? (await prisma.branch.findMany({ where: { businessId: session.user.businessId as string }, select: { id: true } })).map(b => b.id)
            : [session.user.branchId as string]);

    const branchWhere = { in: branchIds };

    const [records, todayRevenue, activeCount, completedCount, services, employees] = await Promise.all([
        prisma.serviceRecord.findMany({
            where: { branchId: branchWhere },
            include: {
                client: { select: { fullName: true } },
                service: { select: { name: true, category: true, price: true } },
                employee: { select: { fullName: true } },
                review: { select: { id: true } },
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
        prisma.service.findMany({
            where: { branchId: branchWhere, status: "ACTIVE" },
            select: { id: true, name: true, price: true }
        }),
        prisma.employee.findMany({
            where: { branchId: branchWhere, status: "ACTIVE" },
            select: { id: true, fullName: true }
        }),
    ]);

    function parseExtras(raw: unknown): ExtraService[] {
        if (!raw) return [];
        if (Array.isArray(raw)) return raw as ExtraService[];
        if (typeof raw === "string") {
            try { 
                const p = JSON.parse(raw); 
                return Array.isArray(p) ? p as ExtraService[] : []; 
            } catch { 
                return []; 
            }
        }
        return [];
    }

    type RawRecord = typeof records[number] & { extraServices: unknown; review?: { id: string } | null };

    const recordData: RecordData[] = (records as RawRecord[]).map(r => ({
        id: r.id,
        clientId: r.clientId,
        status: r.status,
        amount: r.amount,
        boxNumber: r.boxNumber,
        createdAt: r.createdAt.toISOString(),
        clientName: r.client.fullName,
        serviceName: r.service.name,
        serviceCategory: r.service.category,
        employeeName: r.employee?.fullName || null,
        employeeId: r.employeeId || null,
        hasReview: !!r.review,
        extraServices: parseExtras(r.extraServices),
    }));





    return (
        <OperationsClient
            records={recordData}
            todayRevenueAmount={todayRevenue._sum.amount || 0}
            activeCount={activeCount}
            completedCount={completedCount}
            services={services}
            employees={employees}
        />
    );
}
