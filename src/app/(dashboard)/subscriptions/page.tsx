import AdminSubscriptionsPage from "@/app/(dashboard)/admin/subscriptions/server-page";
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Subscriptions | Sauna SPA Engine",
};

export default function SubscriptionsPage(props: Record<string, unknown>) {
    return <AdminSubscriptionsPage {...props} />;
}
