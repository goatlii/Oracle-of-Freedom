import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GalleryGrid } from "@/components/gallery";
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
    title: copy.meta.experiences.title,
    description: copy.meta.experiences.description,
    keywords: copy.meta.experiences.keywords,
    hrefForLocale: () => "/experiences",
  });
}

export default async function ExperiencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = (locale === "es" || locale === "pt" ? locale : "en") as Locale;
  const copy = getCopy(locale);
  const catalog = await getCatalog();
  const retreatFrom = openingPrice(catalog, "retreats") ?? 400;
  const artistFrom = openingPrice(catalog, "festivals") ?? 190;
  const doors = [
    {
      href: "/retreats-gatherings" as const,
      title: copy.experiences.retreatsTitle,
      body: copy.experiences.retreatsBody,
      price: copy.experiences.retreatsPrice.replace("{price}", formatEuro(locale, retreatFrom)),
    },
    {
      href: "/festivals-artists" as const,
      title: copy.experiences.festivalsTitle,
      body: copy.experiences.festivalsBody,
      price: copy.experiences.festivalsPrice.replace("{price}", formatEuro(locale, artistFrom)),
    },
  ];

  return (
    <article>
      <header className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <p className="text-xs tracking-[0.22em] text-terracotta-ink uppercase">{copy.nav.experiences}</p>
        <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-[1.05] md:text-7xl">{copy.experiences.title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">{copy.experiences.dek}</p>
      </header>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-2 md:px-6">
        {doors.map((door) => (
          <Link key={door.href} href={door.href} className="rounded-3xl bg-night p-8 text-sand transition-colors hover:bg-ink">
            <h2 className="font-serif text-4xl">{door.title}</h2>
            <p className="mt-3 text-sand/80">{door.body}</p>
            <p className="mt-4 text-ember">{door.price}</p>
            <p className="mt-6 text-sm underline underline-offset-4">{copy.common.explore}</p>
          </Link>
        ))}
      </section>
      <section className="bg-moss text-sand">
        <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
          <h2 className="font-serif text-4xl">{copy.experiences.consentTitle}</h2>
          <p className="mt-4 text-lg">{copy.experiences.consent}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <GalleryGrid
          images={imagesForPage("experiences")}
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
    </article>
  );
}
