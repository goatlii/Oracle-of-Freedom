import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCopy } from "@/content";
import { posts } from "@/content/journal";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getCopy(locale);
  return pageMetadata({
    locale,
    title: copy.meta.journal.title,
    description: copy.meta.journal.description,
    keywords: copy.meta.journal.keywords,
    hrefForLocale: () => "/journal",
  });
}

export default async function JournalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = (locale === "es" || locale === "pt" ? locale : "en") as Locale;
  const copy = getCopy(locale);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <p className="text-xs tracking-[0.22em] text-terracotta-ink uppercase">{copy.nav.journal}</p>
      <h1 className="mt-3 font-serif text-5xl leading-[1.05] md:text-7xl">{copy.journal.title}</h1>
      <p className="mt-5 text-lg text-ink/80">{copy.journal.dek}</p>
      <div className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
        {posts.map((post) => (
          <article key={post.id} className="py-8">
            <time dateTime={post.date} className="text-xs tracking-[0.16em] text-ink/50 uppercase">
              {post.date}
            </time>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">
              <Link href={{ pathname: "/journal/[slug]", params: { slug: post.slugs[loc] } }}>{post.title[loc]}</Link>
            </h2>
            <p className="mt-3 text-ink/75">{post.description[loc]}</p>
            <Link
              href={{ pathname: "/journal/[slug]", params: { slug: post.slugs[loc] } }}
              className="mt-4 inline-flex text-sm text-terracotta-ink underline underline-offset-4"
            >
              {copy.journal.read}
            </Link>
          </article>
        ))}
      </div>
    </article>
  );
}
