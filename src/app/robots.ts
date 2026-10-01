import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/keystatic", "/thank-you", "/es/gracias", "/pt/obrigada"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
