import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LegalTemplatesClientPage from "./client-page";

export const dynamic = "force-dynamic";

export default async function AdminLegalPage() {
    const session = await auth();

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
        redirect("/login");
    }

    return <LegalTemplatesClientPage />;
}
