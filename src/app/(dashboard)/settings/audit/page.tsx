import { redirect } from "next/navigation";

export default function AuditRedirect() {
    redirect("/settings/records?tab=audit");
}
