"use client";

import Link from "next/link";

export function Footer() {
  return (
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
          <FooterLinks links={["Demo Dashboard", "Pricing", "Case Studies", "Changelog"]} hrefs={["/demo", "/#pricing", "/case-studies", "/changelog"]} />
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
