import { redirect } from "next/navigation";

export default function BusinessHoursRedirect() {
    redirect("/settings/operations?tab=hours");
}
