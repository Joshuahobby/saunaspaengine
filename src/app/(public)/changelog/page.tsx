import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ChangelogContent } from "@/components/changelog/ChangelogContent";

export default function ChangelogPage() {
    return (
        <PublicLayout>
            <main className="flex-1">
                <section className="py-16 lg:py-20 bg-gradient-to-br from-[var(--bg-app)] to-[var(--color-primary)]/5">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <span className="material-symbols-outlined text-[var(--color-primary)] text-5xl mb-4">update</span>
                        <h1 className="text-4xl font-black tracking-tight mb-4">Release Notes &amp; Changelog</h1>
                        <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">Stay up to date with the latest features, improvements, and bug fixes.</p>
                    </div>
                </section>
                
                {/* Main Content (Client Island) */}
                <ChangelogContent />
            </main>
        </PublicLayout>
    );
}
