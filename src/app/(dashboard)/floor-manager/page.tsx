import { redirect } from "next/navigation";

export default function FloorManagerRedirect() {
    redirect("/operations?tab=map");
}
