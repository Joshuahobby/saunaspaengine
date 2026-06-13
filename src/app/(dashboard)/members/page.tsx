import AdminMembersPage from "@/app/(dashboard)/admin/members/server-page";
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Client Records | Sauna SPA Engine",
};

export default function MembersPage(props: Record<string, unknown>) {
    return <AdminMembersPage {...props} />;
}
