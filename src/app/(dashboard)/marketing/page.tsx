import { redirect } from "next/navigation";

export default function MarketingRedirect() {
    redirect("/growth?tab=promo");
}
