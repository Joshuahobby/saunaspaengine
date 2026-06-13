import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSettingsPage from "@/app/(dashboard)/admin/settings/server-page";
import ExecutiveSettingsPage from "@/app/(dashboard)/executive/settings/server-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Governance Hub | Sauna SPA Engine",
    description: "Regional settings, privacy, and compliance configuration.",
};

export const dynamic = "force-dynamic";

export default async function GovernancePage() {
    redirect("/settings");
}
