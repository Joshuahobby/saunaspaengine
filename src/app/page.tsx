import Link from "next/link";

export const metadata = {
  title: "Sauna SPA Engine — Spa & Sauna Management Platform for Rwanda",
  description:
    "Digitize your sauna and spa business with fast check-ins, QR memberships, real-time reports, and mobile-first operations. Built for Rwanda.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-[rgba(19,236,164,0.1)]">
        <div className="flex items-center gap-3">
          <div className="size-8 text-[var(--color-primary)]">
            <span className="material-symbols-outlined text-4xl">spa</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">
            Sauna SPA Engine
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-600 hover:text-[var(--color-primary)] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="hidden md:flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-[var(--color-primary)] text-[var(--color-bg-dark)] text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-[rgba(19,236,164,0.1)] text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            Built for Rwanda 🇷🇼
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
            Your Spa. <br />
            <span className="text-[var(--color-primary)]">Digitized.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            Enterprise-grade operations platform for sauna & spa businesses.
            Fast QR check-ins, real-time dashboards, and membership management —
            all from your phone.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full md:w-auto px-8 py-4 bg-[var(--color-primary)] text-[var(--color-bg-dark)] rounded-xl font-extrabold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[rgba(19,236,164,0.3)] transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">login</span>
              Sign In to Dashboard
            </Link>
            <Link
              href="/help"
              className="w-full md:w-auto px-8 py-4 border border-[var(--color-border-light)] rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">play_circle</span>
              See How It Works
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <FeaturePill icon="qr_code_scanner" label="QR Check-in" />
            <FeaturePill icon="card_membership" label="Memberships" />
            <FeaturePill icon="analytics" label="Live Reports" />
            <FeaturePill icon="smartphone" label="Mobile-First" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-400 text-xs border-t border-[var(--color-border-light)]">
        <p>© 2026 Sauna SPA Engine · Made for Rwanda 🇷🇼</p>
      </footer>
    </div>
  );
}

function FeaturePill({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl border border-[var(--color-border-light)] bg-white hover:border-[var(--color-primary)] hover:shadow-sm transition-all cursor-default">
      <span className="material-symbols-outlined text-[var(--color-primary)] text-[20px]">
        {icon}
      </span>
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}
