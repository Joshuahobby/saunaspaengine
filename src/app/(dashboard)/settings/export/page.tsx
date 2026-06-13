import { redirect } from "next/navigation";

export default function ExportRedirect() {
    redirect("/settings/records?tab=transfer");
}
