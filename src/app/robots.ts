import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/services", "/technicians"],
        disallow: ["/dashboard", "/technician/", "/admin", "/payment", "/login", "/register"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
