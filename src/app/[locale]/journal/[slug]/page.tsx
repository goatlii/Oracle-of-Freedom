import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { getCopy } from "@/content";
import { postBySlug, posts } from "@/content/journal";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slugs[locale] })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = (locale === "es" || locale === "pt" ? locale : "en") as Locale;
  const post = postBySlug(loc, slug);
  if (!post) return {};
  return pageMetadata({
    locale,
    title: post.title[loc],
    description: post.description[loc],
    keywords: post.keywords[loc],
    hrefForLocale: (target) => ({
      pathname: "/journal/[slug]",
      params: { slug: post.slugs[target] },
    }),
  });
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = (locale === "es" || locale === "pt" ? locale : "en") as Locale;
  const post = postBySlug(loc, slug);
  if (!post) notFound();
  const copy = getCopy(locale);
  const related = posts.filter((item) => item.id !== post.id);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <p className="text-xs tracking-[0.22em] text-terracotta-ink uppercase">
        <Link href="/journal">{copy.nav.journal}</Link>
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-[1.1] md:text-6xl">{post.title[loc]}</h1>
      <time dateTime={post.date} className="mt-4 block text-sm text-ink/50">
        {post.date}
      </time>
      <div className="mt-10">
        <Markdown text={post.body[loc]} />
      </div>
      <div className="mt-12">
        <Button asChild>
          <Link href={{ pathname: "/inquire", query: { service: post.id === "ericeira" ? "couple" : post.id === "retreat" ? "retreat" : "elopement" } }}>
            {copy.journal.cta}
          </Link>
        </Button>
      </div>
      <aside className="mt-16 border-t border-ink/10 pt-8">
        <h2 className="font-serif text-3xl">{copy.journal.related}</h2>
        <ul className="mt-4 space-y-3">
          {related.map((item) => (
            <li key={item.id}>
              <Link
                href={{ pathname: "/journal/[slug]", params: { slug: item.slugs[loc] } }}
                className="text-terracotta-ink underline underline-offset-4"
              >
                {item.title[loc]}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </article>
  );
}
