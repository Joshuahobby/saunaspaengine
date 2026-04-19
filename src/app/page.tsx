import Link from "next/link";
import { Metadata } from "next";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { LiveCheckins } from "@/components/landing/LiveCheckins";
import { NewsletterForm } from "@/components/landing/NewsletterForm";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { PublicLayout } from "@/components/layout/PublicLayout";
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
    <PublicLayout>
        {/* Hero Section */}
        <section className="px-6 md:px-20 lg:px-40 py-12 md:py-24">
          <div className="max-w-7xl mx-auto flex flex-col gap-12 lg:flex-row lg:items-center">
            <ScrollReveal direction="right" className="flex flex-col gap-8 lg:w-1/2">
              <div className="flex flex-col gap-6">
                <ScrollReveal direction="up" delay={0.1} duration={0.6}>
                  <span className="inline-block w-fit bg-[var(--color-primary-muted)] text-[var(--color-primary)] text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-sm border border-[var(--color-primary-border)]">
                    Built for Rwanda 🇷🇼
                  </span>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={0.2} duration={0.8}>
                  <h1 className="text-[var(--text-main)] text-6xl md:text-8xl font-black font-serif leading-[1.05] tracking-tight">
                    Crafting <br /><span className="text-[var(--color-primary)] italic">Pure Serenity</span>
                  </h1>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={0.3} duration={1}>
                  <p className="text-[var(--text-muted)] text-xl md:text-2xl font-medium leading-relaxed max-w-[580px]">
                    Rwanda&apos;s #1 management platform for spas and saunas. Digitize operations, delight your clients, grow your revenue.
                  </p>
                </ScrollReveal>
              </div>
              <ScrollReveal direction="up" delay={0.4} duration={0.8} className="flex flex-wrap gap-6">
                <Link
                  href={isLoggedIn ? "/dashboard" : "/signup"}
                  aria-label={isLoggedIn ? "Go to Dashboard" : "Register Spa"}
                  className="flex min-w-[220px] cursor-pointer items-center justify-center rounded-2xl h-16 px-10 bg-[var(--color-primary)] text-white text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-[var(--color-primary)]/30 transition-all hover:scale-[1.05] hover:bg-[var(--color-primary-hover)] active:scale-[0.98] group"
                >
                  <span className="material-symbols-outlined mr-3 group-hover:rotate-12 transition-transform">{isLoggedIn ? "dashboard" : "rocket_launch"}</span>
                  {isLoggedIn ? "Go to Dashboard" : "Register Your Spa"}
                </Link>
                <Link
                  href="#how-it-works"
                  aria-label="See how it works"
                  className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-2xl h-16 px-10 bg-[var(--bg-surface-muted)] text-[var(--text-main)] text-sm font-black uppercase tracking-[0.2em] border border-[var(--border-main)] transition-all hover:bg-[var(--bg-app)] hover:border-[var(--color-primary)]/30 shadow-lg shadow-black/5 active:scale-[0.98] group"
                >
                  <span className="material-symbols-outlined mr-3 group-hover:translate-y-1 transition-transform">keyboard_double_arrow_down</span>
                  How It Works
                </Link>
              </ScrollReveal>
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
              {/* Free Forever */}
              <ScrollReveal direction="up" delay={0.1}>
                <div className="h-full glass-card p-10 flex flex-col gap-8 shadow-sm hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 border border-[var(--border-main)] relative overflow-hidden group transition-all duration-500 rounded-[2.5rem]">
                  <div className="flex flex-col gap-2 relative z-10">
                    <h4 className="text-[var(--color-primary)] font-black uppercase tracking-[0.2em] text-xs">Free Forever</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-[var(--text-main)] italic">0</span>
                      <span className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em]">RWF<span className="opacity-50">/mo</span></span>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm font-medium">For solo practitioners starting out.</p>
                  </div>
                  <ul className="flex flex-col gap-5 border-t border-[var(--border-muted)]/50 pt-8 relative z-10">
                    <PricingInclusion text="100 Check-ins/mo" />
                    <PricingInclusion text="1 Staff Member" />
                    <PricingInclusion text="5 Services" />
                    <PricingInclusion text="Basic Dashboard" />
                  </ul>
                  <Link href="/signup" className="mt-auto w-full py-5 rounded-2xl border-2 border-[var(--border-muted)] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all text-center text-[10px] flex items-center justify-center gap-2">
                    Get Started Free
                  </Link>
                </div>
              </ScrollReveal>

              {/* Essential */}
              <ScrollReveal direction="up" delay={0.2}>
                <div className="h-full glass-card p-10 flex flex-col gap-8 shadow-sm hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 border border-[var(--border-main)] relative overflow-hidden group transition-all duration-500 rounded-[2.5rem]">
                  <div className="flex flex-col gap-2 relative z-10">
                    <h4 className="text-[var(--color-primary)] font-black uppercase tracking-[0.2em] text-xs">Essential</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-[var(--text-main)] italic">50,000</span>
                      <span className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em]">RWF<span className="opacity-50">/mo</span></span>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm font-medium">For single-location boutique spas.</p>
                  </div>
                  <ul className="flex flex-col gap-5 border-t border-[var(--border-muted)]/50 pt-8 relative z-10">
                    <PricingInclusion text="Up to 500 Check-ins/mo" />
                    <PricingInclusion text="Up to 10 Staff Members" />
                    <PricingInclusion text="Up to 25 Services" />
                    <PricingInclusion text="Standard Support" />
                  </ul>
                  <Link href="/signup" className="mt-auto w-full py-5 rounded-2xl border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-black uppercase tracking-[0.2em] hover:bg-[var(--color-primary)] hover:text-white transition-all text-center text-[10px] shadow-lg shadow-[var(--color-primary)]/5 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-base">rocket</span>
                    Subscribe
                  </Link>
                </div>
              </ScrollReveal>

              {/* Premium */}
              <ScrollReveal direction="up" delay={0.3} className="relative z-10">
                <div className="h-full bg-gradient-to-br from-[#1b3a1b] to-[#2d5a27] dark:from-[#2d5a27] dark:to-[#1b3a1b] rounded-[2.5rem] p-10 border border-white/10 flex flex-col gap-8 transform lg:scale-105 shadow-[0_20px_60px_rgba(45,90,39,0.4)] relative overflow-hidden group transition-all duration-500">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-colors"></div>
                  <div className="absolute -top-3 left-1/2 -track-x-1/2 bg-white text-[var(--color-primary)] text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.3em] shadow-xl z-20 whitespace-nowrap -translate-x-1/2 leading-none">Best Value</div>
                  <div className="flex flex-col gap-2 relative z-10">
                    <h4 className="text-white/70 font-black uppercase tracking-[0.2em] text-xs">Premium</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-white italic">150,000</span>
                      <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">RWF<span className="opacity-50">/mo</span></span>
                    </div>
                    <p className="text-white/80 text-sm font-medium">For growing wellness centers.</p>
                  </div>
                  <ul className="flex flex-col gap-5 border-t border-white/10 pt-8 relative z-10">
                    <PricingInclusion text="Unlimited Check-ins" isDark />
                    <PricingInclusion text="Up to 25 Staff Members" isDark />
                    <PricingInclusion text="Up to 100 Services" isDark />
                    <PricingInclusion text="Multi-branch (3 Branches)" isDark />
                    <PricingInclusion text="Priority Support" isDark />
                  </ul>
                  <Link href="/signup" className="mt-auto w-full py-5 rounded-2xl bg-white text-[var(--color-primary)] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-50 transition-all text-center text-[10px] flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-base font-black">upgrade</span>
                    Go Premium
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Enterprise / Elite Callout */}
            <ScrollReveal direction="up" delay={0.4}>
              <div className="mt-8 glass-card border border-[var(--border-main)] p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-[var(--text-main)]/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className="size-16 rounded-2xl bg-[var(--text-main)]/5 flex items-center justify-center text-[var(--text-main)] group-hover:bg-[var(--text-main)] group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-4xl">corporate_fare</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black font-serif">Enterprise & Elite Solutions</h4>
                    <p className="text-[var(--text-muted)] text-sm">For 4+ branches, white-label needs, or custom API integrations.</p>
                  </div>
                </div>
                <Link href="/contact" className="px-10 py-5 rounded-2xl border-2 border-[var(--text-main)] text-[var(--text-main)] font-black uppercase tracking-[0.2em] hover:bg-[var(--text-main)] hover:text-white transition-all text-center text-[10px]">
                  Contact Sales
                </Link>
              </div>
            </ScrollReveal>
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
    </PublicLayout>
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

