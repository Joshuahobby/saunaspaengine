import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SubscriptionsClientPage from "./client-page";

export const metadata = {
    title: "Global Subscriptions | Admin",
    description: "Manage business subscriptions and revenue.",
};

export default async function AdminSubscriptionsPage() {
    const session = await auth();

    if (!session || (session.user as any).role !== "ADMIN") {
        redirect("/login");
    }

    return <SubscriptionsClientPage />;
}
