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
    title: copy.meta.elopements.title,
    description: copy.meta.elopements.description,
    keywords: copy.meta.elopements.keywords,
    hrefForLocale: () => "/boho-elopements",
  });
}

export default async function ElopementsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = (locale === "es" || locale === "pt" ? locale : "en") as Locale;
  const copy = getCopy(locale);
  return (
    <ServiceView
      locale={loc}
      copy={copy.elopements}
      page="elopements"
      group="elopements"
      tone="warm"
      heroId="elopement-01"
      heroPosition="center 28%"
      common={copy.common}
      a11y={copy.a11y}
      whatsappText={copy.whatsapp.elopements}
    />
  );
}
