import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-[Manrope,sans-serif] antialiased">{children}</body>
    </html>
  );
}
