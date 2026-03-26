import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Sauna SPA Engine",
  description:
    "Read the terms and conditions governing your use of the Sauna SPA Engine platform.",
};

export default function TermsPage() {
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
          <h1 className="text-4xl md:text-5xl font-black font-serif">Terms of Service</h1>
          <p className="text-[var(--text-muted)] text-sm">Last updated: March 26, 2026</p>
        </div>

        <article className="prose-legal flex flex-col gap-10 text-[var(--text-muted)] text-[15px] leading-relaxed">
          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using the Sauna SPA Engine platform (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you are using the Service on behalf of a business, you represent that you have the authority to bind that entity to these terms. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">2. Description of Service</h2>
            <p>Sauna SPA Engine provides a cloud-based management platform for wellness businesses including spas, saunas, and massage centers. The Service includes tools for client check-in management, staff scheduling, commission tracking, QR code verification, multi-branch administration, and business analytics reporting.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information during registration. Notify us immediately of any unauthorized use. We reserve the right to suspend accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">4. Acceptable Use</h2>
            <p>You agree not to misuse the Service. Prohibited activities include: attempting to gain unauthorized access to other user accounts, interfering with the Service&apos;s infrastructure, using the platform for illegal activities, uploading malicious content, or reverse-engineering any part of the platform.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">5. Payment Terms</h2>
            <p>Paid subscriptions are billed in advance on a monthly or annual basis. All fees are non-refundable except where required by law. We reserve the right to change pricing with 30 days&apos; written notice. Failure to pay may result in account suspension or termination.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">6. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are owned by Sauna SPA Engine and are protected by international copyright, trademark, and other intellectual property laws. You retain ownership of any data you input into the platform.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Sauna SPA Engine shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">8. Termination</h2>
            <p>Either party may terminate the agreement at any time. Upon termination, your right to access the Service ceases immediately. We will retain your data for 30 days following termination, during which you may request a data export. After this period, data may be permanently deleted.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">9. Governing Law</h2>
            <p>These Terms are governed by the laws of the Republic of Rwanda. Any disputes arising from these terms shall be resolved through the courts of Kigali, Rwanda.</p>
          </section>

          <section>
            <h2 className="text-[var(--text-main)] text-xl font-bold font-serif mb-3">10. Contact</h2>
            <p>For questions about these Terms of Service, contact us at <span className="text-[var(--color-primary)] font-bold">legal@saunaspa.com</span> or write to our offices in Kigali, Rwanda.</p>
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
          <Link href="/security" className="text-[var(--text-muted)] text-sm hover:text-[var(--color-primary)] transition-colors">
            Security
          </Link>
        </div>
      </main>
    </div>
  );
}
