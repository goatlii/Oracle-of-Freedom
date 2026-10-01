import type { MetadataRoute } from "next";
import { posts } from "@/content/journal";
import { getPathname } from "@/i18n/navigation";
import { routing, staticPathnames, type Locale, type StaticPathname } from "@/i18n/routing";
import { siteUrl } from "@/lib/content";

function absolute(path: string) {
  if (path === "/") return siteUrl();
  return `${siteUrl()}${path}`;
}

function languages(hrefForLocale: (locale: Locale) => StaticPathname | { pathname: "/journal/[slug]"; params: { slug: string } }) {
  const map: Record<string, string> = {};
  for (const locale of routing.locales) {
    const path = getPathname({ locale, href: hrefForLocale(locale) });
    map[locale === "pt" ? "pt-PT" : locale] = absolute(path);
  }
  map["x-default"] = map.en;
  return map;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = staticPathnames
    .filter((pathname) => pathname !== "/thank-you")
    .map((pathname) => ({
      url: absolute(getPathname({ locale: "en", href: pathname })),
      alternates: { languages: languages(() => pathname) },
    }));

  const journal = posts.map((post) => ({
    url: absolute(getPathname({ locale: "en", href: { pathname: "/journal/[slug]", params: { slug: post.slugs.en } } })),
    lastModified: post.date,
    alternates: {
      languages: languages((locale) => ({
        pathname: "/journal/[slug]",
        params: { slug: post.slugs[locale] },
      })),
    },
  }));

  return [...pages, ...journal];
}
