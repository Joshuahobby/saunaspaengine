import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { NavProvider } from "@/components/providers/NavProvider";
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
        />
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
          <NavProvider>
            {children}
          </NavProvider>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
