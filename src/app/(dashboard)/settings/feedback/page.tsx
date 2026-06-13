import { redirect } from "next/navigation";

export default function FeedbackRedirect() {
    redirect("/settings/operations?tab=feedback");
}
