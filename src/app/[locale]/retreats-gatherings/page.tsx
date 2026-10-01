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
    title: copy.meta.retreats.title,
    description: copy.meta.retreats.description,
    keywords: copy.meta.retreats.keywords,
    hrefForLocale: () => "/retreats-gatherings",
  });
}

export default async function RetreatsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = (locale === "es" || locale === "pt" ? locale : "en") as Locale;
  const copy = getCopy(locale);
  return (
    <ServiceView
      locale={loc}
      copy={copy.retreats}
      page="retreats"
      group="retreats"
      tone="warm"
      common={copy.common}
      a11y={copy.a11y}
      whatsappText={copy.whatsapp.retreats}
    />
  );
}
