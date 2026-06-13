import AdminPlatformSubscriptionsPage from "@/app/(dashboard)/admin/subscriptions/platform/server-page";
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Platform Subscriptions | Sauna SPA Engine",
};

export default function PlatformSubscriptionsPage(props: Record<string, unknown>) {
    return <AdminPlatformSubscriptionsPage {...props} />;
}
