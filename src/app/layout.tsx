import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Sauna SPA Engine",
  description:
    "Enterprise-grade operations platform for sauna and spa businesses in Rwanda. Digitize your workflows, manage memberships, and track performance.",
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
    <html lang="en" className={manrope.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={`${manrope.className} antialiased`}>{children}</body>
    </html>
  );
}
