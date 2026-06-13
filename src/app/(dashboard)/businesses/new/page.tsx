import AdminNewBusinessPage from "@/app/(dashboard)/admin/businesses/new/server-page";
export const dynamic = "force-dynamic";

export const metadata = {
    title: "New Business | Sauna SPA Engine",
};

export default function NewBusinessPage(props: Record<string, unknown>) {
    return <AdminNewBusinessPage {...props} />;
}
