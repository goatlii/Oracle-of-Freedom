import galleryJson from "../../content/gallery.json";
import packagesJson from "../../content/packages.json";
import settingsJson from "../../content/settings.json";
import testimonialsJson from "../../content/testimonials.json";
import videosJson from "../../content/videos.json";
import type { Locale } from "@/i18n/routing";
import { isPublishedPhoto } from "@/lib/utils";

export type GalleryImage = {
  id: string;
  src: string;
  width: number;
  height: number;
  blur: string;
  category: string;
  categories: string[];
  pages: string[];
  /** Portfolio tabs that may show this image. When set, "all" is included only if listed. */
  portfolioTabs?: string[];
  featured: boolean;
  provisional: boolean;
  placeholder: boolean;
  order: number;
  alt: Record<Locale, string>;
  /** Location or event line. Pages render it under the photo when set. */
  caption?: Record<Locale, string>;
  source: string;
};

export type PackageItem = {
  id: string;
  group: string;
  kind: "photo" | "video" | "combo" | "addon";
  label: string;
  from?: number;
  to?: number;
  plus?: boolean;
  unit?: "day" | "night" | "month";
  inquiry: string;
  loved?: boolean;
  custom?: boolean;
  compare?: string[];
  personalize?: boolean;
};

export type Testimonial = {
  id: string;
  /** False for a published client quote. Missing or true keeps the placeholder card. */
  placeholder?: boolean;
  /** Name and place, for example "India, Ireland". */
  name?: string;
  /** Shoot-type label shown with the attribution. */
  shoot?: Partial<Record<Locale, string>>;
  quote: Record<Locale, string>;
};

export type VideoItem = {
  id: string;
  platform: string;
  url: string;
  youtubeId?: string;
  posterId: string;
  verify?: boolean;
  /** Public caption under the film. Empty in a language means no caption. */
  label: Record<Locale, string>;
};

export const settings = settingsJson;
export const packages = packagesJson;
export const gallery = galleryJson.images as GalleryImage[];
export const testimonials = testimonialsJson.items as Testimonial[];
export const videos = videosJson as { note: string; items: VideoItem[] };

export function imageById(id: string) {
  const image = gallery.find((item) => item.id === id);
  if (!image) throw new Error(`Missing gallery image: ${id}`);
  return image;
}

export function imagesForPage(page: string) {
  return gallery
    .filter((image) => image.pages.includes(page) && isPublishedPhoto(image))
    .sort((a, b) => a.order - b.order);
}

export function featuredImages() {
  return gallery
    .filter((image) => image.featured && image.pages.includes("home") && isPublishedPhoto(image))
    .sort((a, b) => a.order - b.order);
}

export function packageGroup(group: string) {
  return (packages.items as PackageItem[]).filter((item) => item.group === group);
}

export function formatEuro(locale: string, amount: number) {
  if (locale === "en") {
    return `€${amount.toLocaleString("en-GB")}`;
  }
  const tag = locale === "pt" ? "pt-PT" : "es-ES";
  return `${amount.toLocaleString(tag)} €`;
}

function guidePrice(locale: string, amount: number, guide?: { to?: number; plus?: boolean }) {
  const high = guide?.to;
  const open = guide?.plus === true;
  if (open) {
    if (locale === "en") return `€${amount.toLocaleString("en-GB")}+`;
    const tag = locale === "pt" ? "pt-PT" : "es-ES";
    return `${amount.toLocaleString(tag)}+ €`;
  }
  if (high == null || high <= amount) return null;
  if (locale === "en") {
    return `€${amount.toLocaleString("en-GB")}–${high.toLocaleString("en-GB")}`;
  }
  const tag = locale === "pt" ? "pt-PT" : "es-ES";
  return `${amount.toLocaleString(tag)}–${high.toLocaleString(tag)} €`;
}

export function formatFrom(
  locale: string,
  amount: number | undefined,
  unit?: PackageItem["unit"],
  addon = false,
  guide?: { to?: number; plus?: boolean },
) {
  if (amount == null) return "";
  const price = guidePrice(locale, amount, guide) ?? formatEuro(locale, amount);
  const unitLabel =
    unit === "day"
      ? locale === "en"
        ? "/day"
        : locale === "es"
          ? "/día"
          : "/dia"
      : unit === "night"
        ? locale === "en"
          ? "/night"
          : locale === "es"
            ? "/noche"
            : "/noite"
        : unit === "month"
          ? locale === "en"
            ? "/month"
            : locale === "es"
              ? "/mes"
              : "/mês"
          : "";
  const prefix = addon ? "+ " : "";
  const fromWord = locale === "en" ? "from" : locale === "es" ? "desde" : "desde";
  return `${prefix}${fromWord} ${price}${unitLabel}`;
}

export function whatsappHref(text: string) {
  const number = settings.whatsappE164.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || settings.siteUrl).replace(/\/$/, "");
}

export function htmlLang(locale: string) {
  if (locale === "pt") return "pt-PT";
  if (locale === "es") return "es";
  return "en";
}

export function ogLocale(locale: string) {
  if (locale === "pt") return "pt_PT";
  if (locale === "es") return "es_ES";
  return "en_GB";
}
