import AdminBusinessesPage from "@/app/(dashboard)/admin/businesses/server-page";
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Businesses Directory | Sauna SPA Engine",
    description: "Manage registered businesses on the platform.",
};

export default function BusinessesPage(props: Record<string, unknown>) {
    return <AdminBusinessesPage {...props} />;
}
