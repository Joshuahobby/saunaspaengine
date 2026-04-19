import { prisma } from "./prisma";
import { Resend } from "resend";
import { addDays, startOfDay, endOfDay } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function processSubscriptionReminders() {
    console.log("🔔 Starting subscription reminder process...");
    
    if (!process.env.RESEND_API_KEY) {
        console.warn("⚠️ Resend API Key not found, skipping reminders.");
        return { success: false, error: "Missing API Key" };
    }

    const today = new Date();
    
    // Define reminder thresholds (days from now)
    const thresholds = [7, 3, 1];
    let totalSent = 0;

    for (const days of thresholds) {
        const targetDate = addDays(today, days);
        const start = startOfDay(targetDate);
        const end = endOfDay(targetDate);

        // Find businesses renewing on this specific day
        const targetBusinesses = await prisma.business.findMany({
            where: {
                subscriptionRenewal: {
                    gte: start,
                    lte: end,
                },
                subscriptionStatus: "ACTIVE",
                // Skip businesses that have already been reminded for THIS specific threshold today/yesterday 
                // (Idempotency check: we can use a dedicated field or just trust the cron runs once a day)
            },
            include: {
                users: {
                    where: { role: "OWNER", status: "ACTIVE" }
                },
                subscriptionPlan: true
            }
        });

        console.log(`Found ${targetBusinesses.length} businesses for the ${days}-day reminder.`);

        for (const business of targetBusinesses) {
            const owners = business.users;
            if (owners.length === 0) continue;

            const planName = business.subscriptionPlan?.name || "Active Plan";
            const renewalDateStr = business.subscriptionRenewal?.toLocaleDateString("en-RW", { 
                day: "numeric", 
                month: "long", 
                year: "numeric" 
            });

            const amount = business.subscriptionCycle === "Yearly" 
                ? business.subscriptionPlan?.priceYearly 
                : business.subscriptionPlan?.priceMonthly;

            for (const owner of owners) {
                try {
                    await resend.emails.send({
                        from: "Sauna SPA Engine <billing@resend.dev>", // Update to verified domain in prod
                        to: owner.email,
                        subject: `Reminder: Subscription Renewal for ${business.name}`,
                        html: `
                            <div style="font-family: sans-serif; color: #1a1a1a; padding: 40px; background-color: #f4f4f5; border-radius: 24px; max-width: 600px; margin: auto;">
                                <div style="text-align: center; margin-bottom: 32px;">
                                    <h1 style="color: #fbbf24; font-size: 28px; font-weight: 800; margin: 0;">Sauna SPA Engine</h1>
                                    <p style="color: #71717a; font-size: 14px; margin-top: 8px;">Subscription Management</p>
                                </div>
                                
                                <div style="background: white; padding: 32px; border-radius: 20px; border: 1px solid #e4e4e7; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                                    <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Hello ${owner.fullName},</h2>
                                    <p style="line-height: 1.6; color: #3f3f46;">
                                        Your subscription for <strong>${business.name}</strong> is scheduled to renew in <strong>${days} day${days > 1 ? 's' : ''}</strong> on <strong>${renewalDateStr}</strong>.
                                    </p>
                                    
                                    <div style="margin: 24px 0; padding: 20px; background: #fffcf2; border: 1px dashed #fbbf24; border-radius: 12px;">
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                            <span style="color: #71717a; font-size: 13px; font-weight: 600;">Plan:</span>
                                            <span style="font-weight: 700;">${planName}</span>
                                        </div>
                                        <div style="display: flex; justify-content: space-between;">
                                            <span style="color: #71717a; font-size: 13px; font-weight: 600;">Renewal Amount:</span>
                                            <span style="font-weight: 800; color: #fbbf24;">${amount?.toLocaleString()} RWF</span>
                                        </div>
                                    </div>

                                    <p style="line-height: 1.6; color: #3f3f46; font-size: 14px;">
                                        Please ensure your pawaPay linked wallet has sufficient funds to avoid any service interruption. 
                                        You can manage your plan or update billing details at any time from your dashboard.
                                    </p>

                                    <div style="text-align: center; margin-top: 32px;">
                                        <a href="${process.env.NEXTAUTH_URL}/dashboard/settings" 
                                           style="display: inline-block; background: #1a1a1a; color: white; padding: 14px 28px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 14px;">
                                           Manage Subscription
                                        </a>
                                    </div>
                                </div>

                                <div style="text-align: center; margin-top: 32px;">
                                    <p style="font-size: 12px; color: #71717a;">
                                        &copy; ${new Date().getFullYear()} Sauna SPA Engine. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        `,
                    });
                    totalSent++;
                } catch (err) {
                    console.error(`Failed to send reminder to ${owner.email}:`, err);
                }
            }
        }
    }

    return { success: true, totalSent };
}
