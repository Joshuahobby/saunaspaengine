import { NextRequest, NextResponse } from "next/server";
import { processSubscriptionReminders } from "@/lib/reminders";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization");
        const cronSecret = process.env.CRON_SECRET;

        // Verify request is authorized (shared secret)
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const result = await processSubscriptionReminders();

        return NextResponse.json({
            message: "Subscription reminder cron completed",
            ...result
        });
    } catch (err) {
        console.error("Cron Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
