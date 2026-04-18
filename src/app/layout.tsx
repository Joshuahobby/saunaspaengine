import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sauna SPA Engine",
  description:
    "Enterprise-grade operations platform for sauna and spa branches in Rwanda. Digitize your workflows, manage memberships, and track performance.",
  keywords: [
    "sauna",
    "spa",
    "Rwanda",
    "Kigali",
    "management",
    "SaaS",
    "membership",
    "QR code",
  ],
};

export const viewport: import("next").Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#2d5a27", // Sophisticated Eucalyptus Green
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          crossOrigin="anonymous"
        />
        {/* Network & Cache Hard-Reset Meta Tags */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={`${inter.className} antialiased selection:bg-[var(--color-primary)] selection:text-teal-900`}>
        {/* Invisible touch points to satisfy browser preload requirements and clear console warnings */}
        <div className="font-touch-observer" aria-hidden="true">
          <span className="font-inter-400">.</span>
          <span className="font-inter-700">.</span>
          <span className="font-poppins-400">.</span>
          <span className="font-poppins-700">.</span>
        </div>
        <ThemeProvider>
          {children}
          <ToastProvider />
          <Analytics />
        </ThemeProvider>
        <Analytics />

        {/* Self-destructing script for phantom service workers on localhost:3000 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('[PURGE] Initializing Total Network Purge...');
              
              if ('serviceWorker' in navigator) {
                // Register our dedicated kill-switch SW to evict ghosts
                navigator.serviceWorker.register('/sw.js').then(reg => {
                   console.log('[PURGE] Kill-switch SW Registered:', reg.scope);
                }).catch(err => {
                   console.warn('[PURGE] SW Registration Failed:', err);
                });

                // Force unregister everything else
                navigator.serviceWorker.getRegistrations().then(registrations => {
                  for (let registration of registrations) {
                    registration.unregister();
                    console.log('[PURGE] Unregistered phantom worker:', registration.scope);
                  }
                });
              }

              // Aggressively clear all caches to resolve 'Failed to fetch' errors in browser
              if ('caches' in window) {
                caches.keys().then(names => {
                  for (let name of names) {
                    caches.delete(name);
                    console.log('[PURGE] Cache Cleared:', name);
                  }
                });
              }
              
              console.log('[PURGE] Network Purge Logic Executed.');
            `,
          }}
        />
      </body>
    </html>
  );
}
