import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { TokenText } from "@/components/token-text";
import { Button } from "@/components/ui/button";
import { getCopy } from "@/content";
import type { Locale } from "@/i18n/routing";
import { imageById, settings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getCopy(locale);
  return pageMetadata({
    locale,
    title: copy.meta.about.title,
    description: copy.meta.about.description,
    keywords: copy.meta.about.keywords,
    hrefForLocale: () => "/about",
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = (locale === "es" || locale === "pt" ? locale : "en") as Locale;
  const copy = getCopy(locale);
  const primary = imageById(settings.aboutImageId);
  const secondary = imageById("about-portrait");
  const atWork = ["about-work-01", "about-work-02", "about-work-03"].map((id) => imageById(id));

  return (
    <article>
      <header className="mx-auto grid max-w-6xl items-end gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-24">
        <div>
          <p className="text-xs tracking-[0.22em] text-terracotta-ink uppercase">{settings.founder}</p>
          <h1 className="mt-3 font-serif text-5xl leading-[1.05] md:text-7xl">{copy.about.title}</h1>
          <div className="mt-8 space-y-5 text-lg text-ink/85">
            {copy.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <Image
          src={primary.src}
          alt={primary.alt[loc]}
          width={primary.width}
          height={primary.height}
          priority
          placeholder="blur"
          blurDataURL={primary.blur}
          className="w-full rounded-3xl object-cover"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
      </header>

      <section className="bg-clay/50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
          <p className="font-quote text-3xl leading-snug md:text-4xl">{copy.about.promise}</p>
          <Image
            src={secondary.src}
            alt={secondary.alt[loc]}
            width={secondary.width}
            height={secondary.height}
            placeholder="blur"
            blurDataURL={secondary.blur}
            className="w-full rounded-3xl object-cover"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="font-serif text-4xl">{copy.about.valuesTitle}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {copy.about.values.map((value) => (
            <article key={value.title} className="rounded-3xl bg-white/50 p-6">
              <h3 className="font-serif text-2xl">{value.title}</h3>
              <p className="mt-2 text-ink/80">{value.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-ink/80">
          <TokenText text={copy.about.facts} />
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {atWork.map((image) => (
            <Image
              key={image.id}
              src={image.src}
              alt={image.alt[loc]}
              width={image.width}
              height={image.height}
              placeholder="blur"
              blurDataURL={image.blur}
              className="w-full rounded-3xl object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ))}
        </div>
      </section>

      <section className="grain bg-night text-sand">
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 md:px-6">
          <h2 className="font-serif text-4xl md:text-5xl">{copy.about.closingTitle}</h2>
          <div className="mt-8">
            <Button asChild variant="light">
              <Link href="/inquire">{copy.common.checkAvailability}</Link>
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}
