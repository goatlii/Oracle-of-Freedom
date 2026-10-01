import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale, type StaticPathname } from "@/i18n/routing";
import { ogLocale, siteUrl } from "@/lib/content";

type Href =
  | StaticPathname
  | {
      pathname: "/journal/[slug]";
      params: { slug: string };
    };

function localizedPath(locale: Locale, href: Href) {
  return getPathname({ locale, href });
}

export function absoluteUrl(pathname: string) {
  if (pathname === "/") return siteUrl();
  return `${siteUrl()}${pathname}`;
}

export function languageAlternates(hrefForLocale: (locale: Locale) => Href) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    const href = hrefForLocale(locale);
    const path = localizedPath(locale, href);
    const key = locale === "pt" ? "pt-PT" : locale;
    languages[key] = absoluteUrl(path);
  }
  languages["x-default"] = languages.en;
  return languages;
}

export function pageMetadata({
  locale,
  title,
  description,
  keywords,
  hrefForLocale,
  noIndex = false,
}: {
  locale: string;
  title: string;
  description: string;
  keywords?: string;
  hrefForLocale: (locale: Locale) => Href;
  noIndex?: boolean;
}): Metadata {
  const languages = languageAlternates(hrefForLocale);
  const canonical =
    languages[locale === "pt" ? "pt-PT" : locale] ?? languages.en;
  const image = `/api/og?title=${encodeURIComponent(title)}&locale=${locale}`;

  return {
    title,
    description,
    keywords: keywords
      ?.split(";")
      .map((word) => word.trim())
      .filter(Boolean),
    alternates: {
      canonical,
      languages,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Oracle of Freedom",
      locale: ogLocale(locale),
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
