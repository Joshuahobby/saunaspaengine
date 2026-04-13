import Link from "next/link";
import { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { LiveCheckins } from "@/components/landing/LiveCheckins";
import { NewsletterForm } from "@/components/landing/NewsletterForm";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { auth } from "@/lib/auth";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sauna SPA Engine — Spa & Sauna Management Platform for Rwanda",
  description:
    "Rwanda's #1 management platform for spas and saunas. Fast QR check-ins, Mobile Money payments, real-time reports, and mobile-first operations.",
  openGraph: {
    title: "Sauna SPA Engine — Spa & Sauna Management for Rwanda",
    description: "Rwanda's #1 management platform for spas and saunas. Digitize operations, delight your clients, grow your revenue.",
    url: "https://saunaspa.rw",
    siteName: "Sauna SPA Engine",
    images: [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD377Rw1J3jJ50DFdv7DI9VFckbkX50HKLF-0MQoJ6UG7ZM7QXD5QnskGKx85GT7bGeapAnHwaf71_gIMa8Bn1IKNC9fmzjuWNDeiAOSqrfbQz-ihSJCxIBr1vXCAFeQ5_K_UuDdV43xr0rXle25Eyed_UiZBa4xqMi2gpUSnL6PGmkEGPq1aM2yw7UoZVN9BqvRbnVM0GFW4wzaEQms1Ok-WLoaHi6O6u2PFUCwzG_GcllwK7ks9mQhEtTATcLd2-kjcqhRPM2-B8S",
        width: 1200,
        height: 630,
        alt: "Sauna SPA Engine Hero Image",
      },
    ],
    locale: "en_RW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sauna SPA Engine — Rwanda's #1 Spa Management Platform",
    description: "Digitize your sauna and spa with fast QR check-ins, Mobile Money payments, and real-time reports.",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuD377Rw1J3jJ50DFdv7DI9VFckbkX50HKLF-0MQoJ6UG7ZM7QXD5QnskGKx85GT7bGeapAnHwaf71_gIMa8Bn1IKNC9fmzjuWNDeiAOSqrfbQz-ihSJCxIBr1vXCAFeQ5_K_UuDdV43xr0rXle25Eyed_UiZBa4xqMi2gpUSnL6PGmkEGPq1aM2yw7UoZVN9BqvRbnVM0GFW4wzaEQms1Ok-WLoaHi6O6u2PFUCwzG_GcllwK7ks9mQhEtTATcLd2-kjcqhRPM2-B8S"],
  },
};
export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-main)] selection:bg-[var(--color-primary)] selection:text-white overflow-x-hidden">
      <Header isLoggedIn={isLoggedIn} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 md:px-20 lg:px-40 py-12 md:py-24">
          <div className="max-w-7xl mx-auto flex flex-col gap-12 lg:flex-row lg:items-center">
            <ScrollReveal direction="right" className="flex flex-col gap-8 lg:w-1/2">
              <div className="flex flex-col gap-6">
                <span className="inline-block w-fit bg-[var(--color-primary-muted)] text-[var(--color-primary)] text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-sm border border-[var(--color-primary-border)]">
                  Built for Rwanda 🇷🇼
                </span>
                <h1 className="text-[var(--text-main)] text-6xl md:text-8xl font-black font-serif leading-[1.05] tracking-tight">
                  Crafting <br /><span className="text-[var(--color-primary)] italic">Pure Serenity</span>
                </h1>
                <p className="text-[var(--text-muted)] text-xl md:text-2xl font-medium leading-relaxed max-w-[580px]">
                  Rwanda&apos;s #1 management platform for spas and saunas. Digitize operations, delight your clients, grow your revenue.
                </p>
              </div>
              <div className="flex flex-wrap gap-6">
                <Link
                  href={isLoggedIn ? "/dashboard" : "/login"}
                  aria-label={isLoggedIn ? "Go to Dashboard" : "Start Your Journey"}
                  className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-2xl h-16 px-10 bg-[var(--color-primary)] text-white text-sm font-black uppercase tracking-widest shadow-2xl shadow-[var(--color-primary)]/30 transition-all hover:scale-105 hover:bg-[var(--color-primary-hover)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)] selection:bg-white selection:text-[var(--color-primary)]"
                >
                  {isLoggedIn ? "Go to Dashboard" : "Start Your Journey"}
                </Link>
                <Link
                  href="#how-it-works"
                  aria-label="See how it works"
                  className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-2xl h-16 px-10 bg-[var(--bg-surface)] text-[var(--text-main)] text-sm font-black uppercase tracking-widest border border-[var(--border-main)] transition-all hover:bg-[var(--bg-surface-muted)] shadow-lg shadow-black/5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--border-main)]"
                >
                  How It Works
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.2} className="lg:w-1/2 relative">
              <div className="w-full aspect-[4/3] bg-[var(--bg-surface-muted)] rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-main)] relative">
                <Image
                  alt="Luxury Spa Interior showing a serene sauna room"
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD377Rw1J3jJ50DFdv7DI9VFckbkX50HKLF-0MQoJ6UG7ZM7QXD5QnskGKx85GT7bGeapAnHwaf71_gIMa8Bn1IKNC9fmzjuWNDeiAOSqrfbQz-ihSJCxIBr1vXCAFeQ5_K_UuDdV43xr0rXle25Eyed_UiZBa4xqMi2gpUSnL6PGmkEGPq1aM2yw7UoZVN9BqvRbnVM0GFW4wzaEQms1Ok-WLoaHi6O6u2PFUCwzG_GcllwK7ks9mQhEtTATcLd2-kjcqhRPM2-B8S"
                  width={800}
                  height={600}
                  priority
                />
              </div>
              <LiveCheckins />
            </ScrollReveal>
          </div>
        </section>

        {/* Platform Stats Bar — replaces fake brand logos */}
        <section className="bg-[var(--bg-surface-muted)]/50 border-y border-[var(--border-main)] py-12">
          <ScrollReveal direction="up" duration={0.8}>
            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 items-center text-center">
              {[
                { value: "< 3s", label: "Average Check-in Time", icon: "speed" },
                { value: "24/7", label: "Real-time Dashboard", icon: "monitoring" },
                { value: "100%", label: "Mobile Friendly", icon: "smartphone" },
                { value: "RWF", label: "Local Payment Support", icon: "payments" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-2 group">
                  <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl mb-1 group-hover:scale-110 transition-transform">{stat.icon}</span>
                  <span className="text-3xl font-black text-[var(--color-primary)]">{stat.value}</span>
                  <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 md:px-20 lg:px-40 py-24">
          <div className="max-w-7xl mx-auto flex flex-col gap-16">
            <ScrollReveal direction="up" className="flex flex-col gap-4 text-center items-center">
              <h2 className="text-[var(--text-main)] text-4xl md:text-6xl font-black font-serif leading-tight max-w-[800px]">
                Powerful Features for <span className="text-[var(--color-primary)]">Modern Wellness</span>
              </h2>
              <p className="text-[var(--text-muted)] text-lg md:text-xl font-normal leading-normal max-w-[720px]">
                Everything you need to run your spa enterprise efficiently in one integrated platform.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollReveal direction="up" delay={0.1}>
                <FeatureCard
                  icon="qr_code_scanner"
                  title="Instant QR Validation"
                  description="Speed up check-ins with secure, instant QR code scanning for memberships and day passes. No more front desk queues."
                />
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.2}>
                <FeatureCard
                  icon="payments"
                  title="Mobile Money Payments"
                  description="Accept RWF via MTN MoMo and Airtel Money. Instant, cashless transactions for walk-ins, day passes, and membership renewals."
                />
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.3}>
                <FeatureCard
                  icon="bar_chart_4_bars"
                  title="Real-time Analytics"
                  description="Gain deep insights with live analytics on occupancy, revenue, and staff performance across all your departments."
                />
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.4}>
                <FeatureCard
                  icon="account_tree"
                  title="Multi-Branch Sync"
                  description="Manage multiple locations from a single dashboard with centralized control and synchronized customer profiles."
                />
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.5}>
                <FeatureCard
                  icon="calendar_month"
                  title="Staff & Scheduling"
                  description="Create shift schedules, track attendance, and manage your team&apos;s performance — all from one centralized portal."
                />
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.6}>
                <FeatureCard
                  icon="loyalty"
                  title="Membership CRM"
                  description="Track client memberships, visit history, and preferences. Automate renewal reminders and build lasting relationships."
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* How It Works Section — replaces fake testimonials */}
        <section id="how-it-works" className="bg-[var(--bg-surface-muted)]/30 border-t border-[var(--border-main)] py-24 px-6 md:px-20 lg:px-40 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col gap-16">
            <ScrollReveal direction="up" className="flex flex-col gap-4 text-center items-center">
              <span className="inline-block w-fit bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-sm border border-[var(--color-primary-border)] mb-2">
                Get Started in Minutes
              </span>
              <h3 className="text-[var(--text-main)] text-4xl md:text-5xl font-black font-serif">How It Works</h3>
              <p className="text-[var(--text-muted)] text-lg max-w-[600px]">Go live in under 10 minutes. No special hardware required.</p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-[4.5rem] left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent"></div>

              <ScrollReveal direction="up" delay={0.1}>
                <HowItWorksStep
                  number="01"
                  icon="add_business"
                  title="Register Your Branch"
                  description="Sign up and configure your spa in minutes. Add your services, pricing in RWF, and operating hours."
                />
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.25}>
                <HowItWorksStep
                  number="02"
                  icon="group_add"
                  title="Add Your Team"
                  description="Invite staff members, assign roles and permissions, and configure shift schedules. Everyone gets their own login."
                />
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.4}>
                <HowItWorksStep
                  number="03"
                  icon="qr_code_2"
                  title="Go Live"
                  description="Start checking in clients with QR codes, accept Mobile Money payments, and track revenue in real-time."
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="bg-[var(--bg-surface-muted)]/50 border-t border-[var(--border-main)] py-24 px-6 md:px-20 lg:px-40">
          <div className="max-w-7xl mx-auto flex flex-col gap-16">
            <ScrollReveal direction="up" className="text-center flex flex-col gap-4">
              <h2 className="text-[var(--text-main)] text-4xl md:text-6xl font-black font-serif">Simple, Transparent Pricing</h2>
              <p className="text-[var(--text-muted)] text-lg md:text-xl">Choose the perfect plan for your branch size. All prices in RWF.</p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-8">
              {/* Basic */}
              <ScrollReveal direction="up" delay={0.1}>
                <div className="h-full glass-card p-8 flex flex-col gap-8 shadow-none hover:shadow-xl hover:shadow-[var(--color-primary)]/5 border border-[var(--border-main)]">
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[var(--color-primary)] font-bold uppercase tracking-widest text-sm">Starter</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[var(--text-main)]">50,000</span>
                      <span className="text-[var(--text-muted)] text-sm font-medium">RWF/mo</span>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm">For single-location boutique spas.</p>
                  </div>
                  <ul className="flex flex-col gap-4 border-t border-[var(--border-muted)] pt-6">
                    <PricingInclusion text="Up to 500 Check-ins/mo" />
                    <PricingInclusion text="QR Code Scanner" />
                    <PricingInclusion text="Mobile Money Payments" />
                    <PricingInclusion text="Email Support" />
                  </ul>
                  <Link href="/login" aria-label="Start Starter Plan" className="mt-auto w-full py-4 rounded-xl border border-[var(--color-primary-border)] hover:border-[var(--color-primary)] text-[var(--text-main)] font-bold hover:bg-[var(--color-primary)] hover:text-white transition-all text-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]">Get Started</Link>
                </div>
              </ScrollReveal>

              {/* Pro */}
              <ScrollReveal direction="up" delay={0.2} className="relative z-10">
                <div className="h-full bg-[var(--color-primary)] rounded-3xl p-8 border border-[var(--color-primary-border)] flex flex-col gap-8 transform lg:scale-105 shadow-2xl relative">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[var(--text-main)] text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-lg">Most Popular</div>
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[var(--bg-app)] opacity-90 font-bold uppercase tracking-widest text-sm">Pro</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">150,000</span>
                      <span className="text-white/80 text-sm font-medium">RWF/mo</span>
                    </div>
                    <p className="text-white/80 text-sm">For growing wellness centers.</p>
                  </div>
                  <ul className="flex flex-col gap-4 border-t border-white/10 pt-6">
                    <PricingInclusion text="Unlimited Check-ins" isDark />
                    <PricingInclusion text="Advanced Analytics" isDark />
                    <PricingInclusion text="Up to 3 Branches" isDark />
                    <PricingInclusion text="Staff Scheduling" isDark />
                    <PricingInclusion text="Priority WhatsApp Support" isDark />
                  </ul>
                  <Link href="/login" aria-label="Go Pro Plan" className="mt-auto w-full py-4 rounded-xl bg-white text-[var(--color-primary)] font-black shadow-lg shadow-black/20 hover:opacity-90 transition-all text-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white">Go Pro</Link>
                </div>
              </ScrollReveal>

              {/* Enterprise */}
              <ScrollReveal direction="up" delay={0.3}>
                <div className="h-full glass-card p-8 flex flex-col gap-8 shadow-none hover:shadow-xl hover:shadow-[var(--color-primary)]/5 border border-[var(--border-main)]">
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-sm">Enterprise</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-[var(--text-main)]">Custom</span>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm">For businesses with 4+ branches or custom needs.</p>
                  </div>
                  <ul className="flex flex-col gap-4 border-t border-[var(--border-muted)] pt-6">
                    <PricingInclusion text="White-labeled Platform" />
                    <PricingInclusion text="Custom API Integration" />
                    <PricingInclusion text="Dedicated Account Manager" />
                    <PricingInclusion text="On-site Training" />
                  </ul>
                  <Link href="/help" aria-label="Contact Sales for Enterprise Plan" className="mt-auto w-full py-4 rounded-xl border border-[var(--text-muted)] text-[var(--text-main)] font-bold hover:bg-[var(--text-main)] hover:text-[var(--bg-app)] transition-colors text-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--text-main)]">Contact Sales</Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto flex flex-col gap-16">
            <ScrollReveal direction="up" className="text-center flex flex-col gap-4">
              <h2 className="text-[var(--text-main)] text-4xl md:text-5xl font-black font-serif">Frequently Asked Questions</h2>
              <p className="text-[var(--text-muted)] text-lg">Everything you need to know about adopting our platform.</p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2} duration={0.6}>
              <FaqAccordion />
            </ScrollReveal>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 px-6 border-t border-[var(--border-main)]">
          <ScrollReveal direction="up" className="max-w-5xl mx-auto bg-[#15241f] rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/30 rounded-full -mr-32 -mt-32 blur-3xl shadow-[0_0_100px_var(--color-primary)]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="flex flex-col gap-4 md:w-1/2">
                <h2 className="text-white text-4xl font-black font-serif leading-tight">Stay updated with Spa Insights</h2>
                <p className="text-white/80 text-lg">Join Rwanda&apos;s growing community of spa professionals receiving our weekly operations newsletter.</p>
              </div>
              <NewsletterForm />
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* Footer */}
      <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-main)] pt-20 pb-10 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 text-[var(--color-primary)]">
              <span className="material-symbols-outlined text-3xl">spa</span>
              <span className="text-xl font-bold font-serif tracking-tight text-[var(--text-main)]">Sauna SPA Engine</span>
            </div>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xs">
              The smart operations engine for modern wellness brands in Rwanda. Streamline check-ins, accept Mobile Money, and grow your revenue.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon="mail" ariaLabel="Email Us" href="mailto:hello@saunaspa.rw" />
              <SocialIcon icon="call" ariaLabel="Call Us" href="tel:+250793895236" />
              <SocialIcon icon="chat" ariaLabel="WhatsApp" href="https://wa.me/250793895236" />
            </div>
          </div>
          <div>
            <h5 className="font-bold text-[var(--text-main)] mb-6">Platform</h5>
            <FooterLinks links={["Demo Dashboard", "Pricing", "Case Studies", "Changelog"]} hrefs={["/demo", "/pricing", "/case-studies", "/changelog"]} />
          </div>
          <div>
            <h5 className="font-bold text-[var(--text-main)] mb-6">Company</h5>
            <FooterLinks links={["Contact Us", "Privacy Policy", "Terms of Service", "Security"]} hrefs={["/contact", "/privacy", "/terms", "/security"]} />
          </div>
          <div>
            <h5 className="font-bold text-[var(--text-main)] mb-6">Support</h5>
            <FooterLinks links={["Help Center", "Developer Docs", "API Status", "Release Notes"]} hrefs={["/support", "/developer", "/status", "/changelog"]} />
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-[var(--border-main)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--text-muted)] opacity-80 text-xs">© 2026 Sauna SPA Engine · Made for Rwanda 🇷🇼</p>
          <div className="flex gap-6 text-xs text-[var(--text-muted)] opacity-80">
            <Link href="/terms" className="hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none">Terms</Link>
            <Link href="/privacy" className="hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none">Privacy</Link>
            <Link href="/security" className="hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="group h-full flex flex-col gap-6 rounded-3xl border border-[var(--border-main)] bg-[var(--bg-surface)] p-8 transition-all hover:shadow-2xl hover:-translate-y-2 hover:border-[var(--color-primary-border)]">
      <div className="size-14 rounded-xl bg-[var(--color-primary-muted)] border border-[var(--color-primary-border)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
        <span aria-hidden="true" className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-[var(--text-main)] text-2xl font-bold leading-tight font-serif">{title}</h3>
        <p className="text-[var(--text-muted)] text-base font-normal leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function HowItWorksStep({ number, icon, title, description }: { number: string; icon: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-5 relative">
      <div className="size-20 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30 relative z-10 border-4 border-[var(--bg-app)]">
        <span className="material-symbols-outlined text-4xl">{icon}</span>
      </div>
      <span className="text-[var(--color-primary)] text-xs font-black uppercase tracking-[0.3em]">Step {number}</span>
      <h4 className="text-[var(--text-main)] text-xl font-bold font-serif">{title}</h4>
      <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xs">{description}</p>
    </div>
  );
}

function PricingInclusion({ text, isDark = false }: { text: string; isDark?: boolean }) {
  return (
    <li className={`flex items-center gap-3 ${isDark ? "text-white/90" : "text-[var(--text-muted)]"}`}>
      <span aria-hidden="true" className={`material-symbols-outlined ${isDark ? "text-white" : "text-[var(--color-primary)]"}`}>check_circle</span>
      <span className="text-sm font-medium">{text}</span>
    </li>
  );
}

function SocialIcon({ icon, ariaLabel, href }: { icon: string; ariaLabel?: string; href?: string }) {
  return (
    <a
      aria-label={ariaLabel || `Social Link: ${icon}`}
      className="size-10 rounded-full bg-[var(--bg-surface-muted)] border border-[var(--border-main)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)] focus-visible:outline-none"
      href={href || "#"}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      <span aria-hidden="true" className="material-symbols-outlined text-[20px]">{icon}</span>
    </a>
  );
}

function FooterLinks({ links, hrefs }: { links: string[]; hrefs?: string[] }) {
  return (
    <ul className="flex flex-col gap-4 text-sm text-[var(--text-muted)]">
      {links.map((link, i) => (
        <li key={link}>
          <Link
            className="hover:text-[var(--color-primary)] transition-colors focus-visible:ring-2 focus-visible:outline-none rounded"
            href={hrefs?.[i] || "#"}
          >
            {link}
          </Link>
        </li>
      ))}
    </ul>
  );
}
