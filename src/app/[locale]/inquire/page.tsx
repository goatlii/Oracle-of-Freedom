import { setRequestLocale } from "next-intl/server";
import { InquiryForm } from "@/components/inquiry-form";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { getCopy } from "@/content";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { settings } from "@/lib/content";
import { getSettings } from "@/lib/offers";
import { hasPromoCode } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getCopy(locale);
  return pageMetadata({
    locale,
    title: copy.meta.inquire.title,
    description: copy.meta.inquire.description,
    keywords: copy.meta.inquire.keywords,
    hrefForLocale: () => "/inquire",
  });
}

export default async function InquirePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { locale } = await params;
  const { service } = await searchParams;
  setRequestLocale(locale);
  const loc = (locale === "es" || locale === "pt" ? locale : "en") as Locale;
  const copy = getCopy(locale);
  const showPromoCode = hasPromoCode(await getSettings());
  const thankYouPath = getPathname({ locale: loc, href: "/thank-you" });

  return (
    <article className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:px-6 md:py-24">
      <div>
        <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">{copy.inquire.title}</h1>
        <p className="mt-4 max-w-xl text-lg text-ink/80">{copy.inquire.dek}</p>
        <div className="mt-8">
          <InquiryForm
            copy={copy.form}
            locale={loc}
            initialService={service}
            thankYouPath={thankYouPath}
            showPromoCode={showPromoCode}
          />
        </div>
      </div>
      <aside className="h-fit rounded-3xl bg-clay/50 p-6 md:sticky md:top-24">
        <h2 className="font-serif text-3xl">{copy.inquire.prefer}</h2>
        <p className="mt-4">
          <WhatsAppLink text={copy.whatsapp.general} codeLabel={copy.form.promoCode} wishLabel={copy.form.wish} className="text-terracotta-ink underline underline-offset-4">
            WhatsApp
            {settings.whatsappIsPlaceholder ? ` (${settings.whatsappDisplay})` : ""}
          </WhatsAppLink>
        </p>
        <p className="mt-3">
          <span className="text-ink/60">{copy.inquire.email}: </span>
          <a className="text-terracotta-ink underline underline-offset-4" href={`mailto:${settings.email}`}>
            {settings.email}
          </a>
        </p>
        <h2 className="mt-10 font-serif text-3xl">{copy.inquire.nextTitle}</h2>
        <ol className="mt-4 space-y-3">
          {copy.inquire.next.map((step, index) => (
            <li key={step} className="grid grid-cols-[auto_1fr] gap-3">
              <span className="font-serif text-2xl text-ember">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </aside>
    </article>
  );
}
