import { setRequestLocale } from "next-intl/server";
import { ServiceView } from "@/components/service-view";
import { getCopy } from "@/content";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getCopy(locale);
  return pageMetadata({
    locale,
    title: copy.meta.festivals.title,
    description: copy.meta.festivals.description,
    keywords: copy.meta.festivals.keywords,
    hrefForLocale: () => "/festivals-artists",
  });
}

export default async function FestivalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = (locale === "es" || locale === "pt" ? locale : "en") as Locale;
  const copy = getCopy(locale);
  return (
    <ServiceView
      locale={loc}
      copy={copy.festivals}
      page="festivals"
      group="festivals"
      tone="night"
      common={copy.common}
      a11y={copy.a11y}
      whatsappText={copy.whatsapp.festivals}
      showVideos
    />
  );
}
