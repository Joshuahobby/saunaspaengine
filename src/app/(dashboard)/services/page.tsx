import { redirect } from "next/navigation";

export default function ServicesRedirect() {
    redirect("/operations?tab=menu");
}
