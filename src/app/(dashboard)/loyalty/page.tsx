import { redirect } from "next/navigation";

export default function LoyaltyRedirect() {
    redirect("/growth?tab=rewards");
}
