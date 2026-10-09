import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { GalleryGrid } from "@/components/gallery";
import { OmMark } from "@/components/om-mark";
import { Testimonials } from "@/components/testimonials";
import { Button } from "@/components/ui/button";
import { getCopy } from "@/content";
import { posts } from "@/content/journal";
import type { Locale } from "@/i18n/routing";
import { featuredImages, formatEuro, imageById, settings } from "@/lib/content";
import { getCatalog } from "@/lib/offers";
import { openingPrice } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getCopy(locale);
  return pageMetadata({
    locale,
    title: copy.meta.home.title,
    description: copy.meta.home.description,
    keywords: copy.meta.home.keywords,
    hrefForLocale: () => "/",
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (locale === "es" || locale === "pt" ? locale : "en") as Locale;
  const copy = getCopy(locale);
  const catalog = await getCatalog();
  const hero = imageById(settings.heroImageId);
  const mobile = imageById(settings.mobileHeroImageId);
  const about = imageById(settings.aboutImageId);
  const doors = [
    {
      href: "/people" as const,
      title: copy.home.peopleTitle,
      body: copy.home.peopleBody,
      price: copy.home.peoplePrice
        .replace("{session}", formatEuro(locale, openingPrice(catalog, "portraits") || 175))
        .replace("{elopement}", formatEuro(locale, openingPrice(catalog, "elopements") || 690)),
      image: imageById(settings.doorPeopleId),
      cta: copy.common.explore,
    },
    {
      href: "/experiences" as const,
      title: copy.home.experiencesTitle,
      body: copy.home.experiencesBody,
      price: copy.home.experiencesPrice.replace(
        "{retreat}",
        formatEuro(locale, openingPrice(catalog, "retreats") || 400),
      ),
      image: imageById(settings.doorExperiencesId),
      cta: copy.common.explore,
    },
    {
      href: "/places" as const,
      title: copy.home.placesTitle,
      body: copy.home.placesBody,
      price: copy.home.placesPrice.replace("{places}", formatEuro(locale, openingPrice(catalog, "places") || 475)),
      image: imageById(settings.doorPlacesId),
      cta: copy.common.explore,
    },
  ];

  return (
    <>
      <section className="relative min-h-[100svh]">
        <Image
          src={hero.src}
          alt={hero.alt[loc]}
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={hero.blur}
          className="hidden object-cover object-[center_30%] md:block"
        />
        <Image
          src={mobile.src}
          alt={mobile.alt[loc]}
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={mobile.blur}
          className="object-cover object-center md:hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-night/20" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pt-28 pb-16 md:px-6">
          <OmMark className="h-10 w-10" />
          <p className="mt-4 text-xs tracking-[0.22em] text-ember uppercase">Oracle of Freedom</p>
          <h1 className="mt-3 max-w-4xl font-serif text-[2.4rem] leading-[1.05] text-white sm:text-5xl md:text-7xl">
            {copy.home.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-sand/90">{copy.home.dek}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="light" size="lg">
              <Link href="/inquire">{copy.common.checkAvailability}</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/portfolio">{copy.common.seeWork}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20 pb-8 md:px-6 md:pt-28">
        <h2 className="font-serif text-4xl md:text-5xl">{copy.home.doorsTitle}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {doors.map((door) => (
            <Link key={door.href} href={door.href} className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src={door.image.src}
                alt={door.image.alt[loc]}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                placeholder="blur"
                blurDataURL={door.image.blur}
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-sand">
                <h3 className="font-serif text-4xl">{door.title}</h3>
                <p className="mt-2 text-sm text-sand/85">{door.body}</p>
                <p className="mt-3 text-sm text-ember">{door.price}</p>
                <p className="mt-3 text-sm underline underline-offset-4">{door.cta}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-28">
        <p className="font-quote text-3xl leading-snug text-ink md:text-5xl">{copy.home.manifesto}</p>
        <Image
          src={about.src}
          alt={about.alt[loc]}
          width={about.width}
          height={about.height}
          placeholder="blur"
          blurDataURL={about.blur}
          className="aspect-[4/5] w-full rounded-[2rem] object-cover"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
      </section>

      <section className="mt-16 bg-clay/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3 md:px-6">
          <h2 className="font-serif text-4xl md:col-span-3">{copy.home.howTitle}</h2>
          {copy.home.how.map((item) => (
            <article key={item.title}>
              <h3 className="font-serif text-2xl">{item.title}</h3>
              <p className="mt-2 text-ink/80">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-serif text-4xl">{copy.home.featuredTitle}</h2>
          <Link href="/portfolio" className="text-sm text-terracotta-ink underline underline-offset-4">
            {copy.common.viewPortfolio}
          </Link>
        </div>
        <GalleryGrid
          images={featuredImages()}
          locale={loc}
          foldMobile
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
        ids={["india", "oliwia", "sage", "rewild", "kliq", "nixie", "bliss-burn", "anael", "couple", "retreat", "artist"]}
        locale={loc}
        title={copy.home.wordsTitle}
        foldAfter={4}
      />

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 md:grid-cols-2 md:px-6">
        <Image
          src={about.src}
          alt={about.alt[loc]}
          width={about.width}
          height={about.height}
          className="aspect-[4/5] rounded-[2rem] object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div>
          <p className="text-lg">{copy.home.about}</p>
          <Button asChild className="mt-6">
            <Link href="/about">{copy.common.meet}</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-4xl">{copy.home.journalTitle}</h2>
            <p className="mt-2 text-ink/70">{copy.home.journalDek}</p>
          </div>
          <Link href="/journal" className="text-sm text-terracotta-ink underline underline-offset-4">
            {copy.common.readGuides}
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={{ pathname: "/journal/[slug]", params: { slug: post.slugs[loc] } }}
              className="rounded-3xl bg-clay/50 p-6 hover:bg-clay"
            >
              <h3 className="font-serif text-2xl">{post.title[loc]}</h3>
              <p className="mt-3 text-sm text-ink/75">{post.description[loc]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grain bg-night text-sand">
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
          <h2 className="font-serif text-4xl md:text-6xl">{copy.home.closingTitle}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="light">
              <Link href="/inquire">{copy.common.checkAvailability}</Link>
            </Button>
            <Button asChild variant="ghost">
              <a href={settings.instagramUrl}>{copy.home.follow}</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-serif text-3xl">Instagram</h2>
          <a href={settings.instagramUrl} className="text-sm text-terracotta-ink underline underline-offset-4">
            @{settings.instagram}
          </a>
        </div>
        <p className="mb-4 text-sm text-ink/60">{copy.home.igNote}</p>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
          {featuredImages()
            .slice(0, 6)
            .map((image) => (
              <a key={image.id} href={settings.instagramUrl} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src={image.src} alt={image.alt[loc]} fill sizes="16vw" className="object-cover" />
              </a>
            ))}
        </div>
      </section>
    </>
  );
}
