import { setRequestLocale } from "next-intl/server";
import { BookingWidget } from "@/components/booking-widget";
import { bookingCopy } from "@/content/booking";
import { getCopy } from "@/content";
import type { Locale } from "@/i18n/routing";
import { readCalendarConfig } from "@/lib/calendar-config-store";
import { pageMetadata } from "@/lib/seo";
import { storageMode } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const copy = getCopy(locale);
  return pageMetadata({
    locale,
    title: copy.meta.book.title,
    description: copy.meta.book.description,
    keywords: copy.meta.book.keywords,
    hrefForLocale: () => "/book",
  });
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = bookingCopy[locale] || bookingCopy.en;
  const config = await readCalendarConfig();
  const types = config.bookingTypes.filter((item) => item.active);
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
      <header className="max-w-3xl">
        <p className="text-xs tracking-[0.22em] text-ember uppercase">{copy.eyebrow}</p>
        <h1 className="mt-3 font-serif text-5xl leading-tight md:text-7xl">{copy.title}</h1>
        <p className="mt-5 text-lg text-ink/70">{copy.dek}</p>
      </header>
      <div className="mt-10">
        <BookingWidget
          types={types}
          locale={locale}
          copy={copy}
          canSave={storageMode() !== "readonly"}
        />
      </div>
    </main>
  );
}
