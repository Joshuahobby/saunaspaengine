import { redirect } from "next/navigation";

export default function InventoryRedirect() {
    redirect("/operations?tab=stock");
}
