import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GalleryGrid } from "@/components/gallery";
import { Testimonials } from "@/components/testimonials";
import { getCopy } from "@/content";
import type { Locale } from "@/i18n/routing";
import { formatEuro, imagesForPage } from "@/lib/content";
import { getCatalog } from "@/lib/offers";
import { openingPrice } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getCopy(locale);
  return pageMetadata({
    locale,
    title: copy.meta.people.title,
    description: copy.meta.people.description,
    keywords: copy.meta.people.keywords,
    hrefForLocale: () => "/people",
  });
}

export default async function PeoplePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = (locale === "es" || locale === "pt" ? locale : "en") as Locale;
  const copy = getCopy(locale);
  const catalog = await getCatalog();
  const portraitsFrom = openingPrice(catalog, "portraits") ?? 175;
  const elopementFrom = openingPrice(catalog, "elopements") ?? 690;
  const doors = [
    {
      href: "/portraits-engagement" as const,
      title: copy.people.portraitsTitle,
      body: copy.people.portraitsBody,
      price: copy.people.portraitsPrice.replace("{price}", formatEuro(locale, portraitsFrom)),
    },
    {
      href: "/boho-elopements" as const,
      title: copy.people.weddingsTitle,
      body: copy.people.weddingsBody,
      price: copy.people.weddingsPrice.replace("{price}", formatEuro(locale, elopementFrom)),
    },
  ];

  return (
    <article>
      <header className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <p className="text-xs tracking-[0.22em] text-terracotta-ink uppercase">{copy.nav.people}</p>
        <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-[1.05] md:text-7xl">{copy.people.title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">{copy.people.dek}</p>
      </header>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-2 md:px-6">
        {doors.map((door) => (
          <Link key={door.href} href={door.href} className="rounded-3xl bg-clay/60 p-8 transition-colors hover:bg-clay">
            <h2 className="font-serif text-4xl">{door.title}</h2>
            <p className="mt-3 text-ink/80">{door.body}</p>
            <p className="mt-4 text-terracotta-ink">{door.price}</p>
            <p className="mt-6 text-sm underline underline-offset-4">{copy.common.explore}</p>
          </Link>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <GalleryGrid
          images={imagesForPage("people")}
          locale={loc}
          labels={{
            open: copy.a11y.openPhoto,
            close: copy.a11y.close,
            previous: copy.a11y.previous,
            next: copy.a11y.next,
            placeholder: copy.a11y.photoPlaceholder,
          }}
        />
      </section>
      <Testimonials
        ids={["india"]}
        locale={loc}
        title={copy.people.wordsTitle}
        badge={copy.common.placeholderTitle}
        note={copy.common.placeholderBody}
      />
    </article>
  );
}
