import { testimonials, type Testimonial } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export function Testimonials({
  ids,
  locale,
  title,
}: {
  ids: string[];
  locale: Locale;
  title: string;
}) {
  const items = ids
    .map((id) => testimonials.find((item) => item.id === id))
    .filter((item): item is Testimonial => item != null && item.placeholder === false);

  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h2 className="font-serif text-4xl text-ink">{title}</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <RealTestimonial key={item.id} item={item} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function RealTestimonial({ item, locale }: { item: Testimonial; locale: Locale }) {
  const shoot = item.shoot?.[locale];
  return (
    <figure className="min-w-0 rounded-3xl bg-clay/70 p-6">
      <blockquote className="font-quote text-xl leading-relaxed text-pretty break-words text-ink sm:text-2xl sm:leading-snug">
        {item.quote[locale]}
      </blockquote>
      <figcaption className="mt-5">
        <span className="text-sm font-medium break-words text-ink">{item.name}</span>
        {shoot ? (
          <span className="mt-1 block text-xs font-semibold tracking-[0.16em] text-pretty text-terracotta-ink uppercase">
            {shoot}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
