import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://saunaspaengine.com";
    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
        { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
        { url: `${baseUrl}/demo`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
        { url: `${baseUrl}/case-studies`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
        { url: `${baseUrl}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${baseUrl}/developer`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${baseUrl}/developer/reference`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
        { url: `${baseUrl}/status`, lastModified: now, changeFrequency: "always", priority: 0.5 },
        { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
        { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
        { url: `${baseUrl}/security`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ];

    return staticRoutes;
}
