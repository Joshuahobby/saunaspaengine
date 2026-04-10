import { redirect } from "next/navigation";

export default function QRSecurityRedirect() {
    redirect("/settings/compliance");
}
