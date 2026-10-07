import { testimonials, type Testimonial } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export function Testimonials({
  ids,
  locale,
  title,
  badge,
  note,
}: {
  ids: string[];
  locale: Locale;
  title: string;
  badge: string;
  note: string;
}) {
  const items = ids
    .map((id) => testimonials.find((item) => item.id === id))
    .filter((item) => item != null);

  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h2 className="font-serif text-4xl text-ink">{title}</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((item) =>
          item.placeholder === false ? (
            <RealTestimonial key={item.id} item={item} locale={locale} />
          ) : (
            <figure
              key={item.id}
              className="rounded-3xl border border-dashed border-terracotta/50 bg-clay/40 p-6"
            >
              <figcaption className="text-xs font-semibold tracking-[0.16em] text-terracotta-ink uppercase">
                {badge}
              </figcaption>
              <blockquote className="mt-4 font-quote text-2xl leading-snug text-ink/80">
                {item.quote[locale]}
              </blockquote>
              <p className="mt-4 text-sm text-ink/70">{note}</p>
            </figure>
          ),
        )}
      </div>
    </section>
  );
}

function RealTestimonial({ item, locale }: { item: Testimonial; locale: Locale }) {
  const shoot = item.shoot?.[locale];
  return (
    <figure className="rounded-3xl bg-clay/70 p-6">
      <blockquote className="font-quote text-2xl leading-snug text-ink">{item.quote[locale]}</blockquote>
      <figcaption className="mt-5">
        <span className="text-sm font-medium text-ink">{item.name}</span>
        {shoot ? (
          <span className="mt-1 block text-xs font-semibold tracking-[0.16em] text-terracotta-ink uppercase">
            {shoot}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
