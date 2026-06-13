import AdminHealthPage from "@/app/(dashboard)/admin/health/server-page";
export const dynamic = "force-dynamic";

export const metadata = {
    title: "System Health | Sauna SPA Engine",
};

export default function MonitoringPage(props: Record<string, unknown>) {
    return <AdminHealthPage {...props} />;
}
