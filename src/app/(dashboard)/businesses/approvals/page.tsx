import AdminBusinessesApprovalsPage from "@/app/(dashboard)/admin/businesses/approvals/server-page";
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Business Approvals | Sauna SPA Engine",
};

export default function BusinessesApprovalsPage(props: Record<string, unknown>) {
    return <AdminBusinessesApprovalsPage {...props} />;
}
