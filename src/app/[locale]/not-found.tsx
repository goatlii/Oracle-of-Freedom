import { Link } from "@/i18n/navigation";
import { getCopy } from "@/content";
import { getLocale } from "next-intl/server";

export default async function NotFound() {
  let locale = "en";
  try {
    locale = await getLocale();
  } catch {
    locale = "en";
  }
  const copy = getCopy(locale);
  const title = locale === "es" ? "Esta página no está" : locale === "pt" ? "Esta página não está" : "This page isn’t here";
  const body =
    locale === "es"
      ? "El camino se desvió. Vuelve al inicio o escríbeme."
      : locale === "pt"
        ? "O caminho desviou. Volta ao início ou escreve-me."
        : "The path wandered off. Come back home, or write to me.";

  return (
    <article className="mx-auto max-w-3xl px-4 py-24 md:px-6">
      <h1 className="font-serif text-5xl">{title}</h1>
      <p className="mt-4 text-lg text-ink/80">{body}</p>
      <p className="mt-8 flex gap-6">
        <Link href="/" className="underline underline-offset-4">
          {copy.thankYou.again}
        </Link>
        <Link href="/inquire" className="underline underline-offset-4">
          {copy.nav.inquire}
        </Link>
      </p>
    </article>
  );
}
