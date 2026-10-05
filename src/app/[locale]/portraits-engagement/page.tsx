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
    title: copy.meta.portraits.title,
    description: copy.meta.portraits.description,
    keywords: copy.meta.portraits.keywords,
    hrefForLocale: () => "/portraits-engagement",
  });
}

export default async function PortraitsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = (locale === "es" || locale === "pt" ? locale : "en") as Locale;
  const copy = getCopy(locale);
  return (
    <ServiceView
      locale={loc}
      copy={copy.portraits}
      page="portraits"
      group="portraits"
      tone="warm"
      heroId="portrait-07"
      heroPosition="center"
      common={copy.common}
      a11y={copy.a11y}
      whatsappText={copy.whatsapp.portraits}
    />
  );
}
