import AdminPaymentsPage from "@/app/(dashboard)/admin/payments/server-page";
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Subscription Payments | Sauna SPA Engine",
    description: "Monitor and manage all SaaS subscription payment transactions.",
};

export default function PaymentsPage(props: Record<string, unknown>) {
    return <AdminPaymentsPage {...props} />;
}
