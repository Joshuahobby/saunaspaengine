import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://saunaspa.rw";

    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/"],
                disallow: [
                    "/dashboard/",
                    "/check-in/",
                    "/checkout/",
                    "/clients/",
                    "/employees/",
                    "/services/",
                    "/analytics/",
                    "/reports/",
                    "/settings/",
                    "/onboarding/",
                    "/api/",
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
