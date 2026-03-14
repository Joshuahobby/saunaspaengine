import Link from "next/link";

export const metadata = {
  title: "Sauna SPA Engine - Digitize Your Spa Operations",
  description:
    "Revolutionize your wellness business with QR check-ins, real-time analytics, and automated multi-branch management. Built for Rwanda.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6f8f8] dark:bg-[#102022] text-[#0d1a1c] dark:text-slate-100 font-['Newsreader',_serif]">
      <div className="relative flex flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Top Navigation */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7f2f3] dark:border-[#0d1a1c] px-6 md:px-10 py-4 bg-[#f6f8f8]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-4 text-[#0d1a1c] dark:text-[#0fd4e6]">
              <div className="size-8 flex items-center justify-center bg-[#0fd4e6] rounded-lg text-[#0d1a1c]">
                <span className="material-symbols-outlined">spa</span>
              </div>
              <h2 className="text-[#0d1a1c] dark:text-slate-100 text-xl font-bold leading-tight tracking-[-0.015em]">
                Sauna SPA Engine
              </h2>
            </div>
            <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
              <nav className="hidden md:flex items-center gap-9">
                <a className="text-[#0d1a1c] dark:text-slate-200 text-sm font-medium hover:text-[#0fd4e6] transition-colors" href="#features">Features</a>
                <a className="text-[#0d1a1c] dark:text-slate-200 text-sm font-medium hover:text-[#0fd4e6] transition-colors" href="#solutions">Solutions</a>
                <a className="text-[#0d1a1c] dark:text-slate-200 text-sm font-medium hover:text-[#0fd4e6] transition-colors" href="#pricing">Pricing</a>
                <a className="text-[#0d1a1c] dark:text-slate-200 text-sm font-medium hover:text-[#0fd4e6] transition-colors" href="#about">About</a>
              </nav>
              <div className="flex gap-3">
                <Link 
                  href="/login"
                  className="flex min-w-[80px] md:min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e7f2f3] dark:bg-[#0d1a1c] text-[#0d1a1c] dark:text-slate-100 text-sm font-bold transition-all hover:bg-[#e7f2f3]/80"
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className="flex min-w-[100px] md:min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0fd4e6] text-[#0d1a1c] text-sm font-bold transition-all hover:opacity-90 shadow-lg shadow-[#0fd4e6]/20"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1">
            {/* Hero Section */}
            <div className="px-4 md:px-20 lg:px-40 py-12 md:py-20">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                  <div className="flex flex-col gap-6 lg:w-1/2">
                    <div className="flex flex-col gap-4">
                      <h1 className="text-[#0d1a1c] dark:text-slate-100 text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                        Digitize Your <br /><span className="text-[#0fd4e6] italic">Spa Operations</span>
                      </h1>
                      <p className="text-[#2a4d50] dark:text-slate-300 text-lg md:text-xl font-normal leading-relaxed max-w-[540px]">
                        Revolutionize your wellness business with QR check-ins, real-time analytics, and automated multi-branch management.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        href="/login"
                        className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-[#0fd4e6] text-[#0d1a1c] text-lg font-bold shadow-xl shadow-[#0fd4e6]/30 transition-transform hover:scale-105"
                      >
                        Get Started
                      </Link>
                      <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-[#e7f2f3] dark:bg-[#0d1a1c] text-[#0d1a1c] dark:text-slate-100 text-lg font-bold border border-[#e7f2f3] dark:border-[#0d1a1c] transition-colors hover:bg-[#e7f2f3]/80">
                        Watch Demo
                      </button>
                    </div>
                  </div>
                  <div className="lg:w-1/2 relative">
                    <div className="w-full aspect-[4/3] bg-[#e7f2f3] rounded-3xl overflow-hidden shadow-2xl">
                      <img 
                        alt="Luxury Spa Interior" 
                        className="w-full h-full object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD377Rw1J3jJ50DFdv7DI9VFckbkX50HKLF-0MQoJ6UG7ZM7QXD5QnskGKx85GT7bGeapAnHwaf71_gIMa8Bn1IKNC9fmzjuWNDeiAOSqrfbQz-ihSJCxIBr1vXCAFeQ5_K_UuDdV43xr0rXle25Eyed_UiZBa4xqMi2gpUSnL6PGmkEGPq1aM2yw7UoZVN9BqvRbnVM0GFW4wzaEQms1Ok-WLoaHi6O6u2PFUCwzG_GcllwK7ks9mQhEtTATcLd2-kjcqhRPM2-B8S"
                      />
                    </div>
                    {/* Floating Card Element */}
                    <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#0d1a1c] p-6 rounded-2xl shadow-xl border border-[#e7f2f3] dark:border-[#0d1a1c] flex items-center gap-4">
                      <div className="size-12 rounded-full bg-[#0fd4e6]/20 flex items-center justify-center text-[#0fd4e6]">
                        <span className="material-symbols-outlined text-3xl">qr_code_2</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0d1a1c] dark:text-slate-100">Live Check-ins</p>
                        <p className="text-xs text-[#4b949b] font-medium">124 users today</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof / Trusted By */}
            <section className="bg-[#e7f2f3]/30 dark:bg-[#0d1a1c]/10 py-12">
              <h4 className="text-[#4b949b] text-sm font-bold uppercase tracking-widest px-4 py-2 text-center mb-8">Trusted by world-class wellness brands</h4>
              <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {['AURA SPA', 'ZENITH', 'LUMINA', 'SOOTHE', 'VITALITY'].map((brand) => (
                  <div key={brand} className="flex justify-center">
                    <div className="h-12 w-32 bg-[#4b949b]/20 rounded-lg flex items-center justify-center font-bold text-[#2a4d50]">{brand}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="px-4 md:px-40 py-24">
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4 text-center items-center">
                  <h2 className="text-[#0d1a1c] dark:text-slate-100 text-4xl md:text-5xl font-black leading-tight max-w-[800px]">
                    Powerful Features for <span className="text-[#4b949b]">Modern Wellness</span>
                  </h2>
                  <p className="text-[#2a4d50] dark:text-slate-400 text-lg font-normal leading-normal max-w-[720px]">
                    Everything you need to run your spa enterprise efficiently in one integrated platform.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FeatureCard 
                    icon="qr_code_scanner" 
                    title="Instant QR Validation" 
                    description="Speed up check-ins with secure, instant QR code scanning for memberships and day passes. No more front desk queues."
                  />
                  <FeatureCard 
                    icon="bar_chart_4_bars" 
                    title="Enterprise Reporting" 
                    description="Gain deep insights with real-time analytics on occupancy, revenue, and staff performance across all departments."
                  />
                  <FeatureCard 
                    icon="account_tree" 
                    title="Multi-Branch Sync" 
                    description="Manage multiple locations from a single dashboard with centralized control and synchronized customer profiles."
                  />
                </div>
              </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="bg-[#e7f2f3]/20 dark:bg-[#0d1a1c]/20 py-24 px-4 md:px-40">
              <div className="flex flex-col gap-12">
                <div className="text-center flex flex-col gap-4">
                  <h2 className="text-[#0d1a1c] dark:text-slate-100 text-4xl md:text-5xl font-black">Simple, Transparent Pricing</h2>
                  <p className="text-[#2a4d50] dark:text-slate-400 text-lg">Choose the perfect plan for your business size.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <PricingCard 
                    tier="Basic"
                    price="$99"
                    description="For single location boutique spas."
                    features={["Up to 500 Check-ins/mo", "Basic QR Scanner", "Email Support"]}
                    buttonText="Start Basic"
                  />
                  <PricingCard 
                    tier="Pro"
                    price="$249"
                    description="For growing wellness centers."
                    features={["Unlimited Check-ins", "Advanced Analytics", "Up to 3 Branches", "Priority Chat Support"]}
                    buttonText="Go Pro"
                    popular={true}
                  />
                  <PricingCard 
                    tier="Enterprise"
                    price="Custom"
                    description="For large multi-national chains."
                    features={["White-labeled App", "Custom API Integration", "Dedicated Account Manager"]}
                    buttonText="Contact Sales"
                  />
                </div>
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-24 px-4">
              <div className="max-w-[960px] mx-auto bg-[#0d1a1c] rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0fd4e6]/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                  <div className="flex flex-col gap-4 md:w-1/2">
                    <h2 className="text-white text-4xl font-black leading-tight">Stay updated with Spa Insights</h2>
                    <p className="text-[#e7f2f3] text-lg">Join 5,000+ spa owners receiving our weekly operations newsletter.</p>
                  </div>
                  <div className="md:w-1/2 w-full">
                    <form className="flex flex-col sm:flex-row gap-3">
                      <input className="flex-1 rounded-xl h-14 px-6 bg-white/10 border-white/20 text-white placeholder:text-[#e7f2f3] focus:ring-[#0fd4e6] focus:border-[#0fd4e6]" placeholder="Your work email" type="email" />
                      <button className="bg-[#0fd4e6] text-[#0d1a1c] h-14 px-8 rounded-xl font-bold hover:opacity-90" type="submit">Subscribe</button>
                    </form>
                    <p className="text-[#4b949b] text-xs mt-4">We respect your privacy. Unsubscribe at any time.</p>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="bg-white dark:bg-[#0d1a1c] border-t border-[#e7f2f3] dark:border-[#0d1a1c] pt-20 pb-10 px-6 md:px-10">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 text-[#0d1a1c] dark:text-[#0fd4e6]">
                  <span className="material-symbols-outlined text-3xl">spa</span>
                  <span className="text-xl font-bold tracking-tight dark:text-slate-100">Sauna SPA Engine</span>
                </div>
                <p className="text-[#2a4d50] dark:text-slate-400 text-sm leading-relaxed">
                  The ultimate operations engine for modern wellness brands. Streamline your check-ins and grow your revenue.
                </p>
                <div className="flex gap-4">
                  <SocialLink icon="public" />
                  <SocialLink icon="share" />
                </div>
              </div>
              <FooterColumn title="Platform" links={["QR Check-in", "Analytics Dash", "Staff Portal", "Member CRM"]} />
              <FooterColumn title="Company" links={["About Us", "Careers", "Blog", "Privacy Policy"]} />
              <FooterColumn title="Support" links={["Help Center", "Documentation", "API Status", "Contact Us"]} />
            </div>
            <div className="max-w-[1200px] mx-auto border-t border-[#e7f2f3] dark:border-[#0d1a1c] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[#4b949b] text-xs">© 2026 Sauna SPA Engine · Made for Rwanda 🇷🇼</p>
              <div className="flex gap-6 text-xs text-[#4b949b]">
                <a href="#">Terms</a>
                <a href="#">Cookies</a>
                <a href="#">Security</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="group flex flex-col gap-6 rounded-2xl border border-[#e7f2f3] dark:border-[#0d1a1c] bg-white dark:bg-[#0d1a1c]/40 p-8 transition-all hover:shadow-2xl hover:-translate-y-2">
      <div className="size-14 rounded-xl bg-[#0fd4e6]/10 flex items-center justify-center text-[#0fd4e6] group-hover:bg-[#0fd4e6] group-hover:text-[#0d1a1c] transition-colors">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-[#0d1a1c] dark:text-slate-100 text-2xl font-bold leading-tight">{title}</h3>
        <p className="text-[#2a4d50] dark:text-slate-400 text-base font-normal leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function PricingCard({ tier, price, description, features, buttonText, popular = false }: { tier: string; price: string; description: string; features: string[]; buttonText: string; popular?: boolean }) {
  return (
    <div className={`${popular ? 'bg-[#0d1a1c] dark:bg-[#1a2e28] border-4 border-[#0fd4e6] md:scale-110' : 'bg-white dark:bg-[#0d1a1c] border border-[#e7f2f3] dark:border-[#0d1a1c]'} rounded-3xl p-8 flex flex-col gap-8 relative`}>
      {popular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#0fd4e6] text-[#0d1a1c] text-xs font-black px-4 py-1 rounded-full uppercase tracking-tighter">
          Most Popular
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h4 className={`${popular ? 'text-[#0fd4e6]' : 'text-[#4b949b]'} font-bold uppercase tracking-widest text-sm`}>{tier}</h4>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-black ${popular ? 'text-white' : 'text-[#0d1a1c] dark:text-slate-100'}`}>{price}</span>
          {price !== 'Custom' && (
            <span className={`${popular ? 'text-[#e7f2f3]/60' : 'text-[#4b949b]'} text-sm font-medium`}>/month</span>
          )}
        </div>
        <p className={`${popular ? 'text-[#e7f2f3]/80' : 'text-[#2a4d50] dark:text-slate-400'} text-sm`}>{description}</p>
      </div>
      <ul className="flex flex-col gap-4">
        {features.map((feature) => (
          <li key={feature} className={`flex items-center gap-3 ${popular ? 'text-white' : 'text-[#0d1a1c] dark:text-slate-300'}`}>
            <span className="material-symbols-outlined text-[#0fd4e6]">check_circle</span>
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href="/login"
        className={`mt-auto w-full py-4 rounded-xl font-bold transition-all text-center ${
          popular 
            ? 'bg-[#0fd4e6] text-[#0d1a1c] shadow-lg shadow-[#0fd4e6]/40 hover:opacity-90' 
            : 'border-2 border-[#0fd4e6] text-[#0d1a1c] dark:text-slate-100 hover:bg-[#0fd4e6]'
        }`}
      >
        {buttonText}
      </Link>
    </div>
  );
}

function SocialLink({ icon }: { icon: string }) {
  return (
    <a className="size-10 rounded-full bg-[#e7f2f3] dark:bg-[#0d1a1c] flex items-center justify-center text-[#2a4d50] dark:text-[#e7f2f3] hover:bg-[#0fd4e6] transition-colors" href="#">
      <span className="material-symbols-outlined">{icon}</span>
    </a>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h5 className="font-bold text-[#0d1a1c] dark:text-slate-100 mb-6">{title}</h5>
      <ul className="flex flex-col gap-4 text-sm text-[#2a4d50] dark:text-slate-400">
        {links.map((link) => (
          <li key={link}><a className="hover:text-[#0fd4e6]" href="#">{link}</a></li>
        ))}
      </ul>
    </div>
  );
}
