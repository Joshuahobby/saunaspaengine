import type { NextConfig } from "next";

const securityHeaders = [
    // Prevent MIME-type sniffing
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Block page from being embedded in iframes (clickjacking protection)
    { key: "X-Frame-Options", value: "DENY" },
    // Stop leaking referrer to external sites
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // Restrict browser features
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    },
    // Force HTTPS for 1 year, include subdomains
    {
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
    },
    // Content Security Policy — tightened for this app's known sources
    {
        key: "Content-Security-Policy",
        value: [
            "default-src 'self'",
            // Next.js needs inline scripts for hydration; use nonce in production for strictest CSP
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            // Allow inline styles (Tailwind + dynamic branding CSS vars)
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            // Images from Cloudinary, Unsplash, Google (OAuth avatars), and data URIs (QR codes)
            "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://lh3.googleusercontent.com",
            // API calls are same-origin only
            "connect-src 'self'",
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join("; "),
    },
];

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: ["lucide-react", "date-fns", "framer-motion", "@prisma/client"],
        viewTransition: true,
    },
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "lh3.googleusercontent.com" },
            { protocol: "https", hostname: "res.cloudinary.com" },
        ],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: securityHeaders,
            },
        ];
    },
};

export default nextConfig;
