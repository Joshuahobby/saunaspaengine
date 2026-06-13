import AdminBusinessDetailsPage from "@/app/(dashboard)/admin/businesses/[id]/server-page";
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Business Details | Sauna SPA Engine",
};

export default function BusinessDetailsPage(props: { params: Promise<{ id: string }> }) {
    return <AdminBusinessDetailsPage {...props} />;
}
