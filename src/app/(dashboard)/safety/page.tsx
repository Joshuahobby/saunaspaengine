import { redirect } from "next/navigation";

export default function SafetyRedirect() {
    redirect("/operations?tab=safety");
}
