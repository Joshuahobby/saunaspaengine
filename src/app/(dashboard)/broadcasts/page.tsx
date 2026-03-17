import AdminBroadcastsPage from "@/app/(dashboard)/admin/broadcasts/server-page";
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Broadcasts | Sauna SPA Engine",
};

export default function BroadcastsPage(props: Record<string, unknown>) {
    return <AdminBroadcastsPage {...props} />;
}
