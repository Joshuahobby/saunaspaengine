import AdminAnalyticsPage from "@/app/(dashboard)/admin/analytics/server-page";
import ExecutiveAnalyticsPage from "@/app/(dashboard)/executive/analytics/server-page";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Intelligence Hub | Sauna SPA",
};

export default async function AnalyticsPage(props: any) {
    const session = await auth();
    
    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role === "ADMIN") {
        return <AdminAnalyticsPage {...props} />;
    }

    if (session.user.role === "OWNER") {
        return <ExecutiveAnalyticsPage {...props} />;
    }

    // Managers/Employees can be redirected to their specific reports if needed, 
    // but for now we'll stick to the core two roles for this hub.
    redirect("/dashboard");
}
