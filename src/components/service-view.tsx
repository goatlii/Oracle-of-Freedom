import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ServiceCopy } from "@/content/types";
import { postById } from "@/content/journal";
import { GalleryGrid } from "@/components/gallery";
import { FromPrice, PackageCards } from "@/components/packages";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { Testimonials } from "@/components/testimonials";
import { TokenText, replaceTokens } from "@/components/token-text";
import { VideoGrid } from "@/components/video-grid";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { gallery, imagesForPage, settings, siteUrl } from "@/lib/content";
import { getCatalog } from "@/lib/offers";
import type { PricedPackage } from "@/lib/pricing";
import type { Locale } from "@/i18n/routing";
import type { Copy } from "@/content/types";

const tones = {
  warm: "bg-sand text-ink",
  night: "bg-night text-sand",
  moss: "bg-moss text-sand",
} as const;

export async function ServiceView({
  locale,
  copy,
  page,
  group,
  tone,
  common,
  a11y,
  whatsappText,
  showVideos = false,
  heroId,
  heroPosition = "center",
}: {
  locale: Locale;
  copy: ServiceCopy;
  page: string;
  group: "portraits" | "elopements" | "retreats" | "festivals" | "places";
  tone: keyof typeof tones;
  common: Copy["common"];
  a11y: Copy["a11y"];
  whatsappText: string;
  showVideos?: boolean;
  heroId?: string;
  heroPosition?: string;
}) {
  const images = imagesForPage(page).filter((image) => image.id !== "cover-wide");
  const hero =
    (heroId ? gallery.find((image) => image.id === heroId) : undefined) ?? images[0];
  const catalog = await getCatalog();
  const visible = catalog.filter((item) => item.group === group && item.visible);
  const photos = visible.filter((item) => item.kind === "photo");
  const films = visible.filter((item) => item.kind === "video");
  const combos = visible.filter((item) => item.kind === "combo");
  const addons = visible.filter((item) => item.kind === "addon");
  const lead =
    photos.find((item) => item.listFrom != null) ??
    visible.find((item) => item.kind !== "addon" && item.listFrom != null);
  const dark = tone !== "warm";

  const offers = visible
    .filter((item) => item.listFrom != null)
    .map((item) => ({
      "@type": "Offer",
      name: copy.packages[item.id]?.name,
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: item.promoFrom ?? item.listFrom,
        ...(item.to != null ? { maxPrice: item.to } : {}),
        priceCurrency: "EUR",
      },
    }));

  return (
    <article className={dark ? tones[tone] : undefined}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: copy.subtitle || copy.title,
          provider: { "@type": "ProfessionalService", name: settings.brand, url: siteUrl() },
          areaServed: ["Algarve", "Lisbon", "Portugal", "Europe"],
          offers,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: copy.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: replaceTokens(item.a) },
          })),
        }}
      />
      <section className="relative min-h-[78svh]">
        {hero ? (
          <Image
            src={hero.src}
            alt={hero.alt[locale]}
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={hero.blur}
            className="object-cover"
            style={{ objectPosition: heroPosition }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/35 to-night/10" />
        <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-6xl flex-col justify-end px-4 pt-24 pb-12 md:px-6">
          <p className="text-xs tracking-[0.22em] text-ember uppercase">{copy.eyebrow}</p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl leading-[1.05] text-white md:text-6xl">{copy.title}</h1>
          {copy.subtitle ? <p className="mt-4 max-w-2xl text-lg text-sand">{copy.subtitle}</p> : null}
          <p className="mt-3 max-w-2xl text-sand/85">{copy.dek}</p>
          {lead ? (
            <FromPrice
              locale={locale}
              item={lead}
              offer={common.offer}
              className="mt-4 text-sand"
              mutedClassName="text-sand/50"
            />
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button asChild variant="light">
              <Link href={{ pathname: "/inquire", query: { service: copy.inquiry } }}>
                {copy.personalizeCta || copy.cta}
              </Link>
            </Button>
            {copy.personalizeCta ? (
              <WhatsAppLink
                text={whatsappText}
                codeLabel={locale === "en" ? "Promo code" : "Código promocional"}
                wishLabel={locale === "en" ? "What I would like" : locale === "es" ? "Qué me gustaría" : "O que gostava"}
                className="text-sm text-sand underline decoration-white/40 underline-offset-4"
              >
                {copy.personalizeWhatsapp}
              </WhatsAppLink>
            ) : null}
          </div>
        </div>
      </section>

      <div className={dark ? "bg-sand text-ink" : undefined}>
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="font-serif text-4xl">{copy.whoTitle}</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {copy.who.map((item) => (
              <li key={item} className="rounded-2xl bg-clay/50 px-4 py-3">{item}</li>
            ))}
          </ul>
          {copy.notFor ? <p className="mt-6 max-w-3xl text-ink/80">{copy.notFor}</p> : null}
        </section>

        {copy.problem && copy.problemTitle ? (
          <section className="bg-clay/40">
            <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
              <h2 className="font-serif text-4xl">{copy.problemTitle}</h2>
              <p className="mt-4 text-lg text-ink/80">{copy.problem}</p>
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <PackageSection
            title={copy.packagesTitle}
            locale={locale}
            items={photos}
            copy={copy.packages}
            cta={copy.cta}
            offer={common.offer}
            saveTemplate={common.saveSeparately}
            personalizeCta={copy.personalizeCta}
            whatsappText={whatsappText}
            whatsappLabel={copy.personalizeWhatsapp}
            codeLabel={locale === "en" ? "Promo code" : "Código promocional"}
            wishLabel={locale === "en" ? "What I would like" : locale === "es" ? "Qué me gustaría" : "O que gostava"}
          />
          <PackageSection
            title={copy.filmsTitle || (locale === "en" ? "Film" : "Vídeo")}
            locale={locale}
            items={films}
            copy={copy.packages}
            cta={copy.cta}
            offer={common.offer}
            saveTemplate={common.saveSeparately}
          />
          <PackageSection
            title={copy.combosTitle || (locale === "en" ? "Photo + film" : "Foto + vídeo")}
            locale={locale}
            items={combos}
            copy={copy.packages}
            cta={copy.cta}
            offer={common.offer}
            saveTemplate={common.saveSeparately}
          />
          <PackageSection
            title={copy.addonsTitle || (locale === "en" ? "Express delivery" : locale === "es" ? "Entrega exprés" : "Entrega expressa")}
            note={copy.addonsNote}
            locale={locale}
            items={addons}
            copy={copy.packages}
            cta={copy.addonsCta || copy.cta}
            offer={common.offer}
            saveTemplate={common.saveSeparately}
            cardsClassName={group === "elopements" ? "xl:grid-cols-2" : undefined}
          />
          {copy.travelNote ? (
            <p className="mt-6 text-sm text-ink/70">
              <TokenText text={copy.travelNote} />
            </p>
          ) : null}
          <p className="mt-2 text-sm text-ink/60">{common.priceNote}</p>
        </section>

        {copy.where && copy.whereTitle ? (
          <section className="mx-auto max-w-3xl px-4 py-8 md:px-6">
            <h2 className="font-serif text-4xl">{copy.whereTitle}</h2>
            <p className="mt-4 text-lg text-ink/80">{copy.where}</p>
          </section>
        ) : null}

        {copy.day && copy.dayTitle ? (
          <section className="mx-auto max-w-3xl px-4 py-8 md:px-6">
            <h2 className="font-serif text-4xl">{copy.dayTitle}</h2>
            <p className="mt-4 font-quote text-2xl leading-snug text-ink/85">{copy.day}</p>
          </section>
        ) : null}

        {copy.deliverables && copy.deliverablesTitle ? (
          <section className="mx-auto max-w-3xl px-4 py-8 md:px-6">
            <h2 className="font-serif text-4xl">{copy.deliverablesTitle}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {copy.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {copy.consent && copy.consentTitle ? (
          <section className="bg-moss text-sand">
            <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
              <h2 className="font-serif text-4xl">{copy.consentTitle}</h2>
              {copy.consentIntro ? <p className="mt-4">{copy.consentIntro}</p> : null}
              <ul className="mt-4 space-y-3">
                {copy.consent.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          {copy.comingSoon ? (
            <p className="mb-6 rounded-3xl border border-dashed border-terracotta/50 bg-clay/40 p-5 text-sm">
              <span className="font-semibold tracking-[0.14em] text-terracotta-ink uppercase">{common.comingSoon}. </span>
              {copy.comingSoon}
            </p>
          ) : null}
          <GalleryGrid
            images={images}
            locale={locale}
            labels={{
              open: a11y.openPhoto,
              close: a11y.close,
              previous: a11y.previous,
              next: a11y.next,
              placeholder: a11y.photoPlaceholder,
            }}
          />
        </section>

        {showVideos && copy.videosTitle ? (
          <div className="bg-night text-sand">
            <VideoGrid
              locale={locale}
              title={copy.videosTitle}
              note={copy.videosNote || ""}
              play={locale === "en" ? "Play" : locale === "es" ? "Reproducir" : "Reproduzir"}
              allow={locale === "en" ? "Allow video to play" : locale === "es" ? "Acepta los vídeos para reproducir" : "Aceita os vídeos para reproduzir"}
            />
          </div>
        ) : null}

        <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
          <h2 className="font-serif text-4xl">{copy.processTitle}</h2>
          <ol className="mt-8 space-y-6">
            {copy.process.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[auto_1fr] gap-4">
                <span className="font-serif text-3xl text-ember">{index + 1}</span>
                <div>
                  <h3 className="font-serif text-2xl">{step.title}</h3>
                  <p className="text-ink/80">
                    <TokenText text={step.body} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Testimonials ids={copy.testimonialIds} locale={locale} title={copy.wordsTitle} />

        <section className="mx-auto max-w-3xl px-4 pb-8 md:px-6">
          <h2 className="font-serif text-4xl">{copy.faqTitle}</h2>
          <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {copy.faq.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
                  {item.q}
                </summary>
                <p className="pt-3 text-ink/80">
                  <TokenText text={item.a} />
                </p>
              </details>
            ))}
          </div>
        </section>

        {copy.guide ? (
          <p className="mx-auto max-w-3xl px-4 pb-8 md:px-6">
            <Link
              href={{ pathname: "/journal/[slug]", params: { slug: postById(copy.guide.post).slugs[locale] } }}
              className="text-terracotta-ink underline underline-offset-4"
            >
              {copy.guide.label}
            </Link>
          </p>
        ) : null}

        <section className="grain bg-night text-sand">
          <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 md:px-6">
            <h2 className="font-serif text-4xl md:text-5xl">{common.closingTitle}</h2>
            <p className="mt-4 text-sand/80">{common.closingBody}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild variant="light">
                <Link href={{ pathname: "/inquire", query: { service: copy.inquiry } }}>
                  {copy.personalizeCta
                    ? copy.personalizeCta
                    : copy.inquiry === "place"
                      ? locale === "en"
                        ? "Book a 15-min call"
                        : locale === "es"
                          ? "Reserva una llamada de 15 min"
                          : "Marca uma chamada de 15 min"
                      : common.closingPrimary}
                </Link>
              </Button>
              <WhatsAppLink
                text={whatsappText}
                codeLabel={locale === "en" ? "Promo code" : "Código promocional"}
                wishLabel={
                  copy.personalizeCta
                    ? locale === "en"
                      ? "What I would like"
                      : locale === "es"
                        ? "Qué me gustaría"
                        : "O que gostava"
                    : undefined
                }
                className="text-sm underline decoration-white/40 underline-offset-4"
              >
                {common.closingSecondary}
              </WhatsAppLink>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

function PackageSection({
  title,
  note,
  locale,
  items,
  copy,
  cta,
  offer,
  saveTemplate,
  personalizeCta,
  whatsappText,
  whatsappLabel,
  codeLabel,
  wishLabel,
  cardsClassName,
}: {
  title: string;
  note?: string;
  locale: Locale;
  items: PricedPackage[];
  copy: ServiceCopy["packages"];
  cta: string;
  offer: string;
  saveTemplate: string;
  personalizeCta?: string;
  whatsappText?: string;
  whatsappLabel?: string;
  codeLabel?: string;
  wishLabel?: string;
  cardsClassName?: string;
}) {
  if (!items.length) return null;
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="font-serif text-4xl first:text-4xl">{title}</h2>
      {note ? (
        <p className="mt-4 max-w-3xl text-ink/80">
          <TokenText text={note} />
        </p>
      ) : null}
      <div className="mt-8">
        <PackageCards
          locale={locale}
          items={items}
          copy={copy}
          cta={cta}
          offer={offer}
          saveTemplate={saveTemplate}
          personalizeCta={personalizeCta}
          whatsappText={whatsappText}
          whatsappLabel={whatsappLabel}
          codeLabel={codeLabel}
          wishLabel={wishLabel}
          className={cardsClassName}
        />
      </div>
    </div>
  );
}
