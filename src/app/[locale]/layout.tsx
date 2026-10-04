import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Serif_Display, Karla } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CookieBanner } from "@/components/cookie-banner";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader, type NavItem } from "@/components/site-header";
import { PromoBanner } from "@/components/promo-banner";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getCopy } from "@/content";
import { routing } from "@/i18n/routing";
import { htmlLang, settings, siteUrl } from "@/lib/content";
import "../globals.css";

const serif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const sans = Karla({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

const quote = Cormorant_Garamond({
  weight: "500",
  style: "italic",
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  applicationName: "Oracle of Freedom",
  authors: [{ name: settings.founder, url: settings.instagramUrl }],
  creator: settings.founder,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Unknown single-segment paths (including /cover-wide.jpg when it is not a
// public file) must 404 here. Rendering them calls next-intl requestLocale,
// which reads headers() and turns this static route into a runtime 500.
export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const copy = getCopy(locale);
  const items: NavItem[] = [
    { href: "/people", label: copy.nav.people },
    { href: "/experiences", label: copy.nav.experiences },
    { href: "/places", label: copy.nav.places },
    { href: "/portfolio", label: copy.nav.portfolio },
    { href: "/about", label: copy.nav.about },
    { href: "/journal", label: copy.nav.journal },
  ];

  return (
    <html lang={htmlLang(locale)} className={`${serif.variable} ${sans.variable} ${quote.variable}`}>
      <body className="min-h-screen bg-sand font-sans text-ink antialiased">
        <NextIntlClientProvider>
          <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-sand focus:px-4 focus:py-2">
            {copy.a11y.skip}
          </a>
          <PromoBanner locale={locale} />
          <SiteHeader
            locale={locale}
            items={items}
            inquire={{ href: "/inquire", label: copy.nav.inquire }}
            menuLabel={copy.a11y.menu}
            closeLabel={copy.a11y.closeMenu}
            homeLabel={copy.a11y.home}
          />
          <div id="content">{children}</div>
          <SiteFooter
            locale={locale}
            blurb={copy.footer.blurb}
            whatsappLabel={copy.whatsapp.button}
            privacyLabel={copy.footer.privacy}
            rights={copy.footer.rights}
          />
          <WhatsAppButton
            label={copy.whatsapp.button}
            text={copy.whatsapp.general}
            codeLabel={copy.form.promoCode}
            wishLabel={copy.form.wish}
          />
          <CookieBanner
            text={copy.cookies.text}
            accept={copy.cookies.accept}
            essential={copy.cookies.essential}
            privacy={copy.cookies.privacy}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: settings.brand,
              url: siteUrl(),
              email: settings.email,
              image: `${siteUrl()}/images/portfolio/cover-wide.jpg`,
              founder: { "@type": "Person", name: settings.founder },
              areaServed: ["Algarve", "Lisbon", "Portugal", "Europe"],
              sameAs: [settings.instagramUrl],
              priceRange: "€€",
              description: copy.meta.home.description,
            }}
          />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
