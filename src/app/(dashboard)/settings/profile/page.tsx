import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/settings/change-password-form";

export const metadata = {
    title: "My Profile | Settings | Sauna SPA Engine"
};

export default async function ProfileSettingsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-black font-serif text-[var(--color-primary)] tracking-tight">
                My Profile.
            </h1>
            <p className="text-[var(--text-muted)] text-sm max-w-2xl leading-relaxed">
                Manage your personal account settings and security credentials. Ensure your password is secure and unique.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                {/* Account Details */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border-main)] shadow-sm">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-forest-400)] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-[var(--color-primary)]/20 mb-4">
                            {session.user.fullName?.charAt(0) || "U"}
                        </div>
                        <h2 className="text-lg font-bold text-[var(--text-main)] font-serif mb-1">
                            {session.user.fullName}
                        </h2>
                        <p className="text-sm text-[var(--text-muted)] mb-4">{session.user.email}</p>
                        
                        <div className="inline-block px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-black uppercase tracking-widest rounded-full">
                            {session.user.role}
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-[var(--bg-card)] rounded-3xl p-6 md:p-8 border border-[var(--border-main)] shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">shield_person</span>
                            <h2 className="text-xl font-bold font-serif text-[var(--text-main)]">Security & Password</h2>
                        </div>
                        
                        <ChangePasswordForm userId={session.user.id!} />
                    </div>
                </div>
            </div>
        </div>
    );
}
