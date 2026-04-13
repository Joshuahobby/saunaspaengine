import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security — Sauna SPA Engine",
  description:
    "Learn about the enterprise-grade security measures protecting your data on Sauna SPA Engine.",
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-[var(--border-main)] bg-[var(--bg-app)]/80 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="size-10 text-white flex items-center justify-center bg-[var(--color-primary)] rounded-xl shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl font-black">spa</span>
          </div>
          <h2 className="text-[var(--text-main)] text-lg font-black font-serif leading-tight tracking-tight italic group-hover:text-[var(--color-primary)] transition-colors">
            Sauna <span className="not-italic text-[var(--color-primary)]">SPA</span> Engine
          </h2>
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center rounded-xl h-10 px-6 bg-[var(--bg-surface-muted)] text-[var(--text-main)] text-[10px] font-black uppercase tracking-widest border border-[var(--border-main)] hover:bg-[var(--border-muted)] transition-all"
        >
          Home
        </Link>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col gap-4 mb-12">
          <span className="inline-block w-fit bg-[var(--color-primary-muted)] text-[var(--color-primary)] text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-[var(--color-primary-border)]">
            Security
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-serif">Security at Sauna SPA Engine</h1>
          <p className="text-[var(--text-muted)] text-sm">Your trust is our foundation. Here&apos;s how we protect it.</p>
        </div>

        <article className="flex flex-col gap-10 text-[var(--text-muted)] text-[15px] leading-relaxed">
          {/* Security Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SecurityCard
              icon="lock"
              title="256-bit TLS Encryption"
              description="All data transmitted between your browser and our servers is protected with industry-standard TLS 1.3 encryption, ensuring complete confidentiality."
            />
            <SecurityCard
              icon="enhanced_encryption"
              title="Bcrypt Password Hashing"
              description="User passwords are never stored in plain text. We use bcrypt with salted hashing rounds, making brute-force attacks computationally infeasible."
            />
            <SecurityCard
              icon="admin_panel_settings"
              title="Role-Based Access Control"
              description="Granular RBAC ensures employees, managers, and owners only access data relevant to their role and branch. Every API endpoint enforces session verification."
            />
            <SecurityCard
              icon="backup"
              title="Automated Backups"
              description="Your data is automatically backed up with point-in-time recovery capabilities. Our infrastructure supports instant failover across multiple availability zones."
            />
          </div>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">Infrastructure Security</h2>
            <p>Our platform is hosted on enterprise-grade cloud infrastructure with SOC 2 Type II compliance. We use containerized deployments with automatic scaling, ensuring high availability and protecting against DDoS attacks. All database connections are encrypted and routed through secure, private network tunnels.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">Authentication Security</h2>
            <p>We implement JWT-based session management with automatic token rotation every 15 minutes and a strict 60-minute inactivity timeout. Sessions are cryptographically signed with a unique server secret, preventing token forgery. All authentication attempts are rate-limited to prevent credential stuffing attacks.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">Data Protection</h2>
            <p>Business data is logically isolated at the branch level, ensuring no cross-contamination between organizations. Financial records including commission logs and settlement payouts use atomic database transactions to guarantee consistency. We conduct regular security audits and vulnerability assessments.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">Responsible Disclosure</h2>
            <p>If you discover a security vulnerability, we encourage responsible disclosure. Please report any findings to <span className="text-[var(--color-primary)] font-bold">security@saunaspa.rw</span>. We commit to acknowledging reports within 24 hours and providing updates throughout the resolution process.</p>
          </section>
        </article>

        {/* Back */}
        <div className="mt-16 pt-8 border-t border-[var(--border-main)] flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--color-primary)] text-sm font-bold hover:underline"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Home
          </Link>
          <span className="text-[var(--border-muted)]">•</span>
          <Link href="/privacy" className="text-[var(--text-muted)] text-sm hover:text-[var(--color-primary)] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-[var(--text-muted)] text-sm hover:text-[var(--color-primary)] transition-colors">
            Terms of Service
          </Link>
        </div>
      </main>
    </div>
  );
}

function SecurityCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 transition-all hover:shadow-xl hover:border-[var(--color-primary-border)]">
      <div className="size-12 rounded-xl bg-[var(--color-primary-muted)] border border-[var(--color-primary-border)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-[var(--text-main)] text-lg font-bold">{title}</h3>
        <p className="text-[var(--text-muted)] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
