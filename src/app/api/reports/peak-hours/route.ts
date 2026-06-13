import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || !["OWNER", "ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const businessId = session.user.businessId;
        if (!businessId) {
            return NextResponse.json({ error: "Business context required" }, { status: 400 });
        }

        /**
         * Use raw SQL for efficient hour extraction and grouping.
         * Note: PostgreSQL EXTRACT(HOUR FROM ...) is highly performant.
         * Table Mapping:
         * - Business -> "corporates"
         * - Branch -> "businesses" ("corporateId" links to Business)
         * - ServiceRecord -> "service_records" ("businessId" links to Branch)
         */
        type HourRow = { hour: number; count: number };
        const results = await prisma.$queryRaw<HourRow[]>`
            SELECT
                EXTRACT(HOUR FROM sr."completedAt")::int as hour,
                COUNT(*)::int as count
            FROM "service_records" sr
            JOIN "businesses" b ON sr."businessId" = b.id
            WHERE b."corporateId" = ${businessId}
              AND sr.status = 'COMPLETED'
              AND sr."completedAt" IS NOT NULL
            GROUP BY hour
            ORDER BY hour ASC
        `;

        // Ensure all 24 hours are represented, even if count is 0
        const fullDay = Array.from({ length: 24 }, (_, i) => {
            const result = results.find(r => r.hour === i);
            return {
                hour: i,
                display: `${i % 12 || 12}${i < 12 ? ' AM' : ' PM'}`,
                count: result ? result.count : 0
            };
        });

        return NextResponse.json(fullDay);

    } catch (error) {
        console.error("Failed to fetch peak hours report:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
