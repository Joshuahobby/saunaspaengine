import { redirect } from "next/navigation";

export default function ReferralsRedirect() {
    redirect("/growth?tab=network");
}
