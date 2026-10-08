import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

/** Unknown paths under a locale have no page of their own. Calling notFound()
 * here keeps the localized 404 inside this layout. An unmatched URL otherwise
 * falls through to the English root not-found. */
export default async function UnknownPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
