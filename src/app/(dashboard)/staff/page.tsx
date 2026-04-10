import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

// Server-side Tab Components
import TeamDirectoryTab from "./team-directory-tab";
import LeaderboardTab from "./leaderboard-tab";
import AnalyticsTab from "./analytics-tab";

const TABS = [
    { id: "directory", label: "Our People", icon: "badge" },
    { id: "performance", label: "Top Talent", icon: "workspace_premium" },
    { id: "growth", label: "Team Growth", icon: "query_stats" },
];

export const metadata = {
    title: "Team Management | Sauna SPA Engine",
};

export default async function StaffHubPage(props: {
    searchParams: Promise<{ tab?: string; branchId?: string; q?: string; status?: string }>;
}) {
    const searchParams = await props.searchParams;
    const session = await auth();
    if (!session?.user) redirect("/login");

    const activeTab = searchParams.tab || "directory";

    return (
        <main className="flex-1 w-full max-w-7xl mx-auto space-y-12 pb-20 no-scrollbar animate-fade-in">
            {/* Business-Centric Header */}
            <header className="flex flex-col gap-8 border-b border-[var(--border-muted)] pb-10">
                <div className="flex items-center gap-4">
                    <div className="size-14 rounded-[1.5rem] bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shadow-inner">
                        <span className="material-symbols-outlined text-4xl font-black">groups_3</span>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-[var(--text-main)] tracking-tight">
                            Our <span className="text-[var(--color-primary)]">Team.</span>
                        </h1>
                        <p className="text-[var(--text-muted)] font-black text-sm leading-relaxed opacity-60">
                            Nurturing the professionals behind your brand. Manage your people and progress.
                        </p>
                    </div>
                </div>
                
                {/* Visual Tab Switcher - Scrollable */}
                <div className="flex w-full overflow-x-auto no-scrollbar pb-2">
                    <nav className="flex items-center p-2 bg-[var(--bg-surface-muted)]/50 backdrop-blur-md rounded-[2rem] border border-[var(--border-muted)] gap-1 w-fit whitespace-nowrap">
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <Link
                                    key={tab.id}
                                    href={`/staff?tab=${tab.id}`}
                                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                        isActive
                                            ? "bg-[var(--text-main)] text-[var(--bg-app)] shadow-xl scale-105"
                                            : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                                    {tab.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            {/* Hub Content */}
            <div className="min-h-[600px] relative">
                {activeTab === "directory" && <TeamDirectoryTab searchParams={props.searchParams} />}
                {activeTab === "performance" && <LeaderboardTab />}
                {activeTab === "growth" && <AnalyticsTab />}
            </div>
        </main>
    );
}
