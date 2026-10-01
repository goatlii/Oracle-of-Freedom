"use client";

import { createContext, useContext } from "react";
import { usePathname as useBrowserPath } from "next/navigation";
import { posts } from "@/content/journal";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type JournalHref = {
  pathname: "/journal/[slug]";
  params: { slug: string };
};

export const JournalAlternatesContext = createContext<Partial<
  Record<Locale, JournalHref>
> | null>(null);

const LOCALES: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "es", label: "ES" },
  { id: "pt", label: "PT" },
];

function remember(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

function journalAlternates(browserPath: string) {
  const segments = browserPath.split("/").filter(Boolean);
  const index = segments.indexOf("journal");
  const slug = index >= 0 ? decodeURIComponent(segments[index + 1] || "") : "";
  if (!slug) return null;
  const post = posts.find(
    (item) => item.slugs.en === slug || item.slugs.es === slug || item.slugs.pt === slug,
  );
  if (!post) return null;
  return {
    en: { pathname: "/journal/[slug]" as const, params: { slug: post.slugs.en } },
    es: { pathname: "/journal/[slug]" as const, params: { slug: post.slugs.es } },
    pt: { pathname: "/journal/[slug]" as const, params: { slug: post.slugs.pt } },
  };
}

export function LanguageSwitcher({
  locale,
  tone = "ink",
}: {
  locale: string;
  tone?: "ink" | "light";
}) {
  const pathname = usePathname();
  const browserPath = useBrowserPath();
  const alternates = useContext(JournalAlternatesContext) ?? journalAlternates(browserPath);

  return (
    <div className="flex items-center gap-1 text-xs tracking-[0.16em]" role="navigation" aria-label="Language">
      {LOCALES.map((item) => {
        const active = item.id === locale;
        const fallback = pathname === "/journal/[slug]" ? "/journal" : pathname;
        const href = alternates?.[item.id] ?? fallback;
        return (
          <Link
            key={item.id}
            href={href}
            locale={item.id}
            hrefLang={item.id === "pt" ? "pt-PT" : item.id}
            onClick={() => remember(item.id)}
            className={cn(
              "rounded-full px-2 py-1",
              active
                ? tone === "light"
                  ? "text-white"
                  : "text-terracotta-ink"
                : tone === "light"
                  ? "text-white/60 hover:text-white"
                  : "text-ink/50 hover:text-ink",
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
