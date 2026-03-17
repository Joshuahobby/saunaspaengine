import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { apiAuth, apiHandler } from "@/lib/api-utils";

/**
 * GET /api/inventory/alerts
 * Returns inventory items that are at or below their minimum threshold.
 */
export async function GET() {
    return apiHandler(async () => {
        const { user, error } = await apiAuth(["MANAGER", "ADMIN"]);
        if (error) return error;

        if (!user!.branchId) {
            return NextResponse.json({ error: "No branch assigned" }, { status: 403 });
        }

        const lowStockItems = await prisma.inventory.findMany({
            where: {
                branchId: user!.branchId,
                stockCount: {
                    lte: prisma.inventory.fields.minThreshold as unknown as number,
                },
            },
            orderBy: { stockCount: "asc" },
        });

        // Prisma doesn't support column-to-column comparison in WHERE directly,
        // so we fetch all and filter in JS
        const allItems = await prisma.inventory.findMany({
            where: { branchId: user!.branchId },
            orderBy: { stockCount: "asc" },
        });

        const alerts = allItems
            .filter(item => item.stockCount <= item.minThreshold)
            .map(item => ({
                id: item.id,
                productName: item.productName,
                stockCount: item.stockCount,
                minThreshold: item.minThreshold,
                unit: item.unit,
                isOutOfStock: item.stockCount === 0,
                severity: item.stockCount === 0 ? "CRITICAL" : "WARNING",
            }));

        return NextResponse.json({
            totalAlerts: alerts.length,
            criticalCount: alerts.filter(a => a.isOutOfStock).length,
            warningCount: alerts.filter(a => !a.isOutOfStock).length,
            items: alerts,
        });
    });
}
