import { setRequestLocale } from "next-intl/server";
import { PortfolioBrowser } from "@/components/portfolio-browser";
import { getCopy } from "@/content";
import type { Locale } from "@/i18n/routing";
import { gallery } from "@/lib/content";
import { isPublishedPhoto } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getCopy(locale);
  return pageMetadata({
    locale,
    title: copy.meta.portfolio.title,
    description: copy.meta.portfolio.description,
    keywords: copy.meta.portfolio.keywords,
    hrefForLocale: () => "/portfolio",
  });
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = (locale === "es" || locale === "pt" ? locale : "en") as Locale;
  const copy = getCopy(locale);
  const images = gallery.filter(
    (image) => isPublishedPhoto(image) && (image.pages.includes("portfolio") || image.featured),
  );

  return (
    <article className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <p className="text-xs tracking-[0.22em] text-terracotta-ink uppercase">{copy.nav.portfolio}</p>
      <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-[1.05] md:text-7xl">{copy.portfolio.title}</h1>
      <p className="mt-5 max-w-2xl text-lg text-ink/80">{copy.portfolio.dek}</p>
      <div className="mt-10">
        <PortfolioBrowser
          images={images}
          locale={loc}
          filters={copy.portfolio.filters}
          empty={copy.portfolio.empty}
          soon={copy.common.comingSoon}
          labels={{
            open: copy.a11y.openPhoto,
            close: copy.a11y.close,
            previous: copy.a11y.previous,
            next: copy.a11y.next,
            placeholder: copy.a11y.photoPlaceholder,
          }}
        />
      </div>
    </article>
  );
}
