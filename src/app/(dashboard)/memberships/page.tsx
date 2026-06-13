import { redirect } from "next/navigation";

export default function MembershipsRedirect() {
    redirect("/growth?tab=passes");
}
