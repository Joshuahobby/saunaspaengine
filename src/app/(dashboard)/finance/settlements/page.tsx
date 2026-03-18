import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/role-guard";
import { redirect } from "next/navigation";
import SettlementClientPage from "./client-page";

export const dynamic = "force-dynamic";

export default async function SettlementsPage() {
    const session = await requireRole(["OWNER", "ADMIN"]);
    if (!session?.user) redirect("/login");

    const businessId = session.user.businessId;
    if (!businessId && session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const where = session.user.role === "ADMIN" ? {} : { businessId };

    const [settlements, branches] = await Promise.all([
        (prisma as any).settlement.findMany({
            where,
            orderBy: { periodEnd: "desc" },
            take: 20
        }),
        prisma.branch.findMany({
            where: session.user.role === "ADMIN" ? {} : { businessId: businessId as string },
            select: { id: true, name: true }
        })
    ]);

    // Format data for client
    const branchMap = Object.fromEntries(branches.map((b: any) => [b.id, b.name]));
    const settlementData = settlements.map((s: any) => ({
        ...s,
        branchName: branchMap[s.branchId] || "Unknown Branch",
        period: `${s.periodStart.toLocaleDateString()} - ${s.periodEnd.toLocaleDateString()}`
    }));

    return <SettlementClientPage settlements={settlementData as any} />;
}
