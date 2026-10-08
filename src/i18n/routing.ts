import { defineRouting } from "next-intl/routing";

export const locales = ["en", "es", "pt"] as const;
export type Locale = (typeof locales)[number];

export const pathnames = {
  "/": "/",
  "/about": {
    en: "/about",
    es: "/sobre-mi",
    pt: "/sobre-mim",
  },
  "/people": {
    en: "/people",
    es: "/personas",
    pt: "/pessoas",
  },
  "/portraits-engagement": {
    en: "/portraits-engagement",
    es: "/retratos-preboda",
    pt: "/retratos-pre-casamento",
  },
  "/boho-elopements": {
    en: "/boho-elopements",
    es: "/elopements-bodas-boho",
    pt: "/elopements-casamentos-boho",
  },
  "/experiences": {
    en: "/experiences",
    es: "/experiencias",
    pt: "/experiencias",
  },
  "/retreats-gatherings": {
    en: "/retreats-gatherings",
    es: "/retiros-encuentros",
    pt: "/retiros-encontros",
  },
  "/festivals-artists": {
    en: "/festivals-artists",
    es: "/festivales-artistas",
    pt: "/festivais-artistas",
  },
  "/places": {
    en: "/places",
    es: "/alojamientos",
    pt: "/alojamentos",
  },
  "/portfolio": {
    en: "/portfolio",
    es: "/portfolio",
    pt: "/portefolio",
  },
  "/journal": "/journal",
  "/journal/[slug]": "/journal/[slug]",
  "/inquire": {
    en: "/inquire",
    es: "/contacto",
    pt: "/contacto",
  },
  "/book": {
    en: "/book",
    es: "/reservar",
    pt: "/reservar",
  },
  "/thank-you": {
    en: "/thank-you",
    es: "/gracias",
    pt: "/obrigada",
  },
  "/privacy": {
    en: "/privacy",
    es: "/privacidad",
    pt: "/privacidade",
  },
} as const;

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames,
});

export const staticPathnames = [
  "/",
  "/about",
  "/people",
  "/portraits-engagement",
  "/boho-elopements",
  "/experiences",
  "/retreats-gatherings",
  "/festivals-artists",
  "/places",
  "/portfolio",
  "/journal",
  "/inquire",
  "/book",
  "/thank-you",
  "/privacy",
] as const;

export type StaticPathname = (typeof staticPathnames)[number];
