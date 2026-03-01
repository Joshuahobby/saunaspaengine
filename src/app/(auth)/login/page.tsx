import LoginForm from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="layout-container flex h-full grow flex-col">
            {/* Navigation Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#11d4c4]/10 px-6 md:px-10 py-4 bg-[#f6f8f7] dark:bg-[#10221c]">
                <div className="flex items-center gap-3">
                    <div className="size-8 text-[#11d4c4] flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl leading-none">spa</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] font-serif">
                        Sauna SPA Engine
                    </h2>
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/help"
                            className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-[#11d4c4] transition-colors font-display"
                        >
                            Help Center
                        </Link>
                        <Link
                            href="/security"
                            className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-[#11d4c4] transition-colors font-display"
                        >
                            Security Policy
                        </Link>
                    </div>
                    <button className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#11d4c4] text-[#10221c] text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity font-display">
                        <span className="truncate">Contact Support</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-[480px] flex flex-col gap-6">
                    {/* Branding & Hero Image Card */}
                    <div className="rounded-xl overflow-hidden shadow-sm border border-[#11d4c4]/10">
                        <div
                            className="bg-cover bg-center flex flex-col justify-end min-h-[180px] relative"
                            style={{
                                backgroundImage: `linear-gradient(0deg, rgba(16, 34, 28, 0.8) 0%, rgba(16, 34, 28, 0.2) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB_gNoR6snH9i9pBWO49YSPbEyj0SEa8-bEaOwbzuk7NCYlBAzqyA3L48hGeNnsnP1LpceIU0d_sE43ndkTrg1VXQupm5-Nu3oOLQDlReiGn17m9urIUmFDeZQOQiIx_jHn5odUGGy_A-1az_ZJTxAha30zJQ2rMwVhdqyJAkiG17lhxDM5DU_UrVZP4oasQnpg82Sih3FduwAsVNy7RPgQsSE3LZP9f4qrKXcZAKL7FZW5DRHfQdbmVm5TKrTYuSdJfxNRJLndo3Tp")`
                            }}
                        >
                            <div className="p-6">
                                <span className="bg-[#11d4c4] text-[#10221c] text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded mb-2 inline-block font-display">
                                    Staff Portal
                                </span>
                                <h1 className="text-white tracking-tight text-3xl font-extrabold leading-tight font-serif">
                                    Secure Authentication
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Login Form Component */}
                    <LoginForm />

                    {/* Footer Links */}
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-slate-400 text-xs font-medium font-display">
                        <Link href="/privacy" className="hover:text-[#11d4c4] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-[#11d4c4] transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-[#11d4c4] transition-colors">Cookie Settings</Link>
                        <span className="hidden md:inline text-[#11d4c4]/20">•</span>
                        <p>© 2024 Sauna SPA Engine</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
