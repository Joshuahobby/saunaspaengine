import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Sauna SPA Engine",
  description:
    "Learn how Sauna SPA Engine collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
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
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-serif">Privacy Policy</h1>
          <p className="text-[var(--text-muted)] text-sm">Last updated: March 26, 2026</p>
        </div>

        <article className="prose-legal flex flex-col gap-10 text-[var(--text-muted)] text-[15px] leading-relaxed">
          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">1. Information We Collect</h2>
            <p>When you use Sauna SPA Engine, we may collect information you provide directly, such as your name, email address, phone number, and payment information when you register or book services. We also collect usage data automatically, including IP addresses, browser type, pages visited, and interaction patterns within the platform.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">2. How We Use Your Information</h2>
            <p>We use your personal data to provide and improve our services, process transactions, communicate with you about your account, and send operational updates. For business accounts, we use aggregated analytics to generate reports on branch performance, staff scheduling, and customer metrics.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">3. Data Security</h2>
            <p>We implement industry-standard security measures including 256-bit TLS encryption for data in transit, encrypted password hashing using bcrypt, and role-based access controls. Your data is stored on secure, SOC 2 compliant cloud infrastructure with automated backups and disaster recovery procedures.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">4. Data Sharing</h2>
            <p>We do not sell your personal information. We may share data with trusted third-party service providers who assist in operating our platform (such as payment processors and email delivery services), subject to strict confidentiality agreements. We may also disclose information when required by law or to protect our legal rights.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">5. Cookies &amp; Tracking</h2>
            <p>We use essential cookies to maintain your session and preferences. Analytics cookies help us understand how you use the platform. You can manage your cookie preferences through your browser settings. Disabling essential cookies may affect the functionality of certain features.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data at any time. Business owners can export all client and operational data through the platform&apos;s admin panel. To exercise your rights, contact us at <span className="text-[var(--color-primary)] font-bold">privacy@saunaspa.rw</span>.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">7. Data Retention</h2>
            <p>We retain your personal data for as long as your account is active or as needed to provide you services. After account deletion, we may retain certain data for up to 90 days for backup purposes and as required by applicable law.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">8. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy, please contact our Data Protection Officer at <span className="text-[var(--color-primary)] font-bold">privacy@saunaspa.rw</span> or write to us at Kigali, Rwanda.</p>
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
          <Link href="/terms" className="text-[var(--text-muted)] text-sm hover:text-[var(--color-primary)] transition-colors">
            Terms of Service
          </Link>
          <Link href="/security" className="text-[var(--text-muted)] text-sm hover:text-[var(--color-primary)] transition-colors">
            Security
          </Link>
        </div>
      </main>
    </div>
  );
}
