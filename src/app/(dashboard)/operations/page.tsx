export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import OperationsClient from "./client-page";
import { ExtraService, RecordData } from "@/types/operations";



import { getActiveBranchContext } from "@/lib/branch-context";

export default async function OperationsPage(props: { searchParams: Promise<{ branchId?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await auth();
    if (!session?.user) redirect("/login");

    // Unified & Secure Branch Context Resolution
    const { authorizedBranchIds } = await getActiveBranchContext(session, searchParams);
    
    // If no authorized branches found, something is wrong with the session or business
    if (authorizedBranchIds.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white p-10 font-serif italic text-xl">
                UNAUTHORIZED: Access to requested branch context denied.
            </div>
        );
    }

    const branchWhere = { in: authorizedBranchIds };

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
